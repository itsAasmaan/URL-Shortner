import { MousePointerClick, TrendingUp, Globe, ExternalLink } from "lucide-react";
import type { ClickStats } from "../../types";

interface StatsOverviewProps {
  stats: ClickStats;
  url: {
    shortUrl: string;
    originalUrl: string;
  };
}

const StatsOverview = ({ stats, url }: StatsOverviewProps) => {
  // Calculate growth (comparing last 7 days vs previous 7 days)
  const last7Days = stats.clicksByDay.slice(0, 7).reduce((acc, day) => acc + day.count, 0);
  const previous7Days = stats.clicksByDay.slice(7, 14).reduce((acc, day) => acc + day.count, 0);
  const growthRate = previous7Days > 0 ? ((last7Days - previous7Days) / previous7Days) * 100 : 0;

  const topReferrer = stats.topReferrers[0]?.referrer || "Direct";
  const topCountry = stats.topCountries[0]?.country || "Unknown";

  return (
    <div>
      <div className="card mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{url.shortUrl}</h2>
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-2 group"
            >
              <span className="truncate">{url.originalUrl}</span>
              <ExternalLink className="w-4 h-4 shrink-0 group-hover:text-primary-600" />
            </a>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Clicks</h3>
            <div className="bg-primary-100 p-2 rounded-lg">
              <MousePointerClick className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
        </div>

        {/* Growth Rate */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">7-Day Growth</h3>
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className={`text-3xl font-bold ${growthRate >= 0 ? "text-green-600" : "text-red-600"}`}>
            {growthRate >= 0 ? "+" : ""}
            {growthRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">vs previous week</p>
        </div>

        {/* Top Referrer */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Top Referrer</h3>
            <div className="bg-purple-100 p-2 rounded-lg">
              <ExternalLink className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900 truncate">{topReferrer}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.topReferrers[0]?.count || 0} clicks</p>
        </div>

        {/* Top Country */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Top Location</h3>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Globe className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900">{topCountry}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.topCountries[0]?.count || 0} clicks</p>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
