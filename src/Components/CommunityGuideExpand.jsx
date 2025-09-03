import React from "react";
import "../Styles/community-guide-expand.css";

const CommunityGuideExpand = () => {
  return (
    <>
      <div className="community-guide-expand">
        {/* heading */}
        <div className="community-guide-expand-heading">
          <span></span>
          <h1>About Al Barari</h1>
        </div>
        {/* para */}
        <div className="community-guide-expand-para">
          <p>
            A major advantage of working with Realty Group is the extensive
            experience and specialized knowledge they offer. A major advantage
            of working with Realty Group is the extensive experience and
            specialized knowledge they offer.
          </p>
          <p>
            A major advantage of working with Realty Group is the extensive
            experience and specialized knowledge they offer. A major advantage
            of working with Realty Group is the extensive experience and
            specialized knowledge they offer.
          </p>
        </div>
        {/* video */}
        <div className="community-guide-expand-video-section">
          {/* <div className="community-guide-expand-video"> */}
          <h2 className="community-guide-expand-video-heading-one">Lorem, ipsum.</h2>
          <h2>Lorem, ipsum.</h2>

            {/* <video src="" controls></video> */}
            <img className="community-guide-expand-video-image" src="/Assets/elements.png" alt="" />

          {/* </div> */}
          <div className="community-guide-expand-video-arrow-container">
            <img className="community-guide-expand-video-arrow" src="/Assets/arrow2.png" alt="" />
          </div>


        </div>
      </div>
    </>
  );
};

export default CommunityGuideExpand;
