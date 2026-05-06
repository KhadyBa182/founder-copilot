import { useState, useMemo } from 'react';
import { BusinessData, HealthScoreResult } from '../types/health';
import { computeHealthScore } from '../lib/scoring';

/**
 * Hook personnalisé pour gérer l'état des entrées et le calcul du score de santé.
 * 
 * @returns State et fonctions pour interagir avec le module de santé business.
 */
export function useHealthScore() {
  const [data, setData] = useState<BusinessData>({
    monthlyRevenue: 0,
    monthlyCosts: 0,
    growthRate: 0,
    currency: 'XOF',
  });

  // Calcul mémorisé pour éviter des calculs inutiles au re-render
  const result = useMemo(() => {
    return computeHealthScore(
      data.monthlyRevenue,
      data.monthlyCosts,
      data.growthRate
    );
  }, [data.monthlyRevenue, data.monthlyCosts, data.growthRate]);

  /**
   * Met à jour une valeur spécifique de la donnée business
   */
  const updateField = (field: keyof BusinessData, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    setData((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const setCurrency = (currency: 'XOF' | 'USD') => {
    setData((prev) => ({ ...prev, currency }));
  };

  return {
    data,
    result,
    updateField,
    setCurrency,
  };
}
