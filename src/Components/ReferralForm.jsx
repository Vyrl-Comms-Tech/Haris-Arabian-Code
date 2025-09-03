import React, { useState } from "react";
import "../Styles/referral-form.css";

const ReferralForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState("");

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationDirection("slide-left");
    setTimeout(() => {
      setCurrentStep(2);
      setAnimationDirection("slide-in-right");
      setTimeout(() => {
        setIsAnimating(false);
        setAnimationDirection("");
      }, 300);
    }, 300);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationDirection("slide-right");
    setTimeout(() => {
      setCurrentStep(1);
      setAnimationDirection("slide-in-left");
      setTimeout(() => {
        setIsAnimating(false);
        setAnimationDirection("");
      }, 300);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    alert("Form submitted successfully!");
  };
  return (
    <>
      <div className="property-referral-container">
        <div className="header-section">
          <h1>Help Friends Find Their Perfect Property</h1>
          <p>
            Know someone searching for property? Share their details with us,
            sit back, and let our team handle everything.
          </p>
        </div>

        <div className="form-container">
          <div className={`form-wrapper ${animationDirection}`}>
            {currentStep === 1 ? (
              <div className="form-step">
                <div className="form-header">
                  <h2>Referrer Details</h2>
                  <p>
                    From property tours to final paperwork, we make the buying
                    journey seamless.
                  </p>
                </div>

                <div className="referral-form">
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Name*"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        placeholder="Email*"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="tel"
                        placeholder="Phone*"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <select className="form-select">
                        <option>Relation</option>
                        <option>Friend</option>
                        <option>Family</option>
                        <option>Colleague</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <input
                      type="text"
                      placeholder="Property Area*"
                      className="form-input"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="next-btn"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="form-step">
                <div className="form-header">
                  <h2>Referee Details</h2>
                  <p>
                    From property tours to final paperwork, we make the buying
                    journey seamless.
                  </p>
                </div>

                <div className="referral-form">
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Ref Name*"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        placeholder="Ref Email*"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="tel"
                        placeholder="Ref Phone*"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <select className="form-select">
                        <option>Best Time To Contact</option>
                        <option>Morning (9 AM - 12 PM)</option>
                        <option>Afternoon (12 PM - 5 PM)</option>
                        <option>Evening (5 PM - 8 PM)</option>
                        <option>Anytime</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <select className="form-select">
                        <option>Ref Preferred Contact</option>
                        <option>Phone Call</option>
                        <option>WhatsApp</option>
                        <option>Email</option>
                        <option>SMS</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <select className="form-select">
                        <option>Urgency Level</option>
                        <option>High - Within 1 week</option>
                        <option>Medium - Within 1 month</option>
                        <option>Low - Just browsing</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <textarea
                      placeholder="Special Requirements"
                      className="form-textarea"
                      rows="4"
                    ></textarea>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="prev-btn"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="submit-btn"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralForm;
