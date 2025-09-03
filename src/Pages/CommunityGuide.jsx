import React from "react";
import Navbar from "../Components/Navbar";
import CommunityGuideHero from "../Components/CommunityGuideHero";
import CommunityGuideExpand from "../Components/CommunityGuideExpand";
import CommunityGuideText from "../Components/CommunityGuideText";
import CommunityGuideContact from "../Components/CommunityGuideContact";
import Footer from "../Components/Footer";

const CommunityGuide = () => {
  return (
    <>
      <Navbar />
      <CommunityGuideHero />
      <CommunityGuideExpand/>
      <CommunityGuideText/>
      <CommunityGuideContact/>
      <Footer/>
    </>
  );
};

export default CommunityGuide;
