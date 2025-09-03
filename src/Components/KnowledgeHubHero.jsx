import React from "react";
import "../Styles/knowledge-hub-hero.css";

const KnowledgeHubHero = () => {
  return (
    <>
      <div className="knowledge-hub-hero">
        <div className="knowledge-hub-hero-container">
          <h1>
            Experts making buying and <br /> selling  properties easy
          </h1>
          <p>
            A major advantage of working with Realty Group is the extensive
            experience and specialized knowledge they offer.
          </p>
          <div className="knowledge-hub-hero-container-input">
            <input type="text" placeholder="Search" />
            <div className="knowledge-hub-hero-container-input-search">
              <img src="/Assets/search.png" alt="search" />
            </div>
          </div>
          <div className="knowledge-hub-hero-container-button">
            <button>Blog Post</button>
            <button>Podcast</button>
            <button>Guide</button>
            <button>Insight</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default KnowledgeHubHero;
