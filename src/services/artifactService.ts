import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  setDoc,
  doc,
  serverTimestamp,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface Artifact {
  id: string;
  projectId: string;
  jobId: string;
  path: string;
  content: string;
  version: number;
  language: string;
  updatedAt: any;
}

export const artifactService = {
  onProjectArtifacts(projectId: string, callback: (artifacts: Artifact[]) => void) {
    const q = query(
      collection(db, 'projects', projectId, 'artifacts'),
      where('projectId', '==', projectId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const artifacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artifact[];
      callback(artifacts);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `projects/${projectId}/artifacts`);
    });
  },

  async saveArtifacts(projectId: string, jobId: string, files: { path: string, content: string, language: string }[]) {
    const batch = writeBatch(db);
    
    files.forEach(file => {
      // Use path as part of ID to avoid duplicates per project
      const artifactId = file.path.replace(/\//g, '_');
      const docRef = doc(db, 'projects', projectId, 'artifacts', artifactId);
      
      batch.set(docRef, {
        projectId,
        jobId,
        path: file.path,
        content: file.content,
        language: file.language,
        version: 1, // Simple versioning for now
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
    
    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${projectId}/artifacts`);
    }
  },

  async getProjectArtifacts(projectId: string) {
    try {
      const q = query(
        collection(db, 'projects', projectId, 'artifacts'),
        where('projectId', '==', projectId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artifact[];
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `projects/${projectId}/artifacts`);
      return [];
    }
  }
};
