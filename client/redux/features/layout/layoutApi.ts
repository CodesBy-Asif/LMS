import { apiSlice } from "../api/ApiSlice";

export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLayout: builder.mutation({
      query: ({ data }) => ({
        url: "/layout/create",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    // ✅ FIXED: Pass 'type' as query param
    getHeroData: builder.query({
      query: (type: string) => ({
        url: `/layout/get/${type}`,
        method: "GET",
       
        credentials: "include" as const,
      }),
    }),

    editLayout: builder.mutation({
      query: ({ type, image, title, subtitle, faq, categories }) => ({
        url: `/layout/edit`,
        method: "PUT",
        body: {
          type,
          image,
          title,
          subtitle,
          faq,
          categories,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateLayoutMutation,
  useEditLayoutMutation,
  useGetHeroDataQuery,
} = layoutApi;
