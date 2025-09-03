import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import "../Styles/community-guide-area-map.css";
import { useGSAP } from "@gsap/react";

const CommunityGuideAreaMap = () => {
  const [activeView, setActiveView] = useState("map");
  const backgroundRef = useRef(null);

  useGSAP(() => {
    // Initialize GSAP animation
    if (backgroundRef.current) {
      if (activeView === "map") {
        gsap.to(backgroundRef.current, {
          x: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(backgroundRef.current, {
          x: "100%",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  }, [activeView]);

  const handleToggle = (view) => {
    if (view !== activeView) {
      setActiveView(view);
    }
  };

  return (
    <>
      <div className="community-guide-area-map">
        {/* map */}
        <div className="community-guide-area-map-container"></div>
        {/* button */}
        <div className="community-guide-area-map-button">
          <div className="toggle-container">
            <div ref={backgroundRef} className="toggle-background" />
            <button
              className={`toggle-option ${
                activeView === "map" ? "active" : ""
              }`}
              onClick={() => handleToggle("map")}
            >
              map view
            </button>
            <button
              className={`toggle-option ${
                activeView === "list" ? "active" : ""
              }`}
              onClick={() => handleToggle("list")}
            >
              list view
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityGuideAreaMap;
