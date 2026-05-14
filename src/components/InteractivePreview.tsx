import * as React from 'react';
import { motion } from 'motion/react';
import { MousePointer2, Code2 } from 'lucide-react';

export interface SelectedElement {
  id: string;
  name: string;
  type: string;
  code: string;
}

const ELEMENTS = {
  header: {
    id: 'header',
    name: 'MainNavigation',
    type: 'Component',
    code: `export const MainNavigation = () => (
  <header className="h-14 border-b border-border-bright flex items-center px-6 justify-between bg-surface-elevated/40">
    <div className="flex items-center gap-2 font-bold text-white text-sm">ELITE CRM</div>
    <nav className="flex gap-4">
      <NavItem label="Deals" active />
      <NavItem label="Contacts" />
    </nav>
  </header>
);`
  },
  sidebar: {
    id: 'sidebar',
    name: 'AppSidebar',
    type: 'Component',
    code: `export const AppSidebar = () => (
  <aside className="w-48 flex flex-col gap-3 py-6 px-4">
    <SidebarItem icon={Layout} label="Dashboard" active />
    <SidebarItem icon={Users} label="Pipeline" />
    <SidebarItem icon={Calendar} label="Appointments" />
  </aside>
);`
  },
  chart: {
    id: 'chart',
    name: 'RevenueAnalytics',
    type: 'Component',
    code: `export const RevenueAnalytics = ({ data }) => (
  <div className="h-40 glass-panel p-4 flex flex-col gap-2">
    <div className="h-4 w-1/3 bg-white/10 rounded" />
    <div className="flex-1 flex items-end gap-1">
      {data.map((val) => (
        <Bar key={val.id} height={val.height} />
      ))}
    </div>
  </div>
);`
  },
  stats: {
    id: 'stats',
    name: 'StatCard',
    type: 'Component',
    code: `export const StatCard = ({ label, value }) => (
  <div className="h-32 glass-panel p-4 flex flex-col justify-between">
    <span className="text-xs text-text-muted font-bold uppercase tracking-widest">{label}</span>
    <h3 className="text-2xl font-bold text-white">{value}</h3>
  </div>
);`
  }
};

export const InteractivePreview = ({ 
  artifacts,
  projectName,
  onSelect, 
  selectedId 
}: { 
  artifacts: any[];
  projectName?: string;
  onSelect: (el: SelectedElement) => void;
  selectedId: string | null;
}) => {
  const [activeArtifact, setActiveArtifact] = React.useState<any>(null);

  React.useEffect(() => {
    // Try to find an entry point (index.html or App.tsx)
    const entry = artifacts.find(a => a.path.includes('App.tsx') || a.path.includes('page.tsx')) || artifacts[0];
    setActiveArtifact(entry);
  }, [artifacts]);

  if (artifacts.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-surface-base/50">
         <div className="w-16 h-16 bg-surface-active rounded-full flex items-center justify-center mb-6">
            <Code2 className="w-8 h-8 text-text-muted animate-pulse" />
         </div>
         <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Awaiting Synthesis</h3>
         <p className="text-text-secondary text-sm max-w-xs">Describe your application in the Forge prompt to materialize it here.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-surface-base border border-border-dim rounded-2xl shadow-2xl overflow-hidden flex flex-col relative group">
      {/* Dynamic Browser UI */}
      <header className="h-10 bg-surface-panel/80 border-b border-border-dim flex items-center px-4 justify-between shrink-0">
        <div className="flex gap-1.5">
           <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
           <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
           <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
        </div>
        <div className="bg-surface-base/50 px-4 py-0.5 rounded text-[10px] font-mono text-text-muted border border-border-dim w-1/2 text-center overflow-hidden whitespace-nowrap">
          {projectName ? projectName.toLowerCase().replace(/\s+/g, '-') : 'synth'}.m7a.app
        </div>
        <div className="w-16" />
      </header>

      <div className="flex-1 overflow-auto custom-scrollbar p-8">
        <div className="max-w-4xl mx-auto space-y-12">
           <div className="space-y-4 border-b border-border-dim pb-8">
              <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">{projectName || 'Synthesizing Node'}</h1>
              <div className="flex items-center gap-4">
                 <div className="px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded text-[10px] font-bold text-brand-blue uppercase">Version 1.0.0-Materialized</div>
                 <div className="px-3 py-1 bg-brand-green/10 border border-brand-green/20 rounded text-[10px] font-bold text-brand-green uppercase">Live Status: Active</div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Materialized Shards</h3>
                 <div className="space-y-2">
                    {artifacts.slice(0, 5).map(art => (
                       <div key={art.path} className="p-4 glass-panel border border-border-dim flex items-center justify-between group/file hover:border-brand-blue transition-colors">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-surface-active rounded">
                                <Code2 className="w-4 h-4 text-brand-cyan" />
                             </div>
                             <span className="text-[11px] font-mono text-text-secondary group-hover/file:text-white transition-colors">{art.path}</span>
                          </div>
                          <span className="text-[9px] font-bold text-text-muted uppercase">{art.language}</span>
                       </div>
                    ))}
                    {artifacts.length > 5 && <div className="text-center text-[10px] text-text-muted pt-2 font-bold uppercase">+{artifacts.length - 5} more shards...</div>}
                 </div>
              </div>

              <div className="glass-panel p-8 space-y-6 flex flex-col justify-center border-dashed border-2">
                 <div className="w-16 h-16 bg-brand-blue/10 rounded-3xl mx-auto flex items-center justify-center text-brand-blue">
                    <MousePointer2 className="w-8 h-8" />
                 </div>
                 <div className="text-center space-y-2">
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs">Visual Component Mapping</h4>
                    <p className="text-text-secondary text-[10px] max-w-[200px] mx-auto uppercase leading-loose">Autonomic UI materialization for {projectName} is finalized. Use Source Stream to inspect individual node logic.</p>
                 </div>
                 <button className="w-full py-3 bg-brand-blue text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all">
                    Launch Interactive Sandbox
                 </button>
              </div>
           </div>
        </div>
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 pointer-events-none group-hover:bg-brand-blue/2 transition-all duration-500 border-2 border-transparent group-hover:border-brand-blue/10 rounded-2xl" />
    </div>
  );
};
