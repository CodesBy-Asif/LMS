import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useGetUserAnalyticsQuery , useGetTransactionsQuery, useGetOrderAnalyticsQuery } from "@/redux/features/analytic/analyticapi";
import { useGetAllOrdersQuery } from "@/redux/features/order/orderApi";

import { HiUser } from "react-icons/hi";
import { HiCurrencyDollar } from "react-icons/hi";

const timeAgo = (dateString?: string) => {
  if (!dateString) return "-"; // fallback if missing
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-"; // invalid date

  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};


const Dashboard = () => {
  const { data: usersData, isLoading: loadingUsers } = useGetUserAnalyticsQuery();
  const { data: ordersData, isLoading: loadingOrders } = useGetOrderAnalyticsQuery();
  const { data: transactions, isLoading: loadingTransactions } = useGetTransactionsQuery();
// Helper function


console.log(transactions)
  if (loadingUsers || loadingOrders || loadingTransactions) return <div className="p-6 text-white">Loading...</div>;
  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mb-6">
        {/* User Analytics */}
        <div className="bg-card col-span-2 md:col-span-1 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">User Analytics (Last 12 Months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={usersData?.user?.Last12Month }>
              <XAxis dataKey="month" stroke="var(--color-secondary)" />
<YAxis stroke="var(--color-primary)" />
              <Line type="basis" dataKey="count" stroke="var(--color-primary)" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
    <div className="flex flex-wrap gap-6 ">
  {/* Total Users */}
  <div className="bg-card w-full p-6 rounded-xl shadow flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
    <div className="p-3 bg-accent rounded-full">
      <HiUser className="h-8 w-8 text-foreground" />
    </div>
    <div>
      <h3 className="text-foreground font-semibold text-sm">Total Users</h3>
      <span className="text-3xl font-bold text-foreground">
        {usersData?.user?.Last12Month?.reduce((sum, item) => sum + item.count, 0) || 0}
      </span>
    </div>
  </div>

  {/* Total Sales */}
  <div className="bg-card p-6 w-full rounded-xl shadow flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
    <div className="bg-accent p-3 rounded-full">
      <HiCurrencyDollar className="h-8 w-8 text-foreground" />
    </div>
    <div>
      <h3 className="text-foreground font-semibold text-sm">Total Sales</h3>
      <span className="text-3xl font-bold text-foreground ">
        {ordersData?.order?.Last12Month?.reduce((sum, item) => sum + item.count, 0) || 0}
      </span>
    </div>
  </div>
</div>


        {/* Orders Analytics */}
        <div className="bg-card col-span-2 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Orders Analytics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ordersData?.order.Last12Month} >
              <XAxis dataKey="month" stroke="var(--color-secondary)" />
              <YAxis stroke="var(--color-primary)" />
              <CartesianGrid stroke="#555" strokeDasharray="3 3" />
              <Tooltip />
              <Line type="linear" dataKey="count" stroke="var(--color-primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.orders.slice(0.5).map((tx:any) => (
                <tr key={tx.id} className="border-b border-gray-700">
                  <td className="px-4 py-2">{tx._id.slice(0,10)}...</td>
                  <td className="px-4 py-2">{tx.course.name}</td>
                <td className="px-4 py-2">{tx.course.price}</td>

          <td className="px-4 py-2">{timeAgo(tx.createdAt)}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
