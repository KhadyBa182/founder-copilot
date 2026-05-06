import { computeHealthScore } from './scoring';

describe('computeHealthScore Logic Tests', () => {
  test('Business très rentable (Excellent)', () => {
    // Revenu 1M, Coûts 300k (Marge 70%), Croissance 25%
    const result = computeHealthScore(1000000, 300000, 25);
    expect(result.totalScore).toBeGreaterThanOrEqual(80);
    expect(result.status).toBe('Excellent');
    expect(result.metrics.grossMargin.score).toBe(40);
    expect(result.metrics.growthMomentum.score).toBe(30);
  });

  test('Business déficitaire (Critique)', () => {
    // Coûts > Revenus
    const result = computeHealthScore(500000, 600000, 5);
    expect(result.totalScore).toBeLessThan(40);
    expect(result.status).toBe('Critique');
    expect(result.metrics.grossMargin.value).toBeLessThan(0);
  });

  test('Croissance négative', () => {
    const result = computeHealthScore(1000000, 700000, -15);
    expect(result.metrics.growthMomentum.score).toBe(0);
    expect(result.insights).toContain("Momentum négatif. Analysez le churn ou la baisse d'acquisition client de toute urgence.");
  });

  test('Données à zéro', () => {
    const result = computeHealthScore(0, 0, 0);
    expect(result.totalScore).toBeDefined();
    expect(typeof result.totalScore).toBe('number');
  });

  test('Cas limite : Revenu = 0, Coûts > 0', () => {
    const result = computeHealthScore(0, 100000, 0);
    expect(result.metrics.grossMargin.value).toBeLessThan(-100000); // Division par safeRevenue
    expect(result.status).toBe('Critique');
  });

  test('Business sain mais fragile (Milieu de tableau)', () => {
    // Marge 20%, Ratio 80%, Croissance 5%
    const result = computeHealthScore(100000, 80000, 5);
    // Margin: 20% -> 24pts
    // Ratio: 80% -> 14pts
    // Growth: 5% -> 18pts
    // Total: 56
    expect(result.totalScore).toBe(56);
    expect(result.status).toBe('Fragile');
  });
});
