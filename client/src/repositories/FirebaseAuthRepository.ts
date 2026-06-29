import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { IAuthRepository, LoginCredentials, RegisterCredentials } from './IAuthRepository'
import { type User } from '../types/user'

export class FirebaseAuthRepository implements IAuthRepository {
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
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    if (!credentials.password) throw new Error('Password is required for email login')

    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password,
    )

    // Attempt to fetch extra details from firestore if needed,
    // but for now mapping from Firebase Auth is sufficient.
    return this.mapFirebaseUserToUser(userCredential.user)
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    if (!credentials.password) throw new Error('Password is required for registration')

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
      createdAt: new Date().toISOString(),
    }

    await setDoc(doc(db, 'users', user.uid), userProfile)

    return userProfile
  }

  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const fbUser = userCredential.user

    const userRef = doc(db, 'users', fbUser.uid)
    const userSnap = await getDoc(userRef)

    const userProfile: User = {
      uid: fbUser.uid,
      email: fbUser.email || '',
      displayName: fbUser.displayName || undefined,
    }

    if (!userSnap.exists()) {
      // Create user document if it's their first time logging in with Google
      const newUserProfile = {
        ...userProfile,
        createdAt: new Date().toISOString(),
      }
      await setDoc(userRef, newUserProfile)
    }

    return userProfile
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
}
