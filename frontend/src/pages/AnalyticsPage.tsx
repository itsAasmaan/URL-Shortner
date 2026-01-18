import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const AnalyticsPage = () => {
  const { shortCode } = useParams();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Analytics for: {shortCode}
        </h1>
        <div className="card">
          <p className="text-gray-600">Analytics coming soon in next commits...</p>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;