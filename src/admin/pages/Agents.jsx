import React from 'react'
// import "../styles/referral-table.css";
// import { Plus, Filter, Search } from "lucide-react";
// import BlogsTable from "../components/BlogsTable";
// import ContactUsTable from "../components/ContactusTable";
import BlogsTable from '../components/BlogsTable'
import EditBlogModal from "../components/EditBlogModal";
import AgentTable from '../components/Agentstable';

function Agents() {
  return (
    <>
        <div className="dashboard">
                <div className="dashboard-header">
                  <h1 className="dashboard-title">Agents</h1>
                </div>
                <AgentTable/>
                {/* <BlogsTable /> */}
              </div>
    </>
  )
}

export default Agents