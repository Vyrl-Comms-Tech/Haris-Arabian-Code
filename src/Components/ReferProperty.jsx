import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../Styles/ReferProperty.css";
import { useGSAP } from "@gsap/react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function ReferProperty() {
  // Content data for different slides
  const slides = [
    {
      id: 1,
      image: "/Assets/house.jpg",
      title:
        "Got friends looking for a new home ?<br /> Refer them to us & earn commission.",
      description:
        "Know someone searching for property? Share their details with us, sit back, and let our team handle everything. From property tours to final paperwork, we make the buying journey seamless. Once your referral becomes a proud homeowner, you'll receive your reward—simple, secure, and truly rewarding.",
    },
    {
      id: 2,
      image: "/Assets/elements.png",
      title:
        "Connect Friends with Premium Properties<br /> & Get Exclusive Rewards",
      description:
        "Your network is valuable! When you refer someone to our premium property collection, you're not just helping them find a home—you're earning substantial commissions. Our dedicated team ensures a white-glove experience for your referrals, maximizing both satisfaction and your earnings.",
    },
    {
      id: 3,
      image: "/Assets/figure.png",
      title: "Turn Your Connections into<br /> Profitable Partnerships",
      description:
        "Every successful referral is a win-win situation. Your friends get access to exclusive properties and expert guidance, while you earn competitive commissions. Our streamlined referral process makes it easy to track your earnings and celebrate each successful match.",
    },
    {
      id: 4,
      image: "/Assets/bg-video.png",
      title: "Build Wealth Through Smart<br /> Property Referrals",
      description:
        "Transform your social network into a revenue stream. With our comprehensive property portfolio and professional sales team, your referrals are in expert hands. From luxury apartments to family homes, we match every client with their perfect property while rewarding your efforts generously.",
    },
    {
      id: 5,
      image: "/Assets/house.jpg",
      title: "Your Referrals, Our Expertise<br /> Everyone Wins",
      description:
        "Join our referral program and become part of a success story. We provide all the tools, support, and expertise needed to turn your referrals into satisfied homeowners. With transparent tracking and guaranteed payouts, you can trust that every referral counts toward your financial goals.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTextAnimating, setIsTextAnimating] = useState(false);

  // Refs for animation targets
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRefs = useRef([]);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const bulletsRef = useRef([]);

  const currentSlide = slides[currentIndex];

  // Refs for animation targets

  // Update text content smoothly with improved animation
  const updateText = (index) => {
    if (
      titleRef.current &&
      descRef.current &&
      !isTextAnimating &&
      index !== currentIndex
    ) {
      setIsTextAnimating(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setIsTextAnimating(false);
        },
      });

      // First: Smooth fade out with stagger
      tl.to(titleRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      })
        .to(
          descRef.current,
          {
            y: -25,
            opacity: 0,
            duration: 0.35,
            ease: "power2.inOut",
          },
          "-=0.2"
        ) // Start slightly before title animation ends

        // Then: Update content after fade out is complete
        .call(() => {
          titleRef.current.innerHTML = slides[index].title;
          descRef.current.textContent = slides[index].description;
          setCurrentIndex(index); // Update index here after content change
        })

        // Finally: Smooth fade in with stagger
        .to(titleRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        })
        .to(
          descRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.25"
        ); // Start before title fade in completes
    }
  };

  // Update pagination bullets
  const updateBullets = (index) => {
    bulletsRef.current.forEach((bullet, i) => {
      if (bullet) {
        gsap.to(bullet, {
          scale: i === index ? 1.2 : 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  };

  // Handle bullet click
  const handleBulletClick = (index) => {
    if (index === currentIndex) return;

    const section = sectionRef.current;
    if (!section) return;

    // Calculate exact scroll position for the clicked slide
    const scrollPosition = section.offsetTop + index * window.innerHeight;

    gsap.to(window, {
      scrollTo: scrollPosition,
      duration: 1,
      ease: "power2.inOut",
    });
  };

  // Initialize on mount
  useEffect(() => {
    if (titleRef.current && descRef.current) {
      gsap.set([titleRef.current, descRef.current], {
        y: 0,
        opacity: 1,
      });
    }
  }, []);

  // Setup ScrollTrigger for smooth scroll animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || imageRefs.current.length === 0) return;

    // Store reference to the ScrollTrigger instance
    let scrollTriggerInstance = null;

    // Clear existing ScrollTriggers only for this component's trigger
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === section) {
        trigger.kill();
      }
    });

    // Initialize all images at the same position
    imageRefs.current.forEach((img, index) => {
      if (img) {
        gsap.set(img, {
          backgroundImage: `url(${slides[index].image})`,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // All start fully visible
          zIndex: slides.length - index, // Higher z-index for earlier images
        });
      }
    });

    // Track the current displayed slide independently
    let currentDisplayedSlide = 0;

    // Create main ScrollTrigger
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${window.innerHeight * (slides.length - 1)}`, // Fix: Only go to last slide, not beyond
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const totalProgress = self.progress;
        const direction = self.direction;

        // Calculate slide progress with better precision
        const exactSlidePosition = totalProgress * (slides.length - 1);
        const slideIndex = Math.max(
          0,
          Math.min(Math.floor(exactSlidePosition), slides.length - 2)
        );
        const slideProgress = exactSlidePosition - slideIndex;

        // Update images with proper reverse animation
        imageRefs.current.forEach((img, index) => {
          if (!img) return;

          if (index < slideIndex) {
            // Previous images - hidden based on direction
            gsap.set(img, {
              clipPath:
                direction === 1
                  ? "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" // Hidden at top when scrolling down
                  : "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", // Hidden at bottom when scrolling up
            });
          } else if (index === slideIndex) {
            // Current image - animating based on direction and progress
            if (direction === 1) {
              // Scrolling DOWN - image slides DOWN (correct!)
              gsap.set(img, {
                clipPath: `polygon(0% ${slideProgress * 100}%, 100% ${
                  slideProgress * 100
                }%, 100% 100%, 0% 100%)`,
              });
            } else {
              // Scrolling UP - image slides UP (fix this!)
              gsap.set(img, {
                // clipPath: `polygon(0% 0%, 100% 0%, 100% ${(1 - slideProgress) * 100}%, 0% ${(1 - slideProgress) * 100}%)`
                clipPath: `polygon(0% ${slideProgress * 100}%, 100% ${
                  slideProgress * 100
                }%, 100% 100%, 0% 100%)`,
              });
            }
          } else {
            // Future images - fully visible (ready behind)
            gsap.set(img, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            });
          }
        });

        // Calculate which slide should be displayed based on overall progress
        let targetSlide = Math.round(exactSlidePosition);
        targetSlide = Math.max(0, Math.min(targetSlide, slides.length - 1));

        // Update text and pagination only when the target slide actually changes
        if (targetSlide !== currentDisplayedSlide && !isTextAnimating) {
          console.log(
            `Changing from slide ${currentDisplayedSlide} to slide ${targetSlide} (Progress: ${totalProgress.toFixed(
              3
            )}, Direction: ${direction})`
          );

          currentDisplayedSlide = targetSlide;
          setCurrentIndex(targetSlide);
          updateText(targetSlide);
          updateBullets(targetSlide);
        }
      },

      // Reset on refresh
      onRefresh: () => {
        imageRefs.current.forEach((img, index) => {
          if (img) {
            gsap.set(img, {
              backgroundImage: `url(${slides[index].image})`,
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              zIndex: slides.length - index,
            });
          }
        });
        currentDisplayedSlide = 0;
        setCurrentIndex(0);
        setIsTextAnimating(false);
        updateText(0);
        updateBullets(0);
      },
    });

    // Initialize first state
    currentDisplayedSlide = 0;
    setCurrentIndex(0);
    updateText(0);
    updateBullets(0);

    // Cleanup function - kill only this component's ScrollTrigger instance
    return () => {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }

      // Reset scroll position to prevent conflicts with other animations
      ScrollTrigger.refresh();
    };
  }, [slides.length]);

  // Additional cleanup effect for component unmount or route changes
  useEffect(() => {
    return () => {
      // Kill only ScrollTriggers related to this component when component unmounts
      const section = sectionRef.current;
      if (section) {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === section) {
            trigger.kill();
          }
        });
      }
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <>
      <div
        ref={sectionRef}
        className="refferproperty-section"
        id="referproperty-section"
        style={{
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="header" id="padded-dark-header">
          <div className="header-left">
            <p className="property-label">Referrer</p>
            <h1 className="main-title">
              Help Friends & Family Find Their
              <br />
              Dream Home Get Rewarded
            </h1>
          </div>
        </div>

        <div className="reffersection-body">
          <div className="reffersection-left">
            <div ref={imageContainerRef} className="image-container">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  ref={(el) => (imageRefs.current[index] = el)}
                  className="refer-image"
                  style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="reffersection-right">
            <h1
              ref={titleRef}
              className="reffer-title"
              dangerouslySetInnerHTML={{ __html: currentSlide.title }}
            />

            <h4 ref={descRef} className="reffer-desc">
              {currentSlide.description}
            </h4>

            <button className="refer-button">Refer Now & Earn!</button>

            <div className="refferpaginationsection">
              {slides.map((_, index) => (
                <div
                  key={index}
                  ref={(el) => (bulletsRef.current[index] = el)}
                  className={`reffer-bullet ${
                    index === currentIndex ? "reffer-bullet-active" : ""
                  }`}
                  onClick={() => handleBulletClick(index)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={`small-bullet ${
                      index === currentIndex ? "small-bullet-active" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content after pinned section */}
      
    </>
  );
}

export default ReferProperty;