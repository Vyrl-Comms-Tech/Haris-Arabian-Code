import React from "react";
import "../Styles/contact-us.css";
import Navbar from "./Navbar";

const Contactus = () => {
  return (
    <>
      <Navbar />
      <div className="contact-us-hero">
        <div className="contact-us-container">
          <div className="contact-us-container-left">
            {/* top */}
            <div className="contact-us-container-left-top">
              <h1>Contact us</h1>
              <p>
                Our dedicated team is committed to equipping you with the
                knowledge that can transform your real estate experience.
              </p>
            </div>

            {/* bottom */}
            <div className="contact-us-container-left-bottom">
              <button> Book valuation</button>
              <h3>Our Social media</h3>
              <div className="contact-us-container-left-bottom-icons">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="22"
                    viewBox="0 0 24 22"
                    fill="none"
                  >
                    <path
                      d="M5.03673 2.44553C5.03639 3.0938 4.77075 3.71539 4.29822 4.17356C3.8257 4.63173 3.18502 4.88894 2.5171 4.88862C1.84919 4.88829 1.20877 4.63046 0.736721 4.17183C0.264673 3.71321 -0.00033364 3.09136 3.15251e-07 2.44309C0.000334271 1.79482 0.265981 1.17323 0.738502 0.715057C1.21102 0.25689 1.85171 -0.00032383 2.51962 3.0598e-07C3.18753 0.000324441 3.82796 0.25816 4.30001 0.716786C4.77205 1.17541 5.03706 1.79726 5.03673 2.44553ZM5.11228 6.69863H0.0755511V22H5.11228V6.69863ZM13.0703 6.69863H8.05876V22H13.0199V13.9704C13.0199 9.49736 19.0262 9.08183 19.0262 13.9704V22H24V12.3083C24 4.76762 15.1102 5.04872 13.0199 8.75185L13.0703 6.69863Z"
                      fill="#E6E6E6"
                    />
                  </svg>
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                  >
                    <path
                      d="M7.54 0H18.46C22.62 0 26 3.38 26 7.54V18.46C26 20.4597 25.2056 22.3776 23.7916 23.7916C22.3776 25.2056 20.4597 26 18.46 26H7.54C3.38 26 0 22.62 0 18.46V7.54C0 5.54027 0.794391 3.62244 2.20842 2.20842C3.62244 0.794391 5.54027 0 7.54 0ZM7.28 2.6C6.03879 2.6 4.84841 3.09307 3.97074 3.97074C3.09307 4.84841 2.6 6.03879 2.6 7.28V18.72C2.6 21.307 4.693 23.4 7.28 23.4H18.72C19.9612 23.4 21.1516 22.9069 22.0293 22.0293C22.9069 21.1516 23.4 19.9612 23.4 18.72V7.28C23.4 4.693 21.307 2.6 18.72 2.6H7.28ZM19.825 4.55C20.256 4.55 20.6693 4.7212 20.974 5.02595C21.2788 5.3307 21.45 5.74402 21.45 6.175C21.45 6.60598 21.2788 7.0193 20.974 7.32405C20.6693 7.62879 20.256 7.8 19.825 7.8C19.394 7.8 18.9807 7.62879 18.6759 7.32405C18.3712 7.0193 18.2 6.60598 18.2 6.175C18.2 5.74402 18.3712 5.3307 18.6759 5.02595C18.9807 4.7212 19.394 4.55 19.825 4.55ZM13 6.5C14.7239 6.5 16.3772 7.18482 17.5962 8.40381C18.8152 9.62279 19.5 11.2761 19.5 13C19.5 14.7239 18.8152 16.3772 17.5962 17.5962C16.3772 18.8152 14.7239 19.5 13 19.5C11.2761 19.5 9.62279 18.8152 8.40381 17.5962C7.18482 16.3772 6.5 14.7239 6.5 13C6.5 11.2761 7.18482 9.62279 8.40381 8.40381C9.62279 7.18482 11.2761 6.5 13 6.5ZM13 9.1C11.9657 9.1 10.9737 9.51089 10.2423 10.2423C9.51089 10.9737 9.1 11.9657 9.1 13C9.1 14.0343 9.51089 15.0263 10.2423 15.7577C10.9737 16.4891 11.9657 16.9 13 16.9C14.0343 16.9 15.0263 16.4891 15.7577 15.7577C16.4891 15.0263 16.9 14.0343 16.9 13C16.9 11.9657 16.4891 10.9737 15.7577 10.2423C15.0263 9.51089 14.0343 9.1 13 9.1Z"
                      fill="#E6E6E6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="contact-us-container-right">
            <h1>write your message here</h1>
            <div className="contact-us-container-right-input">
              <input type="text" placeholder="First name" />
              <input type="text" placeholder="Last name" />
            </div>
            <div className="contact-us-container-right-input">
              <input type="text" placeholder="phone*" />
              <input type="text" placeholder="Email" />
            </div>
            <input type="text" placeholder="Message " />
            <button>
              Submit
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="13"
                viewBox="0 0 14 13"
                fill="none"
              >
                <g clip-path="url(#clip0_1207_3097)">
                  <path
                    d="M0.8125 5.79506L12.0341 5.79506L7.73716 1.70231C7.51216 1.488 7.50344 1.13193 7.71775 0.906934C7.93178 0.682215 8.28784 0.673215 8.51312 0.887528L13.4204 5.5619C13.6327 5.77453 13.75 6.0569 13.75 6.35756C13.75 6.65793 13.6327 6.94059 13.4105 7.1625L8.51284 11.8273C8.404 11.9311 8.2645 11.9826 8.125 11.9826C7.9765 11.9826 7.828 11.9241 7.71747 11.8079C7.50316 11.5829 7.51188 11.2271 7.73688 11.0128L12.0518 6.92006L0.8125 6.92006C0.502 6.92006 0.25 6.66806 0.25 6.35756C0.25 6.04706 0.502 5.79506 0.8125 5.79506Z"
                    fill="#011825"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1207_3097">
                    <rect
                      width="14"
                      height="12"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>

        </div>
        {/* bottom */}
        <div className="contact-us-bottom">
          <div className="contact-us-bottom-container">
            <h3>General inquires</h3>
            <p>@gmail.com</p>
            <p>+928 00000000</p>
          </div>
          {/* 2 */}
          <div className="contact-us-bottom-container">
            <h3>For collaboration</h3>
            <p>@gmail.com</p>
            <p>+928 00000000</p>
          </div>
          {/* 3 */}
          <div className="contact-us-bottom-container">
            <h3>Social media</h3>
            <p>Twitter</p>
            <p>Instagram</p>
          </div>
          {/* 4 */}
          <div className="contact-us-bottom-container">
            <h3>Direct chat</h3>
            <p>Whatsapp</p>
            <p>Mail</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contactus;