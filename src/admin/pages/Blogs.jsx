import React from "react";
import "../styles/referral-table.css";
import { Plus, Filter, Search } from "lucide-react";
// import BlogsTable from "../components/BlogsTable";
// import ContactUsTable from "../components/ContactusTable";
import BlogsTable from '../components/BlogsTable'
import AgentTable from "../components/Agentstable";
import EditBlogModal from "../components/EditBlogModal";

export default function Blogs() {
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Blogs</h1>
        </div>
        <BlogsTable/>
        {/* <AgentTable /> */}
      </div>
    </>
  );
}
