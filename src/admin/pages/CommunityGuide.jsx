import React from "react";
import "../styles/referral-table.css";
import { Plus, Filter, Search } from "lucide-react";
import CommunityGuideTable from "../components/CommunityGuideTable";

export default function CommunityGuides() {
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Community Guides</h1>
        </div>
        <CommunityGuideTable />
      </div>
    </>
  );
}