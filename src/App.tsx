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
    if (!prompt.trim() || !user) return;
    
    setIsGenerating(true);
    try {
      const project = await projectService.createProject(
        prompt.split(' ').slice(0, 3).join(' ') || "Untitled App",
        "Autonomic Web App"
      );
      setSelectedProjectId(project.id);
      
      const jobId = await generationService.startGeneration(project.id, prompt);
      
      generationService.onJobStatus(project.id, jobId, (job) => {
        setActiveJob(job);
        if (job.status === 'completed') {
          setIsGenerating(false);
          setActiveTab('source');
        }
      });
      
    } catch (error) {
      console.error("Initialization failed:", error);
      setIsGenerating(false);
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

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
          <div className="flex-1 flex min-h-0">
             {/* Left Column: Explorer */}
             <div className="w-1/4 border-r border-border-dim flex flex-col bg-surface-base/50">
                <div className="p-4 border-b border-border-dim flex items-center justify-between">
                   <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Explorer</span>
                   <Layers className="w-3.5 h-3.5 text-text-muted" />
                </div>
                <div className="flex-1 overflow-hidden">
                   {artifacts.length > 0 ? (
                      <FileTree 
                        artifacts={artifacts} 
                        onSelectFile={(a) => {
                          setSelectedArtifact(a);
                          setActiveTab('source');
                        }} 
                        selectedPath={selectedArtifact?.path} 
                      />
                   ) : (
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-2">
                         <div className="w-1 h-12 bg-border-dim/20 rounded-full animate-pulse" />
                         <span className="text-[10px] font-mono text-text-muted uppercase">Awaiting Materialization</span>
                      </div>
                   )}
                </div>
                {artifacts.length > 0 && (
                   <div className="p-4 border-t border-border-dim">
                      <button 
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-surface-active hover:bg-surface-panel border border-border-dim rounded-xl text-[10px] font-bold text-white uppercase tracking-widest transition-all"
                      >
                         <Download className="w-3.5 h-3.5" /> Download Project
                      </button>
                   </div>
                )}
             </div>

             {/* Center/Right: Main Display */}
             <div className="flex-1 flex flex-col min-w-0 bg-surface-elevated/20">
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab + (selectedArtifact?.id || '')}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="h-full flex flex-col"
                    >
                      {activeTab === 'dashboard' && <Dashboard />}
                      {activeTab === 'preview' && (
                        <div className="h-full flex items-center justify-center p-8">
                           <div className="w-full h-full max-w-5xl bg-surface-base border border-border-dim rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                              <div className="h-10 bg-surface-elevated border-b border-border-dim flex items-center px-4 justify-between">
                                 <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
                                 </div>
                                 <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
                                    <Globe className="w-3 h-3" /> https://preview.m7a.io/{selectedProjectId?.slice(0, 8)}
                                 </div>
                                 <div className="w-20" />
                              </div>
                              <InteractivePreview 
                                selectedId={null}
                                onSelect={() => {}} 
                              />
                           </div>
                        </div>
                      )}
                      {activeTab === 'source' && (
                        <div className="space-y-6 flex flex-col h-full">
                           <div className="flex flex-col gap-1">
                              <h1 className="text-2xl font-bold tracking-tight text-white">Source Stream</h1>
                              <p className="text-text-secondary text-sm">Autonomic logic injection for {selectedArtifact?.path || 'artifacts'}.</p>
                           </div>
                           
                           {selectedArtifact ? (
                             <div className="glass-panel rounded-lg overflow-hidden flex flex-col min-h-0 flex-1">
                                <div className="p-3 bg-surface-elevated border-b border-border-dim text-text-muted flex justify-between items-center">
                                   <div className="flex items-center gap-3 font-mono text-[11px]">
                                      <span>{selectedArtifact.path}</span>
                                      <button onClick={() => handleCopy(selectedArtifact.content)} className="p-1 hover:text-white transition-colors relative">
                                        {copied ? <Check className="w-3 h-3 text-brand-cyan" /> : <Copy className="w-3 h-3" />}
                                      </button>
                                   </div>
                                   <span className="text-[10px] font-bold text-brand-blue uppercase">{selectedArtifact.language}</span>
                                </div>
                                <div className="p-6 bg-[#0F0F12] text-brand-cyan/90 leading-relaxed whitespace-pre overflow-auto font-mono flex-1 custom-scrollbar text-[13px]">
                                   {selectedArtifact.content}
                                </div>
                             </div>
                           ) : (
                             <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border-dim rounded-xl">
                                <Code2 className="w-12 h-12 text-text-muted mb-4" />
                                <h3 className="text-white font-bold uppercase tracking-widest text-xs">No Artifact Selected</h3>
                             </div>
                           )}
                        </div>
                      )}
                      {activeTab === 'service-graph' && <ServiceGraph />}
                      {activeTab === 'neural-burn' && <NeuralBurn />}
                      {activeTab === 'database' && <DatabaseSchema />}
                      {activeTab === 'diagnostics' && <Diagnostics />}
                      {activeTab === 'deployment' && (
                        <div className="h-full flex flex-col items-center justify-center p-8 max-w-4xl mx-auto space-y-12 w-full">
                           <div className="flex flex-col items-center text-center gap-4">
                              <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                                 <Globe className="w-10 h-10" />
                              </div>
                              <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-widest italic">Global Edge Ingress</h2>
                                <p className="text-text-secondary text-sm max-w-sm">Stage your autonomic application for global distribution across the decentralized forge network.</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                              <div className="glass-panel p-6 space-y-4 border-l-2 border-l-brand-blue">
                                 <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Staging Node</span>
                                    <span className="text-[9px] font-mono text-brand-green">READY</span>
                                 </div>
                                 <div className="text-sm font-bold text-white">m7a-edge-alpha-01</div>
                                 <div className="h-1 w-full bg-border-dim rounded-full overflow-hidden">
                                    <div className="h-full w-full bg-brand-blue" />
                                 </div>
                              </div>
                              <div className="glass-panel p-6 space-y-4 opacity-50 grayscale">
                                 <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Production Pipeline</span>
                                    <span className="text-[9px] font-mono text-text-muted italic">PRO_REQUIRED</span>
                                 </div>
                                 <div className="text-sm font-bold text-text-muted">m7a-mainnet-stable</div>
                                 <div className="h-1 w-full bg-border-dim rounded-full" />
                              </div>
                           </div>

                           <button 
                             disabled={deploying}
                             onClick={() => {
                               setDeploying(true);
                               setTimeout(() => setDeploying(false), 3000);
                             }}
                             className="px-12 py-4 bg-brand-green text-black font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-brand-green/80 transition-all flex items-center gap-3 disabled:opacity-50 shadow-lg"
                           >
                              {deploying ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                              {deploying ? 'Initializing Protocols...' : 'Commit to Production'}
                           </button>

                           {deploying && (
                             <motion.div 
                               initial={{ opacity: 0, y: 10 }} 
                               animate={{ opacity: 1, y: 0 }}
                               className="text-[10px] font-mono text-brand-green uppercase animate-pulse"
                             >
                               Injecting autonomic shards into edge clusters...
                             </motion.div>
                           )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="p-6 border-t border-border-dim bg-surface-elevated/40">
                   <div className="max-w-4xl mx-auto">
                      <div className="flex gap-4 items-end bg-surface-panel border border-border-bright p-4 rounded-2xl">
                         <textarea 
                           value={prompt}
                           onChange={(e) => setPrompt(e.target.value)}
                           placeholder="Modify project or branch logic..." 
                           className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-mono h-12 text-text-primary resize-none"
                         />
                         <button 
                           onClick={handleInitializeGeneration}
                           disabled={isGenerating || !user}
                           className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center hover:scale-105 disabled:opacity-50 transition-all shadow-lg"
                         >
                            <Send className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                </div>

                {isGenerating && (
                  <div className="absolute inset-0 bg-surface-base/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-20 gap-10">
                     <div className="relative w-64 h-64 flex items-center justify-center">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-4 border-dashed border-brand-blue/20 rounded-full" />
                        <div className="w-32 h-32 bg-brand-blue/10 rounded-full flex items-center justify-center">
                           <Cpu className="w-12 h-12 text-brand-blue animate-pulse" />
                        </div>
                     </div>
                     <div className="flex flex-col items-center gap-4 text-center">
                        <h3 className="text-xl font-bold text-white tracking-widest uppercase">Orchestrating Matrix</h3>
                        <p className="text-text-secondary font-mono text-sm uppercase tracking-tighter">
                           {currentStep?.label || 'Initializing Pipeline...'}
                        </p>
                        <div className="w-48 h-1 bg-border-dim rounded-full overflow-hidden mt-4">
                           <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity }} className="h-full w-full bg-brand-blue" />
                        </div>
                     </div>
                  </div>
                )}
             </div>
          </div>
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


