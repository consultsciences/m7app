import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { generateCodebase } from '../lib/gemini';
import { artifactService } from './artifactService';

export interface GenerationStep {
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output?: string;
  timestamp: string;
}

export interface Job {
  id: string;
  projectId: string;
  prompt: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  steps: GenerationStep[];
  startedAt: any;
  completedAt?: any;
  error?: string;
}

export const generationService = {
  async startGeneration(projectId: string, prompt: string) {
    const jobData = {
      projectId,
      prompt,
      status: 'processing' as const,
      steps: [],
      startedAt: serverTimestamp(),
    };
    
    try {
      const jobRef = await addDoc(collection(db, 'projects', projectId, 'jobs'), jobData);
      
      // Parallelize pipeline execution
      this.executePipeline(projectId, jobRef.id, prompt);
      
      return jobRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${projectId}/jobs`);
    }
  },

  async executePipeline(projectId: string, jobId: string, prompt: string) {
    const jobRef = doc(db, 'projects', projectId, 'jobs', jobId);
    
    try {
      // Step 1: Synthesize Full System Blueprint
      await this.updateStep(jobRef, "Synthesizing Application Blueprint", "processing");
      const codebasePlan = await generateCodebase(prompt);
      await this.updateStep(jobRef, "Synthesizing Application Blueprint", "completed");
      
      // Step 2: Materializing Artifacts
      await this.updateStep(jobRef, "Materializing Code Artifacts", "processing");
      await artifactService.saveArtifacts(projectId, jobId, codebasePlan.files);
      await this.updateStep(jobRef, "Materializing Code Artifacts", "completed");
      
      // Step 3: Calibrating Neural Matrix
      await this.updateStep(jobRef, "Calibrating Neural Matrix", "processing");
      await new Promise(r => setTimeout(r, 1000));
      await this.updateStep(jobRef, "Calibrating Neural Matrix", "completed");
      
      // Finalize Job
      await updateDoc(jobRef, { 
        status: 'completed',
        completedAt: serverTimestamp()
      });
      
      // Update project metadata
      await updateDoc(doc(db, 'projects', projectId), { 
        status: 'deployed',
        description: codebasePlan.description,
        name: codebasePlan.projectName,
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error("Pipeline failed:", error);
      try {
        await updateDoc(jobRef, { status: 'failed', error: String(error) });
      } catch (innerError) {
        handleFirestoreError(innerError, OperationType.UPDATE, `projects/${projectId}/jobs/${jobId}`);
      }
    }
  },

  async updateStep(jobRef: any, label: string, status: 'pending' | 'processing' | 'completed' | 'failed', output?: string) {
    try {
      await updateDoc(jobRef, {
        steps: arrayUnion({ label, status, output, timestamp: new Date().toISOString() })
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, jobRef.path);
    }
  },

  onJobStatus(projectId: string, jobId: string, callback: (job: Job) => void) {
    return onSnapshot(doc(db, 'projects', projectId, 'jobs', jobId), (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as Job);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `projects/${projectId}/jobs/${jobId}`);
    });
  }
};
