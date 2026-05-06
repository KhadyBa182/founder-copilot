export type Currency = 'XOF' | 'USD';

export interface BusinessData {
  monthlyRevenue: number;
  monthlyCosts: number;
  growthRate: number;
  currency: Currency;
}

export type HealthStatus = 'Excellent' | 'Sain' | 'Fragile' | 'Critique';

export interface MetricResult {
  value: number;
  score: number;
  label: string;
  unit: string;
}

export interface HealthScoreResult {
  totalScore: number;
  status: HealthStatus;
  color: string;
  metrics: {
    grossMargin: MetricResult;
    costRatio: MetricResult;
    growthMomentum: MetricResult;
  };
  insights: string[];
}
