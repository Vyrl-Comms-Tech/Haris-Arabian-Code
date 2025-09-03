import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../Styles/ProjectSlider.css";

const PropertySlider = () => {
  // State management
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("sale"); // "sale" or "rent"
  const [totalCount, setTotalCount] = useState(0); 
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch properties based on active tab
  const fetchProperties = async (type = "sale") => {
    try {
      setLoading(true);
      setError(null);

      const endpoint =
        type === "sale" ? "/sale-properties" : "/rent-properties";
      const response = await axios.get(
        `${BASE_URL}${endpoint}?page=1&limit=20`
      );

      // console.log(`${type} properties API Response:`, response.data);

      if (response.data && response.data.success) {
        setProperties(response.data.data || []);
        setTotalCount(response.data.pagination?.totalCount || 0);
        console.log(`${type} properties loaded:`, response.data.data.length);
      } else {
        setProperties([]);
        setTotalCount(0);
        setError(`No ${type} properties found`);
      }
    } catch (err) {
      console.error(`Error fetching ${type} properties:`, err);
      setError(err.message || `Failed to load ${type} properties`);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Load properties on component mount and when tab changes
  useEffect(() => {
    fetchProperties(activeTab);
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Format price display
  const formatPrice = (property) => {
    if (!property?.general_listing_information?.listingprice)
      return "Price on Request";

    const price = parseFloat(property.general_listing_information.listingprice);
    const currency =
      property.general_listing_information.currency_iso_code || "AED";

    if (price >= 1000000) {
      return `${currency} ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${currency} ${(price / 1000).toFixed(0)}K`;
    } else {
      return `${currency} ${price.toLocaleString()}`;
    }
  };

  // Get property image
  const getPropertyImage = (property) => {
    if (!property?.listing_media?.images?.image?.length) {
      return "/placeholder.svg";
    }

    return property.listing_media.images.image[0].url;
  };

  // Get property location
  const getPropertyLocation = (property) => {
    if (property?.address_information?.address) {
      return property.address_information.address;
    }

    if (property?.custom_fields?.pba_uaefields__community_propertyfinder) {
      return property.custom_fields.pba_uaefields__community_propertyfinder;
    }

    return property?.address_information?.city || "Dubai";
  };

  // Get property title
  const getPropertyTitle = (property) => {
    if (property?.general_listing_information?.listing_title) {
      // Truncate long titles
      const title = property.general_listing_information.listing_title;
      return title.length > 30 ? title.substring(0, 30) + "..." : title;
    }

    return `${
      property?.general_listing_information?.propertytype || "Property"
    }`;
  };

  // Get property specs
  const getPropertySpecs = (property) => {
    return {
      beds: property?.general_listing_information?.bedrooms || "N/A",
      baths: property?.general_listing_information?.fullbathrooms || "N/A",
      sqft: property?.general_listing_information?.totalarea
        ? Math.round(parseFloat(property.general_listing_information.totalarea))
        : "N/A",
    };
  };

  // Get property tag
  const getPropertyTag = (property) => {
    const listingType = property?.general_listing_information?.listingtype;
    return listingType === "Sale" ? "FOR SALE" : "FOR RENT";
  };

  // Get price type for rent properties
  const getPriceType = (property) => {
    if (property?.general_listing_information?.listingtype === "Rent") {
      return "/year";
    }
    return "";
  };

  // Loading state
  if (loading) {
    return (
      <div className="property-slider-container">
        <div className="header">
          <div className="header-left">
            <p className="property-label">Property</p>
            <h1 className="main-title">Loading Properties...</h1>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="property-slider-container">
        <div className="header">
          <div className="header-left">
            <p className="property-label">Property</p>
            <h1 className="main-title">Error Loading Properties</h1>
            <p>Error: {error}</p>
            <button
              onClick={() => fetchProperties(activeTab)}
              style={{ marginTop: "10px", padding: "10px 20px" }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="property-slider-container">
      <div className="header">
        <div className="header-left">
          <p className="property-label">Property</p>
          <h1 className="main-title">
            View Top Listings by Real Estate    <br />Company Dubai Experts
         
          </h1>
          <p id="property-card-details">
           Work With Experienced Real Estate Agents in Dubai. Buy, Sell, Rent, or Invest with a <br/>Premier Real Estate Company in Dubai
           </p>
        </div>
        <div className="header-right">
          <button
            className={`sale-button ${activeTab === "sale" ? "active" : ""}`}
            onClick={() => handleTabChange("sale")}
          >
            Property for sale{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="13"
              viewBox="0 0 15 13"
              fill="none"
            >
              <g clipPath="url(#clip0_529_887)">
                <path
                  d="M0.877444 5.89829H12.8881L8.28902 1.51905C8.0482 1.28972 8.03887 0.90874 8.26825 0.66799C8.49733 0.427541 8.87842 0.417911 9.11954 0.647226L14.3719 5.64881C14.5991 5.87631 14.7247 6.17846 14.7247 6.50016C14.7247 6.82156 14.5991 7.12401 14.3613 7.36144L9.11925 12.3528C9.00275 12.4638 8.85344 12.5189 8.70413 12.5189C8.54519 12.5189 8.38625 12.4563 8.26795 12.3321C8.03857 12.0913 8.0479 11.7106 8.28872 11.4813L12.9071 7.10204H0.877444C0.54511 7.10204 0.275391 6.8324 0.275391 6.50016C0.275391 6.16793 0.54511 5.89829 0.877444 5.89829Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_529_887">
                  <rect
                    width="15"
                    height="12.84"
                    fill="white"
                    transform="translate(0 0.0800171)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
          <button
            className={`rent-button ${activeTab === "rent" ? "active" : ""}`}
            onClick={() => handleTabChange("rent")}
          >
            Property for Rent{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="13"
              viewBox="0 0 15 13"
              fill="none"
            >
              <g clipPath="url(#clip0_529_892)">
                <path
                  d="M0.877444 5.89829H12.8881L8.28902 1.51905C8.0482 1.28972 8.03887 0.90874 8.26825 0.66799C8.49733 0.427541 8.87842 0.417911 9.11954 0.647226L14.3719 5.64881C14.5991 5.87631 14.7247 6.17846 14.7247 6.50016C14.7247 6.82156 14.5991 7.12401 14.3613 7.36144L9.11925 12.3528C9.00275 12.4638 8.85344 12.5189 8.70413 12.5189C8.54519 12.5189 8.38625 12.4563 8.26795 12.3321C8.03857 12.0913 8.0479 11.7106 8.28872 11.4813L12.9071 7.10204H0.877444C0.54511 7.10204 0.275391 6.8324 0.275391 6.50016C0.275391 6.16793 0.54511 5.89829 0.877444 5.89829Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_529_892">
                  <rect
                    width="15"
                    height="12.84"
                    fill="white"
                    transform="translate(0 0.0800171)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>

      {properties.length > 0 ? (
        <div className="slider-container">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={false}
            pagination={{
              clickable: true,
            }}
            // breakpoints={{
            //   500: {
            //     slidesPerView: 1,
            //     spaceBetween: 20,
            //   },
            //   650: {
            //     slidesPerView: 1,
            //     spaceBetween: 20,
            //   },
            //   768: {
            //     slidesPerView: 2,
            //     spaceBetween: 20,
            //   },
            //   1040: {
            //     slidesPerView: 3.5,
            //     spaceBetween: 15,
            //   },
            //   1200: {
            //     slidesPerView: 3,
            //     spaceBetween: 30,
            //   },
            //   1400: {
            //     slidesPerView: 4,
            //     spaceBetween: 30,
            //   },
            //   1900: {
            //     slidesPerView: 3.5,
            //     spaceBetween:30,
            //   },
            // }}
            className="custom-swiper"
          >
            {properties.map((property) => {
              const specs = getPropertySpecs(property);

              return (
                <SwiperSlide key={property._id || property.id}>
                  <div className="property-card">
                    <div className="image-container">
                      <img
                        src={getPropertyImage(property)}
                        alt={getPropertyTitle(property)}
                        className="property-image"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="tag">{getPropertyTag(property)}</div>
                    </div>
                    <div className="card-content2">
                      <div className="cardrow1">
                        <h3 className="property-title">
                          {getPropertyTitle(property)}
                        </h3>
                        <div className="price-container">
                          <span className="price">{formatPrice(property)}</span>
                          <span className="price-type">
                            {getPriceType(property)}
                          </span>
                        </div>
                      </div>
                      <div className="location-container">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="21"
                          viewBox="0 0 20 21"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_513_32)">
                            <path
                              d="M16.1335 2.80332C15.2891 2.00332 14.3446 1.3811 13.3002 0.936655C12.2557 0.49221 11.1557 0.269987 10.0002 0.269987C8.84461 0.269987 7.7335 0.49221 6.66683 0.936655C5.60016 1.3811 4.66683 2.00332 3.86683 2.80332C3.06683 3.60332 2.44461 4.53665 2.00016 5.60332C1.55572 6.66999 1.3335 7.7811 1.3335 8.93666C1.3335 10.0922 1.55572 11.1922 2.00016 12.2367C2.44461 13.2811 3.06683 14.2255 3.86683 15.07L8.46683 19.67C8.86683 20.07 9.36683 20.27 9.96683 20.27C10.5668 20.27 11.0891 20.07 11.5335 19.67L16.1335 15.07C16.9335 14.2255 17.5557 13.2811 18.0002 12.2367C18.4446 11.1922 18.6668 10.0922 18.6668 8.93666C18.6668 7.7811 18.4446 6.66999 18.0002 5.60332C17.5557 4.53665 16.9335 3.60332 16.1335 2.80332ZM15.2668 14.2033L10.6668 18.8033C10.4891 18.9811 10.2668 19.07 10.0002 19.07C9.7335 19.07 9.48905 18.9811 9.26683 18.8033L4.66683 14.2033C3.95572 13.4922 3.42239 12.6811 3.06683 11.77C2.71127 10.8589 2.5335 9.90332 2.5335 8.90332C2.5335 7.90332 2.71127 6.94777 3.06683 6.03665C3.42239 5.12554 3.95572 4.32554 4.66683 3.63665C5.37794 2.94777 6.18905 2.41443 7.10016 2.03666C8.01127 1.65888 8.96683 1.46999 9.96683 1.46999C10.9668 1.46999 11.9224 1.65888 12.8335 2.03666C13.7446 2.41443 14.5557 2.93666 15.2668 3.60332C16.2446 4.5811 16.9002 5.71443 17.2335 7.00332C17.5668 8.29221 17.5668 9.5811 17.2335 10.87C16.9002 12.1589 16.2446 13.27 15.2668 14.2033ZM10.0002 5.80332C9.15572 5.80332 8.42239 6.11443 7.80016 6.73666C7.17794 7.35888 6.86683 8.09221 6.86683 8.93666C6.86683 9.7811 7.17794 10.5033 7.80016 11.1033C8.42239 11.7033 9.15572 12.0033 10.0002 12.0033C10.8446 12.0033 11.5668 11.7033 12.1668 11.1033C12.7668 10.5033 13.0668 9.7811 13.0668 8.93666C13.0668 8.09221 12.7668 7.35888 12.1668 6.73666C11.5668 6.11443 10.8446 5.80332 10.0002 5.80332ZM10.0002 10.87C9.46683 10.87 9.01127 10.6811 8.6335 10.3033C8.25572 9.92554 8.06683 9.46999 8.06683 8.93666C8.06683 8.40332 8.25572 7.94777 8.6335 7.56999C9.01127 7.19221 9.46683 7.00332 10.0002 7.00332C10.5335 7.00332 10.9891 7.19221 11.3668 7.56999C11.7446 7.94777 11.9335 8.40332 11.9335 8.93666C11.9335 9.46999 11.7446 9.92554 11.3668 10.3033C10.9891 10.6811 10.5335 10.87 10.0002 10.87Z"
                              fill="#1A1A1A"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_513_32">
                              <rect
                                width="20"
                                height="20"
                                fill="white"
                                transform="matrix(1 0 0 -1 0 20.27)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        <span className="location">
                          {getPropertyLocation(property)}
                        </span>
                      </div>
                      <div className="specs">
                        <div className="spec">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="15"
                            viewBox="0 0 20 15"
                            fill="none"
                          >
                            <path
                              d="M17.5333 3.86667H8.73333C8.28889 3.86667 7.86667 4.00001 7.46667 4.26667C7.37778 3.60001 7.1 3.05556 6.63333 2.63334C6.16667 2.21112 5.62222 2.00001 5 2.00001C4.51111 2.00001 4.06667 2.11112 3.66667 2.33334V1.33334C3.66667 1.15556 3.61111 1.01112 3.5 0.900007C3.38889 0.788897 3.24444 0.733341 3.06667 0.733341H0.6C0.422222 0.733341 0.277778 0.788897 0.166667 0.900007C0.0555556 1.01112 0 1.15556 0 1.33334V13.8667C0 14.0445 0.0555556 14.1889 0.166667 14.3C0.277778 14.4111 0.422222 14.4667 0.6 14.4667H3.06667C3.24444 14.4667 3.38889 14.4111 3.5 14.3C3.61111 14.1889 3.66667 14.0445 3.66667 13.8667V11.9333H16.3333V13.8667C16.3333 14.0445 16.3889 14.1889 16.5 14.3C16.6111 14.4111 16.7556 14.4667 16.9333 14.4667H19.4C19.5778 14.4667 19.7222 14.4111 19.8333 14.3C19.9444 14.1889 20 14.0445 20 13.8667V6.33334C20 5.66667 19.7556 5.0889 19.2667 4.60001C18.7778 4.11112 18.2 3.86667 17.5333 3.86667ZM5 3.13334C5.35556 3.13334 5.65556 3.26667 5.9 3.53334C6.14444 3.80001 6.26667 4.11112 6.26667 4.46667C6.26667 4.82223 6.14444 5.12223 5.9 5.36667C5.65556 5.61112 5.35556 5.73334 5 5.73334C4.64444 5.73334 4.33333 5.61112 4.06667 5.36667C3.8 5.12223 3.66667 4.82223 3.66667 4.46667C3.66667 4.11112 3.8 3.80001 4.06667 3.53334C4.33333 3.26667 4.64444 3.13334 5 3.13334ZM3.66667 6.53334C4.06667 6.80001 4.5 6.93334 4.96667 6.93334C5.43333 6.93334 5.86667 6.80001 6.26667 6.53334V8.26667H3.66667V6.53334ZM18.8 13.2667H17.4667V11.3333C17.4667 11.2 17.4111 11.0778 17.3 10.9667C17.1889 10.8556 17.0667 10.8 16.9333 10.8H3.06667C2.93333 10.8 2.81111 10.8556 2.7 10.9667C2.58889 11.0778 2.53333 11.2 2.53333 11.3333V13.2667H1.2V1.93334H2.53333V8.86667C2.53333 9.00001 2.58889 9.13334 2.7 9.26667C2.81111 9.40001 2.93333 9.46667 3.06667 9.46667H18.8V13.2667ZM18.8 8.26667H7.46667V6.33334C7.46667 5.97779 7.58889 5.67779 7.83333 5.43334C8.07778 5.1889 8.37778 5.06667 8.73333 5.06667H17.5333C17.8889 5.06667 18.1889 5.1889 18.4333 5.43334C18.6778 5.67779 18.8 5.97779 18.8 6.33334V8.26667Z"
                              fill="#1A1A1A"
                            />
                          </svg>
                          <span className="spec-text">{specs.beds} Beds</span>
                        </div>
                        <div className="spec">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="21"
                            height="21"
                            viewBox="0 0 21 21"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_513_40)">
                              <path
                                d="M20.6401 10.7333C20.6401 10.2444 20.4735 9.83334 20.1401 9.5C19.8068 9.16667 19.3957 9 18.9068 9H3.77347V3.6C3.77347 3.15556 3.92903 2.77778 4.24014 2.46667C4.46236 2.24445 4.71791 2.11111 5.0068 2.06667C5.29569 2.02222 5.59569 2.04445 5.9068 2.13334C5.5068 2.75556 5.35125 3.44445 5.44014 4.2C5.52903 4.95556 5.84014 5.6 6.37347 6.13334L6.5068 6.33334C6.64014 6.42223 6.78458 6.46667 6.94014 6.46667C7.09569 6.46667 7.21792 6.42223 7.3068 6.33334L11.1068 2.53334C11.2401 2.4 11.3068 2.25556 11.3068 2.1C11.3068 1.94445 11.2401 1.8 11.1068 1.66667L10.9735 1.53334C10.3957 0.955559 9.69569 0.644447 8.87347 0.600002C8.05125 0.555559 7.32903 0.777781 6.7068 1.26667C6.17347 0.955559 5.59569 0.833336 4.97347 0.900003C4.35125 0.966669 3.81791 1.22223 3.37347 1.66667C2.84014 2.2 2.57347 2.84445 2.57347 3.6V9H2.37347C1.88458 9 1.47347 9.16667 1.14014 9.5C0.806803 9.83334 0.640137 10.2444 0.640137 10.7333C0.640137 11.1333 0.751248 11.4778 0.97347 11.7667C1.19569 12.0556 1.46236 12.2667 1.77347 12.4V13.6667C1.77347 14.7333 2.06236 15.7111 2.64014 16.6C3.21791 17.4889 3.95125 18.1778 4.84014 18.6667L4.3068 19.7333C4.21791 19.9111 4.2068 20.0667 4.27347 20.2C4.34014 20.3333 4.44014 20.4444 4.57347 20.5333C4.7068 20.6222 4.85125 20.6333 5.0068 20.5667C5.16236 20.5 5.28458 20.4 5.37347 20.2667L5.97347 19.0667C6.41791 19.1556 6.88458 19.2 7.37347 19.2H13.9068C14.3957 19.2 14.8624 19.1556 15.3068 19.0667L15.9068 20.2667C15.9957 20.4 16.1179 20.5 16.2735 20.5667C16.429 20.6333 16.5735 20.6222 16.7068 20.5333C16.8401 20.4444 16.9401 20.3333 17.0068 20.2C17.0735 20.0667 17.0624 19.9111 16.9735 19.7333L16.4401 18.6667C17.329 18.1778 18.0624 17.4889 18.6401 16.6C19.2179 15.7111 19.5068 14.7333 19.5068 13.6667V12.4C19.8179 12.2667 20.0846 12.0556 20.3068 11.7667C20.529 11.4778 20.6401 11.1333 20.6401 10.7333ZM9.84014 2.13334L6.97347 5.06667C6.66236 4.62223 6.52903 4.15556 6.57347 3.66667C6.61791 3.17778 6.81791 2.75556 7.17347 2.4C7.52903 2.04445 7.96236 1.84445 8.47347 1.8C8.98458 1.75556 9.44014 1.86667 9.84014 2.13334ZM2.37347 10.2H18.9068C19.0401 10.2 19.1624 10.2556 19.2735 10.3667C19.3846 10.4778 19.4401 10.6111 19.4401 10.7667C19.4401 10.9222 19.3846 11.0556 19.2735 11.1667C19.1624 11.2778 19.0401 11.3333 18.9068 11.3333H2.37347C2.24014 11.3333 2.11791 11.2778 2.0068 11.1667C1.89569 11.0556 1.84014 10.9222 1.84014 10.7667C1.84014 10.6111 1.89569 10.4778 2.0068 10.3667C2.11791 10.2556 2.24014 10.2 2.37347 10.2ZM18.3068 13.6667C18.3068 14.4667 18.1068 15.2 17.7068 15.8667C17.3068 16.5333 16.7735 17.0667 16.1068 17.4667C15.4401 17.8667 14.7068 18.0667 13.9068 18.0667H7.37347C6.57347 18.0667 5.84014 17.8667 5.17347 17.4667C4.5068 17.0667 3.97347 16.5333 3.57347 15.8667C3.17347 15.2 2.97347 14.4667 2.97347 13.6667V12.5333H18.3068V13.6667ZM9.1068 6.53334C9.1068 6.71111 9.16236 6.85556 9.27347 6.96667C9.38458 7.07778 9.51791 7.13334 9.67347 7.13334C9.82903 7.13334 9.96236 7.07778 10.0735 6.96667C10.1846 6.85556 10.2401 6.71111 10.2401 6.53334C10.2401 6.35556 10.1846 6.21111 10.0735 6.1C9.96236 5.98889 9.82903 5.93334 9.67347 5.93334C9.51791 5.93334 9.38458 5.98889 9.27347 6.1C9.16236 6.21111 9.1068 6.35556 9.1068 6.53334ZM10.7735 4.86667C10.7735 5.04445 10.829 5.18889 10.9401 5.3C11.0512 5.41111 11.1846 5.46667 11.3401 5.46667C11.4957 5.46667 11.629 5.41111 11.7401 5.3C11.8512 5.18889 11.9068 5.04445 11.9068 4.86667C11.9068 4.68889 11.8512 4.54445 11.7401 4.43334C11.629 4.32223 11.4957 4.26667 11.3401 4.26667C11.1846 4.26667 11.0512 4.32223 10.9401 4.43334C10.829 4.54445 10.7735 4.68889 10.7735 4.86667ZM11.1735 6.93334C11.1735 7.06667 11.229 7.2 11.3401 7.33334C11.4512 7.46667 11.5846 7.53334 11.7401 7.53334C11.8957 7.53334 12.029 7.46667 12.1401 7.33334C12.2512 7.2 12.3068 7.05556 12.3068 6.9C12.3068 6.74445 12.2512 6.61111 12.1401 6.5C12.029 6.38889 11.8957 6.33334 11.7401 6.33334C11.5846 6.33334 11.4512 6.38889 11.3401 6.5C11.229 6.61111 11.1735 6.75556 11.1735 6.93334Z"
                                fill="#1A1A1A"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_513_40">
                                <rect
                                  width="20"
                                  height="20"
                                  fill="white"
                                  transform="matrix(1 0 0 -1 0.640137 20.6)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                          <span className="spec-text">{specs.baths} Baths</span>
                        </div>
                        <div className="spec">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="21"
                            height="21"
                            viewBox="0 0 21 21"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_513_43)">
                              <path
                                d="M16.3867 19.4H13.9867C13.8534 19.4 13.72 19.4667 13.5867 19.6C13.4534 19.7333 13.3867 19.8778 13.3867 20.0333C13.3867 20.1889 13.4534 20.3222 13.5867 20.4333C13.72 20.5445 13.8534 20.6 13.9867 20.6H16.3867C16.5645 20.6 16.7089 20.5445 16.82 20.4333C16.9311 20.3222 16.9867 20.1889 16.9867 20.0333C16.9867 19.8778 16.9311 19.7333 16.82 19.6C16.7089 19.4667 16.5645 19.4 16.3867 19.4ZM11.6534 19.4H9.32002C9.14224 19.4 8.9978 19.4667 8.88669 19.6C8.77558 19.7333 8.72002 19.8778 8.72002 20.0333C8.72002 20.1889 8.77558 20.3222 8.88669 20.4333C8.9978 20.5445 9.14224 20.6 9.32002 20.6H11.6534C11.8311 20.6 11.9756 20.5445 12.0867 20.4333C12.1978 20.3222 12.2534 20.1889 12.2534 20.0333C12.2534 19.8778 12.1978 19.7333 12.0867 19.6C11.9756 19.4667 11.8311 19.4 11.6534 19.4ZM19.92 8.80001C19.7867 8.80001 19.6534 8.85556 19.52 8.96667C19.3867 9.07778 19.32 9.22223 19.32 9.40001V11.7333C19.32 11.9111 19.3867 12.0556 19.52 12.1667C19.6534 12.2778 19.7978 12.3333 19.9534 12.3333C20.1089 12.3333 20.2422 12.2778 20.3534 12.1667C20.4645 12.0556 20.52 11.9111 20.52 11.7333V9.40001C20.52 9.22223 20.4645 9.07778 20.3534 8.96667C20.2422 8.85556 20.0978 8.80001 19.92 8.80001ZM19.92 13.4667C19.7867 13.4667 19.6534 13.5333 19.52 13.6667C19.3867 13.8 19.32 13.9333 19.32 14.0667V16.4C19.32 16.5778 19.3867 16.7222 19.52 16.8333C19.6534 16.9445 19.7978 17 19.9534 17C20.1089 17 20.2422 16.9445 20.3534 16.8333C20.4645 16.7222 20.52 16.5778 20.52 16.4V14.0667C20.52 13.9333 20.4645 13.8 20.3534 13.6667C20.2422 13.5333 20.0978 13.4667 19.92 13.4667ZM6.98669 19.4H6.38669V18.8667C6.38669 18.6889 6.33113 18.5445 6.22002 18.4333C6.10891 18.3222 5.96446 18.2667 5.78669 18.2667C5.60891 18.2667 5.46446 18.3222 5.35335 18.4333C5.24224 18.5445 5.18669 18.6889 5.18669 18.8667V20C5.18669 20.1778 5.24224 20.3222 5.35335 20.4333C5.46446 20.5445 5.60891 20.6 5.78669 20.6H6.98669C7.12002 20.6 7.24224 20.5445 7.35335 20.4333C7.46446 20.3222 7.52002 20.1889 7.52002 20.0333C7.52002 19.8778 7.46446 19.7333 7.35335 19.6C7.24224 19.4667 7.12002 19.4 6.98669 19.4ZM19.92 5.26667H18.7867C18.6089 5.26667 18.4645 5.32223 18.3534 5.43334C18.2422 5.54445 18.1867 5.68889 18.1867 5.86667C18.1867 6.04445 18.2422 6.18889 18.3534 6.3C18.4645 6.41112 18.6089 6.46667 18.7867 6.46667H19.32V7.06667C19.32 7.20001 19.3867 7.32223 19.52 7.43334C19.6534 7.54445 19.7978 7.60001 19.9534 7.60001C20.1089 7.60001 20.2422 7.54445 20.3534 7.43334C20.4645 7.32223 20.52 7.20001 20.52 7.06667V5.86667C20.52 5.68889 20.4645 5.54445 20.3534 5.43334C20.2422 5.32223 20.0978 5.26667 19.92 5.26667ZM19.92 18.2667C19.7867 18.2667 19.6534 18.3222 19.52 18.4333C19.3867 18.5445 19.32 18.6889 19.32 18.8667V19.4H18.7867C18.6089 19.4 18.4645 19.4667 18.3534 19.6C18.2422 19.7333 18.1867 19.8778 18.1867 20.0333C18.1867 20.1889 18.2422 20.3222 18.3534 20.4333C18.4645 20.5445 18.6089 20.6 18.7867 20.6H19.92C20.0978 20.6 20.2422 20.5445 20.3534 20.4333C20.4645 20.3222 20.52 20.1778 20.52 20V18.8667C20.52 18.6889 20.4645 18.5445 20.3534 18.4333C20.2422 18.3222 20.0978 18.2667 19.92 18.2667ZM16.3867 5.26667H15.7867V1.2C15.7867 1.02223 15.72 0.877783 15.5867 0.766672C15.4534 0.655561 15.32 0.600004 15.1867 0.600004H1.12002C0.942242 0.600004 0.797797 0.655561 0.686686 0.766672C0.575575 0.877783 0.52002 1.02223 0.52002 1.2V15.2667C0.52002 15.4 0.575575 15.5333 0.686686 15.6667C0.797797 15.8 0.942242 15.8667 1.12002 15.8667H5.18669V16.4C5.18669 16.5778 5.24224 16.7222 5.35335 16.8333C5.46446 16.9445 5.60891 17 5.78669 17C5.96446 17 6.10891 16.9445 6.22002 16.8333C6.33113 16.7222 6.38669 16.5778 6.38669 16.4V6.46667H16.3867C16.5645 6.46667 16.7089 6.41112 16.82 6.3C16.9311 6.18889 16.9867 6.04445 16.9867 5.86667C16.9867 5.68889 16.9311 5.54445 16.82 5.43334C16.7089 5.32223 16.5645 5.26667 16.3867 5.26667ZM14.5867 5.26667H5.78669C5.60891 5.26667 5.46446 5.32223 5.35335 5.43334C5.24224 5.54445 5.18669 5.68889 5.18669 5.86667V14.6667H1.72002V1.8H14.5867V5.26667Z"
                                fill="#1A1A1A"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_513_43">
                                <rect
                                  width="20"
                                  height="20"
                                  fill="white"
                                  transform="matrix(1 0 0 -1 0.52002 20.6)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                          <span className="spec-text">{specs.sqft} sqft</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      ) : (
        <div className="no-properties">
          <p>No {activeTab} properties available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default PropertySlider;
