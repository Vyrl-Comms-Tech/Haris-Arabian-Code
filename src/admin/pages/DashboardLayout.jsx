// src/admin/components/DashboardLayout.jsx
import React from "react";
import Sidebar from "../components/sidebar"
import Topbar from "../components/topbar"

const DashboardLayout = ({ children, isDarkMode, toggleDarkMode, isSidebarOpen, toggleSidebar }) => (
  <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
    <Sidebar isOpen={isSidebarOpen} />
    <div className="main-content2">
      <Topbar
        onMenuClick={toggleSidebar}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <main className="content-area">{children}</main>
    </div>
  </div>
);

export default DashboardLayout;
