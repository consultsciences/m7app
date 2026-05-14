import * as React from 'react';
import { motion } from 'motion/react';
import { Server, Database, Globe, Shield, Cpu } from 'lucide-react';

interface NodeProps {
  x: number;
  y: number;
  label: string;
  icon: any;
  color: string;
}

const Node: React.FC<NodeProps> = ({ x, y, label, icon: Icon, color }) => (
  <motion.foreignObject 
    x={x - 60} 
    y={y - 40} 
    width="120" 
    height="80"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
  >
    <div className="flex flex-col items-center gap-2">
      <div className={`w-10 h-10 rounded-sm bg-surface-panel border ${color} flex items-center justify-center shadow-lg relative group`}>
        <Icon className={`w-5 h-5 ${color.replace('border-', 'text-')}`} />
        <div className={`absolute inset-0 rounded-sm ${color.replace('border-', 'bg-')} opacity-5 group-hover:opacity-10 transition-opacity`} />
      </div>
      <span className="text-[9px] font-mono text-text-secondary uppercase tracking-tighter bg-surface-elevated/90 px-1.5 py-0.5 rounded border border-border-dim">
        {label}
      </span>
    </div>
  </motion.foreignObject>
);

const Connection = ({ x1, y1, x2, y2, active }: { x1: number; y1: number; x2: number; y2: number; active?: boolean }) => (
  <g>
    <line 
      x1={x1} y1={y1} x2={x2} y2={y2} 
      stroke="#2D2D30" strokeWidth="1" 
    />
    {active && (
      <motion.line
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#0066FF" strokeOpacity="0.5" strokeWidth="1"
        strokeDasharray="4, 4"
      />
    )}
  </g>
);

export const ServiceGraph = () => {
  const nodes = [
    { id: 'kernel', x: 400, y: 300, label: 'm7a_kernel', icon: Cpu, color: 'border-brand-cyan' },
    { id: 'db', x: 400, y: 150, label: 'synth_pool_v4', icon: Database, color: 'border-brand-blue' },
    { id: 'api', x: 200, y: 300, label: 'gateway_alpha', icon: Globe, color: 'border-brand-cyan' },
    { id: 'auth', x: 200, y: 450, label: 'identity_wall', icon: Shield, color: 'border-red-500' },
    { id: 'worker', x: 600, y: 300, label: 'synth_worker_01', icon: Server, color: 'border-brand-cyan' },
    { id: 'aux', x: 600, y: 450, label: 'telemetry_node', icon: Activity, color: 'border-text-muted' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Topology Vault</h1>
        <p className="text-text-secondary text-sm max-w-2xl font-mono uppercase tracking-widest">
           Live blueprint of autonomic agency routing.
        </p>
      </div>

      <div className="flex-1 glass-panel rounded-lg relative overflow-hidden technical-grid p-6">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          <g>
            <Connection x1={400} y1={300} x2={400} y2={150} active />
            <Connection x1={400} y1={300} x2={200} y2={300} active />
            <Connection x1={400} y1={300} x2={600} y2={300} active />
            <Connection x1={200} y1={300} x2={200} y2={450} />
            <Connection x1={600} y1={300} x2={600} y2={450} active />
            <Connection x1={400} y1={300} x2={600} y2={450} />
          </g>
          
          {nodes.map(node => (
            <Node 
              key={node.id} 
              x={node.x} 
              y={node.y} 
              label={node.label} 
              icon={node.icon} 
              color={node.color} 
            />
          ))}
        </svg>

        <div className="absolute top-6 right-6 flex flex-col gap-2">
            <div className="glass-panel p-4 flex flex-col gap-3 min-w-[180px] rounded-lg shadow-xl">
                <div className="text-[10px] font-bold text-text-muted border-b border-border-bright pb-2 mb-1 uppercase tracking-widest">NODE_DETAILS</div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-text-secondary">ACTIVE_AGENTS</span>
                    <span className="text-[10px] font-mono text-brand-green">14,204</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-text-secondary">THROUGHPUT</span>
                    <span className="text-[10px] font-mono text-brand-cyan">12.4 GB/s</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-text-secondary">ERROR_RATE</span>
                    <span className="text-[10px] font-mono text-brand-cyan">0.001%</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Internal Activity component for the nodes
const Activity = (props: any) => (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);
