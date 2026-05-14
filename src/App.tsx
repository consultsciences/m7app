import * as React from 'react';
import { LandingPage } from './components/LandingPage';
import { ProjectsDashboard } from './components/ProjectsDashboard';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { NeuralBurn } from './components/NeuralBurn';
import { ServiceGraph } from './components/ServiceGraph';
import { DatabaseSchema } from './components/DatabaseSchema';
import { Diagnostics } from './components/Diagnostics';
import { InteractivePreview } from './components/InteractivePreview';
import { generationService, Job } from './services/generationService';
import { projectService } from './services/projectService';
import { artifactService, Artifact } from './services/artifactService';
import { userService, UserProfile } from './services/userService';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { FileTree } from './components/FileTree';
import JSZip from 'jszip';
import { Bell, Search, User, TriangleAlert, ChevronLeft, ChevronRight, Play, Layout, Code2, Database, MessageSquare, Send, Globe, Smartphone, Monitor, RotateCcw, Rocket, Cpu, Copy, Check, Download, Layers, Eye, RefreshCw } from 'lucide-react';

type AppView = 'landing' | 'dashboard' | 'builder';

const MaintenancePlaceholder = ({ title }: { title: string }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-20 gap-6">
    <TriangleAlert className="w-16 h-16 text-yellow-500 opacity-50" />
    <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
    <p className="text-text-secondary max-w-md">
      This subsystem is currently under calibration. Initializing M7A protocols and synthetic data streams.
    </p>
  </div>
);

export default function App() {
  const [user, setUser] = React.useState(auth.currentUser);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [view, setView] = React.useState<AppView>('landing');
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);
  const [artifacts, setArtifacts] = React.useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = React.useState<Artifact | null>(null);
  const [activeJob, setActiveJob] = React.useState<Job | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showSupport, setShowSupport] = React.useState(false);
  const [deploying, setDeploying] = React.useState(false);

  React.useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const profile = await userService.ensureUserProfile(u);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      if (u && view === 'landing') setView('dashboard');
    });
  }, [view]);

  React.useEffect(() => {
    if (selectedProjectId) {
      return artifactService.onProjectArtifacts(selectedProjectId, (data) => {
        setArtifacts(data);
        if (data.length > 0 && !selectedArtifact) {
           const readme = data.find(a => a.path.toLowerCase().includes('readme'));
           setSelectedArtifact(readme || data[0]);
        }
      });
    } else {
      setArtifacts([]);
      setSelectedArtifact(null);
    }
  }, [selectedProjectId, selectedArtifact]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (artifacts.length === 0) return;
    
    try {
      const zip = new JSZip();
      artifacts.forEach(artifact => {
        // Handle potential subdirectory structure in path
        zip.file(artifact.path, artifact.content);
      });
      
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedProjectId || 'project'}-m7a-export.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to materialize project bundle. System error occurred.");
    }
  };

  const handleStart = () => {
    setView('dashboard');
  };

  const handleBack = () => {
    setView('landing');
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setView('builder');
    setActiveTab('source');
  };

  const handleCreateProject = () => {
    setSelectedProjectId(null);
    setView('builder');
    setIsGenerating(false);
  };

  const handleInitializeGeneration = async () => {
    console.log("Initializing generation for prompt:", prompt);
    if (!prompt.trim()) {
      console.warn("Prompt is empty");
      return;
    }
    if (!user) {
      console.warn("User not authenticated");
      return;
    }
    
    setIsGenerating(true);
    try {
      console.log("Creating project...");
      const project = await projectService.createProject(
        prompt.split(' ').slice(0, 3).join(' ') || "Untitled App",
        "Autonomic Web App"
      );
      console.log("Project created:", project.id);
      setSelectedProjectId(project.id);
      
      console.log("Starting generation job...");
      const jobId = await generationService.startGeneration(project.id, prompt);
      
      generationService.onJobStatus(project.id, jobId, (job) => {
        console.log("Job status update:", job.status, job.steps.length);
        setActiveJob(job);
        if (job.status === 'completed') {
          console.log("Job completed! Loading artifacts...");
          setIsGenerating(false);
          // Force a refresh of artifacts
          artifactService.getProjectArtifacts(project.id).then(arts => {
             setArtifacts(arts);
             if (arts.length > 0) setSelectedArtifact(arts[0]);
             setActiveTab('preview');
          });
        } else if (job.status === 'failed') {
          console.error("Job failed:", job.error);
          setIsGenerating(false);
          alert(`Synthesis failed: ${job.error}`);
        }
      });
      
    } catch (error) {
      console.error("Initialization failed:", error);
      setIsGenerating(false);
      alert("Nuclear link failure. Check console for neural discrepancy logs.");
    }
  };

  if (view === 'landing' && !user) {
    return <LandingPage onStart={handleStart} />;
  }

  if (view === 'dashboard') {
    return <ProjectsDashboard onSelectProject={handleSelectProject} onCreateProject={handleCreateProject} onBack={handleBack} />;
  }

  const currentStep = activeJob?.steps[activeJob.steps.length - 1];

  return (
    <div className="flex h-screen bg-surface-base text-text-primary font-sans overflow-hidden selection:bg-brand-blue/30">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-surface-base relative">
        <div className="absolute inset-0 technical-grid pointer-events-none opacity-40" />
        
        {/* Header */}
        <header className="h-12 flex items-center justify-between px-6 border-b border-border-dim bg-surface-elevated/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setView('dashboard')}
              className="p-1.5 hover:bg-surface-active rounded transition-colors text-text-secondary"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-tighter text-text-primary uppercase">
                {selectedProjectId ? `Project :: ${selectedProjectId.slice(0, 8)}` : 'Initializing New Build'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 bg-surface-active p-1 rounded-lg border border-border-dim">
                <button 
                  onClick={() => setActiveTab('source')}
                  className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all ${activeTab === 'source' ? 'bg-white text-black shadow-sm' : 'text-text-muted hover:text-white'}`}
                >
                  <Code2 className="w-3 h-3 inline mr-1" /> Source
                </button>
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all ${activeTab === 'preview' ? 'bg-white text-black shadow-sm' : 'text-text-muted hover:text-white'}`}
                >
                  <Eye className="w-3 h-3 inline mr-1" /> Preview
                </button>
             </div>
             <div className="h-4 w-px bg-border-dim mx-2" />
             
             <div className="relative">
                <button 
                  onClick={() => alert("Initializing Global Matrix Search... Scanning 1.4M shards.")}
                  className="p-1.5 hover:bg-surface-active rounded transition-colors text-text-secondary hover:text-white"
                >
                  <Search className="w-4 h-4" />
                </button>
             </div>

             <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-1.5 rounded transition-colors relative ${showNotifications ? 'bg-surface-active text-white' : 'text-text-secondary hover:text-white'}`}
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-cyan rounded-full border border-surface-elevated"></span>
                </button>

                <AnimatePresence>
                   {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-72 glass-panel shadow-2xl z-50 overflow-hidden"
                      >
                         <div className="p-3 border-b border-border-dim bg-surface-base/80 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Neural Notifications</span>
                            <span className="text-[9px] font-mono text-text-muted uppercase">2 Unread</span>
                         </div>
                         <div className="max-h-80 overflow-y-auto">
                            <div className="p-4 border-b border-border-dim hover:bg-surface-active transition-colors cursor-pointer group">
                               <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/20">
                                     <Rocket className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                     <div className="text-[11px] font-bold text-white leading-none">Project Materialized</div>
                                     <p className="text-[10px] text-text-secondary leading-relaxed">Synthesis of PROJECT_X88 is complete and staged for deployment.</p>
                                     <div className="text-[9px] font-mono text-text-muted uppercase">2m ago</div>
                                  </div>
                               </div>
                            </div>
                            <div className="p-4 border-b border-border-dim hover:bg-surface-active transition-colors cursor-pointer group">
                               <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded bg-brand-cyan/10 flex items-center justify-center text-brand-cyan border border-brand-cyan/20">
                                     <Cpu className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                     <div className="text-[11px] font-bold text-white leading-none">Kernel Update</div>
                                     <p className="text-[10px] text-text-secondary leading-relaxed">System-wide M7A logic kernel upgraded to v2.4.0-STABLE.</p>
                                     <div className="text-[9px] font-mono text-text-muted uppercase">1h ago</div>
                                  </div>
                               </div>
                            </div>
                         </div>
                         <button className="w-full py-2 bg-surface-active text-[10px] font-bold text-text-secondary hover:text-white uppercase tracking-[0.1em] transition-colors">
                            Clear Matrix Logs
                         </button>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>

             <div className="flex items-center gap-3 pl-2">
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-semibold text-white">{user?.displayName || 'Autonomic User'}</span>
                <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-tighter">PRD_ENGINEER</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-border-bright bg-surface-active overflow-hidden flex items-center justify-center">
                {user?.photoURL ? <img src={user.photoURL} alt="User" /> : <User className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
          {view === 'builder' && !selectedProjectId && !isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="max-w-2xl w-full space-y-12">
                <div className="space-y-4">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-gradient-to-tr from-brand-blue to-brand-cyan rounded-[32px] mx-auto flex items-center justify-center font-bold text-4xl text-white shadow-[0_20px_50px_rgba(0,102,255,0.3)] rotate-12"
                  >
                    M7A
                  </motion.div>
                  <h1 className="text-5xl font-black tracking-tight text-white">THE FORGE</h1>
                  <p className="text-text-secondary text-lg font-medium opacity-80">What are we building today?</p>
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-3xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
                  <div className="relative flex flex-col bg-surface-panel/90 backdrop-blur-xl border border-border-bright p-6 rounded-3xl shadow-2xl">
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your app in plain English..." 
                      className="w-full bg-transparent border-none focus:ring-0 text-2xl font-sans h-40 text-text-primary resize-none placeholder:text-text-muted/20 selection:bg-brand-blue/30"
                    />
                    <div className="flex items-center justify-between pt-4 border-t border-border-dim">
                      <div className="flex items-center gap-3 text-text-muted">
                        <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Neural Link Active</span>
                      </div>
                      <button 
                        onClick={handleInitializeGeneration}
                        disabled={isGenerating || !user || !prompt.trim()}
                        className="px-10 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.15)] flex items-center gap-3"
                      >
                        Materialize <Rocket className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {[
                    "SaaS CRM",
                    "Crypto Dashboard",
                    "Fitness Tracker",
                    "AI Chat Interface"
                  ].map(t => (
                    <button 
                      key={t}
                      onClick={() => setPrompt(`Build a high-end ${t} with a focus on speed and beautiful data visuals.`)}
                      className="px-5 py-2 bg-surface-active/50 border border-border-dim rounded-full text-[10px] font-bold text-text-muted hover:text-white hover:border-brand-blue transition-all uppercase tracking-widest"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex min-h-0 relative">
               {/* Simplified Layout: Main Preview + Sidebar Explorer (Collapsible) */}
               <div className="flex-1 flex flex-col min-w-0 bg-surface-elevated/10">
                 <div className="flex-1 overflow-auto custom-scrollbar">
                   {activeTab === 'preview' ? (
                     <div className="h-full p-6">
                       <div className="w-full h-full glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl">
                          <div className="h-12 bg-surface-panel/50 border-b border-border-dim flex items-center px-6 justify-between shrink-0">
                             <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                             </div>
                             <div className="text-[10px] font-medium text-text-muted flex items-center gap-2">
                                <Globe className="w-3.5 h-3.5" /> preview.m7a.io/{selectedProjectId?.slice(0, 8)}
                             </div>
                             <div className="w-16" />
                          </div>
                          <div className="flex-1 relative">
                             <InteractivePreview 
                                artifacts={artifacts}
                                projectName={selectedProjectId ? artifacts.find(a => a.projectId === selectedProjectId)?.path.split('/')[0] : 'Materializing App'}
                                selectedId={null} 
                                onSelect={() => {}} 
                             />
                          </div>
                       </div>
                     </div>
                   ) : activeTab === 'source' ? (
                    <div className="h-full flex">
                       <div className="w-64 border-r border-border-dim flex flex-col bg-surface-base/30 shrink-0">
                          <div className="p-4 border-b border-border-dim flex items-center justify-between">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Files</span>
                            <Layers className="w-3.5 h-3.5 text-text-muted" />
                          </div>
                          <div className="flex-1 overflow-auto">
                            <FileTree 
                              artifacts={artifacts} 
                              selectedPath={selectedArtifact?.path}
                              onSelectFile={setSelectedArtifact}
                            />
                          </div>
                       </div>
                       <div className="flex-1 bg-[#09090B] flex flex-col">
                          <div className="h-12 border-b border-border-dim flex items-center px-4 justify-between">
                            <span className="text-[11px] font-mono text-text-muted">{selectedArtifact?.path || 'Select a file'}</span>
                            {selectedArtifact && (
                              <button onClick={() => handleCopy(selectedArtifact.content)} className="p-2 text-text-muted hover:text-white">
                                {copied ? <Check className="w-4 h-4 text-brand-cyan" /> : <Copy className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                          <div className="flex-1 p-6 font-mono text-[13px] text-brand-cyan/80 whitespace-pre overflow-auto custom-scrollbar">
                            {selectedArtifact?.content || '// Brain dump pending... Select an artifact.'}
                          </div>
                       </div>
                    </div>
                   ) : (
                     <div className="flex-1 flex flex-col h-full bg-surface-base">
                        {activeTab === 'deployment' ? (
                           <div className="flex-1 flex flex-colアイテムs-center justify-center p-20 gap-8 text-center max-w-2xl mx-auto">
                              <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                                 <Globe className="w-12 h-12" />
                              </div>
                              <div className="space-y-4">
                                 <h2 className="text-4xl font-bold text-white tracking-tight uppercase italic">Go Live</h2>
                                 <p className="text-text-secondary text-lg leading-relaxed">Synthesis complete. Application is staged on the edge. Commit current branch to production infrastructure?</p>
                              </div>
                              <button 
                                onClick={() => {
                                  setDeploying(true);
                                  setTimeout(() => setDeploying(false), 3000);
                                }}
                                className="px-12 py-4 bg-brand-green text-black font-bold uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl flex items-center gap-3"
                              >
                                {deploying ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                                {deploying ? 'Injecting Protools...' : 'Confirm Mainnet Push'}
                              </button>
                           </div>
                        ) : <div className="p-10 text-center text-text-muted">Protocol Under Calibration.</div>}
                     </div>
                   )}
                 </div>

                 {/* Persistent Chat/Prompt Bar at the bottom like Lovable */}
                 <div className="p-6 shrink-0 z-20">
                    <div className="max-w-4xl mx-auto relative group">
                       <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition transition-duration-500"></div>
                       <div className="relative flex items-center gap-4 bg-surface-panel/80 backdrop-blur-xl border border-border-bright p-2 rounded-2xl shadow-xl">
                          <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="How can we refine this build?"
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-sans py-3 px-4 text-white resize-none h-12 custom-scrollbar"
                          />
                          <button 
                             onClick={handleInitializeGeneration}
                             disabled={isGenerating || !user}
                             className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:scale-105 disabled:opacity-50 transition-all font-bold"
                          >
                             <Send className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>
               </div>

               {isGenerating && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-surface-base/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-20 gap-12"
                 >
                    <div className="relative">
                       <motion.div 
                         animate={{ rotate: 360 }} 
                         transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                         className="w-48 h-48 border-2 border-dashed border-brand-blue/30 rounded-full"
                       />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Cpu className="w-16 h-16 text-brand-blue animate-pulse" />
                       </div>
                    </div>
                    <div className="text-center space-y-6">
                       <h2 className="text-3xl font-black text-white italic tracking-widest uppercase">Orchestrating Structure</h2>
                       <div className="flex flex-col items-center gap-2">
                          <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.3em] font-bold">
                             {currentStep?.label || 'Initializing Neural Engine...'}
                          </span>
                          <div className="w-64 h-1 bg-surface-active rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ x: '-100%' }}
                               animate={{ x: '100%' }}
                               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                               className="h-full w-full bg-brand-blue" 
                             />
                          </div>
                       </div>
                       <p className="text-xs text-text-muted font-mono max-w-sm mx-auto uppercase">Synthesizing autonomic nodes and edge-sharded logic vectors.</p>
                    </div>
                 </motion.div>
               )}
            </div>
          )}
        </div>

        <footer className="h-8 border-t border-border-dim bg-surface-elevated flex items-center px-4 justify-between text-[10px] font-mono text-text-muted shrink-0">
           <div className="flex gap-6 uppercase tracking-widest">
              <span>Engine: <span className="text-white">Active</span></span>
              <span>Cloud: <span className="text-brand-green">Connected</span></span>
              <button 
                onClick={() => setShowSupport(true)}
                className="hover:text-white transition-colors"
              >
                Inquiry Protocol
              </button>
           </div>
           <div className="text-text-secondary">M7A_SYSTEM_v3.2.0</div>
        </footer>

        <AnimatePresence>
          {showSupport && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSupport(false)}
                className="absolute inset-0 bg-surface-base/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-8 max-w-md w-full relative z-10 space-y-6"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest italic">Operative Support</h3>
                  <button onClick={() => setShowSupport(false)} className="text-text-muted hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </button>
                </div>
                <p className="text-sm text-text-secondary">Neural line to the M7A Architect. Typical response latency measured in cycles.</p>
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-muted uppercase">Protocol Query</label>
                      <textarea className="w-full bg-surface-active border border-border-dim rounded-lg p-3 text-sm focus:border-brand-blue outline-none transition-all h-24" placeholder="Detail your system discrepancy..." />
                   </div>
                   <button 
                     onClick={() => {
                        alert("Inquiry transmitted to the kernel. Awaiting synchronization.");
                        setShowSupport(false);
                     }}
                     className="w-full py-3 bg-brand-blue text-white font-bold uppercase tracking-widest rounded-xl text-xs"
                   >
                      Transmit Inquiry
                   </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}


