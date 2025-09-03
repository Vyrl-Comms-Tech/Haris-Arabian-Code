import React from "react";
import "../Styles/community-guide-contact.css";

const CommunityGuideContact = () => {
  return (
    <>
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
    </>
  );
};

export default CommunityGuideContact;

