import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "../Styles/about-people.css";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
gsap.registerPlugin(Draggable);

const AboutPeople = () => {
  const carouselRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const draggableRef = useRef(null);

  // Sample team data - replace with your actual data
  const teamMembers = [
    { id: 1, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 2, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 3, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 4, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 5, name: "Sarah Johnson", image: "/Assets/people-card.png" },
    { id: 6, name: "Mike Chen", image: "/Assets/people-card.png" },
    { id: 7, name: "Emily Davis", image: "/Assets/people-card.png" },
    { id: 8, name: "Alex Smith", image: "/Assets/people-card.png" },
    { id: 9, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 10, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 11, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 12, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 13, name: "Sarah Johnson", image: "/Assets/people-card.png" },
    { id: 14, name: "Mike Chen", image: "/Assets/people-card.png" },
    { id: 15, name: "Emily Davis", image: "/Assets/people-card.png" },
    { id: 16, name: "Alex Smith", image: "/Assets/people-card.png" },
    { id: 17, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 18, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 19, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 20, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 21, name: "Sarah Johnson", image: "/Assets/people-card.png" },
    { id: 22, name: "Mike Chen", image: "/Assets/people-card.png" },
    { id: 23, name: "Emily Davis", image: "/Assets/people-card.png" },
    { id: 24, name: "Alex Smith", image: "/Assets/people-card.png" },
    { id: 25, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 26, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 27, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 28, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 29, name: "Sarah Johnson", image: "/Assets/people-card.png" },
    { id: 30, name: "Mike Chen", image: "/Assets/people-card.png" },
    { id: 31, name: "Emily Davis", image: "/Assets/people-card.png" },
    { id: 32, name: "Alex Smith", image: "/Assets/people-card.png" },
    { id: 33, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 34, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 35, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 36, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 37, name: "Sarah Johnson", image: "/Assets/people-card.png" },
    { id: 38, name: "Mike Chen", image: "/Assets/people-card.png" },
    { id: 39, name: "Emily Davis", image: "/Assets/people-card.png" },
    { id: 40, name: "Alex Smith", image: "/Assets/people-card.png" },
    { id: 41, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 42, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 43, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 44, name: "Daniel Mokhtari", image: "/Assets/people-card.png" },
    { id: 45, name: "Sarah Johnson", image: "/Assets/people-card.png" },
    { id: 46, name: "Mike Chen", image: "/Assets/people-card.png" },
    { id: 47, name: "Emily Davis", image: "/Assets/people-card.png" },
    { id: 48, name: "Alex Smith", image: "/Assets/people-card.png" },
  ];

  // Duplicate items for seamless loop
  const duplicatedMembers = [...teamMembers, ...teamMembers];

  useGSAP(() => {
    const carousel = carouselRef.current;
    const container = containerRef.current;

    if (!carousel || !container) return;

    const cards = carousel.querySelectorAll(".team-card");
    const cardWidth = 435; // Card width + gap
    const totalWidth = cardWidth * teamMembers.length;

    // Set initial positions
    gsap.set(carousel, { x: 0 });

    // Create infinite animation
    const createAnimation = () => {
      return gsap.to(carousel, {
        x: -totalWidth,
        duration: totalWidth / 50, // Adjust speed here
        ease: "none",
        repeat: -1,
        onRepeat: () => {
          gsap.set(carousel, { x: 0 });
        },
      });
    };

    animationRef.current = createAnimation();

    // Create draggable
    draggableRef.current = Draggable.create(carousel, {
      type: "x",
      bounds: { minX: -totalWidth, maxX: cardWidth },
      inertia: true,
      onPress: () => {
        // Pause animation on drag start
        animationRef.current.pause();
      },
      onDrag: function () {
        // Handle infinite loop during drag
        if (this.x <= -totalWidth) {
          gsap.set(carousel, { x: this.x + totalWidth });
          this.update();
        } else if (this.x >= 0) {
          gsap.set(carousel, { x: this.x - totalWidth });
          this.update();
        }
      },
      onThrowComplete: () => {
        // Resume animation after drag
        const currentX = gsap.getProperty(carousel, "x");
        const progress = Math.abs(currentX) / totalWidth;

        animationRef.current.progress(progress);
        animationRef.current.resume();
      },
    })[0];

    // Pause on hover
    const handleMouseEnter = () => animationRef.current.pause();
    const handleMouseLeave = () => animationRef.current.resume();

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationRef.current) animationRef.current.kill();
      if (draggableRef.current) draggableRef.current.kill();
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div className="about-people">
        <div className="about-people-text">
          <div className="about-people-heading-left">
            <h3>Team</h3>
            <h1>Our People</h1>
          </div>
          <button>Meet the team</button>
        </div>

        <div className="carousel-container" ref={containerRef}>
          <div className="carousel-track" ref={carouselRef}>
            {duplicatedMembers.map((member, index) => (
              <div key={`${member.id}-${index}`} className="team-card">
                <div className="card-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="card-content3">
                  <h4>{member.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPeople;
