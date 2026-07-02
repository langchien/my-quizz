import { db } from '@/lib/firebase'
import type { IUserRepository } from '@/repositories/IUserRepository'
import type {
  CreateUserProfileDto,
  UpdateUserProfileDto,
  UserPreferences,
  UserProfile,
} from '@/types/user'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

const USERS_COLLECTION = 'users'

/** Preferences mặc định cho user mới */
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'classic',
  language: 'vi',
}

export class FirebaseUserRepository implements IUserRepository {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, USERS_COLLECTION, uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    return this.mapToUserProfile(uid, docSnap.data())
  }

  async createUserProfile(uid: string, data: CreateUserProfileDto): Promise<UserProfile> {
    const docRef = doc(db, USERS_COLLECTION, uid)
    const existingSnap = await getDoc(docRef)

    // Merge với data đã có từ auth registration (email, displayName, etc.)
    const existingData = existingSnap.exists() ? existingSnap.data() : {}

    const displayName = `${data.firstName} ${data.lastName}`.trim()

    const profileData = {
      ...existingData,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName,
      useCase: data.useCase,
      role: data.role,
      grade: data.grade ?? null,
      age: data.age ?? null,
      avatarUrl: data.avatarUrl,
      preferences: DEFAULT_PREFERENCES,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    }

    await setDoc(docRef, profileData, { merge: true })

    return this.mapToUserProfile(uid, { ...existingData, ...profileData })
  }

  async updateUserProfile(uid: string, data: UpdateUserProfileDto): Promise<UserProfile> {
    const docRef = doc(db, USERS_COLLECTION, uid)

    // Flatten preferences nếu có
    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    }

    if (data.username !== undefined) updateData.username = data.username
    if (data.firstName !== undefined) updateData.firstName = data.firstName
    if (data.lastName !== undefined) updateData.lastName = data.lastName
    if (data.displayName !== undefined) updateData.displayName = data.displayName
    if (data.grade !== undefined) updateData.grade = data.grade
    if (data.role !== undefined) updateData.role = data.role
    if (data.age !== undefined) updateData.age = data.age
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl
    if (data.useCase !== undefined) updateData.useCase = data.useCase

    // Merge preferences (partial update)
    if (data.preferences) {
      const docSnap = await getDoc(docRef)
      const existing = docSnap.exists() ? docSnap.data() : {}
      updateData.preferences = {
        ...DEFAULT_PREFERENCES,
        ...(existing.preferences ?? {}),
        ...data.preferences,
      }
    }

    await updateDoc(docRef, updateData)

    // Re-fetch to return updated profile
    const updated = await this.getUserProfile(uid)
    if (!updated) throw new Error('Không tìm thấy profile sau khi cập nhật')
    return updated
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('username', '==', username.toLowerCase()),
    )
    const snapshot = await getDocs(q)
    return snapshot.empty
  }

  async deleteUserProfile(uid: string): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, uid)
    await deleteDoc(docRef)
  }

  /** Map Firestore document data → UserProfile */
  private mapToUserProfile(uid: string, data: Record<string, unknown>): UserProfile {
    return {
      uid,
      email: (data.email as string) || '',
      displayName: (data.displayName as string) || undefined,
      photoURL: (data.photoURL as string) || undefined,
      createdAt: (data.createdAt as string) || undefined,
      username: (data.username as string) || undefined,
      firstName: (data.firstName as string) || undefined,
      lastName: (data.lastName as string) || undefined,
      grade: (data.grade as UserProfile['grade']) || undefined,
      role: (data.role as UserProfile['role']) || undefined,
      age: (data.age as number) || undefined,
      avatarUrl: (data.avatarUrl as string) || undefined,
      useCase: (data.useCase as UserProfile['useCase']) || undefined,
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...((data.preferences as Partial<UserPreferences>) ?? {}),
      },
      onboardingCompleted: (data.onboardingCompleted as boolean) ?? false,
    }
  }
}
