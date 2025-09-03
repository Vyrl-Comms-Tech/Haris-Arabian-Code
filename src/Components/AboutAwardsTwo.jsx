import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../Styles/about-awards-two.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const AboutAwardsTwo = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    // Get the scroll distance needed
    const scrollDistance = content.scrollWidth - container.clientWidth +100;

    // Create horizontal scroll animation
    const horizontalScroll = gsap.to(content, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Optional: Add any additional animations during scroll
        },
      },
    });

    // Cleanup function
    return () => {
      horizontalScroll.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <div className="about-awards-two" ref={containerRef}>
        <h1 className="about-awards-two-title">Awards & Recognition</h1>
        <div className="about-awards-two-content" ref={contentRef}>
          {/* 1 */}
          <div className="about-awards-two-contaienr1">
            {/* left */}
            <div className="about-awards-two-contaienr-left">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim .
              </p>
            </div>
            {/* right */}
            <div className="about-awards-two-contaienr-right">
              <div></div>
            </div>
          </div>
          {/* 2 */}
          <div className="about-awards-two-contaienr2">
            {/* left */}
            <div className="about-awards-two-contaienr-left">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim .
              </p>
            </div>
            {/* right */}
            <div className="about-awards-two-contaienr-right">
              <div></div>
            </div>
          </div>
          {/* 3 */}
          <div className="about-awards-two-contaienr3">
            {/* left */}
            <div className="about-awards-two-contaienr-left">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim .
              </p>
            </div>
            {/* right */}
            <div className="about-awards-two-contaienr-right">
              <div></div>
            </div>
          </div>
        
        </div>
        <div className="about-awards-two-svg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="171"
            height="129"
            viewBox="0 0 171 129"
            fill="none"
            className=""
          >
            <circle cx="86" cy="114" r="15" fill="#808B92" />
            <path
              d="M3 1H168C169.105 1 170 1.89543 170 3V65.6133C170 66.7178 169.105 67.6133 168 67.6133H101.406C99.8553 67.6133 98.4441 68.5101 97.7852 69.9141L86.4883 93.9844C85.7791 95.4955 83.64 95.5238 82.8906 94.0322L70.7246 69.8174C70.0457 68.466 68.6617 67.6133 67.1494 67.6133H3C1.89548 67.6133 1.00008 66.7178 1 65.6133V3C1 1.89543 1.89543 1 3 1Z"
              stroke="#808B92"
              stroke-width="2"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="171"
            height="129"
            viewBox="0 0 171 129"
            fill="none"
            className=""
          >
            <circle cx="86" cy="114" r="15" fill="#808B92" />
            <path
              d="M3 1H168C169.105 1 170 1.89543 170 3V65.6133C170 66.7178 169.105 67.6133 168 67.6133H101.406C99.8553 67.6133 98.4441 68.5101 97.7852 69.9141L86.4883 93.9844C85.7791 95.4955 83.64 95.5238 82.8906 94.0322L70.7246 69.8174C70.0457 68.466 68.6617 67.6133 67.1494 67.6133H3C1.89548 67.6133 1.00008 66.7178 1 65.6133V3C1 1.89543 1.89543 1 3 1Z"
              stroke="#808B92"
              stroke-width="2"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="171"
            height="129"
            viewBox="0 0 171 129"
            fill="none"
            className=""
          >
            <circle cx="86" cy="114" r="15" fill="#808B92" />
            <path
              d="M3 1H168C169.105 1 170 1.89543 170 3V65.6133C170 66.7178 169.105 67.6133 168 67.6133H101.406C99.8553 67.6133 98.4441 68.5101 97.7852 69.9141L86.4883 93.9844C85.7791 95.4955 83.64 95.5238 82.8906 94.0322L70.7246 69.8174C70.0457 68.466 68.6617 67.6133 67.1494 67.6133H3C1.89548 67.6133 1.00008 66.7178 1 65.6133V3C1 1.89543 1.89543 1 3 1Z"
              stroke="#808B92"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default AboutAwardsTwo;
