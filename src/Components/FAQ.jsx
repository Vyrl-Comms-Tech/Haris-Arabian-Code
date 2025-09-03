import React, { useState, useRef, useEffect } from "react";
import "../Styles/FAQ.css";

const FAQ = ({ faqData, variant = "default" }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [heights, setHeights] = useState([]);
  const contentRefs = useRef([]);

  useEffect(() => {
    // measure each panel once mounted
    const h = contentRefs.current.map((el) => (el ? el.scrollHeight : 0));
    setHeights(h);
  }, [faqData]);

  const toggle = (idx) => setOpenIndex((prev) => (prev === idx ? null : idx));

  return (
    <div className={`faq-accordion ${variant}`}>
      {faqData.map((item, idx) => (
        <div 
          key={idx} 
          className={`faq-item ${openIndex === idx ? 'active' : ''}`}
        >
          <button 
            className="faq-question"
            onClick={() => toggle(idx)}
            aria-expanded={openIndex === idx}
          >
            <h3>{item.question}</h3>
            <svg
              className="faq-arrow"
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="14"
              viewBox="0 0 25 14"
              fill="none"
            >
              <path
                d="M22.7181 0.254153L24.7267 2.13856L14.3001 12.9302C14.1331 13.1042 13.9328 13.2439 13.7108 13.3413C13.4887 13.4388 13.2494 13.492 13.0064 13.498C12.7635 13.504 12.5218 13.4627 12.2952 13.3763C12.0687 13.2899 11.8617 13.1603 11.6863 12.9948L0.734033 2.73124L2.64718 0.751782L12.9268 10.3849L22.7181 0.254153Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div 
            className="faq-answer"
            style={{
              maxHeight: openIndex === idx ? `${heights[idx]}px` : '0px'
            }}
          >
            <div ref={(el) => (contentRefs.current[idx] = el)}>
              <p>{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;