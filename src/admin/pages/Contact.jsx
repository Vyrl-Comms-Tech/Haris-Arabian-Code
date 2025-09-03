import React from "react";
import "../styles/referral-table.css";
import { Plus, Filter, Search } from "lucide-react";
import ContactUsTable from "../components/ContactusTable";
export default function Contact() {
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Contact Queries</h1>
        </div>
        <ContactUsTable />
      </div>
    </>
  );
}
