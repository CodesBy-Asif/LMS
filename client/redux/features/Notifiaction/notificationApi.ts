import { apiSlice } from "../api/ApiSlice";

export const NotificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({  
        getAllNotification: builder.query({
      query: () => ({
        url: "/notification/get-all",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
      markNotificationRead: builder.mutation({
      query: (id: string) => ({
        url: `/notification/update/${id}`,
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    }),
});

export const {useGetAllNotificationQuery,useMarkNotificationReadMutation}   = NotificationApi;