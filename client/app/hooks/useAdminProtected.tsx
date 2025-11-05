import { redirect } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/ApiSlice";

interface Props {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: Props) {
  const { user } = useSelector((state: any) => state.auth);
  const {isLoading} = useLoadUserQuery({})

  // 1️⃣ Show loader while user data is loading
  if (isLoading) {
    return <Loader />;
  }

  // 2️⃣ Redirect if not logged in
  if (!user) {
    redirect("/");
  }

  // 3️⃣ Check if user is admin
  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    redirect("/");
  }

  // 4️⃣ Render children if admin
  return <>{children}</>;
}
