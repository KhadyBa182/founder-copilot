import BusinessHealthScore from '../components/HealthScore';

export const metadata = {
  title: 'Business Health Score | Founder Copilot',
  description: 'Évaluez la santé financière de votre startup avec l\'IA de Founder Copilot.',
};

export default function Home() {
  return (
    <main>
      <BusinessHealthScore />
    </main>
  );
}
