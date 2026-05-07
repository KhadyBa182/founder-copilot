import { HealthScoreResult, HealthStatus } from '../types/health';

/**
 * Constantes définissant les seuils de scoring (Magic numbers évités)
 */
const MARGIN_THRESHOLDS = [
  { limit: 50, score: 40 },
  { limit: 30, score: 32 },
  { limit: 15, score: 24 },
  { limit: 0, score: 14 },
];

const COST_RATIO_THRESHOLDS = [
  { limit: 50, score: 30 },
  { limit: 70, score: 22 },
  { limit: 85, score: 14 },
  { limit: 100, score: 6 },
];

const GROWTH_THRESHOLDS = [
  { limit: 20, score: 30 },
  { limit: 10, score: 24 },
  { limit: 5, score: 18 },
  { limit: 0, score: 10 },
  { limit: -10, score: 4 },
];

/**
 * Calcule le score global et les métriques de santé business.
 * 
 * @param revenue - Revenu mensuel
 * @param costs - Coûts mensuels
 * @param growth - Taux de croissance mensuel en %
 * @returns HealthScoreResult contenant le score, le statut, les métriques et insights
 */
export function computeHealthScore(
  revenue: number,
  costs: number,
  growth: number
): HealthScoreResult {
  // 0. Si aucun revenu n'est saisi, le score est 0
  if (revenue <= 0) {
    return {
      totalScore: 0,
      status: 'Critique',
      color: '#f87171',
      metrics: {
        grossMargin: { value: 0, score: 0, label: 'Marge Brute', unit: '%' },
        costRatio: { value: 0, score: 0, label: 'Ratio Coût', unit: '%' },
        growthMomentum: { value: 0, score: 0, label: 'Momentum Croissance', unit: '%' },
      },
      insights: ["Veuillez entrer vos données financières pour obtenir une analyse."],
    };
  }

  // Protection contre division par zéro
  const safeRevenue = revenue <= 0 ? 0.000001 : revenue;
  
  // 1. Calcul Marge Brute
  const grossMarginValue = ((revenue - costs) / safeRevenue) * 100;
  let marginScore = 0;
  for (const t of MARGIN_THRESHOLDS) {
    if (grossMarginValue >= t.limit) {
      marginScore = t.score;
      break;
    }
  }

  // 2. Calcul Ratio Coût
  const costRatioValue = (costs / safeRevenue) * 100;
  let costScore = 0;
  for (const t of COST_RATIO_THRESHOLDS) {
    if (costRatioValue <= t.limit) {
      costScore = t.score;
      break;
    }
  }

  // 3. Calcul Momentum Croissance
  let growthScore = 0;
  for (const t of GROWTH_THRESHOLDS) {
    if (growth >= t.limit) {
      growthScore = t.score;
      break;
    }
  }

  // Score total arrondi
  const totalScore = Math.round(marginScore + costScore + growthScore);

  // Détermination du statut et de la couleur
  let status: HealthStatus = 'Critique';
  let color = '#E24B4A'; // Rouge

  if (totalScore >= 80) {
    status = 'Excellent';
    color = '#639922'; // Vert
  } else if (totalScore >= 60) {
    status = 'Sain';
    color = '#229986'; // Teal (ajusté pour contraste)
  } else if (totalScore >= 40) {
    status = 'Fragile';
    color = '#EF9F27'; // Orange
  }

  // Génération d'insights contextuels
  const insights: string[] = [];
  
  if (grossMarginValue < 15) {
    insights.push("Vos marges sont trop faibles. Envisagez d'augmenter vos prix ou de réduire vos coûts variables.");
  } else if (grossMarginValue > 50) {
    insights.push("Excellente rentabilité opérationnelle. Vous avez une marge de manœuvre pour investir davantage.");
  }

  if (costRatioValue > 85) {
    insights.push("Le ratio de coût est élevé. Optimisez vos processus internes pour regagner en efficacité.");
  }

  if (growth > 15) {
    insights.push("Forte croissance ! Surveillez votre cash-flow pour soutenir cette accélération sans rupture.");
  } else if (growth < 0) {
    insights.push("Momentum négatif. Analysez le churn ou la baisse d'acquisition client de toute urgence.");
  }

  // S'assurer d'avoir entre 2 et 4 insights
  if (insights.length < 2) {
    insights.push("Continuez à suivre ces indicateurs mensuellement pour anticiper les tendances.");
  }

  return {
    totalScore,
    status,
    color,
    metrics: {
      grossMargin: {
        value: Math.round(grossMarginValue),
        score: marginScore,
        label: 'Marge Brute',
        unit: '%',
      },
      costRatio: {
        value: Math.round(costRatioValue),
        score: costScore,
        label: 'Ratio Coût',
        unit: '%',
      },
      growthMomentum: {
        value: Math.round(growth),
        score: growthScore,
        label: 'Momentum Croissance',
        unit: '%',
      },
    },
    insights: insights.slice(0, 4),
  };
}
