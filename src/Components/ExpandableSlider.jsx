import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import "../Styles/ExpandableSlider.css";
import "../Styles/ProjectSlider.css";
import "../Styles/HeroOffplanProperty.css";

function ExpandableSlider() {
  const hoverImageRef = useRef(null);
  const navigate = useNavigate();
  const itemsRef = useRef([]);
  const eventListenersRef = useRef([]);
  const animationsRef = useRef([]); // Track specific animations

  // Cleanup function to remove only THIS component's animations and listeners
  const cleanup = useCallback(() => {
    // Kill only tracked animations instead of all animations globally
    animationsRef.current.forEach(animation => {
      if (animation && animation.kill) {
        animation.kill();
      }
    });
    animationsRef.current = [];

    // Remove all event listeners
    eventListenersRef.current.forEach(({ element, event, handler }) => {
      if (element && element.removeEventListener) {
        element.removeEventListener(event, handler);
      }
    });

    // Clear the event listeners array
    eventListenersRef.current = [];
  }, []);

  // Helper to track animations
  const trackAnimation = useCallback((animation) => {
    if (animation) {
      animationsRef.current.push(animation);
    }
    return animation;
  }, []);

  // Add event listener helper function
  const addEventListenerWithCleanup = useCallback((element, event, handler) => {
    if (element && element.addEventListener) {
      element.addEventListener(event, handler);
      eventListenersRef.current.push({ element, event, handler });
    }
  }, []);

  useEffect(() => {
    const hoverImage = hoverImageRef.current;
    if (!hoverImage) return;

    // Clear any existing setup
    cleanup();

    const items = hoverImage.querySelectorAll(".hover-image-item");
    itemsRef.current = Array.from(items);

    if (items.length === 0) return;

    items.forEach((item, index) => {
      const textElement = item.querySelector(".hover-image-text h2");
      const description = item.querySelector("#project-details-holder p");
      const btn = item.querySelector("#project-detail-btn");

      if (!textElement || !description || !btn) return;

      // Set initial state for text elements and track them
      trackAnimation(gsap.set(textElement, {
        opacity: 0,
        y: 20,
      }));

      // Set initial state for description and track them
      trackAnimation(gsap.set(description, {
        opacity: 0,
        y: 20,
      }));

      // Set initial state for button - centered position and track them
      trackAnimation(gsap.set(btn, {
        left: "50%",
        xPercent: -50,
      }));

      // Create hover animation function for this specific item
      const handleMouseEnter = () => {
        // Kill only animations on elements within this component
        items.forEach((allItems) => {
          const allBtn = allItems.querySelector("#project-detail-btn");
          const allText = allItems.querySelector(".hover-image-text h2");
          const allDesc = allItems.querySelector("#project-details-holder p");
          
          // Kill only specific element animations, not global
          if (allBtn) gsap.killTweensOf(allBtn);
          if (allText) gsap.killTweensOf(allText);
          if (allDesc) gsap.killTweensOf(allDesc);
          gsap.killTweensOf(allItems);
        });

        // Expand current item and track animation
        trackAnimation(gsap.to(item, {
          width: "40%",
          duration: 0.6,
          ease: "none",
        }));

        // Move current button to left and track animation
        trackAnimation(gsap.to(btn, {
          left: "0px",
          xPercent: 0,
          duration: 0.9,
          ease: "power2.out",
        }));

        // Show current item's text and track animation
        trackAnimation(gsap.to(textElement, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.2,
          ease: "power2.out",
        }));

        // Show current item's description and track animation
        trackAnimation(gsap.to(description, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.9,
          ease: "power2.out",
        }));

        // Handle other items
        items.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherBtn = otherItem.querySelector("#project-detail-btn");
            const otherText = otherItem.querySelector(".hover-image-text h2");
            const otherDesc = otherItem.querySelector(
              "#project-details-holder p"
            );

            // Shrink other items and track animation
            trackAnimation(gsap.to(otherItem, {
              width: "20%",
              duration: 0.8,
              ease: "power2.out",
            }));

            // Center other buttons and track animation
            if (otherBtn) {
              trackAnimation(gsap.to(otherBtn, {
                left: "50%",
                xPercent: -50,
                duration: 0.6,
                ease: "power2.out",
              }));
            }

            // Hide other items' content and track animation
            if (otherText && otherDesc) {
              trackAnimation(gsap.to([otherText, otherDesc], {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: "power2.in",
              }));
            }
          }
        });
      };

      // Create mouseout animation - simplified
      const handleMouseLeave = (event) => {
        // Basic mouse leave handling if needed
      };

      // Add event listeners with cleanup tracking
      addEventListenerWithCleanup(item, "mouseenter", handleMouseEnter);
      addEventListenerWithCleanup(item, "mouseleave", handleMouseLeave);
    });

    // Add container-level mouse leave to reset everything when leaving the entire slider
    const handleContainerLeave = () => {
      // Kill only animations on elements within this component
      items.forEach((allItems) => {
        const allBtn = allItems.querySelector("#project-detail-btn");
        const allText = allItems.querySelector(".hover-image-text h2");
        const allDesc = allItems.querySelector("#project-details-holder p");
        
        if (allBtn) gsap.killTweensOf(allBtn);
        if (allText) gsap.killTweensOf(allText);
        if (allDesc) gsap.killTweensOf(allDesc);
        gsap.killTweensOf(allItems);
      });

      // Reset all items to equal width and track animation
      trackAnimation(gsap.to(items, {
        width: "25%",
        duration: 0.6,
        ease: "power2.out",
      }));

      // Reset all buttons to center and track animations
      items.forEach((resetItem) => {
        const resetBtn = resetItem.querySelector("#project-detail-btn");
        if (resetBtn) {
          trackAnimation(gsap.to(resetBtn, {
            left: "50%",
            xPercent: -50,
            duration: 0.6,
            ease: "power2.out",
          }));
        }
      });

      // Hide all text and descriptions and track animations
      items.forEach((resetItem) => {
        const resetText = resetItem.querySelector(".hover-image-text h2");
        const resetDesc = resetItem.querySelector("#project-details-holder p");
        if (resetText && resetDesc) {
          trackAnimation(gsap.to([resetText, resetDesc], {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: "power2.in",
          }));
        }
      });
    };

    // Add the container leave event with cleanup tracking
    addEventListenerWithCleanup(hoverImage, "mouseleave", handleContainerLeave);

    // Cleanup function
    return cleanup;
  }, [cleanup, addEventListenerWithCleanup, trackAnimation]);

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Project data with matching IDs from DynamicSection
  const projectData = [
    {
      id: "innovative-design",
      title: "Innovative Design",
      description:
        "Welcome To Jaikor GP, A Leading Name In Construction Company, Dedicated To Delivering Exceptional Infrastructure Solutions",
      image: "/Assets/i1.jpg",
    },
    {
      id: "urban-development",
      title: "Urban Development",
      description:
        "Welcome To Jaikor GP, A Leading Name In Construction Company, Dedicated To Delivering Exceptional Infrastructure Solutions",
      image: "/Assets/i2.jpg",
    },
    {
      id: "sustainable-projects",
      title: "Sustainable Projects",
      description:
        "Welcome To Jaikor GP, A Leading Name In Construction Company, Dedicated To Delivering Exceptional Infrastructure Solutions",
      image: "/Assets/i3.jpg",
    },
    {
      id: "structural-excellence",
      title: "Structural Excellence",
      description:
        "Welcome To Jaikor GP, A Leading Name In Construction Company, Dedicated To Delivering Exceptional Infrastructure Solutions",
      image: "/Assets/i4.jpg",
    },
  ];

  const handleProjectClick = useCallback(
    (projectId) => {
      // Add a small delay before navigation to allow any animations to complete
      setTimeout(() => {
        navigate(`/dynamic/${projectId}`);
      }, 300);
    },
    [navigate]
  );

  return (
    <>
      <div className="ExpandableSlider">
        <div className="Expandableheader">
          <div className="header" id="padded-header">
            <div className="header-left">
              <p className="property-label">Off plans</p>
              <h1 className="main-title">
                Live or Invest in Dubai's Most
                <br /> Sought-After Real Estate Locations
              </h1>
              <p id="deatils-text">
                We specialize in high-performing and lifestyle-rich locations,
                ideal for residential and
                <br /> investment purposes
              </p>
            </div>
          </div>
        </div>
        <div className="main-slider-content">
          <div className="main-slider">
            <div className="hover-image-main-container">
              <div className="hover-image-container" ref={hoverImageRef}>
                {projectData.map((project, index) => (
                  <div
                    key={`project-${project.id}-${index}`}
                    className="hover-image-item"
                    onClick={() => handleProjectClick(project.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      onError={(e) => {
                        e.target.src = "/Assets/placeholder.jpg"; // Add a fallback image
                      }}
                    />
                    <div className="hover-image-text">
                      <h2>{project.title}</h2>
                      <div id="project-details-holder">
                        <div className="preject-details-row">
                          <button id="project-detail-btn">
                            See More
                          </button>
                        </div>
                        <p>{project.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpandableSlider;