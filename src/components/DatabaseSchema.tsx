import * as React from 'react';
import { motion } from 'motion/react';
import { Database, Key, Table, Shield, Lock } from 'lucide-react';

const TableRow = ({ name, type, primary, sensitive }: { name: string; type: string; primary?: boolean; sensitive?: boolean }) => (
  <div className="flex items-center justify-between p-3 border-b border-border-dim hover:bg-surface-active/30 transition-colors">
    <div className="flex items-center gap-3">
      {primary ? <Key className="w-3.5 h-3.5 text-brand-cyan" /> : <Shield className="w-3.5 h-3.5 text-text-muted opacity-40" />}
      <span className={`text-[11px] font-mono ${primary ? 'text-white' : 'text-text-primary'}`}>{name}</span>
    </div>
    <div className="flex items-center gap-4">
      {sensitive && (
        <span className="flex items-center gap-1 text-[9px] font-bold text-red-400 uppercase tracking-tighter bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/20">
          <Lock className="w-2.5 h-2.5" /> PII_LOCKED
        </span>
      )}
      <span className="text-[10px] font-mono text-text-muted uppercase">{type}</span>
    </div>
  </div>
);

export const DatabaseSchema = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">Matrix Schema</h1>
        <p className="text-text-secondary text-sm max-w-2xl font-mono uppercase tracking-widest leading-relaxed">
          Structural integrity of persistent data sharding and relational mapping.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-0 overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-4 bg-surface-elevated/80 border-b border-border-dim flex items-center justify-between">
             <div className="flex items-center gap-3">
                <Table className="w-4 h-4 text-brand-blue" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Users_Manifest</span>
             </div>
             <span className="text-[10px] font-mono text-text-muted">1.4M SHARDS</span>
          </div>
          <div className="flex-1 overflow-y-auto">
             <TableRow name="id" type="uuid_v4" primary />
             <TableRow name="email" type="string" sensitive />
             <TableRow name="hashed_auth" type="bin_data" sensitive />
             <TableRow name="created_at" type="timestamp" />
             <TableRow name="last_synapse" type="timestamp" />
             <TableRow name="meta_matrix" type="json_blob" />
          </div>
        </div>

        <div className="glass-panel p-0 overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-4 bg-surface-elevated/80 border-b border-border-dim flex items-center justify-between">
             <div className="flex items-center gap-3">
                <Table className="w-4 h-4 text-brand-blue" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Synthesis_Vault</span>
             </div>
             <span className="text-[10px] font-mono text-text-muted">8.2M SHARDS</span>
          </div>
          <div className="flex-1 overflow-y-auto">
             <TableRow name="id" type="uuid_v4" primary />
             <TableRow name="owner_uid" type="uuid_fk" />
             <TableRow name="vector_buffer" type="float_arr[1536]" />
             <TableRow name="prompt_hash" type="sha256" />
             <TableRow name="status_bit" type="int8" />
             <TableRow name="topology_ref" type="ref_link" />
          </div>
        </div>
      </div>
    </div>
  );
};
