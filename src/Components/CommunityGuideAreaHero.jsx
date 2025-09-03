import React from "react";
import "../Styles/community-guide-area-hero.css";

const CommunityGuideAreaHero = () => {
  return (
    <>
      <div className="community-guide-area-hero">
        <div className="community-guide-area-hero-content">
          <h1>Experts making buying and selling  properties easy</h1>
          <p>
            A major advantage of working with Realty Group is the extensive
            experience and specialized knowledge they offer.
          </p>
          <div className="community-guide-area-hero-content-input">
            <input type="text" placeholder="Name" />
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M12.4398 13L7.47085 8.03168C7.0741 8.36967 6.61784 8.63123 6.10206 8.81636C5.58628 9.00149 5.06785 9.09405 4.54679 9.09405C3.27612 9.09405 2.20066 8.65424 1.32039 7.77461C0.440131 6.89499 0 5.81992 0 4.54941C0 3.27889 0.439602 2.2033 1.31881 1.32261C2.19801 0.44193 3.27295 0.00105978 4.54361 1.90266e-06C5.81428 -0.00105598 6.89027 0.439021 7.77159 1.32023C8.65291 2.20145 9.09357 3.27704 9.09357 4.54703C9.09357 5.09818 8.99597 5.63162 8.80077 6.14733C8.60557 6.66305 8.349 7.10418 8.03107 7.47074L13 12.4383L12.4398 13ZM4.54758 8.29985C5.6003 8.29985 6.48902 7.93753 7.21376 7.21288C7.93849 6.48823 8.30086 5.59935 8.30086 4.54623C8.30086 3.49311 7.93849 2.6045 7.21376 1.88038C6.48902 1.15626 5.6003 0.793939 4.54758 0.79341C3.49486 0.792881 2.60587 1.1552 1.88061 1.88038C1.15534 2.60556 0.792976 3.49417 0.793505 4.54623C0.794034 5.59829 1.1564 6.48691 1.88061 7.21209C2.60481 7.93726 3.49354 8.29958 4.54679 8.29906"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityGuideAreaHero;
