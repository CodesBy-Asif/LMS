"use client";

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/ApiSlice";
import authSlice from "./features/auth/authSlice";

// Create the store
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// ✅ Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Run refresh once on app load
const InitializeApp = async () => {
  try {
    await store.dispatch(apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true }));
    await store.dispatch(apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }));
  } catch (err) {
    console.error("Failed to refresh token:", err);
  }
};


InitializeApp();
