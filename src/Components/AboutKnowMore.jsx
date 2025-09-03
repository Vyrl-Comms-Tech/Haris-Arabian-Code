import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../Styles/about-know-more.css";

const AboutKnowMore = () => {
  const knowMoreData = [
    {
      id: 1,
      image: "https://placehold.co/560x360",
      text: "Experience a hassle-free journey to your new front door.",
      buttonText: "Buyer",
      buttonIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="13"
          viewBox="0 0 16 13"
          fill="none"
        >
          <g clipPath="url(#clip0_1491_606)">
            <path
              d="M1.37744 5.89847H13.3881L8.78902 1.51923C8.5482 1.28991 8.53887 0.908923 8.76825 0.668173C8.99733 0.427724 9.37842 0.418094 9.61954 0.647409L14.8719 5.64899C15.0991 5.87649 15.2247 6.17864 15.2247 6.50035C15.2247 6.82174 15.0991 7.12419 14.8613 7.36162L9.61925 12.353C9.50275 12.464 9.35344 12.5191 9.20413 12.5191C9.04519 12.5191 8.88625 12.4565 8.76795 12.3323C8.53857 12.0915 8.5479 11.7108 8.78872 11.4815L13.4071 7.10222H1.37744C1.04511 7.10222 0.775391 6.83258 0.775391 6.50035C0.775391 6.16811 1.04511 5.89847 1.37744 5.89847Z"
              fill="#011825"
            />
          </g>
          <defs>
            <clipPath id="clip0_1491_606">
              <rect
                width="15"
                height="12.84"
                fill="white"
                transform="translate(0.5 0.0800781)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: 2,
      image: "https://placehold.co/560x360",
      text: "Supercharge your sales with our agent resources.",
      buttonText: "Agent",
      buttonIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="13"
          viewBox="0 0 16 13"
          fill="none"
        >
          <g clipPath="url(#clip0_1491_606)">
            <path
              d="M1.37744 5.89847H13.3881L8.78902 1.51923C8.5482 1.28991 8.53887 0.908923 8.76825 0.668173C8.99733 0.427724 9.37842 0.418094 9.61954 0.647409L14.8719 5.64899C15.0991 5.87649 15.2247 6.17864 15.2247 6.50035C15.2247 6.82174 15.0991 7.12419 14.8613 7.36162L9.61925 12.353C9.50275 12.464 9.35344 12.5191 9.20413 12.5191C9.04519 12.5191 8.88625 12.4565 8.76795 12.3323C8.53857 12.0915 8.5479 11.7108 8.78872 11.4815L13.4071 7.10222H1.37744C1.04511 7.10222 0.775391 6.83258 0.775391 6.50035C0.775391 6.16811 1.04511 5.89847 1.37744 5.89847Z"
              fill="#011825"
            />
          </g>
          <defs>
            <clipPath id="clip0_1491_606">
              <rect
                width="15"
                height="12.84"
                fill="white"
                transform="translate(0.5 0.0800781)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: 3,
      image: "https://placehold.co/560x360",
      text: "Experience a hassle-free journey to your new front door.",
      buttonText: "Seller",
      buttonIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="13"
          viewBox="0 0 16 13"
          fill="none"
        >
          <g clipPath="url(#clip0_1491_606)">
            <path
              d="M1.37744 5.89847H13.3881L8.78902 1.51923C8.5482 1.28991 8.53887 0.908923 8.76825 0.668173C8.99733 0.427724 9.37842 0.418094 9.61954 0.647409L14.8719 5.64899C15.0991 5.87649 15.2247 6.17864 15.2247 6.50035C15.2247 6.82174 15.0991 7.12419 14.8613 7.36162L9.61925 12.353C9.50275 12.464 9.35344 12.5191 9.20413 12.5191C9.04519 12.5191 8.88625 12.4565 8.76795 12.3323C8.53857 12.0915 8.5479 11.7108 8.78872 11.4815L13.4071 7.10222H1.37744C1.04511 7.10222 0.775391 6.83258 0.775391 6.50035C0.775391 6.16811 1.04511 5.89847 1.37744 5.89847Z"
              fill="#011825"
            />
          </g>
          <defs>
            <clipPath id="clip0_1491_606">
              <rect
                width="15"
                height="12.84"
                fill="white"
                transform="translate(0.5 0.0800781)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: 4,
      image: "https://placehold.co/560x360",
      text: "Experience a hassle-free journey to your new front door.",
      buttonText: "Landlord",
      buttonIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="13"
          viewBox="0 0 16 13"
          fill="none"
        >
          <g clipPath="url(#clip0_1491_606)">
            <path
              d="M1.37744 5.89847H13.3881L8.78902 1.51923C8.5482 1.28991 8.53887 0.908923 8.76825 0.668173C8.99733 0.427724 9.37842 0.418094 9.61954 0.647409L14.8719 5.64899C15.0991 5.87649 15.2247 6.17864 15.2247 6.50035C15.2247 6.82174 15.0991 7.12419 14.8613 7.36162L9.61925 12.353C9.50275 12.464 9.35344 12.5191 9.20413 12.5191C9.04519 12.5191 8.88625 12.4565 8.76795 12.3323C8.53857 12.0915 8.5479 11.7108 8.78872 11.4815L13.4071 7.10222H1.37744C1.04511 7.10222 0.775391 6.83258 0.775391 6.50035C0.775391 6.16811 1.04511 5.89847 1.37744 5.89847Z"
              fill="#011825"
            />
          </g>
          <defs>
            <clipPath id="clip0_1491_606">
              <rect
                width="15"
                height="12.84"
                fill="white"
                transform="translate(0.5 0.0800781)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: 5,
      image: "https://placehold.co/560x360",
      text: "Professional property management services for maximum returns.",
      buttonText: "Property Manager",
      buttonIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="13"
          viewBox="0 0 16 13"
          fill="none"
        >
          <g clipPath="url(#clip0_1491_606)">
            <path
              d="M1.37744 5.89847H13.3881L8.78902 1.51923C8.5482 1.28991 8.53887 0.908923 8.76825 0.668173C8.99733 0.427724 9.37842 0.418094 9.61954 0.647409L14.8719 5.64899C15.0991 5.87649 15.2247 6.17864 15.2247 6.50035C15.2247 6.82174 15.0991 7.12419 14.8613 7.36162L9.61925 12.353C9.50275 12.464 9.35344 12.5191 9.20413 12.5191C9.04519 12.5191 8.88625 12.4565 8.76795 12.3323C8.53857 12.0915 8.5479 11.7108 8.78872 11.4815L13.4071 7.10222H1.37744C1.04511 7.10222 0.775391 6.83258 0.775391 6.50035C0.775391 6.16811 1.04511 5.89847 1.37744 5.89847Z"
              fill="#011825"
            />
          </g>
          <defs>
            <clipPath id="clip0_1491_606">
              <rect
                width="15"
                height="12.84"
                fill="white"
                transform="translate(0.5 0.0800781)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: 6,
      image: "https://placehold.co/560x360",
      text: "Comprehensive real estate investment consultation and guidance.",
      buttonText: "Investor",
      buttonIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="13"
          viewBox="0 0 16 13"
          fill="none"
        >
          <g clipPath="url(#clip0_1491_606)">
            <path
              d="M1.37744 5.89847H13.3881L8.78902 1.51923C8.5482 1.28991 8.53887 0.908923 8.76825 0.668173C8.99733 0.427724 9.37842 0.418094 9.61954 0.647409L14.8719 5.64899C15.0991 5.87649 15.2247 6.17864 15.2247 6.50035C15.2247 6.82174 15.0991 7.12419 14.8613 7.36162L9.61925 12.353C9.50275 12.464 9.35344 12.5191 9.20413 12.5191C9.04519 12.5191 8.88625 12.4565 8.76795 12.3323C8.53857 12.0915 8.5479 11.7108 8.78872 11.4815L13.4071 7.10222H1.37744C1.04511 7.10222 0.775391 6.83258 0.775391 6.50035C0.775391 6.16811 1.04511 5.89847 1.37744 5.89847Z"
              fill="#011825"
            />
          </g>
          <defs>
            <clipPath id="clip0_1491_606">
              <rect
                width="15"
                height="12.84"
                fill="white"
                transform="translate(0.5 0.0800781)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="about-know-more">
        <div className="about-know-more-heading">
          <h1>Know more</h1>
          <p>
            Your home-buying journey should be smooth and stress-free. Speak to
            our dedicated mortgage specialists at Arabian Estates today and let
            us secure the best available rates for you across the UAE market.
          </p>
        </div>
        <div className="about-know-more-container">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: ".know-more-swiper-button-next",
              prevEl: ".know-more-swiper-button-prev",
            }}
            pagination={{
              clickable: true,
              el: ".know-more-swiper-pagination",
            }}
            breakpoints={{
              480: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 3.5,
                spaceBetween: 20,
              },
              1560: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            className="know-more-swiper"
          >
            {knowMoreData.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="about-know-more-content">
                  <img src={item.image} alt={item.buttonText} />
                  <div className="about-know-more-content-text">
                    <p>{item.text}</p>
                    <button>
                      {item.buttonText}
                      {item.buttonIcon}
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          {/* <div className="know-more-swiper-navigation">
            <div className="know-more-swiper-button-prev">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#011825" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="know-more-swiper-button-next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="#011825" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div> */}

          {/* Custom Pagination */}
        </div>
      </div>
    </>
  );
};

export default AboutKnowMore;
