import { ExternalLink, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { ReferrerStat } from "../../types";

interface ReferrerStatsProps {
  referrers: ReferrerStat[];
  totalClicks: number;
}

const COLORS = ["#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1", "#ef4444"];

const ReferrerStats = ({ referrers, totalClicks }: ReferrerStatsProps) => {
  // Prepare data for pie chart
  const chartData = referrers.slice(0, 5).map((ref) => ({
    name: ref.referrer,
    value: ref.count,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalClicks) * 100).toFixed(1);
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-primary-600 font-semibold">
            {payload[0].value} clicks ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <ExternalLink className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Referrers</h3>
          <p className="text-sm text-gray-600">Where your traffic comes from</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Referrer List */}
        <div className="space-y-3">
          {referrers.slice(0, 7).map((referrer, index) => {
            const percentage = ((referrer.count / totalClicks) * 100).toFixed(1);
            return (
              <div key={referrer.referrer} className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">{referrer.referrer}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {referrer.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}

          {referrers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No referrer data yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferrerStats;
