"use client";
import { useGetCourseAnalyticsQuery } from "../../../../redux/features/analytic/analyticapi";
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

export default function CourseAnalytics() {
  const { data, isLoading, isError, error } = useGetCourseAnalyticsQuery();

  if (isLoading)
    return <div className="p-6 text-gray-600 text-center">Loading course analytics...</div>;
  if (isError)
    return (
      <div className="p-6 text-red-600 text-center">
        Error: {(error as any)?.data?.message || "Failed to load course analytics"}
      </div>
    );

  // ✅ Ensure data is normalized for Recharts
  const rawData = data?.course?.Last12Month;
  const chartData = Array.isArray(rawData)
    ? rawData
    : Object.entries(rawData || {}).map(([key, value]) => ({
        month: key,
        count: Number(value),
      }));

  return (
    <div className="p-4 sm:p-6 bg-background rounded-2xl shadow-md w-full max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-muted-foreground text-center">
        Course Analytics (Last 12 Months)
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
            {/* Gradient for the area fill */}
            <defs>
              <linearGradient id="colorCourse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F4400D" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#F4400D" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" />
            <XAxis
              dataKey="month"
              tickFormatter={(dateStr) => {
                const d = new Date(dateStr);
                const day = d.getDate();
                const month = d.toLocaleDateString("en-US", { month: "short" });
                const year = d.getFullYear().toString().slice(-2);
                return `${day} ${month} '${year}`;
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
              labelFormatter={(dateStr) => {
                const d = new Date(dateStr);
                return d.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
              }}
            />

            <Area
              type="monotone"
              dataKey="count"
              stroke="#F4400D"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCourse)"
              activeDot={{ r: 6 }}
              name="Courses Created"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
