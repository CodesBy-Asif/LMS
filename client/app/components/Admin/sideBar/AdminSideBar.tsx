'use client'
import Image from "next/image";
import React, { use } from "react";
import {
  FaTachometerAlt,
  FaQuestionCircle,
  FaListUl,
  FaUsersCog,
  FaChalkboardTeacher,
  FaShoppingCart,
  FaUser,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaVideo,
} from "react-icons/fa";
import { MdCreateNewFolder } from "react-icons/md";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";

interface SidebarProps {
  activeTab: string;
}

const sidebarSections = [
   {
    title: "Dashboard",
    items: [
      { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt },
    ],
  },
  {
    title: "Data",
    items: [
      { id: "users", label: "Users", icon: FaUser },
      { id: "Invoices", label: "Orders", icon: FaShoppingCart },
    ],
  },
   {
    title: "Content",
    items: [
      { id: "create-course", label: "Create Course", icon: MdCreateNewFolder },
      { id: "courses", label: "Live Courses", icon: FaVideo },
    ],
  },
   {
    title: "Customization",
    items: [
      { id: "hero", label: "Hero Section", icon: FaHome },
      { id: "faq", label: "FAQ", icon: FaQuestionCircle },
      { id: "categories", label: "Categories", icon: FaListUl },
    ],
  },
  {
    title: "Controllers",
    items: [
      { id: "team", label: "Manage Team", icon: FaUsersCog },
    ],
  },
 
  {
    title: "Analytics",
    items: [
      { id: "UserAnalytics", label: "User Analytics", icon: FaChartLine },
      { id: "CourseAnalytics", label: "Course Analytics", icon: FaChalkboardTeacher },
      {id: "OrderAnalytics", label: "Order Analytics", icon: FaShoppingCart },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab}) => {
  const {user} = useSelector((state:any) => state.auth);
  return (
    <aside className="max-h-screen sticky top-0 bg-sidebar overflow-hidden ">
      {/* Header */}
      <div className="flex flex-col items-center justify-center py-4 gap-2  border-b border-border">
       <Image src={user?.avatar.url || "https://res.cloudinary.com/dxze1vehc/image/upload/v1756711327/products/wkveofepcg5wmgsorkyf.jpg"} alt="User Avatar" width={100} height={100} className="rounded-full" />
        <h1 className="text-xl md:block hidden  font-bold">{user?.name}</h1>
      </div>

      {/* Navigation */}
      <nav className="max-h-screen h-[100%] px-2 lg:px-4 py-4 overflow-y-auto space-y-6  pb-40">
        {sidebarSections.map((section) => (
          <div key={section.title} >
            <h4 className="md:block hidden text-xs uppercase font-semibold  text-foreground mb-2 px-2">
              {section.title}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() =>{
                      if(item.id === "logout") return ;
                        redirect(item.id==="dashboard"?"/admin":"/admin/"+item.id)}}
                    disabled={isActive}
                    className={`w-full flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted hover:text-foreground/90 text-foreground/70"
                      }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border text-xs text-center text-foreground/60">
        © 2025 Edura
      </div>
    </aside>
  );
};

export default Sidebar;
