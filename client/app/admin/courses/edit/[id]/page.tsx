"use client";
import React from "react";
import AdminSidebar from "../../../../components/Admin/sideBar/AdminSideBar";
import Heading from "../../../../../app/utils/Heading";
import EditCourse from "../../../../components/Admin/Course/EditCourse";
import DashboardHeader from "../../../../components/Admin/DashboardHero";
import AdminProtected from "@/app/hooks/useAdminProtected";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const  id  = React.use(params).id;

  return (
    <AdminProtected>
      <Heading
        title="Create Course - Admin"
        description="Create a new course on ELearning platform."
        keywords="ELearning, create course, online learning, education, courses, tutorials, training"
      />
      <div className="flex ">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar activeTab="" />
        </div>
        <div className="w-[85%]">
          <DashboardHeader />
          <EditCourse id={id} />
        </div>
      </div>
    </AdminProtected>
  );
};

export default Page;
