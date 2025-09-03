import React from "react";
import "../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Header Section */}
        <div className="footer-header">
          <div className="footerlogo">
            <img src="/Assets/logo.svg" alt="" />
          </div>
          <div className="social-section">
            <span className="follow-text">Follow Us</span>
            <div className="social-icons">
              <a href="#" className="social-icon">
                {/* <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg> */}
                <img src="/Assets/fb.png" alt="" />
              </a>
              <a href="#" className="social-icon">
                <img src="/Assets/X.png" alt="" />
              </a>
              <a href="#" className="social-icon">
                <img src="/Assets/insta.png" alt="" />
              </a>
              <a href="#" className="social-icon">
                <img src="/Assets/li.png" alt="" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="footer-content">
          {/* Subscribe Section */}
          <div className="footer-column">
            <h3 className="column-title">Subscribe</h3>
            <div className="subscribe-form">
              <input
                type="email"
                placeholder="Your e-mail"
                className="footer-email-input"
              />
              <button className="send-btn">Send →</button>
            </div>
            <p className="subscribe-text">
              Subscribe to our newsletter to receive our weekly feed.
            </p>
            <button className="footer-contact-btn">
              Contact us{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <g clipPath="url(#clip0_731_38)">
                  <path
                    d="M0.877444 5.89847H12.8881L8.28902 1.51923C8.0482 1.28991 8.03887 0.908923 8.26825 0.668173C8.49733 0.427724 8.87842 0.418094 9.11954 0.647409L14.3719 5.64899C14.5991 5.87649 14.7247 6.17864 14.7247 6.50035C14.7247 6.82174 14.5991 7.12419 14.3613 7.36162L9.11925 12.353C9.00275 12.464 8.85344 12.5191 8.70413 12.5191C8.54519 12.5191 8.38625 12.4565 8.26795 12.3323C8.03857 12.0915 8.0479 11.7108 8.28872 11.4815L12.9071 7.10222H0.877444C0.54511 7.10222 0.275391 6.83258 0.275391 6.50035C0.275391 6.16811 0.54511 5.89847 0.877444 5.89847Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_731_38">
                    <rect
                      width="15"
                      height="12.84"
                      fill="white"
                      transform="translate(0 0.0800781)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>

          {/* Quick Links 1 */}
          <div className="footer-links-column">
            <ul className="links-list">
            <h3 className="column-title">Quick Links</h3>
              <li>
                <a href="#" className="footer-link">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  FAQ's
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Terms & Conditions
                </a>
              </li>
            </ul>

            {/* Quick Links 2 */}
            <div className="footer-column">
              <ul className="links-list">
              <h3 className="column-title">Quick Links</h3>
                <li>
                  <a href="#" className="footer-link">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    FAQ's
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Pricing Plans
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="footer-column">
              <div className="contact-info">
              <h3 className="column-title">Contact Us</h3>
                <p className="contact-text">hi@justhome.com</p>
                <p className="contact-text">(123) 456-7890</p>
              </div>
            </div>

            {/* Our Address */}
            <div className="footer-column">
              <div className="address-info">
              <h3 className="column-title">Our Address</h3>
                <p className="address-text">99 Fifth Avenue, 3rd Floor</p>
                <p className="address-text">San Francisco, CA 1980</p>
              </div>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="footer-copyright">
          <p className="copyright-text">Copyright © 2024. Arabianestate</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
