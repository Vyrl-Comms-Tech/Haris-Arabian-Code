import React from 'react'
import "../Styles/about-below.css"

const AboutBelow = () => {
  return (
    <>
   <div className="about-below">
      <div className="about-left">
        <h2 className="about-below__title">
          Indulge in the artistry of comfort within the walls of Arabian.
        </h2>
        
        <ul className="about-below__list">
          <li className="about-below__list-item">
            <span className="about-below__bullet"></span>
            <p className="about-below__text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim
            </p>
          </li>
          <li className="about-below__list-item">
            <span className="about-below__bullet"></span>
            <p className="about-below__text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim
            </p>
          </li>
          <li className="about-below__list-item">
            <span className="about-below__bullet"></span>
            <p className="about-below__text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim lore
            </p>
          </li>
          <li className="about-below__list-item">
            <span className="about-below__bullet"></span>
            <p className="about-below__text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim
            </p>
          </li>
        </ul>
        
        <p className="about-below__description">
          Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae 
          risus tristique posuere.
        </p>
        
        <div className="about-below__buttons">
          <button className="about-below__btn about-below__btn--primary">
            View our properties
          </button>
          <button className="about-below__btn about-below__btn--secondary">
            Contact
          </button>
        </div>
      </div>
      
      <div className="about-right">
        <div className="about-below__image-container">
          <img 
            src="/Assets/about.png" 
            alt="Professional team" 
            className="about-below__image"
          />
        </div>
      </div>
    </div>
    </>
  )
}

export default AboutBelow