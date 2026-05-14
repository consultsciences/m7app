import * as React from 'react';
import { LayoutDashboard, Share2, Activity, ShieldAlert, Cpu, Settings, Database, Rocket, Code2 } from 'lucide-react';
import { motion } from 'motion/react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group border ${
      active 
        ? 'bg-surface-active text-white border-border-bright' 
        : 'text-text-secondary border-transparent hover:bg-surface-active hover:text-text-primary'
    }`}
  >
    <div className={`w-4 h-4 border border-current rounded-sm ${active ? 'opacity-100' : 'opacity-50'}`}></div>
    <span className="font-medium text-xs tracking-tight">{label}</span>
  </button>
);

export const Navigation = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) => {
  const items = [
    { id: 'dashboard', label: 'Synthesis Lab', icon: LayoutDashboard },
    { id: 'source', label: 'Source Stream', icon: Code2 },
    { id: 'service-graph', label: 'Topology Vault', icon: Share2 },
    { id: 'neural-burn', label: 'Neural Burn', icon: Activity },
    { id: 'database', label: 'Matrix Schema', icon: Database },
    { id: 'deployment', label: 'Prod Push', icon: Rocket },
    { id: 'diagnostics', label: 'Diagnostics', icon: ShieldAlert },
  ];

  return (
    <div className="flex flex-col h-full bg-surface-elevated border-r border-border-dim w-[220px] p-4 gap-1">
      <div className="flex items-center gap-4 px-2 mb-8 mt-2">
        <div className="w-6 h-6 bg-brand-blue rounded-sm flex items-center justify-center font-bold text-[10px] text-white">
          M7A
        </div>
        <div className="flex flex-col text-left">
          <span className="font-bold text-xs leading-tight tracking-wider text-white uppercase">AUTONOMIC</span>
          <span className="text-[9px] font-mono text-brand-cyan uppercase">v2.4.0-STABLE</span>
        </div>
      </div>

      <div className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mb-3 mt-2 px-2">CORE INTERFACES</div>
      
      <nav className="flex-1 space-y-1">
        {items.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      <div className="mt-auto px-4 py-4 bg-surface-base/50 rounded-lg border border-border-dim">
        <div className="text-[10px] text-text-secondary mb-2 font-bold tracking-wider">ENGINE LOAD</div>
        <div className="h-1.5 w-full bg-border-dim rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '64.2%' }}
            className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan" 
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-mono text-text-secondary">
          <span>64.2%</span>
          <span>1.2s LAT</span>
        </div>
      </div>
    </div>
  );
};
