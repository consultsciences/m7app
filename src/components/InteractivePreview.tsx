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
  onSelect, 
  selectedId 
}: { 
  onSelect: (el: SelectedElement) => void;
  selectedId: string | null;
}) => {
  return (
    <div className="w-full h-full max-w-5xl bg-surface-base border border-border-dim rounded-2xl shadow-2xl overflow-hidden flex flex-col relative group">
      {/* Header */}
      <header 
        onClick={(e) => { e.stopPropagation(); onSelect(ELEMENTS.header); }}
        className={`h-14 border-b border-border-bright flex items-center px-6 justify-between bg-surface-elevated/40 cursor-pointer transition-all hover:bg-brand-blue/5 relative group/item ${selectedId === 'header' ? 'ring-2 ring-brand-blue ring-inset bg-brand-blue/10' : ''}`}
      >
        <div className="flex items-center gap-2 font-bold text-white text-sm">ELITE CRM</div>
        <div className="flex gap-4">
          <div className="w-20 h-2 bg-surface-active rounded" />
          <div className="w-20 h-2 bg-surface-active rounded" />
        </div>
        {selectedId === 'header' && (
             <div className="absolute top-0 right-0 p-1 bg-brand-blue text-white text-[8px] font-bold uppercase">Component: Header</div>
        )}
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <div 
          onClick={(e) => { e.stopPropagation(); onSelect(ELEMENTS.sidebar); }}
          className={`w-48 border-r border-border-dim p-6 flex flex-col gap-3 cursor-pointer transition-all hover:bg-brand-blue/5 relative group/item ${selectedId === 'sidebar' ? 'ring-2 ring-brand-blue ring-inset bg-brand-blue/10' : ''}`}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 bg-surface-active/50 rounded flex items-center px-3">
              <div className="w-3 h-3 rounded-sm bg-white/10 mr-2" />
              <div className="w-full h-1 bg-white/5 rounded" />
            </div>
          ))}
          {selectedId === 'sidebar' && (
             <div className="absolute top-0 left-0 p-1 bg-brand-blue text-white text-[8px] font-bold uppercase">Component: Sidebar</div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 grid grid-cols-2 gap-4 overflow-y-auto">
          {/* Chart */}
          <div 
            onClick={(e) => { e.stopPropagation(); onSelect(ELEMENTS.chart); }}
            className={`col-span-2 h-40 glass-panel p-4 flex flex-col gap-2 cursor-pointer transition-all hover:bg-brand-blue/5 relative group/item ${selectedId === 'chart' ? 'ring-2 ring-brand-blue ring-inset bg-brand-blue/10' : ''}`}
          >
            <div className="h-4 w-1/3 bg-white/10 rounded" />
            <div className="flex-1 flex items-end gap-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="flex-1 bg-brand-blue/20" style={{ height: `${Math.random() * 80 + 20}%` }} />
              ))}
            </div>
            {selectedId === 'chart' && (
             <div className="absolute top-0 right-0 p-1 bg-brand-blue text-white text-[8px] font-bold uppercase">Component: Chart</div>
            )}
          </div>

          {/* Stats */}
          <div 
            onClick={(e) => { e.stopPropagation(); onSelect(ELEMENTS.stats); }}
            className={`h-32 glass-panel p-6 flex flex-col justify-between cursor-pointer transition-all hover:bg-brand-blue/5 relative group/item ${selectedId === 'stats' ? 'ring-1 ring-brand-blue ring-inset bg-brand-blue/10' : ''}`}
          >
             <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Active Leads</div>
             <div className="text-3xl font-bold text-white tracking-tight">1,204</div>
             <div className="h-1 w-full bg-surface-active rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-brand-cyan" />
             </div>
             {selectedId === 'stats' && (
                <div className="absolute top-0 left-0 p-1 bg-brand-blue text-white text-[8px] font-bold uppercase">Component: Stats</div>
             )}
          </div>

          <div 
            onClick={(e) => { e.stopPropagation(); onSelect(ELEMENTS.stats); }}
            className={`h-32 glass-panel p-6 flex flex-col justify-between cursor-pointer transition-all hover:bg-brand-blue/5 relative group/item ${selectedId === 'stats' ? 'ring-1 ring-brand-blue ring-inset bg-brand-blue/10' : ''}`}
          >
             <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Conversion Rate</div>
             <div className="text-3xl font-bold text-white tracking-tight">14.2%</div>
             <div className="h-1 w-full bg-surface-active rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-brand-blue" />
             </div>
          </div>
        </div>
      </div>
      
      {/* Help Overlay on Hover */}
      <div className="absolute inset-0 pointer-events-none bg-brand-blue/0 group-hover:bg-brand-blue/2 transition-all duration-500">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-elevated border border-brand-blue/50 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl backdrop-blur-md">
            <MousePointer2 className="w-4 h-4 text-brand-blue" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Click element to inspect source code</span>
         </div>
      </div>
    </div>
  );
};
