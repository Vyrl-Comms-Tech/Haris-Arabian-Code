import React from "react";
import KnowledgeHubHero from "../Components/KnowledgeHubHero";
import Navbar from "../Components/Navbar";
import KnowledgeHubNews from "../Components/KnowledgeHubNews";
import KnowledgeHubInsight from "../Components/KnowledgeHubInsight";
import KnowledgeHubBlog from "../Components/KnowledgeHubBlog";
import PodcastPlayer from "../Components/PodcastPlayer";
import Footer from "../Components/Footer";

const KnowledgeHub = () => {
  return (
    <>
      <Navbar />
      <KnowledgeHubHero />
      <KnowledgeHubNews />
      <PodcastPlayer />
      {/* <div className="random"></div> */}
      <KnowledgeHubInsight />
      <KnowledgeHubBlog />
      <Footer />
    </>
  );
};

export default KnowledgeHub;
