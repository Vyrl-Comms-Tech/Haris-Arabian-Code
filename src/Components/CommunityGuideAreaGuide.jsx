import React from "react";
import "../Styles/community-guide-area-guide.css";

const CommunityGuideAreaGuide = () => {
  const guideItems = Array(9).fill({
    title: "Dubai Hills Estate Area Guide",
    image: "/Assets/area-guide.png",
  });

  return (
    <>
      <div className="community-guide-area-guide">
        <div className="community-guide-area-guide-heading">
          <div></div>
          <h1>Area Guide</h1>
        </div>
        {/* community-guide-area-guide-content */}
        <div className="community-guide-area-guide-content">
          <div className="guide-grid">
            {guideItems.map((item, index) => (
              <div key={index} className="guide-card">
                <div className="guide-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="guide-title">
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityGuideAreaGuide;
