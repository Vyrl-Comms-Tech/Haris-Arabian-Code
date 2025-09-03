import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../Styles/mortgage-page-insight.css"


const MortgagesPageInsight = () => {

    const slides = [
        {
            img: "/Assets/insight.jpg",
            category: "News letter",
            title: "Google just showed us the future",
            desc: "A major advantage of working with Realty Group is the extensive experience and specialized knowledge they offer.",
        },
        {
            img: "/Assets/insight.jpg",
            category: "News letter",
            title: "Google just showed us the future",
            desc: "A major advantage of working with Realty Group is the extensive experience and specialized knowledge they offer.",
        },
        // Add more slides here if needed
        {
            img: "/Assets/insight.jpg",
            category: "News letter",
            title: "Google just showed us the future",
            desc: "A major advantage of working with Realty Group is the extensive experience and specialized knowledge they offer.",
        },
        {
            img: "/Assets/insight.jpg",
            category: "News letter",
            title: "Google just showed us the future",
            desc: "A major advantage of working with Realty Group is the extensive experience and specialized knowledge they offer.",
        },
    ];
    return (
        <>
            <div className="mortgage-page-insight">
                <div className="mortgage-page-insight-heading">
                    <h1>insights</h1>
                    <p>Your home-buying journey should be smooth and stress-free. Speak to our dedicated mortgage specialists at Arabian Estates today and let us secure the best available rates for you across the UAE market.</p>
                </div>
                <div className="mortgage-page-insight-swiper">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={30}
                        slidesPerView={2}
                        // navigation
                        // pagination={{ clickable: true }}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                        }}
                    >
                        {slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <div className="insight-slide">
                                    <div className="insight-image">
                                        <img src={slide.img} alt={slide.title} />
                                    </div>
                                    <div className="insight-content">
                                        <span className="insight-category"> <div className='insight-category'></div>{slide.category}</span>
                                        <h3 className="insight-title">{slide.title}</h3>
                                        <p className="insight-description">{slide.desc}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default MortgagesPageInsight