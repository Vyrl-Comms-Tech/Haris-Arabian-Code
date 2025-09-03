import React, { useEffect, useRef, useState } from "react";
import "../Styles/contact-location.css";

const ContacLocation = () => {
  const items = [
    {
      title: "For Activity Seekers",
      content:
        "Discover thrilling adventures and exciting experiences tailored for those who crave action and exploration. Whether you're looking to hike scenic trails, engage in water sports, or participate in local events, there's something for every activity seeker to enjoy. Discover thrilling adventures and exciting experiences tailored for those who crave action and exploration. Whether you're looking to hike scenic trails, engage in water sports, or participate in local events, there's something for every activity seeker to enjoy.",
    },
    { title: "For Food Enthusiasts", content: "Add your copy here." },
    { title: "For Nature Lovers", content: "Add your copy here." },
    { title: "For Culture Explorers", content: "Add your copy here." },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const [heights, setHeights] = useState([]);
  const contentRefs = useRef([]);

  useEffect(() => {
    // measure each panel once mounted
    const h = contentRefs.current.map((el) => (el ? el.scrollHeight : 0));
    setHeights(h);
  }, []);

  const toggle = (idx) => setOpenIndex((prev) => (prev === idx ? null : idx));

  return (
    <>
      <div className="contact-location">
        <h1>Our location</h1>
        <div className="contact-location-map"></div>
        {/* contact-services */}
        <div className="contact-location-services">
          <h1>
            Know more about our <br /> services
          </h1>
          <div className="contact-location-services-top">
            {/* top one */}
            <div className="contact-location-services-top-one">
              <h2>list with us</h2>
              <p>
                A major advantage of working with Realty Group is the extensive
                experience and specialized knowledge they offer.A major
                advantage of working with Realty Group is the extensive
                experience and specialized knowledge they offer.
              </p>
              <button>List with us</button>
            </div>
            {/* top two */}
            <div className="contact-location-services-top-two">
              <h2>referral programme</h2>
              <p>
                A major advantage of working with Realty Group is the extensive
                experience and specialized knowledge they offer.A major
                advantage of working with Realty Group is the extensive
                experience and specialized knowledge they offer.
              </p>
              <button>reffer now</button>
            </div>
          </div>
          {/* bottom */}
          <div className="contact-location-services-bottom">
            <h2>find an agent</h2>
            <div className="contact-location-services-bottom-p">
              <p>
                A major advantage of working with Realty Group is the extensive
                experience and specialized knowledge they offer.A major
                advantage of working with Realty Group is the extensive
                experience and specialized knowledge they offer.
              </p>
            </div>
            <button>Find agent</button>
          </div>
        </div>
        {/* contact location faq */}
        <div className="contact-location-faq">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`faq-item ${isOpen ? "active" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                >
                  <h2>{item.title}</h2>
                  <span className="arrow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="14"
                      viewBox="0 0 25 14"
                      fill="none"
                    >
                      <path
                        d="M22.7181 0.254153L24.7267 2.13856L14.3001 12.9302C14.1331 13.1042 13.9328 13.2439 13.7108 13.3413C13.4887 13.4388 13.2494 13.492 13.0064 13.498C12.7635 13.504 12.5218 13.4627 12.2952 13.3763C12.0687 13.2899 11.8617 13.1603 11.6863 12.9948L0.734033 2.73124L2.64718 0.751782L12.9268 10.3849L22.7181 0.254153Z"
                        fill="#011825"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  id={`faq-panel-${idx}`}
                  className="faq-answer"
                  ref={(el) => (contentRefs.current[idx] = el)}
                  style={{
                    maxHeight: isOpen ? heights[idx] || 0 : 0,
                    opacity: isOpen ? 1 : 0,
                    paddingTop: isOpen ? 8 : 0, // smooth padding
                    paddingBottom: isOpen ? 18 : 0,
                  }}
                  role="region"
                  aria-hidden={!isOpen}
                >
                  <p>{item.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ContacLocation;
