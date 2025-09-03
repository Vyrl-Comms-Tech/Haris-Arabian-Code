import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "../Styles/single-property-page.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { usePropertyContext } from "../Context/PropertyContext"; // Import context
import MortgageCalculator from "./MortgageCalculator";
import SinglePropertyCharts from "./SinglePropertyCharts";
import SinglePropertyRightStick from "./SinglePropertyRightStick";
import SimilarPropertySection from "./SimilarPropertySection";
import RentalYieldCalculator from "./RentalYieldCalculator";
import SimilarPropertySlider from "./SimilarPropertySlider";

const SinglePropertyPage = () => {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const propertyType = urlParams.get("type"); // 'Rent' or 'Sale'
  const propertyId = urlParams.get("id");

  // Get single property data from context
  const {
    singleProperty,
    singlePropertyLoading,
    singlePropertyError,
    fetchSingleProperty,
    clearSingleProperty,
  } = usePropertyContext();

  // Determine if this is a rental property (case-insensitive check)
  const isRental = propertyType?.toLowerCase() === "rent";

  // Calculator toggle state
  const [showRentalYield, setShowRentalYield] = useState(false);

  // Tab state for General/Amenities
  const [activeTab, setActiveTab] = useState("general");

  // Map states - Simplified to avoid conflicts
  const [showFullMap, setShowFullMap] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  // Google Maps container style
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const fullMapContainerStyle = {
    width: "100%",
    height: "80vh",
  };

  // Dynamic location coordinates based on property data
  const getLocation = () => {
    if (
      singleProperty &&
      singleProperty.address_information?.latitude &&
      singleProperty.address_information?.longitude
    ) {
      return {
        lat: parseFloat(singleProperty.address_information.latitude),
        lng: parseFloat(singleProperty.address_information.longitude),
        address: singleProperty.address_information?.city || "Dubai, UAE",
      };
    }
    // Fallback location (Burj Khalifa Coordinates)
    return {
      lat: 25.1972,
      lng: 55.2744,
      address: "Dubai, UAE",
    };
  };

  const location = getLocation();

  // Mortgage calculator states (only for sales properties)
  const [purchasePrice, setPurchasePrice] = useState(224204);
  const [downPayment, setDownPayment] = useState(44841);
  const [interestRate, setInterestRate] = useState(4.8);
  const [loanTerm, setLoanTerm] = useState(25);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Calculator toggle handler
  const handleCalculatorToggle = () => {
    setShowRentalYield(!showRentalYield);
  };

  // Handle successful Google Maps load
  const handleGoogleMapsLoad = () => {
    console.log("Google Maps loaded successfully!");
    setGoogleMapsLoaded(true);
  };

  // Handle Google Maps load error
  const handleGoogleMapsError = (error) => {
    console.error("Google Maps loading error:", error);
    setGoogleMapsLoaded(false);
  };

  // Fetch single property data if not available
  useEffect(() => {
    if (
      propertyId &&
      propertyType &&
      !singleProperty &&
      !singlePropertyLoading
    ) {
      console.log("SinglePropertyPage: Fetching property data", {
        propertyId,
        propertyType,
      });
      fetchSingleProperty(propertyId, propertyType);
    }
    if (
      singleProperty &&
      singleProperty.general_listing_information?.listingprice &&
      !isRental
    ) {
      const price = parseFloat(
        singleProperty.general_listing_information.listingprice.replace(
          /,/g,
          ""
        )
      );
      if (!isNaN(price)) {
        setPurchasePrice(price);
        setDownPayment(price > 5000000 ? price * 0.3 : price * 0.2); // 20% down payment
      }
    }
  }, [
    propertyId,
    propertyType,
    singleProperty,
    singlePropertyLoading,
    fetchSingleProperty,
    singleProperty,
    isRental,
  ]);

  // Get property details from singleProperty data
  const getGeneralItems = () => {
    if (singleProperty) {
      return [
        {
          id: 1,
          name: "Property Type",
          count:
            singleProperty.general_listing_information?.propertytype || "N/A",
        },
        {
          id: 2,
          name: "Bedrooms",
          count: singleProperty.general_listing_information?.bedrooms || "N/A",
        },
        {
          id: 3,
          name: "Bathrooms",
          count:
            singleProperty.general_listing_information?.fullbathrooms || "N/A",
        },
        {
          id: 4,
          name: "Area",
          count: singleProperty.general_listing_information?.totalarea
            ? `${singleProperty.general_listing_information.totalarea} sq.ft`
            : "N/A",
        },
      ];
    }
    return [
      { id: 1, name: "Bedrooms", count: "02" },
      { id: 2, name: "Bathrooms", count: "02" },
      { id: 3, name: "Area", count: "838 sq.ft" },
    ];
  };

  const generalItems = getGeneralItems();

  // Mortgage calculation (only for sales properties)
  useEffect(() => {
    if (!isRental) {
      const principal = purchasePrice - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;

      if (monthlyRate === 0) {
        setMonthlyPayment(principal / numberOfPayments);
      } else {
        const monthlyPaymentCalc =
          (principal *
            monthlyRate *
            Math.pow(1 + monthlyRate, numberOfPayments)) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        setMonthlyPayment(monthlyPaymentCalc);
      }
    }
  }, [purchasePrice, downPayment, interestRate, loanTerm, isRental]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-AE").format(num);
  };

  const handleViewMap = () => {
    setShowFullMap(true);
  };

  const handleCloseFullMap = () => {
    setShowFullMap(false);
  };

  // Get images from property data
  const getImages = () => {
    if (singleProperty && singleProperty.listing_media?.images?.image) {
      return singleProperty.listing_media.images.image.map((img) => img.url);
    }
    // Fallback images
    return [
      "https://media.istockphoto.com/id/1255835530/photo/modern-custom-suburban-home-exterior.jpg?s=612x612&w=0&k=20&c=0Dqjm3NunXjZtWVpsUvNKg2A4rK2gMvJ-827nb4AMU4=",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPO3fayo2ycBKmY63jwB1SfXlOanEF91itMw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqnbTn0gKzmhEu5uAr05c8uf7zsbKWrsShdg&s",
    ];
  };

  const images = getImages();

  // Show loading state while fetching property data
  if (singlePropertyLoading) {
    return (
      <div className="single-property-page">
        <div
          className="loading-message"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h2>Loading property details...</h2>
          <p>Please wait while we fetch the property information.</p>
        </div>
      </div>
    );
  }

  // Show error state if property data failed to load
  if (singlePropertyError) {
    return (
      <div className="single-property-page">
        <div
          className="error-message"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h2>Error Loading Property</h2>
          <p>{singlePropertyError}</p>
          <button
            onClick={() => fetchSingleProperty(propertyId, propertyType)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="single-property-page">
        {/* Swiper Section */}
        <div className="single-property-page-swiper-one">
          <Swiper
            slidesPerView="auto"
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            className="mySwiper"
            navigation={true}
            modules={[Navigation]}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image} alt={`Property ${index + 1}`} />
              </SwiperSlide>
            ))}
            <div className="image-count-badge">📷 {images.length}</div>
          </Swiper>
        </div>

        {/* Property Details */}
        <div className="single-property-page-detail">
          <div className="single-property-page-detail-left">
            <div className="single-property-page-detail-left-head">
              <div className="single-property-page-detail-left-head-text">
                <div className="single-property-page-detail-left-head-text-first">
                  <h1>
                    {singleProperty?.general_listing_information
                      ?.listing_title || "Property Details"}
                  </h1>
                  <div className="single-property-page-detail-left-head-icon-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 22 24"
                      fill="none"
                    >
                      <path
                        d="M18 24C17.0278 24 16.2014 23.65 15.5208 22.95C14.8403 22.25 14.5 21.4 14.5 20.4C14.5 20.28 14.5292 20 14.5875 19.56L6.39167 14.64C6.08056 14.94 5.72083 15.1752 5.3125 15.3456C4.90417 15.516 4.46667 15.6008 4 15.6C3.02778 15.6 2.20139 15.25 1.52083 14.55C0.840278 13.85 0.5 13 0.5 12C0.5 11 0.840278 10.15 1.52083 9.45C2.20139 8.75 3.02778 8.4 4 8.4C4.46667 8.4 4.90417 8.4852 5.3125 8.6556C5.72083 8.826 6.08056 9.0608 6.39167 9.36L14.5875 4.44C14.5486 4.3 14.5245 4.1652 14.5152 4.0356C14.5058 3.906 14.5008 3.7608 14.5 3.6C14.5 2.6 14.8403 1.75 15.5208 1.05C16.2014 0.35 17.0278 0 18 0C18.9722 0 19.7986 0.35 20.4792 1.05C21.1597 1.75 21.5 2.6 21.5 3.6C21.5 4.6 21.1597 5.45 20.4792 6.15C19.7986 6.85 18.9722 7.2 18 7.2C17.5333 7.2 17.0958 7.1148 16.6875 6.9444C16.2792 6.774 15.9194 6.5392 15.6083 6.24L7.4125 11.16C7.45139 11.3 7.47589 11.4352 7.486 11.5656C7.49611 11.696 7.50078 11.8408 7.5 12C7.49922 12.1592 7.49455 12.3044 7.486 12.4356C7.47744 12.5668 7.45294 12.7016 7.4125 12.84L15.6083 17.76C15.9194 17.46 16.2792 17.2252 16.6875 17.0556C17.0958 16.886 17.5333 16.8008 18 16.8C18.9722 16.8 19.7986 17.15 20.4792 17.85C21.1597 18.55 21.5 19.4 21.5 20.4C21.5 21.4 21.1597 22.25 20.4792 22.95C19.7986 23.65 18.9722 24 18 24ZM18 21.6C18.3306 21.6 18.6078 21.4852 18.8318 21.2556C19.0558 21.026 19.1674 20.7408 19.1667 20.4C19.1659 20.0592 19.0539 19.7744 18.8307 19.5456C18.6074 19.3168 18.3306 19.2016 18 19.2C17.6694 19.1984 17.3926 19.3136 17.1693 19.5456C16.9461 19.7776 16.8341 20.0624 16.8333 20.4C16.8326 20.7376 16.9446 21.0228 17.1693 21.2556C17.3941 21.4884 17.671 21.6032 18 21.6ZM4 13.2C4.33056 13.2 4.60783 13.0848 4.83183 12.8544C5.05583 12.624 5.16744 12.3392 5.16667 12C5.16589 11.6608 5.05389 11.376 4.83067 11.1456C4.60744 10.9152 4.33056 10.8 4 10.8C3.66944 10.8 3.39256 10.9152 3.16933 11.1456C2.94611 11.376 2.83411 11.6608 2.83333 12C2.83256 12.3392 2.94456 12.6244 3.16933 12.8556C3.39411 13.0868 3.671 13.2016 4 13.2ZM18 4.8C18.3306 4.8 18.6078 4.6848 18.8318 4.4544C19.0558 4.224 19.1674 3.9392 19.1667 3.6C19.1659 3.2608 19.0539 2.976 18.8307 2.7456C18.6074 2.5152 18.3306 2.4 18 2.4C17.6694 2.4 17.3926 2.5152 17.1693 2.7456C16.9461 2.976 16.8341 3.2608 16.8333 3.6C16.8326 3.9392 16.9446 4.2244 17.1693 4.4556C17.3941 4.6868 17.671 4.8016 18 4.8Z"
                        fill="#E6E6E6"
                      />
                    </svg>
                  </div>
                </div>
                <div className="single-property-page-detail-left-head-text-loc">
                  <span>🗺</span> <p>{location.address}</p>
                </div>
                <p className="single-property-page-detail-left-head-text-des">
                  {singleProperty?.general_listing_information?.bedrooms ||
                    "N/A"}{" "}
                  Bedroom{" "}
                  {singleProperty?.general_listing_information?.propertytype ||
                    "Property"}{" "}
                  for {isRental ? "Rent" : "Sale"} in{" "}
                  {singleProperty?.address_information?.city || "Dubai"}.
                </p>

                {/* Property Description */}
                {singleProperty?.general_listing_information?.description && (
                  <div
                    className="property-description-section"
                    style={{ marginBottom: "20px" }}
                  >
                    <h3>Property Description</h3>
                    <p style={{ lineHeight: "1.6", color: "#666" }}>
                      {singleProperty.general_listing_information.description}
                    </p>
                  </div>
                )}

                {/* General and Amenities Tabs Section */}
                <div
                  className="property-details-section"
                  style={{ marginBottom: "20px" }}
                >
                  {/* Tab Navigation */}
                  <div
                    className="tab-navigation"
                    style={{
                      display: "flex",
                      borderBottom: "2px solid #f0f0f0",
                      marginBottom: "20px",
                    }}
                  >
                    <button
                      onClick={() => setActiveTab("general")}
                      style={{
                        padding: "12px 24px",
                        border: "none",
                        backgroundColor: "transparent",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        borderBottom:
                          activeTab === "general"
                            ? "3px solid #007bff"
                            : "3px solid transparent",
                        color: activeTab === "general" ? "#007bff" : "#666",
                        transition: "all 0.3s ease",
                      }}
                    >
                      General
                    </button>
                    {singleProperty?.custom_fields?.private_amenities && (
                      <button
                        onClick={() => setActiveTab("amenities")}
                        style={{
                          padding: "12px 24px",
                          border: "none",
                          backgroundColor: "transparent",
                          fontSize: "16px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          borderBottom:
                            activeTab === "amenities"
                              ? "3px solid #007bff"
                              : "3px solid transparent",
                          color: activeTab === "amenities" ? "#007bff" : "#666",
                          transition: "all 0.3s ease",
                        }}
                      >
                        Amenities
                      </button>
                    )}
                  </div>

                  {/* Tab Content */}
                  {activeTab === "general" && (
                    <div className="general-tab-content">
                      <div className="shower-section">
                        <div className="shower-container">
                          {generalItems.map((item, index) => (
                            <div
                              key={item.id}
                              className={`shower-item item-${index + 1}`}
                            >
                              <div className="shower-content">
                                <span className="bullet"></span>
                                <span className="shower-name">{item.name}</span>
                                <span className="shower-count">
                                  {item.count}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "amenities" &&
                    singleProperty?.custom_fields?.private_amenities && (
                      <div className="amenities-tab-content">
                        <div
                          className="amenities-list"
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "15px",
                          }}
                        >
                          {singleProperty.custom_fields.private_amenities
                            .split(";")
                            .filter((amenity) => amenity.trim())
                            .map((amenity, index) => (
                              <div
                                key={index}
                                className="amenity-item"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  padding: "8px 12px",
                                  backgroundColor: "#f8f9fa",
                                  borderRadius: "6px",
                                  border: "1px solid #e9ecef",
                                }}
                              >
                                <span
                                  className="bullet"
                                  style={{
                                    width: "8px",
                                    height: "8px",
                                    backgroundColor: "#007bff",
                                    borderRadius: "50%",
                                    flexShrink: 0,
                                  }}
                                ></span>
                                <span style={{ fontSize: "14px" }}>
                                  {amenity.trim()}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Map Section - Single LoadScript wrapper */}
                <div className="location-section">
                  <h2 className="location-title">Property Location</h2>
                  <div
                    className="map-container"
                    style={{ position: "relative" }}
                  >
                    <LoadScript
                      googleMapsApiKey="AIzaSyBE08qJpTWuwc3ipnEYaD7HGawoe8_Yzog"
                      onLoad={handleGoogleMapsLoad}
                      onError={handleGoogleMapsError}
                      preventGoogleFontsLoading={true}
                      loadingElement={
                        <div
                          style={{
                            width: "100%",
                            height: "400px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f5f5f5",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <div
                              style={{
                                fontSize: "16px",
                                marginBottom: "10px",
                                color: "#666",
                              }}
                            >
                              Loading Map...
                            </div>
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                border: "4px solid #f3f3f3",
                                borderTop: "4px solid #007bff",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite",
                                margin: "0 auto",
                              }}
                            />
                          </div>
                        </div>
                      }
                    >
                      {googleMapsLoaded && (
                        <>
                          <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={location}
                            zoom={14}
                            options={{
                              mapTypeId: "roadmap",
                              zoomControl: true,
                              streetViewControl: false,
                              mapTypeControl: true,
                              fullscreenControl: false,
                            }}
                            onLoad={(map) => {
                              console.log(
                                "GoogleMap component loaded successfully"
                              );
                            }}
                          >
                            <Marker
                              position={location}
                              title={
                                singleProperty?.general_listing_information
                                  ?.listing_title || "Property Location"
                              }
                            />
                          </GoogleMap>

                          {/* Address overlay */}
                          <div
                            className="address-overlay"
                            style={{
                              position: "absolute",
                              bottom: "20px",
                              left: "20px",
                              background: "rgba(255,255,255,0.9)",
                              padding: "10px",
                              borderRadius: "5px",
                              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                            }}
                          >
                            <div
                              className="address-text"
                              style={{
                                fontWeight: "bold",
                                marginBottom: "5px",
                              }}
                            >
                              {location.address}
                            </div>
                            <button
                              className="view-map-btn"
                              onClick={handleViewMap}
                              style={{
                                background: "#007bff",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "3px",
                                cursor: "pointer",
                              }}
                            >
                              View Full Map
                            </button>
                          </div>

                          {/* Full Map Modal */}
                          {showFullMap && (
                            <div
                              className="full-map-modal"
                              onClick={handleCloseFullMap}
                              style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.8)",
                                zIndex: 1000,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                className="full-map-container"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  width: "90%",
                                  height: "90%",
                                  backgroundColor: "white",
                                  borderRadius: "10px",
                                  overflow: "hidden",
                                  position: "relative",
                                }}
                              >
                                <div
                                  className="full-map-header"
                                  style={{
                                    padding: "15px",
                                    borderBottom: "1px solid #ddd",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    className="full-map-title"
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {location.address}
                                  </div>
                                  <button
                                    className="close-btn"
                                    onClick={handleCloseFullMap}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      fontSize: "24px",
                                      cursor: "pointer",
                                      padding: "0",
                                      width: "30px",
                                      height: "30px",
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                                <div
                                  className="full-map"
                                  style={{ height: "calc(100% - 70px)" }}
                                >
                                  <GoogleMap
                                    mapContainerStyle={fullMapContainerStyle}
                                    center={location}
                                    zoom={15}
                                    options={{
                                      zoomControl: true,
                                      streetViewControl: true,
                                      mapTypeControl: true,
                                      fullscreenControl: true,
                                      gestureHandling: "greedy",
                                    }}
                                  >
                                    <Marker
                                      position={location}
                                      title={
                                        singleProperty
                                          ?.general_listing_information
                                          ?.listing_title || "Property Location"
                                      }
                                    />
                                  </GoogleMap>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </LoadScript>
                  </div>
                </div>

                {/* Similar Property Component */}
                <SimilarPropertySection />

                {/* Calculator Toggler - Only show for Sale properties */}
                {!isRental && (
                  <>
                    <div className="Calculator-Toggler">
                      <h1 className="mortgage-calculator-title">
                        {showRentalYield
                          ? "Rental Yield Calculator"
                          : "Mortgage Calculator"}
                      </h1>
                      <button onClick={handleCalculatorToggle}>
                        {showRentalYield
                          ? "Mortgage Calculator"
                          : "Rental Yield Calculator"}
                      </button>
                    </div>

                    {/* Conditional Calculator Rendering */}
                    {showRentalYield ? (
                      <RentalYieldCalculator purchasePrice={purchasePrice} />
                    ) : (
                      <MortgageCalculator
                        isVisible={!isRental}
                        purchasePrice={purchasePrice}
                        setPurchasePrice={setPurchasePrice}
                        downPayment={downPayment}
                        setDownPayment={setDownPayment}
                        interestRate={interestRate}
                        setInterestRate={setInterestRate}
                        loanTerm={loanTerm}
                        setLoanTerm={setLoanTerm}
                        monthlyPayment={monthlyPayment}
                        formatCurrency={formatCurrency}
                        formatNumber={formatNumber}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Side Panel */}
          <SinglePropertyRightStick />
        </div>

        <SinglePropertyCharts />

        <h1>Similar Properties</h1>
        {/* {console.log(singleProperty.custom_fields.pba_uaefields__community_propertyfinder)} */}
        {/* This is causing an error while reloading of page will fix that later on */}
        <SimilarPropertySlider
          currentPropertyAddress={
            singleProperty?.custom_fields?.community || ""
          }
          currentPropertyType={propertyType}
          isRental={isRental}
        />
      </div>
    </>
  );
};

export default SinglePropertyPage;
