import * as React from 'react';
import { LayoutDashboard, Share2, Activity, ShieldAlert, Cpu, Settings, Database, Rocket, Code2, Eye } from 'lucide-react';
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
    { id: 'source', label: 'Source', icon: Code2 },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'deployment', label: 'Deploy', icon: Rocket },
  ];

  return (
    <div className="flex flex-col h-full bg-surface-elevated border-r border-border-dim w-[64px] py-6 items-center gap-6 shrink-0">
      <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-lg">
        M7A
      </div>
      
      <nav className="flex-1 flex flex-col gap-4 pt-6">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-white text-black shadow-lg scale-110' 
                : 'text-text-muted hover:bg-surface-active hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>

      <button className="w-10 h-10 flex items-center justify-center rounded-xl text-text-muted hover:bg-surface-active hover:text-white transition-all">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
};
