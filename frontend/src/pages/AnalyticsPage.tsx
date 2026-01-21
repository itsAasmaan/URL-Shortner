import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import StatsOverview from "../components/analytics/StatsOverview";
import ClicksChart from "../components/analytics/ClicksChart";
import ReferrerStats from "../components/analytics/ReferrerStats";
import CountryStats from "../components/analytics/CountryStats";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { useURLStats } from "../hooks/useAnalytics";
import { useQuery } from "@tanstack/react-query";
import urlService from "../services/urlService";
import { ArrowLeft, Download } from "lucide-react";
import toast from "react-hot-toast";

const AnalyticsPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [days, setDays] = useState(30);

  // Fetch URL details
  const {
    data: urlData,
    isLoading: urlLoading,
    error: urlError,
  } = useQuery({
    queryKey: ["url", shortCode],
    queryFn: () => urlService.getURL(shortCode!),
    enabled: !!shortCode,
  });

  // Fetch analytics stats
  const { data: stats, isLoading: statsLoading, error: statsError, refetch } = useURLStats(shortCode!, days);

  const isLoading = urlLoading || statsLoading;
  const error = urlError || statsError;

  // Export data as CSV
  const handleExport = () => {
    if (!stats) return;

    const csvData = [["Date", "Clicks"], ...stats.clicksByDay.map((day) => [day.date, day.count])];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${shortCode}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Analytics exported successfully!");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" text="Loading analytics..." />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !urlData || !stats) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorMessage message={(error as any)?.message || "Failed to load analytics"} onRetry={() => refetch()} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Detailed insights for your shortened URL</p>
            </div>
          </div>

          <button onClick={handleExport} className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Stats Overview */}
        <StatsOverview
          stats={stats}
          url={{
            shortUrl: urlData.shortUrl,
            originalUrl: urlData.originalUrl,
          }}
        />

        {/* Clicks Chart */}
        <ClicksChart data={stats.clicksByDay} onDaysChange={setDays} currentDays={days} />

        {/* Referrers and Countries */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <ReferrerStats referrers={stats.topReferrers} totalClicks={stats.totalClicks} />
          <CountryStats countries={stats.topCountries} totalClicks={stats.totalClicks} />
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
