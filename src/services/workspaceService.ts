import { 
  collection, 
  addDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  serverTimestamp,
  arrayUnion,
  onSnapshot
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members: string[];
  createdAt: any;
}

export const workspaceService = {
  async createWorkspace(name: string) {
    if (!auth.currentUser) throw new Error("Unauthenticated");
    const wsData = {
      name,
      ownerId: auth.currentUser.uid,
      members: [auth.currentUser.uid],
      createdAt: serverTimestamp(),
    };
    try {
      const docRef = await addDoc(collection(db, 'workspaces'), wsData);
      return { id: docRef.id, ...wsData };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'workspaces');
    }
  },

  async inviteMember(workspaceId: string, userEmail: string) {
    // In a real app, this might create an invitation record.
    // For MVP, we'll assume the user ID is needed or some lookup.
    // Since we don't have a lookup by email yet, we'll just mock the add logic for UI.
    const docRef = doc(db, 'workspaces', workspaceId);
    try {
      // Logic would be to find user by email first
      // await updateDoc(docRef, { members: arrayUnion(newUserId) });
      console.log(`Inviting ${userEmail} to workspace ${workspaceId}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `workspaces/${workspaceId}`);
    }
  },

  onUserWorkspaces(callback: (workspaces: Workspace[]) => void) {
    if (!auth.currentUser) return () => {};
    const q = query(
      collection(db, 'workspaces'),
      where('members', 'array-contains', auth.currentUser.uid)
    );
    return onSnapshot(q, (snapshot) => {
      const ws = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Workspace[];
      callback(ws);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'workspaces');
    });
  }
};
