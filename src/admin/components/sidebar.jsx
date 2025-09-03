import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, UserCheck, Home, Users, BarChart3, Settings } from "lucide-react";
import "../styles/sidebar.css";

export default function DashboardSidebar({ isOpen = true, isMobile = false }) {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { name: "Referrals", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Agents", icon: UserCheck, path: "/agents" },
    { name: "Contacts", icon: Users, path: "/contact" },
    { name: "Blogs", icon: BarChart3, path: "/blogs" },
    { name: "Add Blog", icon: BarChart3, path: "/Addblogs" },
    { name: "Community", icon: Home, path: "/CommunityGuide" },
    // { name: "Settings", icon: Settings, path: "/settings" },
  ];

  // Determine dashboard sidebar classes based on state
  const getDashboardSidebarClasses = () => {
    let classes = "dashboard-sidebar";
    
    if (isMobile) {
      classes += isOpen ? " dashboard-sidebar--open" : " dashboard-sidebar--collapsed";
    } else {
      classes += isOpen ? "" : " dashboard-sidebar--collapsed";
    }
    
    return classes;
  };

  return (
    <div className={getDashboardSidebarClasses()}>
      <div className="dashboard-sidebar__header">
        {isOpen ? (
          <h1 className="dashboard-sidebar__logo">Arabian Estate</h1>
        ) : (
          <h1 className="dashboard-sidebar__logo--small">AE</h1>
        )}
      </div>
      
      <div className="dashboard-sidebar__content">
        <nav className="dashboard-sidebar__nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`dashboard-sidebar__nav-item ${
                  isActive ? "dashboard-sidebar__nav-item--active" : ""
                }`}
                onClick={() => setActiveItem(item.name)}
                title={!isOpen ? item.name : undefined} // Tooltip when collapsed
              >
                <Icon className="dashboard-sidebar__nav-icon" />
                {isOpen && <span className="dashboard-sidebar__nav-text">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}