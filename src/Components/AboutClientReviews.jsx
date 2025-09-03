import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "../Styles/about-client-reviews.css";

const AboutClientReviews = () => {
  const reviews = [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enimLorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim",
      name: "Mariam Al Meraikhi",
      position: "CEO of etc",
      image: "https://placehold.co/85",
      rating: 3
    },
    {
      id: 2,
      text: "Excellent service and outstanding results! The team exceeded our expectations in every aspect. Professional, reliable, and innovative approach to solving complex business challenges. Highly recommend their services to anyone looking for quality solutions.",
      name: "Ahmed Hassan",
      position: "CTO of TechCorp",
      image: "https://placehold.co/85",
      rating: 5
    },
    {
      id: 3,
      text: "Working with this team was a game-changer for our business. Their expertise and dedication helped us achieve goals we thought were impossible. The communication was clear, timely, and professional throughout the entire project.",
      name: "Sarah Johnson",
      position: "Marketing Director",
      image: "https://placehold.co/85",
      rating: 4
    },
    {
      id: 4,
      text: "Outstanding quality and attention to detail. The project was delivered on time and within budget. The team's creativity and problem-solving skills are truly impressive. We're already planning our next collaboration.",
      name: "Michael Chen",
      position: "Founder of StartupXYZ",
      image: "https://placehold.co/85",
      rating: 5
    },
    {
      id: 5,
      text: "Professional, efficient, and results-driven. The team understood our requirements perfectly and delivered exactly what we needed. Their support doesn't end with project completion - they continue to provide excellent after-service support.",
      name: "Emily Rodriguez",
      position: "Operations Manager",
      image: "https://placehold.co/85",
      rating: 4
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        // Filled star
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
          >
            <path
              d="M3.24254 16L4.63718 10.0827L0 6.10441L6.1083 5.58096L8.50056 0L10.8928 5.57984L17 6.1033L12.3628 10.0816L13.7586 15.9989L8.50056 12.8581L3.24254 16Z"
              fill="white"
            />
          </svg>
        );
      } else {
        // Empty star
        stars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M10 13.89L6.24 16.16L7.23 11.88L3.91 9L8.29 8.63L10 4.59L11.71 8.63L16.09 9L12.77 11.88L13.76 16.16M20 7.74L12.81 7.13L10 0.5L7.19 7.13L0 7.74L5.45 12.47L3.82 19.5L10 15.77L16.18 19.5L14.54 12.47L20 7.74Z"
              fill="white"
            />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <>
      <div className="about-client-reviews">
        <h1>Our client reviews</h1>
        {/* reviews */}
        <div className="about-client-reviews-container">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{ 
              clickable: true,
              el: '.swiper-pagination-custom'
            }}
            breakpoints={{
              768: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2.5,
                spaceBetween: 30,
              },
            }}
            className="reviews-swiper"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="about-client-reviews-content">
                  <p>{review.text}</p>
                  <div className="about-client-reviews-content-bottom">
                    {/* left */}
                    <div className="about-client-reviews-content-bottom-left">
                      <img src={review.image} alt={review.name} />
                      <div className="about-client-reviews-content-bottom-left-text">
                        <h3>{review.name}</h3>
                        <span>{review.position}</span>
                      </div>
                    </div>
                    {/* right */}
                    <div className="about-client-reviews-content-bottom-right">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Buttons */}
          <div className="swiper-navigation">
            <div className="swiper-button-prev-custom">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="swiper-button-next-custom">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* Custom Pagination */}
          {/* <div className="swiper-pagination-custom"></div> */}
        </div>
      </div>
    </>
  );
};

export default AboutClientReviews;