"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { ProviderWrapper } from "./Provider";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono, Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { useLoadUserQuery } from "@/redux/features/api/ApiSlice";
import DisableDevtool from "disable-devtool";
import disableDevtool from "disable-devtool";

// Dynamically import Loader to avoid SSR hydration mismatches
const Loader = dynamic(() => import("./components/Loader/Loader"), { ssr: false });

// Fonts
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${josefinSans.variable} ${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-500`}
      >
        <ProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider>
              <Custom>{children}</Custom>
            </SessionProvider>

            <Toaster
              position="top-right"
              toastOptions={{ duration: 5000 }}
              reverseOrder={false}
            />
          </ThemeProvider>
        </ProviderWrapper>
      </body>
    </html>
  );
}

const Custom = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useLoadUserQuery({});
  const [mounted, setMounted] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(true);

  // Mount detection for theme consistency (prevents hydration mismatch)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Loader visibility logic
  React.useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => setShowLoader(false), 300); // smooth fade-out
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // --- Optional DisableDevtool ---
  React.useEffect(() => {
    DisableDevtool({
      disableMenu: true, // disables right-click
      disableSelect: true,
      disableCopy: true,
      ondevtoolopen(type) {
        // Replace the entire <body> content
        document.body.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#fee2e2;color:#b91c1c;flex-direction:column;">
            <h1 style="font-size:2rem;font-weight:bold;margin-bottom:1rem;">DevTools Detected!</h1>
            <p style="font-size:1.2rem;">Please close the developer tools and reload to continue using this page.</p>
          </div>
        `;
        document.body.style.overflow = "hidden"; // prevent scroll
      },
    });
  }, []);
  // -------------------------------

  // Prevent premature render until theme mounts
  if (!mounted) return null;

  return (
    <>
      {showLoader && <Loader />}
      <div
        style={{
          opacity: showLoader ? 0.3 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        {children}
      </div>
    </>
  );
};
