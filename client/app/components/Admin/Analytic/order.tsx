"use client";
import { useGetOrderAnalyticsQuery } from "../../../../redux/features/analytic/analyticapi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function OrderAnalytics() {
  const { data, isLoading, isError, error } = useGetOrderAnalyticsQuery();

  if (isLoading) return <div className="p-6 text-gray-600 text-center">Loading analytics...</div>;

  if (isError)
    return (
      <div className="p-6 text-red-600 text-center">
        Error: {(error as any)?.data?.message || "Failed to load analytics"}
      </div>
    );

  // ✅ Format the response safely
  const rawData = data?.order?.Last12Month;
  const chartData = Array.isArray(rawData)
    ? rawData
    : Object.entries(rawData || {}).map(([key, value]) => ({
        month: key,
        count: Number(value),
      }));

  return (
    <div className="p-4 sm:p-6 bg-background rounded-2xl shadow-md w-full max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-muted-foreground text-center">
        Order Analytics (Last 12 Months)
      </h2>

      <div className="h-[300px] sm:h-[400px] md:h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: -10,
              bottom: 10,
            }}
          >
            {/* ✅ Gradient for area fill */}
            <defs>
              <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F4400D" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#F4400D" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="12 1" />
            <XAxis
              dataKey="month"
              tickFormatter={(dateStr) => {
                const d = new Date(dateStr);
                const month = d.toLocaleDateString("en-US", { month: "short" });
                const year = d.getFullYear().toString().slice(-2);
                return `${month} '${year}`;
              }}
              tick={{ fontSize: 10, fill: "#555" }}
            />
            <YAxis tick={{ fontSize: 10, fill: "#555" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
              labelFormatter={(dateStr) =>
                new Date(dateStr).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              }
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
              }}
            />

            <Area
              type="monotone"
              dataKey="count"
              name="Orders"
              stroke="#F4400D"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorOrder)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
