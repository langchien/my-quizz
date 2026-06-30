import { auth, db } from '@/lib/firebase'
import type {
  IAuthRepository,
  LoginCredentials,
  RegisterCredentials,
} from '@/repositories/IAuthRepository'
import { type User } from '@/types/user'
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export class FirebaseAuthRepository implements IAuthRepository {
  constructor() {
    this.handleRedirectResult()
  }

  private async handleRedirectResult() {
    try {
      const result = await getRedirectResult(auth)
      if (result && result.user) {
        const fbUser = result.user
        const userRef = doc(db, 'users', fbUser.uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
          const userProfile: User = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || undefined,
            photoURL: fbUser.photoURL || undefined,
            createdAt: new Date().toISOString(),
          }
          await setDoc(userRef, userProfile)
        }
      }
    } catch (error) {
      console.error('Error handling redirect result:', error)
    }
  }
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        unsubscribe()
        if (fbUser) {
          resolve(this.mapFirebaseUserToUser(fbUser))
        } else {
          resolve(null)
        }
      })
    })
  }

  private mapFirebaseUserToUser(fbUser: FirebaseUser): User {
    return {
      uid: fbUser.uid,
      email: fbUser.email || '',
      displayName: fbUser.displayName || undefined,
      photoURL: fbUser.photoURL || undefined,
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    if (!credentials.password) throw new Error('Mật khẩu là bắt buộc khi đăng nhập')

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      )

      // Attempt to fetch extra details from firestore if needed,
      // but for now mapping from Firebase Auth is sufficient.
      return this.mapFirebaseUserToUser(userCredential.user)
    } catch (error) {
      this.handleAuthError(error)
    }
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    if (!credentials.password) throw new Error('Mật khẩu là bắt buộc khi đăng ký')

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      )

      const user = userCredential.user

      // Update display name in Firebase Auth
      await updateProfile(user, {
        displayName: credentials.displayName,
      })

      // Save user profile to Firestore
      const userProfile: User = {
        uid: user.uid,
        email: credentials.email,
        displayName: credentials.displayName,
        photoURL: user.photoURL || undefined,
        createdAt: new Date().toISOString(),
      }

      await setDoc(doc(db, 'users', user.uid), userProfile)

      return userProfile
    } catch (error) {
      this.handleAuthError(error)
    }
  }

  async loginWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const fbUser = userCredential.user

      const userRef = doc(db, 'users', fbUser.uid)
      const userSnap = await getDoc(userRef)

      let userProfile: User
      if (!userSnap.exists()) {
        userProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || undefined,
          photoURL: fbUser.photoURL || undefined,
          createdAt: new Date().toISOString(),
        }
        await setDoc(userRef, userProfile)
      } else {
        const data = userSnap.data()
        userProfile = {
          uid: fbUser.uid,
          email: data?.email || fbUser.email || '',
          displayName: data?.displayName || fbUser.displayName || undefined,
          photoURL: data?.photoURL || fbUser.photoURL || undefined,
        }
      }

      return userProfile
    } catch (error) {
      this.handleAuthError(error)
    }
  }

  async logout(): Promise<void> {
    await signOut(auth)
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        callback(this.mapFirebaseUserToUser(fbUser))
      } else {
        callback(null)
      }
    })
  }

  private handleAuthError(error: any): never {
    if (error && typeof error === 'object' && 'code' in error) {
      switch (error.code) {
        case 'auth/invalid-credential':
          throw new Error('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.')
        case 'auth/email-already-in-use':
          throw new Error('Email này đã được sử dụng bởi một tài khoản khác.')
        case 'auth/weak-password':
          throw new Error('Mật khẩu quá yếu. Vui lòng nhập mật khẩu tối thiểu 6 ký tự.')
        case 'auth/invalid-email':
          throw new Error('Địa chỉ email không hợp lệ.')
        case 'auth/user-disabled':
          throw new Error('Tài khoản này đã bị tạm khóa hoặc vô hiệu hóa.')
        case 'auth/too-many-requests':
          throw new Error(
            'Tài khoản tạm thời bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.',
          )
        case 'auth/network-request-failed':
          throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.')
        default:
          throw new Error(error.message || 'Đã xảy ra lỗi xác thực. Vui lòng thử lại.')
      }
    }
    throw error
  }
}
