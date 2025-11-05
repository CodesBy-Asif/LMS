import { fetchBaseQuery, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { userLogin } from "../auth/authSlice";

// 1️⃣ Define the base query with credentials
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
  credentials: "include",
});

// 2️⃣ Wrap with refresh-token logic (only try refresh once)
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Perform the initial request
  let result = await baseQuery(args, api, extraOptions);

  // If unauthorized, try refreshing the token once
  if (result.error && result.error.status === 401) {
    console.warn("⚠️ Token expired. Attempting refresh...");

    // Prevent recursion — don’t refresh if we’re already calling /user/refresh
    const isRefreshing = (args as FetchArgs)?.url === "/user/refresh";
    if (!isRefreshing) {
      const refreshResult = await baseQuery(
        { url: "/user/refresh", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        console.log("✅ Token refreshed successfully!");

        // Optionally revalidate user session
        const userCheck = await baseQuery(
          { url: "/user/me", method: "GET" },
          api,
          extraOptions
        );

        if (userCheck.data) {
          api.dispatch(userLogin(userCheck.data)); // update store
          console.log("👤 User restored, retrying original request...");
          // Retry the original request once
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.log("🚫 Could not verify user after refresh.");
        }
      } else {
        console.log("🚫 Refresh token invalid or expired. Logging out.");
      }
    }
  }

  return result;
};

// 3️⃣ Create the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // ✅ Refresh Token (for manual testing)
    refreshToken: builder.query({
      query: () => ({
        url: "/user/refresh",
        method: "POST",
      }),
    }),

    // ✅ Load Logged-in User
    loadUser: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLogin(result.data));
        } catch (er) {
          console.log("Failed to load user:");
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
