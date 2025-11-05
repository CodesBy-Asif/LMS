import React from "react";
import { FaUser, FaBookOpen, FaLock, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

interface SidebarProps {
  activeTab: string;
  onTabClick: (id: string) => void;
  role?: string; // 'admin' | 'user' | etc.
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabClick, role }) => {
  const sidebarItems = [
    { id: "myAccount", label: "My Account", icon: FaUser },
    { id: "changePassword", label: "Change Password", icon: FaLock },
    { id: "enrolledCourses", label: "Enrolled Courses", icon: FaBookOpen },
    // Conditionally add Admin Dashboard
    ...(role === "admin"
      ? [{ id: "adminDashboard", label: "Admin Dashboard", icon: FaTachometerAlt }]
      : []),
    { id: "logout", label: "Logout", icon: FaSignOutAlt },
  ];

  return (
    <aside className="sticky top-0 left-0 h-screen lg:h-auto w-20 lg:w-64 bg-card text-foreground shadow-lg flex flex-col">
      <nav className="p-2 lg:p-4 sticky top-20 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabClick(item.id)}
            className={`
              w-full flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-2 lg:px-4 py-3 rounded-lg transition
              ${
                activeTab === item.id
                  ? "bg-primary text-text-on-primary"
                  : "hover:bg-primary/10 dark:hover:bg-primary/20"
              }
              ${item.id === "logout" ? "mt-4 border-t border-border pt-4" : ""}
            `}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="hidden lg:inline font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
