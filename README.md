# Founder Copilot - Business Health Score Module

Ce module est un outil d'aide à la décision pour les entrepreneurs, permettant d'évaluer la santé financière d'une startup sur une échelle de 100 points.

## Installation & Lancement

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

3. **Accéder à l'application** : Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

##  Logique de Scoring

Le score est calculé sur un total de **100 points**, répartis sur trois indicateurs clés :

1. **Marge Brute (40 pts max)** : Mesure la rentabilité opérationnelle.
   - ≥ 50% : 40 pts
   - ≥ 30% : 32 pts
   - ≥ 15% : 24 pts
   - ≥ 0%  : 14 pts
   - < 0%  : 0 pt

2. **Ratio Coût (30 pts max)** : Mesure l'efficacité de la gestion des dépenses.
   - ≤ 50% : 30 pts
   - ≤ 70% : 22 pts
   - ≤ 85% : 14 pts
   - ≤ 100%: 6 pts
   - > 100%: 0 pt

3. **Momentum Croissance (30 pts max)** : Mesure la dynamique de traction.
   - ≥ 20% : 30 pts
   - ≥ 10% : 24 pts
   - ≥ 5%  : 18 pts
   - ≥ 0%  : 10 pts
   - ≥ -10%: 4 pts
   - < -10%: 0 pt

### Niveaux de Santé
- **80–100** : Excellent (Vert)
- **60–79**  : Sain (Teal)
- **40–59**  : Fragile (Orange)
- **0–39**   : Critique (Rouge)

##  Choix Techniques

- **Next.js 14+ & Tailwind CSS** : Pour une interface rapide, responsive et moderne sans surcharge de librairies UI.
- **TypeScript** : Typage strict des données business et des résultats de scoring pour éviter les erreurs de calcul.
- **Isolation Logique/UI** : La logique métier se trouve dans `lib/scoring.ts`, totalement indépendante de React, ce qui la rend 100% testable.
- **Custom Hook (`useHealthScore`)** : Centralise la gestion d'état et le calcul réactif pour une UI fluide.
- **Animations SVG Natives** : Utilisation de transitions CSS sur les propriétés SVG pour une jauge animée ultra-légère.

##  Tests

Les tests unitaires sont situés dans `lib/scoring.test.ts`. Pour les exécuter, installez Jest et lancez `npm test`.
Elles couvrent les cas de :
- Business rentable vs déficitaire
- Croissance négative
- Protection contre les divisions par zéro
- Cas limites de revenus à zéro
