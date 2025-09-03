import React from "react";
import CommunityGuideAreaHero from "../Components/CommunityGuideAreaHero";
import CommunityGuideAreaMap from "../Components/CommunityGuideAreaMap";
import CommunityGuideAreaGuide from "../Components/CommunityGuideAreaGuide";
import Footer from "../Components/Footer";

const CommunityGuideArea = () => {
  return (
    <>
      <CommunityGuideAreaHero />
      <CommunityGuideAreaMap />
      <CommunityGuideAreaGuide />
      <Footer />
    </>
  );
};

export default CommunityGuideArea;
