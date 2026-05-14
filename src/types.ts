export type SystemStatus = 'nominal' | 'degraded' | 'critical' | 'calibrating';

export interface ServiceNode {
  id: string;
  name: string;
  status: SystemStatus;
  load: number; // 0-100
  connections: string[];
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}
