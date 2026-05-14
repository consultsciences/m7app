import * as React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';

const data = Array.from({ length: 40 }).map((_, i) => ({
  time: `${i}:00`,
  load: Math.floor(Math.random() * 40) + 30,
  neural: Math.floor(Math.random() * 50) + 20,
}));

const barData = [
  { name: 'Cluster A', load: 85 },
  { name: 'Cluster B', load: 42 },
  { name: 'Cluster C', load: 68 },
  { name: 'Cluster D', load: 91 },
  { name: 'Cluster E', load: 55 },
];

export const NeuralBurn = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Neural Burn Monitor</h1>
        <p className="text-text-secondary text-sm max-w-2xl font-mono uppercase tracking-widest">
          High-frequency heat maps and synaptic load distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-panel p-8 min-h-[400px]">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">Temporal Synaptic Load</h2>
            <div className="flex gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-cyan rounded-full" />
                <span className="text-text-secondary">PRIMARY_SYNAPSE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-blue rounded-full" />
                <span className="text-text-secondary">NEURAL_OVERSPILL</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E0FF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00E0FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNeural" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#ffffff20" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F0F12', border: '1px solid #2D2D30', borderRadius: '4px' }}
                  itemStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="load" 
                  stroke="#00E0FF" 
                  fillOpacity={1} 
                  fill="url(#colorLoad)" 
                  strokeWidth={1.5}
                />
                <Area 
                  type="monotone" 
                  dataKey="neural" 
                  stroke="#0066FF" 
                  fillOpacity={1} 
                  fill="url(#colorNeural)" 
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-8">
           <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary mb-8">Cluster Thermal Status</h2>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#ffffff40" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false}
                    width={80}
                />
                <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#0F0F12', border: '1px solid #2D2D30', borderRadius: '4px' }}
                />
                <Bar dataKey="load" barSize={12} radius={[0, 2, 2, 0]}>
                  {barData.map((entry, index) => (
                    <Cell 
                        key={index} 
                        fill={entry.load > 85 ? '#ef4444' : entry.load > 60 ? '#0066FF' : '#00E0FF'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
           <div className="mt-6 space-y-2">
               <div className="flex items-center gap-3 p-2.5 bg-surface-active/50 rounded border border-border-dim">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                   <span className="text-[10px] font-mono uppercase tracking-tighter text-text-secondary">Cluster D saturation critical</span>
               </div>
               <div className="flex items-center gap-3 p-2.5 bg-surface-active/50 rounded border border-border-dim">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                   <span className="text-[10px] font-mono uppercase tracking-tighter text-text-secondary">Redistribution active</span>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};
