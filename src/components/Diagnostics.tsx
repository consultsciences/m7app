import * as React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Terminal, Search } from 'lucide-react';

const LogEntry = ({ type, message, time }: { type: 'error' | 'warn' | 'info' | 'success'; message: string; time: string }) => {
  const colors = {
    error: 'text-red-500 border-red-500/20 bg-red-500/5',
    warn: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5',
    info: 'text-brand-blue border-brand-blue/20 bg-brand-blue/5',
    success: 'text-brand-green border-brand-green/20 bg-brand-green/5'
  };

  const Icon = {
    error: XCircle,
    warn: AlertTriangle,
    info: Terminal,
    success: CheckCircle2
  };

  const CurrentIcon = Icon[type];

  return (
    <div className={`flex gap-4 p-3 border rounded-lg ${colors[type]} mb-2`}>
       <CurrentIcon className="w-4 h-4 mt-0.5 shrink-0" />
       <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
             <span className="text-[10px] font-bold uppercase tracking-widest">{type}</span>
             <span className="text-[9px] font-mono opacity-60">{time}</span>
          </div>
          <p className="text-[11px] font-mono leading-relaxed">{message}</p>
       </div>
    </div>
  );
};

export const Diagnostics = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">Diagnostics Center</h1>
        <p className="text-text-secondary text-sm max-w-2xl font-mono uppercase tracking-widest leading-relaxed">
          Real-time error interception and autonomic healing sequence logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-3 space-y-6">
            <div className="glass-panel p-6">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <ShieldAlert className="w-5 h-5 text-brand-blue" />
                     <h3 className="text-sm font-bold text-white uppercase tracking-widest">Active Sequencer Logs</h3>
                  </div>
                  <div className="relative">
                     <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                     <input type="text" placeholder="Filter logs..." className="bg-surface-active/50 border border-border-dim rounded py-1 pl-8 pr-4 text-[10px] focus:outline-none focus:border-brand-blue/40" />
                  </div>
               </div>
               
               <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                  <LogEntry type="success" time="21:10:42" message="AUTONOMIC_SEQUENCER: Matrix materialization completed for PROJECT_B87." />
                  <LogEntry type="info" time="21:09:12" message="SYNAPSE_GATEWAY: Re-routing traffic from over-saturated Cluster D to Node 12." />
                  <LogEntry type="warn" time="21:05:44" message="LATENCY_OVERSPILL: 0.42ms limit exceeded in Sector 7. Initializing buffer bypass." />
                  <LogEntry type="error" time="20:58:21" message="KERNEL_PANIC: Invalid memory reference at 0x44A2 during synthesis of UI_KIT_09." />
                  <LogEntry type="info" time="20:45:00" message="HEALER_BOT: Optimizing CSS bundles for autonomic deployment. Target: Vercel_Edge." />
                  <LogEntry type="success" time="20:30:12" message="AUTH_VALIDATOR: System-wide credentials sync finalized. 1.4k nodes verified." />
                  <LogEntry type="info" time="20:15:44" message="DASHBOARD_ENGINE: Refreshing telemetry matrix for current user session." />
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="glass-panel p-6 flex flex-col items-center text-center gap-4">
               <div className="w-16 h-16 rounded-full bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green mb-2">
                  <CheckCircle2 className="w-8 h-8" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Health Index: 98%</h3>
                  <p className="text-[11px] text-text-secondary leading-relaxed">Autonomic engine is operating within nominal parameters.</p>
               </div>
               <button className="w-full py-2 bg-brand-blue text-white text-[10px] font-bold uppercase tracking-widest rounded mt-2">
                  Force Reset Matrix
               </button>
            </div>

            <div className="glass-panel p-6">
               <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">Uptime Matrix</h4>
               <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`aspect-square rounded-[2px] ${i === 14 ? 'bg-red-500/60' : i === 21 ? 'bg-yellow-500/60' : 'bg-brand-green/60'}`}
                      title={`${99 + (Math.random() > 0.8 ? -2 : 0)}% Uptime`}
                    />
                  ))}
               </div>
               <div className="flex justify-between mt-3 text-[9px] font-mono text-text-muted uppercase tracking-tighter">
                  <span>28D AGO</span>
                  <span>TODAY</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
