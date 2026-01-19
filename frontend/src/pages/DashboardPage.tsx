import { useState } from "react";
import Layout from "../components/layout/Layout";
import URLCard from "../components/url/URLCard";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import SkeletonLoader from "../components/common/SkeletonLoader";
import Pagination from "../components/common/Pagination";
import { useURL } from "../hooks/useURLs";
import { Link2, Plus, BarChart2, Zap, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;
  const { data, isLoading, error, refetch } = useURL(currentPage, limit);
  console.log(data);
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage and track your link performance</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-primary-200"
          >
            <Plus className="w-5 h-5" />
            Create New Link
          </Link>
        </div>
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <StatCard
              label="Total Links"
              value={data.pagination.total}
              icon={<Link2 className="text-blue-600" />}
              bgColor="bg-blue-50"
            />
            <StatCard
              label="Active Now"
              value={data.data.filter((url) => url.active).length}
              icon={<Zap className="text-emerald-600" />}
              bgColor="bg-emerald-50"
            />
            <StatCard
              label="Total Clicks"
              value={data.data.reduce((acc, url) => acc + (url.totalClicks || 0), 0)}
              icon={<BarChart2 className="text-primary-600" />}
              bgColor="bg-primary-50"
            />
          </div>
        )}

        <div className="min-h-100">
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          )}

          {error && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <ErrorMessage message={(error as any).message || "Failed to load URLs"} onRetry={() => refetch()} />
            </div>
          )}

          {!isLoading && !error && data?.data.length === 0 && (
            <EmptyState
              title="No URLs found"
              description="Start shortening long links to track their performance."
              actionLabel="Shorten your first link"
              actionLink="/"
              icon={<Activity className="w-12 h-12 text-gray-300" />}
            />
          )}

          {!isLoading && !error && data && data.data.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {data.data.map((url) => (
                  <URLCard key={url.shortCode} url={url} />
                ))}
              </div>

              <div className="flex justify-center border-t border-gray-100 pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={data.pagination.totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};
const StatCard = ({ label, value, icon, bgColor }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bgColor}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

export default DashboardPage;
