import React, { useEffect, useRef } from "react";
import "../Styles/TrustedPartner.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function TrustedPartner() {
  const containerRef = useRef(null);
  const scrollTriggerInstancesRef = useRef([]);

  // Helper to track ScrollTrigger instances
  const trackScrollTrigger = (instance) => {
    if (instance) {
      scrollTriggerInstancesRef.current.push(instance);
    }
    return instance;
  };

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Clear any existing ScrollTriggers for this component
      scrollTriggerInstancesRef.current.forEach(st => st.kill());
      scrollTriggerInstancesRef.current = [];

      const animationPattern = [
        "tpbox1",
        "tpbox5",
        "tpbox2",
        "tpbox6",
        "tpbox3",
      ];
      
      const boxes = animationPattern.map((id) =>
        container.querySelector(`#${id}`)
      ).filter(Boolean); // Filter out null elements

      if (boxes.length === 0) return;

      const rightBoxes = ["tpbox5", "tpbox6"];
      const leftBoxes = ["tpbox1", "tpbox2", "tpbox3"];

      // 🎲 Generate random Y offsets
      const yOffsetMap = {};
      animationPattern.forEach((id) => {
        yOffsetMap[id] = gsap.utils.random(-200, 200);
      });

      // Set initial state - scope to this component's boxes only
      gsap.set(boxes, {
        scale: 2,
        opacity: 0,
      });

      // Create main ScrollTrigger and track it
      const mainScrollTrigger = trackScrollTrigger(ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 1,
        id: "trusted-partner-main", // Add ID for easier debugging
        onUpdate: (self) => {
          const progress = self.progress;

          boxes.forEach((box, index) => {
            if (!box) return;

            const delay = index * 0.1;
            const adjustedProgress = Math.max(
              0,
              Math.min(1, (progress - delay) / 0.8)
            );

            const boxId = box.id;
            const customYOffset = yOffsetMap[boxId] || 0;

            let exitX = 0;
            let exitY = customYOffset * adjustedProgress;

            if (leftBoxes.includes(boxId)) {
              exitX = -800 * adjustedProgress;
            } else if (rightBoxes.includes(boxId)) {
              exitX = 800 * adjustedProgress;
            }

            const scaleValue = 1 + 3 * adjustedProgress;
            const opacityValue =
              adjustedProgress < 0.1 ? adjustedProgress * 10 : 1;
            const zValue = 2500 * adjustedProgress;

            gsap.set(box, {
              scale: scaleValue,
              opacity: opacityValue,
              x: exitX,
              y: exitY,
              z: zValue,
              transformOrigin: "center center",
            });
          });
        },
      }));

      // Animate heading with scoped trigger
      const headingElement = container.querySelector("h1");
      if (headingElement) {
        gsap.fromTo(
          headingElement,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: trackScrollTrigger(ScrollTrigger.create({
              trigger: container,
              start: "top center",
              end: "20% center",
              scrub: 1,
              id: "trusted-partner-heading", // Add ID for easier debugging
            })),
          }
        );
      }

      // Animate detail box with scoped trigger
      const detailBox = container.querySelector(".tp-detailsbox");
      if (detailBox) {
        gsap.fromTo(
          detailBox,
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
            scrollTrigger: trackScrollTrigger(ScrollTrigger.create({
              trigger: container,
              start: "top center",
              end: "20% center",
              scrub: 1,
              id: "trusted-partner-details", // Add ID for easier debugging
            })),
          }
        );
      }

      // Return cleanup function that only affects this component's ScrollTriggers
      return () => {
        scrollTriggerInstancesRef.current.forEach(st => {
          if (st && st.kill) {
            st.kill();
          }
        });
        scrollTriggerInstancesRef.current = [];
      };
    },
    { scope: containerRef, dependencies: [] } // Add dependencies array
  );

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      scrollTriggerInstancesRef.current.forEach(st => {
        if (st && st.kill) {
          st.kill();
        }
      });
      scrollTriggerInstancesRef.current = [];
    };
  }, []);

  return (
    <div className="TrustedPartner" ref={containerRef}>
      <div className="tp-section1">
        <h1>
          Your Trusted Partner <br />{" "}
          <span id="colored-text">in Real Estate</span>
        </h1>
        <div className="box" id="tpbox1">
          <img src="/Assets/box1.jpg" alt="" />
        </div>
        <div className="box" id="tpbox2">
          <img src="/Assets/i1.jpg" alt="" />
        </div>
        <div className="box" id="tpbox3">
          <img src="/Assets/i2.jpg" alt="" />
        </div>
      </div>
      <div className="tp-section2">
        <div className="tp-detailsbox">
          <h6>
            As a top real estate agency in Dubai, Arabian Estates is trusted by
            residents and <br /> investors for more than just listings—we offer
            tailored property advisory services.<br /> Whether you're looking for
            ready properties, off-plan investments, or rental options,<br /> our
            experienced brokers provide informed guidance at every step. We
            simplify buying, <br /> selling, renting, or investing in real estate
            across the UAE, combining local expertise<br /> with a client-first
            approach. With us, you can make smart property decisions with<br />
            clarity and confidence.
          </h6>
          <div className="buttonsrow">
            <button className="sale-button" id="partner-sale-btn">
              About us
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <g clipPath="url(#clip0_529_887)">
                  <path
                    d="M0.877444 5.89829H12.8881L8.28902 1.51905C8.0482 1.28972 8.03887 0.90874 8.26825 0.66799C8.49733 0.427541 8.87842 0.417911 9.11954 0.647226L14.3719 5.64881C14.5991 5.87631 14.7247 6.17846 14.7247 6.50016C14.7247 6.82156 14.5991 7.12401 14.3613 7.36144L9.11925 12.3528C9.00275 12.4638 8.85344 12.5189 8.70413 12.5189C8.54519 12.5189 8.38625 12.4563 8.26795 12.3321C8.03857 12.0913 8.0479 11.7106 8.28872 11.4813L12.9071 7.10204H0.877444C0.54511 7.10204 0.275391 6.8324 0.275391 6.50016C0.275391 6.16793 0.54511 5.89829 0.877444 5.89829Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_529_887">
                    <rect
                      width="15"
                      height="12.84"
                      fill="white"
                      transform="translate(0 0.0800171)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <button className="rent-button" id="partner-contact-btn">
              Contact us
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <g clipPath="url(#clip0_529_892)">
                  <path
                    d="M0.877444 5.89829H12.8881L8.28902 1.51905C8.0482 1.28972 8.03887 0.90874 8.26825 0.66799C8.49733 0.427541 8.87842 0.417911 9.11954 0.647226L14.3719 5.64881C14.5991 5.87631 14.7247 6.17846 14.7247 6.50016C14.7247 6.82156 14.5991 7.12401 14.3613 7.36144L9.11925 12.3528C9.00275 12.4638 8.85344 12.5189 8.70413 12.5189C8.54519 12.5189 8.38625 12.4563 8.26795 12.3321C8.03857 12.0913 8.0479 11.7106 8.28872 11.4813L12.9071 7.10204H0.877444C0.54511 7.10204 0.275391 6.8324 0.275391 6.50016C0.275391 6.16793 0.54511 5.89829 0.877444 5.89829Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_529_892">
                    <rect
                      width="15"
                      height="12.84"
                      fill="white"
                      transform="translate(0 0.0800171)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
        <div className="box" id="tpbox5">
          <img src="/Assets/box1.jpg" alt="" />
        </div>
        <div className="box" id="tpbox6">
          <img src="/Assets/i1.jpg" alt="" />
        </div>
      </div>
    </div>
  );
}

export default TrustedPartner;