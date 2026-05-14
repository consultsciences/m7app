import * as React from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, Database, Server } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, trend }: { label: string; value: string; icon: any; trend: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-panel p-5 flex flex-col justify-between min-h-[120px] transition-colors hover:border-brand-blue/30 group"
  >
    <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">{label}</div>
    <div className="flex items-baseline justify-between">
      <div className="text-4xl font-light text-white tracking-tight">{value}</div>
      <span className={`text-[11px] font-mono ${trend.includes('+') ? 'text-brand-green' : trend.includes('-') ? 'text-red-500' : 'text-text-secondary'}`}>
        {trend}
      </span>
    </div>
  </motion.div>
);

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Synthesis Lab</h1>
        <p className="text-text-secondary text-sm max-w-2xl">
          Real-time autonomic orchestration state and synaptic synthesis metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Active Synthesis Cycles" value="1,248" icon={Zap} trend="+12%" />
        <StatCard label="Neural Latency" value="0.42ms" icon={Activity} trend="-4%" />
        <StatCard label="Architectural Fidelity" value="99.8%" icon={Database} trend="STABLE" />
        <StatCard label="Agent Nodes" value="14,204" icon={Server} trend="SYNCED" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 glass-panel rounded-lg flex flex-col shadow-2xl min-h-[400px]">
          <div className="h-10 border-b border-border-dim flex items-center px-4 justify-between bg-surface-elevated/50 rounded-t-lg">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
              <div className="w-2 h-2 rounded-full bg-brand-green/80"></div>
            </div>
            <span className="text-[10px] font-mono text-text-muted">synthesis_engine_v2_core.rtx</span>
            <div className="flex gap-3">
              <div className="w-3 h-3 border border-border-bright"></div>
              <div className="w-3 h-3 border border-border-bright"></div>
            </div>
          </div>
          
          <div className="flex-1 p-6 font-mono text-[12px] leading-relaxed overflow-hidden relative bg-[#0F0F12]">
             <div className="animate-pulse text-brand-cyan">_ EXEC_SYNTH_PIPELINE [ID: 884-A] ... DONE</div>
             <div className="text-text-primary mt-1">_ MEM_ALLOC: 4.2GB -{'>'} REGISTER_COMMIT</div>
             <div className="text-text-muted mt-1">_ HEALING_AGENT: SCANNING VOL-04 ... OK</div>
             <div className="text-text-primary mt-1">_ PARALLEL_PROCESSING: NODE_CLUSTER_09 :: ACTIVE</div>
             <div className="text-brand-blue mt-1">_ AI_KERNEL: OPTIMIZING LATENCY FOR USER_013</div>
             <div className="text-brand-cyan mt-1">_ SYSTEM: STANDBY FOR NEXT SEQUENCE</div>
             
             <div className="mt-8 border-t border-border-dim pt-4">
                <div className="p-4 bg-surface-active/50 border-l-2 border-brand-blue text-[11px] italic text-text-secondary">
                  // Outputting production-ready React component with Tailwind implementation...
                </div>
             </div>

             <div className="absolute bottom-6 left-6 right-6 flex gap-1 items-end h-16">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-brand-blue/20 border-t border-brand-blue/40"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
                ))}
             </div>
          </div>
          <div className="p-3 border-t border-border-dim flex justify-between items-center bg-surface-elevated/50 rounded-b-lg">
             <span className="text-[10px] text-text-muted px-2 uppercase font-mono tracking-widest">Lines: 1,402 | Chars: 42k</span>
             <button className="px-4 py-1 bg-brand-blue text-white text-[10px] font-bold tracking-widest uppercase rounded hover:bg-brand-blue/80 transition-colors">Deploy to Prod</button>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel rounded-lg p-6 flex flex-col flex-1">
            <div className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em] mb-6">Engine Telemetry</div>
            <div className="space-y-6">
               {[
              { label: 'Heuristic Logic', val: 88, status: 'ACTIVE', color: 'bg-brand-blue' },
              { label: 'Design Pattern Extraction', val: 94, status: '94.2%', color: 'bg-brand-blue' },
              { label: 'Modernism Alignment', val: 100, status: 'OPTIMAL', color: 'bg-brand-cyan' },
              { label: 'Synth Efficiency', val: 12, status: 'BUFFERED', color: 'bg-text-muted' },
            ].map(item => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-text-primary">{item.label}</span>
                  <span className="text-brand-green font-mono">{item.status}</span>
                </div>
                <div className="h-1 bg-border-dim flex overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.val}%` }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
            </div>

            <div className="mt-auto pt-8">
              <div className="h-24 w-full flex items-end gap-1 px-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 ${i === 3 ? 'bg-brand-blue' : 'bg-surface-active border-t border-border-bright'}`}
                    style={{ height: `${[40, 55, 48, 72, 60, 82, 65, 40, 55, 60, 70, 50][i]}%` }}
                  />
                ))}
              </div>
              <div className="text-[9px] text-text-muted font-mono text-center mt-3 tracking-widest uppercase">24H Synthesis Latency Graph</div>
            </div>
          </div>

          <button className="h-24 bg-brand-blue p-5 flex items-center justify-between overflow-hidden relative group cursor-pointer border border-brand-blue/50 rounded-lg">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
            <div className="text-left">
              <div className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Emergency Logic Reset</div>
              <div className="text-white font-medium mt-1">Purge All Process Buffers</div>
            </div>
            <div className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
