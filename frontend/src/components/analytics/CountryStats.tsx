import { Globe, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { CountryStat } from "../../types";

interface CountryStatsProps {
  countries: CountryStat[];
  totalClicks: number;
}

// Country name mapping
const countryNames: { [key: string]: string } = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  IN: "India",
  JP: "Japan",
  CN: "China",
  BR: "Brazil",
  Unknown: "Unknown",
};

const CountryStats = ({ countries, totalClicks }: CountryStatsProps) => {
  const chartData = countries.slice(0, 10).map((country) => ({
    country: countryNames[country.country] || country.country,
    clicks: country.count,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalClicks) * 100).toFixed(1);
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900">{payload[0].payload.country}</p>
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
        <div className="bg-orange-100 p-2 rounded-lg">
          <Globe className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
          <p className="text-sm text-gray-600">Clicks by country</p>
        </div>
      </div>

      {countries.length > 0 ? (
        <>
          {/* Bar Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <YAxis type="category" dataKey="country" stroke="#9ca3af" style={{ fontSize: "12px" }} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="clicks" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Country List */}
          <div className="space-y-2">
            {countries.slice(0, 10).map((country) => {
              const percentage = ((country.count / totalClicks) * 100).toFixed(1);
              const countryName = countryNames[country.country] || country.country;

              return (
                <div
                  key={country.country}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-900">{countryName}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-20 text-right">
                      {country.count} ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Globe className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No geographic data yet</p>
        </div>
      )}
    </div>
  );
};

export default CountryStats;
