import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../Styles/knowledge-hub-insight.css";

export default function KnowledgeHubInsight() {
  const knowledgeHubData = [
    {
      id: 1,
      image: "/Assets/insight.jpg",
      category: "● News letter",
      title: "Google just showed us the future",
      description:
        "A major advantage of working with Realty Group is the extensive experience and specialized knowledge they offer.",
    },
    {
      id: 2,
      image: "/Assets/insight.jpg",
      category: "● News letter",
      title: "The rise of AI in everyday business",
      description:
        "AI tools are transforming workflows, improving efficiency, and enabling smarter decisions.",
    },
    {
      id: 3,
      image: "/Assets/insight.jpg",
      category: "● News letter",
      title: "5 trends shaping the digital economy",
      description:
        "From blockchain to automation, these trends will define the next decade of growth.",
    },
    {
      id: 4,
      image: "/Assets/insight.jpg",
      category: "● News letter",
      title: "Why remote work is here to stay",
      description:
        "Companies are embracing hybrid models that combine flexibility with productivity.",
    },
    {
      id: 5,
      image: "/Assets/insight.jpg",
      category: "● News letter",
      title: "Sustainable tech innovations",
      description:
        "New technologies are paving the way for a greener and more sustainable future.",
    },
    {
      id: 6,
      image: "/Assets/insight.jpg",
      category: "● News letter",
      title: "How big data is changing marketing",
      description:
        "Data-driven insights are allowing businesses to tailor strategies and reach audiences effectively.",
    },
  ];
  return (
    <div className="knowledge-hub-insight">
      <h1>Insight</h1>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={2}
        loop={true}
      >
        {knowledgeHubData.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="slide-card">
              <img src={item.image} alt={item.title} />
              <div className="content">
                <span className="category">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
