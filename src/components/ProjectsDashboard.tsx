import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, LayoutGrid, List, Search, MoreVertical, ExternalLink, Trash2, Edit3, Rocket, CreditCard, User, Settings, Bell, LogOut, Activity, Download, ChevronLeft, Mail, Lock, UserPlus, LogIn, ArrowRight, Shield, RefreshCw } from 'lucide-react';
import { projectService, Project } from '../services/projectService';
import { workspaceService, Workspace } from '../services/workspaceService';
import { userService, UserProfile } from '../services/userService';
import { auth, loginWithGoogle, logout, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, getAuthErrorMessage } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const ProjectsDashboard = ({ onSelectProject, onCreateProject, onBack }: { onSelectProject: (id: string) => void, onCreateProject: () => void, onBack: () => void }) => {
  const [activeSubTab, setActiveSubTab] = React.useState<'projects' | 'team' | 'usage' | 'billing'>('projects');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [user, setUser] = React.useState(auth.currentUser);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [authMode, setAuthMode] = React.useState<'options' | 'login' | 'signup' | 'forgot-password'>('options');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = React.useState<string | null>(null);
  const [authLoading, setAuthLoading] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [isUpgrading, setIsUpgrading] = React.useState(false);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Terminate project sequence? This action is irreversible.")) {
      try {
        await projectService.deleteProject(id);
      } catch (error) {
        console.error("Deletion failed:", error);
      }
    }
  };

  React.useEffect(() => {
    let unsubscribeWorkspaces = () => {};
    let unsubscribeProjects = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const profile = await userService.ensureUserProfile(u);
        setUserProfile(profile);
        
        // Use a flag to avoid double creation in dev strict mode
        unsubscribeWorkspaces = workspaceService.onUserWorkspaces(async (ws) => {
          setWorkspaces(ws);
          if (ws.length === 0) {
             await workspaceService.createWorkspace(`${u.displayName || 'Operative'}'s Forge`);
          }
        });

        unsubscribeProjects = projectService.onUserProjects((p) => {
          setProjects(p);
          setLoading(false);
        });
      } else {
        setLoading(false);
        setProjects([]);
        setWorkspaces([]);
        setUserProfile(null);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeWorkspaces();
      unsubscribeProjects();
    };
  }, []);

  if (!user && !loading) {
    const handleEmailAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError(null);
      setAuthSuccess(null);
      setAuthLoading(true);
      try {
        if (authMode === 'signup') {
          const result = await createUserWithEmailAndPassword(auth, email, password);
          if (displayName) {
            await updateProfile(result.user, { displayName });
          }
        } else if (authMode === 'login') {
          await signInWithEmailAndPassword(auth, email, password);
        } else if (authMode === 'forgot-password') {
          await sendPasswordResetEmail(auth, email);
          setAuthSuccess("A restoration link has been transmitted to your neural address.");
        }
      } catch (error: any) {
        console.error("Auth failed:", error);
        const mappedError = getAuthErrorMessage(error.code || 'unknown');
        setAuthError(mappedError);
      } finally {
        setAuthLoading(false);
      }
    };

    const handleGoogleAuth = async () => {
      setAuthError(null);
      setAuthSuccess(null);
      try {
        await loginWithGoogle();
      } catch (error: any) {
        const mappedError = getAuthErrorMessage(error.code || 'unknown');
        setAuthError(mappedError);
      }
    };

    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 technical-grid opacity-20 pointer-events-none" />
        
        {/* Go Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm font-mono uppercase tracking-widest group z-20"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 max-w-md w-full text-center space-y-8 relative z-10"
        >
          <div className="w-20 h-20 bg-brand-blue rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl text-white shadow-[0_0_40px_rgba(0,102,255,0.4)] mb-2">
            M7A
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white uppercase italic">The Forge</h1>
            <p className="text-text-secondary text-sm">
              {authMode === 'options' ? 'Authentication required to access the autonomic engineering matrix.' : 
               authMode === 'login' ? 'Sync your credentials with the neural network.' : 
               authMode === 'signup' ? 'Register a new operative in the database.' :
               'Initialize credential restoration sequence.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {authMode === 'options' ? (
              <motion.div 
                key="options"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <button 
                  onClick={handleGoogleAuth}
                  className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  Sign in with Google
                </button>
                
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-border-dim" />
                  <span className="text-[10px] font-mono text-text-muted uppercase">OR</span>
                  <div className="h-px flex-1 bg-border-dim" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setAuthMode('login')}
                    className="py-4 bg-surface-active border border-border-bright text-white font-bold uppercase tracking-widest rounded-xl hover:bg-surface-panel transition-all flex flex-col items-center gap-2"
                  >
                    <LogIn className="w-5 h-5 text-brand-blue" />
                    <span className="text-[10px]">Login</span>
                  </button>
                  <button 
                    onClick={() => setAuthMode('signup')}
                    className="py-4 bg-surface-active border border-border-bright text-white font-bold uppercase tracking-widest rounded-xl hover:bg-surface-panel transition-all flex flex-col items-center gap-2"
                  >
                    <UserPlus className="w-5 h-5 text-brand-cyan" />
                    <span className="text-[10px]">Sign Up</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleEmailAuth}
                className="space-y-4 text-left"
              >
                {authMode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Operative Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input 
                        type="text" 
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-surface-active border border-border-bright rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operative@theforge.ai"
                      className="w-full bg-surface-active border border-border-bright rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-all"
                    />
                  </div>
                </div>

                {authMode !== 'forgot-password' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Access Protocol</label>
                      {authMode === 'login' && (
                        <button 
                          type="button"
                          onClick={() => setAuthMode('forgot-password')}
                          className="text-[9px] font-bold text-brand-blue uppercase hover:text-white transition-colors"
                        >
                          Lost Protocol?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-surface-active border border-border-bright rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>
                )}

                {authError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-mono uppercase">
                    ERROR: {authError}
                  </div>
                )}

                {authSuccess && (
                  <div className="p-3 bg-brand-green/10 border border-brand-green/20 rounded-lg text-brand-green text-[10px] font-mono uppercase">
                    SUCCESS: {authSuccess}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-4 bg-brand-blue text-white font-bold uppercase tracking-widest rounded-xl hover:bg-brand-blue/80 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {authLoading ? 'Authorizing...' : 
                   authMode === 'login' ? 'Login Operative' : 
                   authMode === 'signup' ? 'Register Operative' : 
                   'Restore Access'}
                  {!authLoading && <ArrowRight className="w-4 h-4" />}
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    setAuthMode('options');
                    setAuthError(null);
                    setAuthSuccess(null);
                  }}
                  className="w-full text-center text-[10px] font-bold text-text-muted uppercase tracking-widest hover:text-white transition-colors"
                >
                  Cancel Auth Sequence
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-base text-text-primary flex flex-col">
      <div className="absolute inset-0 technical-grid opacity-20 pointer-events-none" />
      
      {/* Top Navbar */}
      <header className="h-16 border-b border-border-dim bg-surface-elevated/80 backdrop-blur-md px-8 flex items-center justify-between z-30">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-blue rounded-sm flex items-center justify-center font-bold text-sm text-white">
              M7A
            </div>
            <span className="font-bold text-lg tracking-tight text-white uppercase hidden md:inline">The Forge</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-text-secondary">
            <button 
              onClick={() => setActiveSubTab('projects')}
              className={`pb-5 pt-5 -mb-[18px] transition-colors ${activeSubTab === 'projects' ? 'text-white border-b-2 border-brand-blue' : 'hover:text-white'}`}
            >
              Projects
            </button>
            <button 
              onClick={() => setActiveSubTab('team')}
              className={`pb-5 pt-5 -mb-[18px] transition-colors ${activeSubTab === 'team' ? 'text-white border-b-2 border-brand-blue' : 'hover:text-white'}`}
            >
              Team
            </button>
            <button 
              onClick={() => setActiveSubTab('usage')}
              className={`pb-5 pt-5 -mb-[18px] transition-colors ${activeSubTab === 'usage' ? 'text-white border-b-2 border-brand-blue' : 'hover:text-white'}`}
            >
              Usage
            </button>
            <button 
              onClick={() => setActiveSubTab('billing')}
              className={`pb-5 pt-5 -mb-[18px] transition-colors ${activeSubTab === 'billing' ? 'text-white border-b-2 border-brand-blue' : 'hover:text-white'}`}
            >
              Billing
            </button>
          </nav>
        </div>

          <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-active border border-border-bright rounded-lg mr-2">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Credits</span>
            <span className="text-xs font-bold text-brand-cyan">{userProfile?.credits || 0}</span>
          </div>
          <div className="relative">
             <button 
               onClick={() => setShowNotifications(!showNotifications)}
               className="text-text-secondary hover:text-white relative"
             >
               <Bell className="w-5 h-5" />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-surface-base"></span>
             </button>
             {showNotifications && (
               <div className="absolute right-0 mt-4 w-64 glass-panel p-4 z-50">
                 <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-2">Neural Feed</div>
                 <div className="text-[10px] text-text-muted">No new alerts from the M7A Kernel.</div>
               </div>
             )}
          </div>
          <button 
            onClick={logout}
            className="w-8 h-8 rounded-full border border-border-bright bg-surface-panel flex items-center justify-center group relative overflow-hidden"
            title="Logout"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" />
            ) : (
              <User className="w-4 h-4 text-text-muted" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
               <LogOut className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full relative z-10 font-sans">
        {activeSubTab === 'projects' ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-white">Your Projects</h1>
                <p className="text-text-secondary text-sm">Manage and orchestrate your autonomous applications.</p>
              </div>
              <button 
                onClick={onCreateProject}
                className="px-6 py-3 bg-brand-blue text-white font-bold tracking-widest uppercase rounded-xl hover:bg-brand-blue/80 transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(0,102,255,0.3)]"
              >
                <Plus className="w-4 h-4" /> New App
              </button>
            </div>

            {/* Filters and View Toggle */}
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects..." 
                      className="w-full bg-surface-panel border border-border-bright rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-blue/50 transition-all text-white"
                    />
                  </div>
               </div>
               <div className="flex items-center gap-2 bg-surface-panel p-1 border border-border-bright rounded-lg">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md shadow-sm transition-all ${viewMode === 'grid' ? 'bg-surface-active text-white' : 'text-text-muted hover:text-text-secondary'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md shadow-sm transition-all ${viewMode === 'list' ? 'bg-surface-active text-white' : 'text-text-muted hover:text-text-secondary'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Project Grid / List */}
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-3"}>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`glass-panel animate-pulse bg-surface-active/20 ${viewMode === 'grid' ? 'h-[320px]' : 'h-20'}`} />
                ))
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project, idx) => (
                  <motion.div 
                     key={project.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.05 }}
                     className={`glass-panel group hover:border-brand-blue/40 transition-all cursor-pointer flex ${viewMode === 'grid' ? 'flex-col' : 'items-center justify-between p-4'}`}
                     onClick={() => onSelectProject(project.id)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-video bg-surface-active/50 overflow-hidden relative border-b border-border-dim">
                          <div className="absolute inset-0 technical-grid opacity-10" />
                          <div className="p-4 flex flex-col gap-2 h-full justify-center items-center opacity-40 group-hover:opacity-100 transition-opacity">
                             <div className="w-1/2 h-1 bg-brand-cyan/20 rounded-full" />
                             <div className="w-3/4 h-1 bg-brand-blue/20 rounded-full" />
                             <div className="w-1/2 h-1 bg-brand-cyan/20 rounded-full" />
                          </div>
                          
                          {project.status === 'building' && (
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-brand-blue/10 backdrop-blur-md flex items-center justify-between border-t border-brand-blue/20">
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                                  <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest">Building Engine...</span>
                               </div>
                               <span className="text-[10px] font-mono text-text-secondary">PIPELINE_ACTIVE</span>
                            </div>
                          )}

                          {project.status === 'deployed' && (
                            <div className="absolute top-4 right-4 bg-brand-green/20 backdrop-blur-md px-2 py-0.5 rounded border border-brand-green/30 text-[9px] font-bold text-brand-green uppercase tracking-widest flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-green shadow-[0_0_8px_#00FF85]" />
                              Live
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-lg font-bold text-white group-hover:text-brand-blue transition-colors font-sans">{project.name}</h3>
                            <button 
                              onClick={(e) => handleDeleteProject(project.id, e)}
                              className="p-1 text-text-muted hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xs text-text-secondary mb-4">{project.type}</div>
                          <div className="mt-auto pt-4 border-t border-border-dim flex items-center justify-between">
                             <span className="text-[10px] font-mono text-text-muted uppercase">Autonomic Node</span>
                             <div className="flex gap-3">
                                <button className="text-text-muted hover:text-brand-cyan transition-colors">
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                                <button className="text-text-muted hover:text-brand-blue transition-colors">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                             </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-surface-active rounded-lg flex items-center justify-center text-brand-blue">
                             <Rocket className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">{project.name}</h3>
                            <p className="text-[10px] text-text-muted uppercase font-mono tracking-widest">{project.id.slice(0, 8)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <span className="text-[10px] font-mono text-text-secondary px-2 py-1 bg-surface-active rounded border border-border-dim uppercase">{project.status}</span>
                          <div className="flex gap-2">
                             <button className="p-2 text-text-muted hover:text-brand-blue transition-all">
                                <Edit3 className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={(e) => handleDeleteProject(project.id, e)}
                               className="p-2 text-text-muted hover:text-red-500 transition-all"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                             <button className="p-2 text-text-muted hover:text-white transition-all">
                                <MoreVertical className="w-4 h-4" />
                             </button>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-border-dim rounded-2xl">
                   <div className="w-16 h-16 bg-surface-active rounded-full flex items-center justify-center text-text-muted">
                      <Plus className="w-8 h-8" />
                   </div>
                   <div className="space-y-1">
                     <h3 className="text-white font-bold uppercase tracking-widest text-sm">No Matching Blueprints</h3>
                     <p className="text-text-secondary text-sm max-w-sm">Search query "{searchQuery}" returned no autonomic units.</p>
                   </div>
                </div>
              )}

              {activeSubTab === 'projects' && filteredProjects.length > 0 && viewMode === 'grid' && (
                <button 
                  onClick={onCreateProject}
                  className="border-2 border-dashed border-border-dim rounded-lg p-8 flex flex-col items-center justify-center gap-4 text-text-muted hover:text-brand-blue hover:border-brand-blue/50 transition-all bg-surface-active/10 group h-full min-h-[320px]"
                >
                  <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Plus className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold uppercase tracking-widest">Create New App</div>
                    <div className="text-[10px] mt-1 opacity-60">Initialize full-stack project</div>
                  </div>
                </button>
              )}
            </div>
          </>
        ) : activeSubTab === 'team' ? (
          <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">Collaboration Matrix</h2>
                  <p className="text-text-secondary text-sm">Managing operatives within the {workspaces[0]?.name || 'Autonomous'} Workspace.</p>
                </div>
                <button 
                  onClick={() => {
                    const email = prompt("Enter operative email to link:");
                    if (email) workspaceService.inviteMember(workspaces[0]?.id || '', email);
                  }}
                  className="px-6 py-2 bg-brand-cyan text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-cyan/80 transition-all flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Invite Operative
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(workspaces[0]?.members || [user?.uid]).map((mId, i) => (
                  <div key={mId} className="glass-panel p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{mId === user?.uid ? userProfile?.displayName : 'External Operative'}</div>
                      <div className="text-[10px] font-mono text-text-muted uppercase truncate">{mId === user?.uid ? 'ARCHITECT' : 'COLLABORATOR'}</div>
                    </div>
                  </div>
                ))}
             </div>

             <div className="py-12 border-t border-border-dim mt-12 flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-surface-active rounded-full flex items-center justify-center">
                   <Settings className="w-8 h-8 text-text-muted" />
                </div>
                <div className="space-y-1">
                   <h3 className="text-white font-bold uppercase tracking-widest">Workspace Protocols</h3>
                   <p className="text-text-secondary text-sm max-w-md">Additional shared workspace features are undergoing neural calibration.</p>
                </div>
             </div>
          </div>
        ) : activeSubTab === 'usage' ? (
          <div className="space-y-12">
             <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-3xl font-bold text-white">System Usage</h2>
                   <p className="text-text-secondary">Resource consumption across the Autonomic Fabric.</p>
                </div>
                <div className="px-4 py-2 bg-surface-panel rounded-lg border border-border-dim">
                   <span className="text-[10px] font-mono text-text-muted uppercase">Cycle Reset: 16 Days</span>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Compute Cycles', value: '4.2T', max: '10T', color: 'bg-brand-blue' },
                  { label: 'Storage Shards', value: '1.2GB', max: '5GB', color: 'bg-brand-cyan' },
                  { label: 'API Ingress', value: '14.2k', max: '50k', color: 'bg-brand-purple' }
                ].map((stat, i) => (
                  <div key={i} className="glass-panel p-6 space-y-4">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</span>
                        <span className="text-sm font-mono text-white">{stat.value} / {stat.max}</span>
                     </div>
                     <div className="h-2 w-full bg-border-dim rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(parseFloat(stat.value)/parseFloat(stat.max))*100}%` }}
                          className={`h-full ${stat.color}`}
                        />
                     </div>
                  </div>
                ))}
             </div>
             
             <div className="glass-panel p-8">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                   <Activity className="w-4 h-4 text-brand-cyan" /> Consumption Timeline
                </h3>
                <div className="h-64 w-full bg-surface-active/20 rounded-lg border border-border-dim flex items-center justify-center overflow-hidden relative">
                   <div className="absolute inset-0 technical-grid opacity-10" />
                   <div className="flex items-end gap-1 px-4 w-full h-40">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-brand-blue/30 hover:bg-brand-blue transition-colors rounded-t-sm"
                          style={{ height: `${Math.random() * 80 + 20}%` }}
                        />
                      ))}
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-12">
             <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-8">
                   <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Billing Vault</h2>
                      <p className="text-text-secondary">Financial orchestration and token allocation.</p>
                   </div>
                   
                   <div className="glass-panel p-8 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                         </div>
                         <div className="flex-1">
                            <div className="text-sm font-bold text-white uppercase tracking-widest leading-none mb-1">M7A-TENSOR-PRO</div>
                            <div className="text-xs text-text-muted">Autonomous Layer Subscription</div>
                         </div>
                         <div className="text-right">
                            <div className="text-lg font-bold text-white">$49.00</div>
                            <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest">per cycle</div>
                         </div>
                      </div>
                      
                      <div className="pt-6 border-t border-border-dim space-y-4">
                         <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Current Token Balance</span>
                            <span className="font-bold text-brand-cyan font-mono">{userProfile?.credits || 0} TOKENS</span>
                         </div>
                         <button 
                           onClick={() => {
                             if (userProfile) userService.updateProfile(userProfile.uid, { credits: (userProfile.credits || 0) + 100 });
                           }}
                           className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest rounded-xl text-xs hover:scale-[1.01] transition-transform"
                         >
                            Top Up Balance (Demo)
                         </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                       <h3 className="text-sm font-bold text-white uppercase tracking-widest">Transaction History</h3>
                       <div className="space-y-2">
                          {[
                            { id: 'INV-782', date: 'MAY 12, 2026', amount: '$49.00', status: 'Settled' },
                            { id: 'TOK-122', date: 'MAY 05, 2026', amount: '$25.00', status: 'Settled' },
                          ].map((inv) => (
                            <div key={inv.id} className="p-4 bg-surface-panel/50 border border-border-dim rounded-lg flex items-center justify-between text-xs">
                               <div className="flex items-center gap-4">
                                  <span className="font-mono text-brand-cyan">{inv.id}</span>
                                  <span className="text-text-muted">{inv.date}</span>
                               </div>
                               <div className="flex items-center gap-6">
                                  <span className="text-white font-bold">{inv.amount}</span>
                                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded uppercase tracking-tighter text-[9px]">{inv.status}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
                 
                 <div className="w-full md:w-80 space-y-6">
                    <div className="glass-panel p-6">
                       <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Payment Methods</h3>
                       <div className="p-4 bg-surface-active/50 border border-border-bright rounded-xl border-dashed flex flex-col items-center justify-center gap-3 text-text-muted">
                          <Plus className="w-5 h-5" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Add Vault Lock</span>
                       </div>
                    </div>
                    
                    <div className="p-6 bg-brand-blue/10 border border-brand-blue/30 rounded-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-2 opacity-10">
                          <Rocket className="w-16 h-16 text-brand-blue" />
                       </div>
                       <h4 className="text-white font-bold text-sm mb-1">Scale Up?</h4>
                       <p className="text-xs text-brand-blue/80 mb-4">Upgrade to ENTERPRISE for 50k tokens and shared workspaces.</p>
                       <button 
                         disabled={isUpgrading || userProfile?.plan === 'pro'}
                         onClick={async () => {
                           setIsUpgrading(true);
                           if (userProfile) await userService.updateProfile(userProfile.uid, { plan: 'pro' });
                           setIsUpgrading(false);
                         }}
                         className="w-full py-2 bg-brand-blue text-white text-[10px] font-bold uppercase tracking-widest rounded-lg disabled:opacity-50"
                       >
                          {userProfile?.plan === 'pro' ? 'PROFESSIONAL_ACTIVE' : 'Initialize Upgrade'}
                       </button>
                    </div>
                 </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

