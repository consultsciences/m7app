import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail };

export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'The email address protocol is invalid. Verify and retry.';
    case 'auth/user-disabled':
      return 'This operative account has been decommissioned.';
    case 'auth/user-not-found':
      return 'No operative found with these credentials in the local matrix.';
    case 'auth/wrong-password':
      return 'Access denied. The protocol password does not match our records.';
    case 'auth/email-already-in-use':
      return 'This email is already registered to another operative.';
    case 'auth/weak-password':
      return 'Security breach risk: Password strength is insufficient. Use at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/Password authentication is disabled in your Firebase Console. Please enable it in the Authentication > Sign-in method tab, or use Google Sign-in to skip this step.';
    case 'auth/too-many-requests':
      return 'System overload. Access blocked due to excessive attempts. Stand by.';
    case 'auth/network-request-failed':
      return 'Neural link dropped. Check your network uplink.';
    case 'auth/popup-closed-by-user':
      return 'Auth window dismissed. Re-initialize the link sequence.';
    case 'auth/internal-error':
      return 'A kernel error occurred during authentication. Initializing retry...';
    default:
      return 'Authentication sequence failed. Error Code: ' + errorCode;
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const logout = () => auth.signOut();
