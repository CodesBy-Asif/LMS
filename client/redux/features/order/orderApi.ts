import { apiSlice } from "../api/ApiSlice";

export const orderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: ({courseId,paymentInfo}) => ({
                url: "/order/create",
                method: "POST",
                body: {courseId,paymentInfo},
                credentials: "include" as const,
            }),
        }),
        createPayment: builder.mutation({
            query: ({amount,product}) => ({
                url: "/order/create-intent",
                method: "POST",
                body: {amount,product},
                credentials: "include" as const,
            }),
    
        }),  
        getAllOrders: builder.query({
      query: () => ({
        url: "/order/get-all",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    }),
});

export const { useCreateOrderMutation,useGetAllOrdersQuery ,useCreatePaymentMutation} = orderApi;