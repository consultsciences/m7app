import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  credits: number;
  plan: 'free' | 'pro' | 'enterprise';
  currentWorkspaceId?: string;
  createdAt: any;
}

export const userService = {
  async ensureUserProfile(user: any) {
    if (!user) return null;
    const docRef = doc(db, 'users', user.uid);
    try {
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        const newUser: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || 'Operative',
          email: user.email,
          credits: 100,
          plan: 'free',
          createdAt: serverTimestamp(),
        };
        await setDoc(docRef, newUser);
        return newUser;
      }
      return snap.data() as UserProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      return null;
    }
  },

  async updateProfile(uid: string, updates: Partial<UserProfile>) {
    const docRef = doc(db, 'users', uid);
    try {
      await updateDoc(docRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  }
};
