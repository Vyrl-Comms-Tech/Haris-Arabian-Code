import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../Styles/TeamSection.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const TeamSection = () => {
  const containerRef = useRef(null);
  const buildingImageRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeCard, setActiveCard] = useState(0);

  // Location suggestions states
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [renderSuggestions, setRenderSuggestions] = useState(false); // Used to control rendering of suggestions

  // Card data with different images and content
  const cardData = [
    {
      id: 0,
      image: "/Assets/build.jpg",
      title: "Finalists in three categories with Property Finder 2024",
      description: "",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="24"
          viewBox="0 0 23 24"
          fill="none"
        >
          <path
            d="M16.438 14.9654H15.3991L15.0309 14.6103C16.3643 13.064 17.097 11.0896 17.0955 9.04774C17.0955 7.35716 16.5942 5.70454 15.6549 4.29887C14.7157 2.89321 13.3807 1.79762 11.8188 1.15066C10.2569 0.503704 8.53826 0.33443 6.88016 0.664246C5.22206 0.994063 3.699 1.80816 2.50358 3.00358C1.30816 4.199 0.494063 5.72206 0.164246 7.38016C-0.16557 9.03826 0.0037036 10.7569 0.650662 12.3188C1.29762 13.8807 2.39321 15.2157 3.79887 16.1549C5.20454 17.0942 6.85716 17.5955 8.54774 17.5955C10.665 17.5955 12.6112 16.8196 14.1103 15.5309L14.4654 15.8991V16.938L21.0406 23.5L23 21.5406L16.438 14.9654ZM8.54774 14.9654C5.2733 14.9654 2.63008 12.3222 2.63008 9.04774C2.63008 5.7733 5.2733 3.13008 8.54774 3.13008C11.8222 3.13008 14.4654 5.7733 14.4654 9.04774C14.4654 12.3222 11.8222 14.9654 8.54774 14.9654Z"
            fill="#E6E6E6"
          />
        </svg>
      ),
    },
    {
      id: 1,
      image: "/Assets/vsearch.jpg", // Different image for card 2
      title: "Recognized as one of the UAE’s Best Workplaces in 2025",
      description: "",
      icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 23 24" fill="none">
  <path d="M11.5003 10.4977C13.3898 10.4977 14.9216 8.98526 14.9216 7.11957C14.9216 5.25389 13.3898 3.74146 11.5003 3.74146C9.61084 3.74146 8.0791 5.25389 8.0791 7.11957C8.0791 8.98526 9.61084 10.4977 11.5003 10.4977Z" fill="#E6E6E6"/>
  <path d="M6.31063 7.45726H6.65563V7.1482C6.65772 6.24948 6.91127 5.36927 7.38759 4.60715C7.86392 3.84503 8.54401 3.23141 9.35093 2.83571C9.11205 2.28555 8.72861 1.81037 8.24135 1.46062C7.7541 1.11088 7.18121 0.899645 6.58354 0.849345C5.98587 0.799046 5.38573 0.911563 4.84687 1.17495C4.30801 1.43833 3.85055 1.84275 3.52307 2.34524C3.1956 2.84773 3.01033 3.42954 2.98696 4.02887C2.96359 4.6282 3.10298 5.22266 3.39033 5.74913C3.67768 6.2756 4.10226 6.71442 4.61897 7.01897C5.13568 7.32351 5.72523 7.48243 6.325 7.47882L6.31063 7.45726ZM16.3587 7.11945V7.42851H16.7037C17.2955 7.42257 17.8748 7.25721 18.3805 6.94982C18.8862 6.64243 19.2997 6.2044 19.5775 5.68181C19.8552 5.15923 19.987 4.57143 19.9588 3.98028C19.9307 3.38914 19.7437 2.81651 19.4176 2.32268C19.0914 1.82884 18.6382 1.43206 18.1055 1.1741C17.5729 0.916147 16.9806 0.806551 16.3909 0.856853C15.8012 0.907156 15.236 1.11549 14.7548 1.45994C14.2735 1.80439 13.894 2.2722 13.6562 2.81415C14.4634 3.2083 15.1443 3.82037 15.6218 4.58117C16.0994 5.34198 16.3546 6.22119 16.3587 7.11945ZM14.5834 10.8354C16.0124 11.1187 17.3941 11.6027 18.6875 12.2729C18.8697 12.3729 19.0348 12.5015 19.1762 12.6538H23V10.1957C23.0007 10.1014 22.9756 10.0087 22.9275 9.92766C22.8793 9.84659 22.81 9.78021 22.7268 9.73569C20.864 8.7613 18.7917 8.25557 16.6894 8.26226H16.215C15.9659 9.27477 15.393 10.1783 14.5834 10.8354ZM3.25595 14.0482C3.25463 13.6862 3.35239 13.3308 3.53863 13.0204C3.72487 12.71 3.99249 12.4564 4.31251 12.2873C5.60593 11.617 6.98762 11.1331 8.41656 10.8498C7.61089 10.1982 7.03837 9.30288 6.785 8.2982H6.31063C4.20831 8.2915 2.13603 8.79724 0.273139 9.77163C0.190029 9.81615 0.12066 9.88253 0.072525 9.9636C0.0243898 10.0447 -0.000683043 10.1374 1.41534e-05 10.2316V14.8244H3.25595V14.0482ZM13.9869 18.1954H18.2706V19.2016H13.9869V18.1954Z" fill="#E6E6E6"/>
  <path d="M22.1451 14.2927H17.2073V13.5739C17.2073 13.3833 17.1315 13.2005 16.9968 13.0657C16.862 12.9309 16.6791 12.8552 16.4885 12.8552C16.2979 12.8552 16.1151 12.9309 15.9803 13.0657C15.8455 13.2005 15.7698 13.3833 15.7698 13.5739V14.2927H14.3754V12.2586C13.4299 12.0592 12.4667 11.9557 11.5004 11.9496C9.23198 11.941 6.99605 12.4889 4.98855 13.5452C4.89914 13.5916 4.82431 13.6618 4.7723 13.748C4.72029 13.8343 4.69315 13.9332 4.69386 14.0339V18.0661H9.80416V22.4433C9.80416 22.6339 9.87989 22.8167 10.0147 22.9515C10.1495 23.0863 10.3323 23.162 10.5229 23.162H22.1451C22.3357 23.162 22.5185 23.0863 22.6533 22.9515C22.7881 22.8167 22.8638 22.6339 22.8638 22.4433V15.0114C22.8638 14.8208 22.7881 14.638 22.6533 14.5032C22.5185 14.3684 22.3357 14.2927 22.1451 14.2927ZM21.4263 21.7389H11.2417V15.7302H15.7698V16.3842C15.7698 16.5749 15.8455 16.7577 15.9803 16.8925C16.1151 17.0273 16.2979 17.103 16.4885 17.103C16.6791 17.103 16.862 17.0273 16.9968 16.8925C17.1315 16.7577 17.2073 16.5749 17.2073 16.3842V15.7302H21.4263V21.7389Z" fill="#E6E6E6"/>
</svg>
      ),
    },
    {
      id: 2,
      image: "/Assets/i3.jpg", // Different image for card 3
      title: "Over 1 Billion AED sold in 2024",
      description: "",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="22"
          viewBox="0 0 21 22"
          fill="none"
        >
          <path
            d="M12.847 0.330078L16.027 4.78608L18.124 4.07108L20.038 9.67008H21V21.6701H0V9.67008H0.51V9.66008L1.158 9.66608L12.847 0.330078ZM7.897 9.67008H17.925L16.888 6.63708L15.366 7.12408L7.897 9.67008ZM6.339 8.08708L14.05 5.46008L12.446 3.21008L6.339 8.08708ZM4 11.6701H2V13.6701C2.53043 13.6701 3.03914 13.4594 3.41421 13.0843C3.78929 12.7092 4 12.2005 4 11.6701ZM14 15.6701C14 15.2105 13.9095 14.7553 13.7336 14.3307C13.5577 13.906 13.2999 13.5202 12.9749 13.1952C12.6499 12.8702 12.264 12.6124 11.8394 12.4365C11.4148 12.2606 10.9596 12.1701 10.5 12.1701C10.0404 12.1701 9.58525 12.2606 9.16061 12.4365C8.73597 12.6124 8.35013 12.8702 8.02513 13.1952C7.70012 13.5202 7.44231 13.906 7.26642 14.3307C7.09053 14.7553 7 15.2105 7 15.6701C7 16.5983 7.36875 17.4886 8.02513 18.145C8.6815 18.8013 9.57174 19.1701 10.5 19.1701C11.4283 19.1701 12.3185 18.8013 12.9749 18.145C13.6313 17.4886 14 16.5983 14 15.6701ZM19 19.6701V17.6701C18.4696 17.6701 17.9609 17.8808 17.5858 18.2559C17.2107 18.6309 17 19.1396 17 19.6701H19ZM17 11.6701C17 12.2005 17.2107 12.7092 17.5858 13.0843C17.9609 13.4594 18.4696 13.6701 19 13.6701V11.6701H17ZM2 19.6701H4C4 19.1396 3.78929 18.6309 3.41421 18.2559C3.03914 17.8808 2.53043 17.6701 2 17.6701V19.6701Z"
            fill="#E6E6E6"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const buildingImage = buildingImageRef.current;
    const cards = cardsRef.current;

    // Initial setup - hide elements
    gsap.set(buildingImage, { opacity: 0, scale: 0.8 });
    gsap.set(cards, { opacity: 0, y: 50 });

    // ScrollTrigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 0%",
        // end: "bottom 20%",
        // toggleActions: "play none none reverse"
      },
    });

    // Animate building image
    tl.to(buildingImage, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: "power3.inOut",
    });

    // Animate cards with stagger
    tl.to(
      cards,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "none",
      },
      "-=0.5"
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleCardClick = (cardIndex) => {
    if (cardIndex === activeCard) return;

    const buildingImage = buildingImageRef.current;

    // Animate image change
    gsap.to(buildingImage, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        setActiveCard(cardIndex);
        gsap.to(buildingImage, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      },
    });

    // Animate cards - highlight active card
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.to(card, {
          scale: index === cardIndex ? 1.05 : 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  };

  return (
    <section className="team-section" ref={containerRef}>
      {/* Full-screen background image */}
      <div className="team-section-background">
        <img
          src="/Assets/teambg.jpg"
          alt="Modern residential complex background"
          className="team-section-bg-image"
        />
        {/* Overlay for better text readability */}
        <div className="team-section-overlay" />
      </div>

      {/* Main content */}
      <div className="team-section-container">
        <div className="team-section-grid">
          {/* Left side - Text content */}
          <div className="team-section-content">
            <h1 className="team-section-title">
              Meet The Strategic Minds
              <br /> Behind Our Real Estate Agency
              <br /> in Dubai
            </h1>

            <p className="team-section-description">
              At Arabian Estates, a full-service real estate agency in Dubai, we
              believe every successful property journey begins with the right
              team. Our expert property advisors, trusted real estate brokers,
              and dedicated mortgage specialists offer full support—from inquiry
              to closing.
            </p>
            <br />
            <p className="team-section-description">
              At Arabian Estates, a full-service real estate agency in Dubai, we
              believe every successful property journey begins with the right
              team. Our expert property advisors, trusted real estate brokers,
              and dedicated mortgage specialists offer full support—from inquiry
              to closing.
            </p>

            {/* Buttons */}
            <div className="team-section-buttons">
              <button className="team-section-btn team-section-btn-primary">
                Meet the team
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="none"
                >
                  <g clipPath="url(#clip0_746_37)">
                    <path
                      d="M1.37744 6.39823H13.3881L8.78902 2.01899C8.5482 1.78966 8.53887 1.40868 8.76825 1.16793C8.99733 0.92748 9.37842 0.91785 9.61954 1.14716L14.8719 6.14875C15.0991 6.37625 15.2247 6.6784 15.2247 7.0001C15.2247 7.3215 15.0991 7.62395 14.8613 7.86138L9.61925 12.8528C9.50275 12.9637 9.35344 13.0188 9.20413 13.0188C9.04519 13.0188 8.88625 12.9562 8.76795 12.832C8.53857 12.5913 8.5479 12.2106 8.78872 11.9813L13.4071 7.60198H1.37744C1.04511 7.60198 0.775391 7.33234 0.775391 7.0001C0.775391 6.66787 1.04511 6.39823 1.37744 6.39823Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_746_37">
                      <rect
                        width="15"
                        height="12.84"
                        fill="white"
                        transform="translate(0.5 0.580078)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>

              <button className="team-section-btn team-section-btn-secondary">
                Career
              </button>
            </div>
          </div>

          {/* Right side - Cards with building image */}
          <div className="team-section-visual">
            {/* Building image container */}
            <div className="team-section-building-container">
              <img
                ref={buildingImageRef}
                src={cardData[activeCard].image}
                alt="Modern building"
                className="team-section-building-image"
              />

              {/* Overlapping cards */}
              <div className="team-section-cards">
                {cardData.map((card, index) => (
                  <div
                    key={card.id}
                    ref={(el) => (cardsRef.current[index] = el)}
                    className={`team-section-card team-section-card-${
                      index + 1
                    } ${activeCard === index ? "active" : ""}`}
                    onClick={() => handleCardClick(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="team-section-card-content">
                      <div className="team-section-card-icon">{card.icon}</div>
                      <div className="team-section-card-text">
                        <h3 className="team-section-card-title">
                          {card.title}
                        </h3>
                        <p className="team-section-card-description">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
