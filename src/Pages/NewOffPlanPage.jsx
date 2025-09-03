import React from "react";
import Navbar from "../Components/Navbar";
import HeadFilterBar from "../Components/HeadFilterBar";
import  OffplanCard from "../Components/OffplanCard"
import '../Styles/OffplanCard.css'

function NewOffPlanPage() {
  return (
    <>
      <Navbar />
      <HeadFilterBar />
      <div className="newoffplan-container">
        <OffplanCard/>
      </div>
    </>
  );
}

export default NewOffPlanPage;
