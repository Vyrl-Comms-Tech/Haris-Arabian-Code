import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import axios from "axios";
import "../Styles/HeroOffplanProperty.css";

const HeroOffplanProperty = () => {
  // State for API data
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Slider states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const dotsRef = useRef([]);

  // Base API URL
  // const BASE_URL = "http://192.168.100.31:8000";
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch off-plan properties from API
  const fetchOffplanProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/get-offplan-property`);
      
      console.log("Off-plan API Response:", response.data);

      if (response.data && response.data.success) {
        setProperties(response.data.data || []);
        setTotalCount(response.data.pagination?.totalCount || 0);
        console.log("Properties loaded:", response.data.data.length);
      } else {
        setProperties([]);
        setTotalCount(0);
        setError("No properties found");
      }
    } catch (err) {
      console.error("Error fetching off-plan properties:", err);
      setError(err.message || "Failed to load properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Load properties on component mount
  useEffect(() => {
    fetchOffplanProperties();
  }, []);

  // Get current property (fallback to first property if available)
  const currentProperty = properties.length > 0 ? properties[currentIndex] : null;

  // Format price display
  const formatPrice = (property) => {
    if (!property) return "Price on Request";
    
    if (property.formattedPrice) {
      return property.formattedPrice;
    }
    
    if (property.priceRange) {
      return property.priceRange;
    }
    
    if (property.minPrice && property.minPrice > 0) {
      return `${property.priceCurrency || 'AED'} ${property.minPrice.toLocaleString()}`;
    }
    
    return "Price on Request";
  };

  // Get property image
  const getPropertyImage = (property) => {
    if (!property) return "/Assets/elements.png"; // fallback image
    
    if (property.mainImageUrl) {
      return property.mainImageUrl;
    }
    
    if (property.coverImage?.url) {
      return property.coverImage.url;
    }
    
    return "/Assets/elements.png"; // fallback image
  };

  // Get property location
  const getPropertyLocation = (property) => {
    if (!property) return "Dubai";
    
    if (property.area) {
      return property.area;
    }
    
    return "Dubai";
  };

  // Get property developer
  const getPropertyDeveloper = (property) => {
    if (!property) return "Developer";
    
    if (property.developer) {
      return property.developer;
    }
    
    return "Developer";
  };

  // Get property completion date
  const getCompletionDate = (property) => {
    if (!property) return "2025";
    
    if (property.completionDate) {
      const date = new Date(property.completionDate);
      return date.getFullYear();
    }
    
    return "2025";
  };

  // Animation function
  const animateSlide = (newIndex) => {
    if (isAnimating || newIndex === currentIndex || !properties.length) return;

    setIsAnimating(true);
    setCurrentIndex(newIndex);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
      },
    });

    // Fade out current content
    tl.to("#animateimg", {
      opacity: 0,
      scale: 1.05,
      duration: 0.4,
      ease: "power2.out",
    })
      .to(
        overlayRef.current,
        {
          delay: -0.3,
          opacity: 0,
          y: 30,
          duration: 0.3,
          ease: "power2.out",
        },
        0
      )
      .set("#animateimg", {
        delay: -0.1,
        backgroundImage: `url(${getPropertyImage(properties[newIndex])})`,
      })
      // Fade in new content
      .to(
        "#animateimg",
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.1"
      )
      .to(
        overlayRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.3"
      );
  };

  const handleNext = () => {
    if (!properties.length) return;
    const newIndex = (currentIndex + 1) % properties.length;
    animateSlide(newIndex);
  };

  const handlePrev = () => {
    if (!properties.length) return;
    const newIndex = currentIndex === 0 ? properties.length - 1 : currentIndex - 1;
    animateSlide(newIndex);
  };

  // Loading state
  if (loading) {
    return (
      <div className="real-estate-main-wrapper">
        <div className="header" id="padded-header">
          <div className="header-left">
            <p className="property-label">Off plans</p>
            <h1 className="main-title">
              Loading off-plan properties...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="real-estate-main-wrapper">
        <div className="header" id="padded-header">
          <div className="header-left">
            <p className="property-label">Off plans</p>
            <h1 className="main-title">
              Error loading properties
            </h1>
            <p>Error: {error}</p>
            <button onClick={fetchOffplanProperties} style={{ marginTop: '10px', padding: '10px 20px' }}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No properties state
  if (!properties.length) {
    return (
      <div className="real-estate-main-wrapper">
        <div className="header" id="padded-header">
          <div className="header-left">
            <p className="property-label">Off plans</p>
            <h1 className="main-title">
              No off-plan properties available
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="real-estate-main-wrapper">
      <div className="header" id="padded-header">
        <div className="header-left">
          <p className="property-label">Off plans</p>
          <h1 className="main-title">
            Transforming your real estate with 
            <br />
            Off plan property
          </h1>
          <p className="property-count">
            {totalCount} properties available
          </p>
        </div>
      </div>

      {/* Image Grid Layout Section */}
      <div className="hero-image-grid-section">
        {/* Left Side - Single Large Image */}
        <div className="hero-left-panel">
          <div className="hero-featured-property-box">
            <div
              className="hero-featured-image"
              style={{
                backgroundImage: `url(${getPropertyImage(currentProperty)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "100%",
              }}
              id="animateimg"
            />
            <div className="hero-property-tags-wrapper">
              <span className="hero-sale-badge">
                {currentProperty?.status || "For Sale"}
              </span>
              <span className="hero-featured-badge">
                {currentProperty?.saleStatus || "OFF PLAN"}
              </span>
            </div>
            <button
              className="slider-navigation-btn"
              onClick={handlePrev}
              id="hero-nav-prev"
              disabled={isAnimating}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
              >
                <g clipPath="url(#clip0_513_252)">
                  <path
                    d="M4.9834 8.29883L11.7021 15.0176L11.0459 15.7051L3.63965 8.29883L11.0459 0.923828L11.7021 1.58008L4.9834 8.29883Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_513_252">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="matrix(1 0 0 -1 0.0771484 16.3301)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>

            <button
              className="slider-navigation-btn hero-nav-next"
              onClick={handleNext}
              disabled={isAnimating}
              id="hero-nav-next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
              >
                <g clipPath="url(#clip0_513_255)">
                  <path
                    d="M12.5146 8.29883L5.1084 15.7051L4.45215 15.0176L11.1709 8.29883L4.45215 1.58008L5.1084 0.923828L12.5146 8.29883Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_513_255">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="matrix(1 0 0 -1 0.0771484 16.3301)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>

            <div ref={overlayRef} className="hero-property-details-overlay">
              <h3 className="hero-property-name">
                {currentProperty?.name || "Property Name"}
              </h3>
              <div className="hero-location-info-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <g clipPath="url(#clip0_513_273)">
                    <path
                      d="M16.2106 3.45325C15.3662 2.65325 14.4218 2.03103 13.3773 1.58659C12.3329 1.14214 11.2329 0.91992 10.0773 0.91992C8.92176 0.91992 7.81065 1.14214 6.74398 1.58659C5.67731 2.03103 4.74398 2.65325 3.94398 3.45325C3.14398 4.25325 2.52176 5.18659 2.07731 6.25325C1.63287 7.31992 1.41064 8.43103 1.41064 9.58659C1.41064 10.7421 1.63287 11.8421 2.07731 12.8866C2.52176 13.931 3.14398 14.8755 3.94398 15.7199L8.54398 20.3199C8.94398 20.7199 9.44398 20.9199 10.044 20.9199C10.644 20.9199 11.1662 20.7199 11.6106 20.3199L16.2106 15.7199C17.0106 14.8755 17.6329 13.931 18.0773 12.8866C18.5218 11.8421 18.744 10.7421 18.744 9.58659C18.744 8.43103 18.5218 7.31992 18.0773 6.25325C17.6329 5.18659 17.0106 4.25325 16.2106 3.45325ZM15.344 14.8533L10.744 19.4533C10.5662 19.631 10.344 19.7199 10.0773 19.7199C9.81065 19.7199 9.5662 19.631 9.34398 19.4533L4.74398 14.8533C4.03287 14.1421 3.49953 13.331 3.14398 12.4199C2.78842 11.5088 2.61064 10.5533 2.61064 9.55326C2.61064 8.55325 2.78842 7.5977 3.14398 6.68659C3.49953 5.77548 4.03287 4.97548 4.74398 4.28659C5.45509 3.5977 6.2662 3.06437 7.17731 2.68659C8.08842 2.30881 9.04398 2.11992 10.044 2.11992C11.044 2.11992 11.9995 2.30881 12.9106 2.68659C13.8218 3.06437 14.6329 3.58659 15.344 4.25325C16.3218 5.23103 16.9773 6.36437 17.3106 7.65325C17.644 8.94214 17.644 10.231 17.3106 11.5199C16.9773 12.8088 16.3218 13.9199 15.344 14.8533ZM10.0773 6.45325C9.23287 6.45325 8.49953 6.76437 7.87731 7.38659C7.25509 8.00881 6.94398 8.74214 6.94398 9.58659C6.94398 10.431 7.25509 11.1533 7.87731 11.7533C8.49953 12.3533 9.23287 12.6533 10.0773 12.6533C10.9218 12.6533 11.644 12.3533 12.244 11.7533C12.844 11.1533 13.144 10.431 13.144 9.58659C13.144 8.74214 12.844 8.00881 12.244 7.38659C11.644 6.76437 10.9218 6.45325 10.0773 6.45325ZM10.0773 11.5199C9.54398 11.5199 9.08842 11.331 8.71064 10.9533C8.33287 10.5755 8.14398 10.1199 8.14398 9.58659C8.14398 9.05325 8.33287 8.5977 8.71064 8.21992C9.08842 7.84214 9.54398 7.65325 10.0773 7.65325C10.6106 7.65325 11.0662 7.84214 11.444 8.21992C11.8218 8.5977 12.0106 9.05325 12.0106 9.58659C12.0106 10.1199 11.8218 10.5755 11.444 10.9533C11.0662 11.331 10.6106 11.5199 10.0773 11.5199Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_513_273">
                      <rect
                        width="20"
                        height="20"
                        fill="white"
                        transform="matrix(1 0 0 -1 0.0771484 20.9199)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span className="hero-location-text">
                  {getPropertyLocation(currentProperty)}
                </span>
              </div>
              <div className="hero-property-bottom-section">
                <span className="hero-property-price-display">
                  {formatPrice(currentProperty)}
                </span>
                <div className="hero-property-specs-list">
                  <div className="hero-property-spec-item">
                    <span className="hero-spec-label">Developer:</span>
                    <span className="hero-spec-value-text">
                      {getPropertyDeveloper(currentProperty)}
                    </span>
                  </div>
                  <div className="hero-property-spec-item">
                    <span className="hero-spec-label">Completion:</span>
                    <span className="hero-spec-value-text">
                      {getCompletionDate(currentProperty)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Three Images Layout */}
        <div className="hero-right-panel">
          {/* Top Image - Full Width */}
          <div className="hero-top-section-box">
            <img
              src={getPropertyImage(currentProperty)}
              alt="Your Off Plan Property"
              className="hero-top-section-image"
            />
            <div className="hero-top-section-overlay">
              <h3 className="hero-top-section-title">Your Off Plan Property</h3>
            </div>
          </div>

          {/* Bottom Row - Two Images Side by Side */}
          <div className="hero-bottom-sections-row">
            {/* Bottom Left - Stats Section */}
            <div className="hero-stats-section-box">
              <div className="hero-stats-content-wrapper">
                <h2 className="hero-stats-number-display">{totalCount}+</h2>
                <p className="hero-stats-label-text">Off-Plan Properties</p>
                <p className="hero-stats-description-text">
                  Explore our wide variety of off-plan properties
                  <br />
                  to find your dream home today
                </p>
                <button className="hero-contact-action-btn">
                  Contact us
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_731_32)">
                      <path
                        d="M0.954592 6.09818H12.9653L8.36617 1.71894C8.12535 1.48961 8.11602 1.10863 8.3454 0.86788C8.57448 0.627431 8.95557 0.617801 9.19669 0.847116L14.449 5.8487C14.6763 6.0762 14.8018 6.37835 14.8018 6.70005C14.8018 7.02145 14.6763 7.3239 14.4384 7.56133L9.19639 12.5527C9.0799 12.6637 8.93059 12.7188 8.78128 12.7188C8.62234 12.7188 8.4634 12.6562 8.3451 12.532C8.11572 12.2912 8.12505 11.9105 8.36587 11.6812L12.9842 7.30193H0.954592C0.622259 7.30193 0.352539 7.03229 0.352539 6.70005C0.352539 6.36782 0.622259 6.09818 0.954592 6.09818Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_731_32">
                        <rect
                          width="15"
                          height="12.84"
                          fill="white"
                          transform="translate(0.0771484 0.280029)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>

            {/* Bottom Right - Property Image */}
            <div className="hero-pool-section-box">
              <img
                src={getPropertyImage(currentProperty)}
                alt="Off-Plan Property"
                className="hero-pool-section-image"
              />
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default HeroOffplanProperty;