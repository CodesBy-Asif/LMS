"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "./useAuth";

interface Props {
  children: React.ReactNode;
}

export default function Protected({ children }: Props) {
  const  auth  = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      router.replace("/"); // client-side redirect
    }
  }, [auth, router]);

  if (!auth) {
    return null; // avoid flicker
  }

  return <>{children}</>;
}
