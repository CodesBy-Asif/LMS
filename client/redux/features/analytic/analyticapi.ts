import { apiSlice } from "../api/ApiSlice";

type AnalyticsResponse = {
  success: boolean;
  message: string;
  user:{
    Last12Month: {
    month: string;
    count: number;
  }[]};
};
type CourseResponse = {
  success: boolean;
  message: string;
  course:{
    Last12Month: {
    month: string;
    count: number;
  }[]};
};
type OrderResponse = {
  success: boolean;
  message: string;
  order:{
    Last12Month: {
    month: string;
    count: number;
  }[]};
};
type TransactionResponse = {
  success: boolean;
  message: string;
  orders: any[];
};
export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => ({
        url: "/analytic/user-analytic",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
     getCourseAnalytics: builder.query<CourseResponse, void>({
      query: () => ({
        url: "/analytic/course-analytic",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getOrderAnalytics: builder.query<OrderResponse, void>({
      query: () => ({
        url: "/analytic/order-analytic",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getTransactions: builder.query<TransactionResponse, void>({
      query: () => ({
        url: "/order/get-all",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGetUserAnalyticsQuery ,useGetCourseAnalyticsQuery,useGetOrderAnalyticsQuery,useGetTransactionsQuery} = analyticsApi;
