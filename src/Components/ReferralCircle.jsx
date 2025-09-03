import React, { useRef, useState } from "react";
import "../Styles/referral-circle.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ReferralCircle = () => {
  const sectionRef = useRef();
  const rotatingCircleRef = useRef();
  const circleTextRefs = useRef([]);
  const textContainerRef = useRef();
  const paginationRefs = useRef([]);
  const ballRefs = useRef([]);
  const [currentSlide, setCurrentSlide] = useState(1);

  const slideData = {
    1: {
      title: "Help Friends Find Property",
      subtitle: "Step One",
      description:
        "Know someone searching for property? Share their details with us, sit back, and let our team handle everything. From property tours to final paperwork, we make the buying journey seamless.",
    },
    2: {
      title: "Professional Consultation",
      subtitle: "Step Two",
      description:
        "Our expert team will provide comprehensive consultation to understand your friend's needs and preferences. We ensure every detail is covered for a perfect property match.",
    },
    3: {
      title: "Property Tours & Selection",
      subtitle: "Step Three",
      description:
        "We arrange personalized property tours based on the requirements. Our agents will guide through the best options available in their preferred locations.",
    },
    4: {
      title: "Seamless Paperwork",
      subtitle: "Final Step",
      description:
        "Once the perfect property is selected, we handle all the legal documentation and paperwork. Your friends can relax while we complete the entire process.",
    },
  };

  useGSAP(() => {
    function updateActiveStates(slideNumber) {
      // Always update currentSlide state first
      setCurrentSlide(slideNumber);

      // Update pagination with force update
      paginationRefs.current.forEach((span, index) => {
        if (span) {
          if (index + 1 === slideNumber) {
            gsap.set(span, {
              backgroundColor: "#011825",
              color: "#FFFFFF",
              scale: 1.3,
            });
          } else {
            gsap.set(span, {
              backgroundColor: "#FFFFFF",
              color: "#011825",
              scale: 1,
            });
          }
        }
      });

      // Update circle numbers with force update
      circleTextRefs.current.forEach((number, index) => {
        if (number) {
          if (index + 1 === slideNumber) {
            gsap.set(number, {
              opacity: 1,
              scale: 1.1,
              color: "#011825",
            });
          } else {
            gsap.set(number, {
              opacity: 0.4,
              scale: 1,
              color: "#011825",
            });
          }
        }
      });
      // Update circle numbers with force update
      ballRefs.current.forEach((ball, index) => {
        if (ball) {
          if (index + 1 === slideNumber) {
            gsap.set(ball, {
              opacity: 1,
              scale: 1.1,
              backgroundColor: "#011825",
            });
          } else {
            gsap.set(ball, {
              opacity: 0.4,
              scale: 1,
              backgroundColor: "#011825",
            });
          }
        }
      });

      // Update text content instantly
      const data = slideData[slideNumber];
      const textContainer = textContainerRef.current;

      if (textContainer && data) {
        const h1 = textContainer.querySelector("h1");
        const subtitle = textContainer.querySelector(
          ".referral-circle-text-p1"
        );
        const description = textContainer.querySelector("p:last-child");

        if (h1) h1.textContent = data.title;
        if (subtitle) subtitle.textContent = data.subtitle;
        if (description) description.textContent = data.description;
      }
    }

    // Initialize first slide
    updateActiveStates(1);

    // Create main ScrollTrigger with perfect synchronization
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=4000vh", // Increased scroll distance for slower animation
      pin: true,
      scrub: 0.002, // Slower scrub for more controlled animation
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress; // 0 to 1

        // Calculate exact slide number based on progress with proper boundaries
        let targetSlide;
        if (progress <= 0.25) {
          targetSlide = 1;
        } else if (progress <= 0.5) {
          targetSlide = 2;
        } else if (progress <= 0.75) {
          targetSlide = 3;
        } else {
          targetSlide = 4;
        }

        // Handle edge cases for perfect reverse scrolling
        if (progress === 0) targetSlide = 1;
        if (progress === 1) targetSlide = 4;

        // Calculate rotation: 270 degrees total for 4 slides
        const rotation = progress * 270;

        // Rotate the circle
        if (rotatingCircleRef.current) {
          gsap.set(rotatingCircleRef.current, {
            rotation: rotation,
            ease: "none",
          });
        }

        // Counter-rotate text to keep upright
        circleTextRefs.current.forEach((text) => {
          if (text) {
            gsap.set(text, {
              rotation:  -rotation,
              ease: "none",
            });
          }
        });

        // Force update states every time to ensure reverse scrolling works
        updateActiveStates(targetSlide);
      },
      onRefresh: () => {
        // Reset to slide 1 on refresh
        updateActiveStates(1);
      },
    });

    // Enhanced pagination click functionality
    paginationRefs.current.forEach((span, index) => {
      if (span) {
        const clickHandler = () => {
          const slideNumber = index + 1;
          // Calculate exact scroll position for target slide
          const targetProgress = (slideNumber - 1) / 4; // 0, 0.25, 0.5, 0.75 for slides 1,2,3,4
          const totalScrollDistance = window.innerHeight * 6; // 600vh
          const targetScrollPosition =
            sectionRef.current.offsetTop + targetProgress * totalScrollDistance;

          gsap.to(window, {
            duration: 2, // Slower click navigation
            scrollTo: targetScrollPosition,
            ease: "power2.inOut",
          });

          // Visual feedback
          gsap.to(span, {
            duration: 0.2,
            scale: 1.4,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          });
        };

        span.addEventListener("click", clickHandler);
        span._clickHandler = clickHandler;
      }
    });

    // Entrance animations
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    if (rotatingCircleRef.current) {
      entranceTl.from(rotatingCircleRef.current, {
        duration: 1.2,
        scale: 0.8,
        opacity: 0,
        ease: "power2.out",
      });
    }

    if (textContainerRef.current) {
      entranceTl.from(
        textContainerRef.current,
        {
          duration: 1,
          x: -100,
          opacity: 0,
          ease: "power2.out",
        },
        "-=0.8"
      );
    }

    entranceTl.from(
      paginationRefs.current.filter(Boolean),
      {
        duration: 0.8,
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        ease: "back.out(1.7)",
      },
      "-=0.6"
    );

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Remove event listeners
      paginationRefs.current.forEach((span) => {
        if (span && span._clickHandler) {
          span.removeEventListener("click", span._clickHandler);
        }
      });
    };
  }, []);

  return (
    <>
      <div className="referral-circle" ref={sectionRef}>
        <div className="referral-circle-circle" ref={rotatingCircleRef}>
          {[1, 2, 3, 4].map((num, index) => (
            <div key={index} className={`referral-circle-circle${num}`}>
              <div
                className="referral-circle-circle1-h1"
                ref={(el) => (circleTextRefs.current[index] = el)}
              >
                {`0${num}`}
              </div>
              <div
                className="circle-ball"
                ref={(el) => (ballRefs.current[index] = el)}
              ></div>
            </div>
          ))}
        </div>

        <div className="referral-circle-text" ref={textContainerRef}>
          <h1>Help Friends Find Property</h1>
          <p className="referral-circle-text-p1">Step One</p>
          <p>
            Know someone searching for property? Share their details with us,
            sit back, and let our team handle everything. From property tours to
            final paperwork, we make the buying journey seamless.
          </p>
        </div>

        <div className="referral-circle-pagination">
          {[1, 2, 3, 4].map((num, index) => (
            <span
              key={index}
              ref={(el) => (paginationRefs.current[index] = el)}
            >
              {`0${num}`}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReferralCircle;
