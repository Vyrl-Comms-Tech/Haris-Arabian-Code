import React from "react";
import "../Styles/career-below.css";

const CareerBelow = () => {
  return (
    <>
      <div className="career-below">
        <div className="career-below-heading">
          <h1>
            <span></span> About Career
          </h1>
          <p>
            Know someone searching for property? Share their details with us,
            sit back, and let our team handle everything. From property tours to
            final paperwork, we make the buying journey seamless.
          </p>
        </div>
        {/* content */}
        <div className="career-below-content">
          {/* 1 */}
          <div className="career-below-content-div">
            <h1>50%</h1>
            <p>
              We tailor our service so that we excede all your requirements and
              expectations.
            </p>
          </div>
          {/* 2 */}
          <div className="career-below-content-div">
            <h1>50%</h1>
            <p>
              We tailor our service so that we excede all your requirements and
              expectations.
            </p>
          </div>
          {/* 3 */}
          <div className="career-below-content-div">
            <h1>50%</h1>
            <p>
              We tailor our service so that we excede all your requirements and
              expectations.
            </p>
          </div>
          {/* 4 */}
          <div className="career-below-content-div">
            <h1>50%</h1>
            <p>
              We tailor our service so that we excede all your requirements and
              expectations.
            </p>
          </div>
        </div>
        {/* cards */}
        <div className="career-below-cards">
          {/* left */}
          <div className="career-below-card-left">
            <div className="career-below-card-left-head">
              <span></span>
              <h1>
                Why work <br /> with us
              </h1>
            </div>
            <div className="career-below-card-left-para">
              <p>
                Your home-buying journey should be smooth and stress-free. Speak
                to our dedicated mortgage specialists at Arabian Estates today
                and let us secure the best available rates for you across the
                UAE market.
              </p>
              <button>Talk to an agent</button>
            </div>
          </div>
          {/* right */}
          <div className="career-below-card-right">
            <h1>
              Great Place to <br /> Work
            </h1>
            <div className="career-below-card-right-para">
              <p>
                Your home-buying journey should be smooth and stress-free. Speak
                to our dedicated mortgage specialists at Arabian Estates today
                and let us secure the best available rates for you across the
                UAE market.
              </p>
              <img src="/Assets/l.png" alt="" />
            </div>
          </div>
        </div>
        {/* video */}
        <div className="career-below-video">
          <img src="Assets/career.jpg" alt="iamge" />
        </div>
        {/* contact */}
        <div className="community-guide-contact">
          <div className="community-guide-contact-left">
            <h1>Reach Out to Us for Assistance </h1>
            <p>
              Know someone searching for property? Share their details with us,
              sit back, and let our team handle everything.{" "}
            </p>
          </div>
          {/*  */}
          <div className="community-guide-contact-right">
            <h1>Contact us</h1>
            <p>
              From property tours to final paperwork, we make the buying journey
              seamless.
            </p>
            <div className="community-guide-contact-right-input">
              <input type="text" placeholder="First name" />
              <input type="text" placeholder="Last name" />
            </div>
            <div className="community-guide-contact-right-input">
              <input type="email" placeholder="Email" />
              <input type="tel" placeholder="Phone number" />
            </div>
            <input type="text" placeholder="Message" />

            <button>submit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CareerBelow;
