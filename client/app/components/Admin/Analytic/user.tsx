"use client";
import { useGetUserAnalyticsQuery } from "../../../../redux/features/analytic/analyticapi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

export default function UserAnalytics() {
  const { data, isLoading, isError, error } = useGetUserAnalyticsQuery();

  if (isLoading) return <div className="p-6 text-gray-600 text-center">Loading analytics...</div>;
  if (isError)
    return (
      <div className="p-6 text-red-600 text-center">
        Error: {(error as any)?.data?.message || "Failed to load analytics"}
      </div>
    );

  const rawData = data?.user?.Last12Month;
  const chartData = Array.isArray(rawData)
    ? rawData
    : Object.entries(rawData || {}).map(([key, value]) => ({
        month: key,
        count: Number(value),
      }));

  return (
    <div className="p-4 sm:p-6 bg-background rounded-2xl shadow-md w-full max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-muted-foreground text-center">
        User Analytics (Last 12 Months)
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
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F4400D" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#F4400D" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" />
            <XAxis
              dataKey="month"
              tickFormatter={(dateStr) => {
                
  const d = new Date(dateStr);
  const day = d.getDate(); // e.g. 5
  const month = d.toLocaleDateString("en-US", { month: "short" }); // e.g. "Nov"
  const year = d.getFullYear().toString().slice(-2); // e.g. "25"
  return `${day}, ${month} '${year}`;
}}

              tick={{ fontSize: 10, fill: "#555" }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 10, fill: "#555" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
              labelFormatter={(dateStr) =>
                new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              }
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
              }}
            />

            {/* ✅ Smooth line with filled gradient area */}
            <Area
              type="monotone"
              dataKey="count"
              stroke="#F4400D"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCount)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
