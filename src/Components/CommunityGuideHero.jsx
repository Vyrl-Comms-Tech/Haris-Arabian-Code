import React from "react";
import "../Styles/community-guide-hero.css";

const CommunityGuideHero = () => {
  return (
    <>
      <div className="community-guide-hero">
        <div className="community-guide-hero-container">
          <h1>Experts making buying and <br /> selling  properties easy</h1>
          <p>
            A major advantage of working with Realty Group is the extensive
            experience <br /> and specialized knowledge they offer.
          </p>
          <div className="community-guide-hero-btn">
            <button>Find property</button> <button>Download guide</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityGuideHero;
