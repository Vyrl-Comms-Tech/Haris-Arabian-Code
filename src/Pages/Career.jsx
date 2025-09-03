import React from "react";
import Navbar from "../Components/Navbar";
import CareerHero from "../Components/CareerHero";
import CareerBelow from "../Components/CareerBelow";
import KnowledgeHubInsight from "../Components/KnowledgeHubInsight";
import Footer from "../Components/Footer";

const Career = () => {
  return (
    <>
      <Navbar />
      <CareerHero />
      <CareerBelow />
      <KnowledgeHubInsight />
      <Footer/>
    </>
  );
};

export default Career;
