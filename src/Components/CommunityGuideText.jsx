import React, { useState, useRef, useEffect } from "react";
import "../Styles/community-guide-text.css";

const CommunityGuideText = () => {
  const items = [
    {
      title: "For Activity Seekers",
      content:
        "Discover thrilling adventures and exciting experiences tailored for those who crave action and exploration. Whether you're looking to hike scenic trails, engage in water sports, or participate in local events, there's something for every activity seeker to enjoy.",
    },
    {
      title: "For Food Enthusiasts",
      content:
        "Savor delicious local cuisines, fine dining, and hidden food gems curated for those who love to explore through taste.",
    },
    {
      title: "For Nature Lovers",
      content:
        "Reconnect with the outdoors—whether it's hiking, bird watching, or finding peace in breathtaking landscapes.",
    },
    {
      title: "For Culture Explorers",
      content:
        "Dive into local traditions, museums, and festivals that showcase the spirit of the community.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const [heights, setHeights] = useState([]);
  const contentRefs = useRef([]);

  useEffect(() => {
    // measure each panel once mounted
    const h = contentRefs.current.map((el) => (el ? el.scrollHeight : 0));
    setHeights(h);
  }, [items]);

  const toggle = (idx) => setOpenIndex((prev) => (prev === idx ? null : idx));

  return (
    <>
      <div className="community-guide-text">
        <div className="community-guide-text-para">
          <p>
            A major advantage of working with Realty Group is the extensive
            experience and specialized knowledge they offe A major advantage of
            working with Realty Group is the extensive experience and
            specialized knowledge they offer
          </p>
          <ul>
            <li>
              A major advantage of working with Realty Group is the extensive
              experience and specialized knowledge they offer A major advantage
              of working with Realty Group is the extensive experience and
              specialized knowledge they offer
            </li>
            <li>
              A major advantage of working with Realty Group is the extensive
              experience and specialized knowledge they offer
            </li>
            <li>
              A major advantage of working with Realty Group is the extensive
              experience and specialized knowledge they offer
            </li>
            <li>
              A major advantage of working with Realty Group is the extensive
              experience and specialized knowledge they offer
            </li>
          </ul>
          <p>
            A major advantage of working with Realty Group is the extensive
            experience and specialized knowledge they offe A major advantage of
            working with Realty Group is the extensive experience and
            specialized knowledge they offer r A major advantage of working with
            Realty Group is the extensive experience and specialized knowledge
            they offer
          </p>
          <button>View property</button>
        </div>
        {/*  */}
        <div className="community-guide-text-img">
          <h1>
            <div></div> Out and About
          </h1>
        </div>
        <div className="community-guide-text-img-container">
          <div className="image-section">
            <img src="/Assets/text.jpg" alt="City skyline" />
          </div>

          <div className="text-section">
            <div className="accordion">
              {items.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`accordion-item ${openIndex === idx ? 'active' : ''}`}
                >
                  <button 
                    className="accordion-question"
                    onClick={() => toggle(idx)}
                    aria-expanded={openIndex === idx}
                  >
                    <h3>{item.title}</h3>
                    <svg
                      className="arrow"
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="14"
                      viewBox="0 0 25 14"
                      fill="none"
                    >
                      <path
                        d="M22.7181 0.254153L24.7267 2.13856L14.3001 12.9302C14.1331 13.1042 13.9328 13.2439 13.7108 13.3413C13.4887 13.4388 13.2494 13.492 13.0064 13.498C12.7635 13.504 12.5218 13.4627 12.2952 13.3763C12.0687 13.2899 11.8617 13.1603 11.6863 12.9948L0.734033 2.73124L2.64718 0.751782L12.9268 10.3849L22.7181 0.254153Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                  <div 
                    className="accordion-answer"
                    style={{
                      maxHeight: openIndex === idx ? `${heights[idx]}px` : '0px'
                    }}
                  >
                    <div ref={(el) => (contentRefs.current[idx] = el)}>
                      <p>{item.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="community-guide-text-location">
        <h1>
          <div></div> Location
        </h1>
        <div className="community-guide-text-location-container"></div>
      </div>
    </>
  );
};

export default CommunityGuideText;