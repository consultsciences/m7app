import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  getDocs,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

export interface Project {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'building' | 'deployed';
  ownerId: string;
  description?: string;
  updatedAt: any;
  createdAt: any;
}

export const projectService = {
  async createProject(name: string, type: string) {
    if (!auth.currentUser) throw new Error("Authentication required");
    
    const projectData = {
      name,
      type,
      ownerId: auth.currentUser.uid,
      status: 'building' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    try {
      const docRef = await addDoc(collection(db, 'projects'), projectData);
      return { id: docRef.id, ...projectData };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects');
    }
  },

  async updateProject(projectId: string, updates: Partial<Project>) {
    const docRef = doc(db, 'projects', projectId);
    try {
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${projectId}`);
    }
  },

  async deleteProject(projectId: string) {
    const docRef = doc(db, 'projects', projectId);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${projectId}`);
    }
  },

  onUserProjects(callback: (projects: Project[]) => void) {
    if (!auth.currentUser) return () => {};
    
    const q = query(
      collection(db, 'projects'), 
      where('ownerId', '==', auth.currentUser.uid)
    );
    
    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      callback(projects);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });
  }
};
