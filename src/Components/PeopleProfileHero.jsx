import React from "react";
import "../Styles/people-profile-hero.css";

const PeopleProfileHero = () => {
  return (
    <>
      <div className="people-profile-hero">
        {/* left */}
        <div className="people-profile-hero-left">
          <div className="people-profile-hero-left-heading">
            <h1>Ricky wolf</h1>
            <h4>lang: English</h4>
            <h3>Sales Director, Co Founder</h3>
            <h3>
              RERA Registration No :<span>1129723</span>
            </h3>
            <h3>
              Specialist Area :
              <span>
                Jumeirah Golf Estates,Green Community,Victory Heights,Dubai
                Investment Park
              </span>
            </h3>
          </div>
          {/* active */}
          <div className="people-profile-hero-left-active">
            <div className="people-profile-hero-left-active-div">
              <h1>2</h1>
              <p>Active sales list</p>
            </div>
            <div className="people-profile-hero-left-active-div">
              <h1>2</h1>
              <p>Active sales list</p>
            </div>
          </div>
          {/* button */}
          <div className="people-profile-hero-left-button">
            <button>
              <img src="/Assets/whats.svg" alt="" /> Whatsapp
            </button>
            <button>
              call now <img src="/Assets/call.svg" alt="" />
            </button>
            <button>
              <img src="/Assets/mail.svg" alt="" />
              mail
            </button>
          </div>
          {/* social links */}
          <div className="people-profile-hero-left-social">
            <h3>Connect with me</h3>
            <div className="people-profile-hero-left-social-links">
              <div className="people-profile-hero-left-social-link">
                <img src="/Assets/li.png" alt="linkedin" />
              </div>
              <div className="people-profile-hero-left-social-link">
                <img src="/Assets/insta.png" alt="linkedin" />
              </div>
            </div>
          </div>
          {/* para */}
          <p className="people-profile-hero-left-para">
            Meet Ricky, our Sales Director and Co-Founder. Ricky started his
            Real Estate career in Dubai in 2014 but has a further 4 years of
            experience in London. Throughout his career in Dubai Ricky has spent
            most of his time specialising in the Palm Jumeirah.
            <br />
            <br />
            Ricky prides himself on his honesty, professionalism and work ethic
            and clients can expect maximum input along with a transparent
            approach.
          </p>
        </div>
        {/* right */}
        <div className="people-profile-hero-right">
          <img src="/Assets/people-card.png" alt="" />
        </div>
      </div>
    </>
  );
};

export default PeopleProfileHero;
