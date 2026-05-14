import * as React from 'react';
import { motion } from 'motion/react';
import { Cpu, Rocket, Code2, Globe, ShieldCheck, Zap, ArrowRight, Layers, Layout, Database, Terminal } from 'lucide-react';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="min-h-screen bg-surface-base text-text-primary selection:bg-brand-blue/30 overflow-x-hidden">
      <div className="absolute inset-0 technical-grid opacity-20 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="h-20 flex items-center justify-between px-8 md:px-20 border-b border-border-dim bg-surface-base/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-blue rounded-sm flex items-center justify-center font-bold text-sm text-white">
            M7A
          </div>
          <span className="font-bold text-lg tracking-tight text-white uppercase">The Forge</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">Orchestration</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <button 
          onClick={onStart}
          className="px-6 py-2.5 bg-brand-blue text-white text-sm font-bold tracking-widest uppercase rounded-lg hover:bg-brand-blue/80 transition-all shadow-[0_0_20px_rgba(0,102,255,0.4)]"
        >
          Launch Builder
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 md:px-20 max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-active border border-border-bright text-[10px] font-mono text-brand-cyan uppercase tracking-[0.2em]"
        >
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          Autonomous App Engineer v2.4 Now Live
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-white max-w-4xl leading-[0.9]"
        >
          Build Production Apps <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">With A Single Prompt</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-text-secondary max-w-2xl leading-relaxed"
        >
          The Forge is an autonomic orchestration layer that plans, architectures, and builds complete SaaS platforms, CRMs, and internal tools from natural language. No drag-and-drop. No boilerplate. Just production code.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4 mt-4 w-full max-w-lg"
        >
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Build me a real estate CRM with lead pipeline..." 
              className="w-full bg-surface-panel border border-border-bright rounded-xl py-4 px-6 text-sm focus:outline-none focus:border-brand-blue transition-all font-mono shadow-2xl"
            />
            <Terminal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          </div>
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-brand-blue text-white font-bold tracking-widest uppercase rounded-xl hover:bg-brand-blue/80 transition-all flex items-center justify-center gap-2"
          >
            Generate <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Hero Visual Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 w-full glass-panel rounded-2xl overflow-hidden shadow-2xl border-border-bright/50"
        >
          <div className="h-10 border-b border-border-dim bg-surface-elevated flex items-center px-4 gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            <div className="ml-4 flex-1 h-5 bg-surface-base/50 rounded flex items-center px-3">
              <span className="text-[10px] font-mono text-text-muted">app.theforge.ai/synthesis_lab</span>
            </div>
          </div>
          <div className="p-2 aspect-[16/9] bg-surface-base flex">
             <div className="w-48 border-r border-border-dim p-4 flex flex-col gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-6 bg-surface-active/50 rounded-sm w-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
             <div className="flex-1 p-8 grid grid-cols-3 gap-6">
                <div className="col-span-3 h-8 bg-surface-active/50 rounded animate-pulse" />
                <div className="h-32 bg-surface-active/50 rounded animate-pulse" />
                <div className="h-32 bg-surface-active/50 rounded animate-pulse" />
                <div className="h-32 bg-surface-active/50 rounded animate-pulse" />
                <div className="col-span-2 h-64 bg-surface-active/50 rounded animate-pulse" />
                <div className="h-64 bg-surface-active/50 rounded animate-pulse" />
             </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Bar */}
      <section id="pricing" className="py-12 border-y border-border-dim bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale contrast-125">
          <div className="flex items-center gap-2 font-display font-bold text-xl">VITE</div>
          <div className="flex items-center gap-2 font-display font-bold text-xl">TAILWIND</div>
          <div className="flex items-center gap-2 font-display font-bold text-xl">POSTGRES</div>
          <div className="flex items-center gap-2 font-display font-bold text-xl">STRIPE</div>
          <div className="flex items-center gap-2 font-display font-bold text-xl">PRISMA</div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-8 md:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-20">
          <h2 className="text-sm font-mono text-brand-cyan tracking-[.3em] font-bold uppercase">The Capability Matrix</h2>
          <h3 className="text-4xl font-bold tracking-tight text-white leading-none">Complete Autonomy Over Implementation.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              icon: Layers, 
              title: "Full-Stack Generation", 
              desc: "From UI components to server controllers and database migrations. The Forge builds the entire stack." 
            },
            { 
              icon: Database, 
              title: "Adaptive Schema", 
              desc: "Describe your data requirements and let the system architect a performance-optimized relational model." 
            },
            { 
              icon: ShieldCheck, 
              title: "Auth & Permissions", 
              desc: "Multi-tenant logic, role-based access control, and secure session management baked into every app." 
            },
            { 
              icon: Code2, 
              title: "Exportable Production Code", 
              desc: "Actually own what you build. Export readable, maintainable TypeScript and Next.js projects." 
            },
            { 
              icon: Zap, 
              title: "Real-time Refinement", 
              desc: "Not happy with a layout? Just tell the engineer. Every change is handled in context of the whole app." 
            },
            { 
              icon: Rocket, 
              title: "Instant Deployment", 
              desc: "One click to push to production. We handle the orchestration, environmental vars, and scale." 
            }
          ].map((feat, idx) => (
            <div key={idx} className="glass-panel p-8 flex flex-col gap-5 hover:border-brand-blue/30 transition-all group">
              <div className="w-12 h-12 bg-surface-active rounded-xl flex items-center justify-center text-brand-cyan border border-border-bright group-hover:scale-110 transition-transform">
                <feat.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white">{feat.title}</h4>
              <p className="text-text-secondary leading-relaxed text-sm">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="how-it-works" className="py-32 px-8 md:px-20 max-w-7xl mx-auto">
        <div className="glass-panel p-16 rounded-[2rem] flex flex-col items-center text-center gap-8 relative overflow-hidden">
          <div className="absolute inset-0 technical-grid opacity-10 pointer-events-none" />
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white max-w-3xl leading-none z-10">
            Stop Building Tools. <br/>
            <span className="text-brand-blue">Start Shipping Products.</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-xl z-10">
            Join 12,000+ engineers and founders scaling their operations with autonomic app generation.
          </p>
          <button 
            onClick={onStart}
            className="px-10 py-5 bg-white text-black font-bold tracking-widest uppercase rounded-2xl hover:scale-105 active:scale-95 transition-all z-10 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Initialize Project Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 md:px-20 border-t border-border-dim bg-surface-elevated/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-brand-blue rounded-sm flex items-center justify-center font-bold text-[10px] text-white">
                M7A
              </div>
              <span className="font-bold text-sm tracking-tight text-white uppercase">The Forge</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Autonomous app engineering platform. <br/>
              Built for the next generation of SaaS.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">Platform</h5>
            <div className="flex flex-col gap-3 text-xs text-text-secondary">
              <a href="#" className="hover:text-white">Builder Engine</a>
              <a href="#" className="hover:text-white">Components</a>
              <a href="#" className="hover:text-white">API Docs</a>
              <a href="#" className="hover:text-white">Deployment</a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">Company</h5>
            <div className="flex flex-col gap-3 text-xs text-text-secondary">
              <a href="#" className="hover:text-white">Privacy Trace</a>
              <a href="#" className="hover:text-white">Terms of Logic</a>
              <a href="#" className="hover:text-white">Security Audit</a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">Updates</h5>
            <p className="text-xs text-text-muted">Subscribe to the synthesis stream.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Synapse established. You are now subscribed.'); }} className="flex border-b border-border-dim pb-2">
              <input type="email" required placeholder="Email Address" className="bg-transparent text-xs w-full focus:outline-none" />
              <button type="submit" className="text-brand-cyan"><ArrowRight className="w-4 h-4" /></button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border-dim flex justify-between items-center text-[10px] font-mono text-text-muted">
           <span>© 2026 M7A AUTONOMIC SYSTEMS.</span>
           <span>US-EAST-1 // STABLE_READY</span>
        </div>
      </footer>
    </div>
  );
};
