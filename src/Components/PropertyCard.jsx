import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../Styles/property-card.css";
import { Building2, Bed, Bath, RulerDimensionLine, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePropertyContext } from "../Context/PropertyContext";
import SeoAccordianText from "./SeoAccordianText";

export default function PropertyCard({ activefilter }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname;

  const getRouteType = () => {
    if (pageName.includes("/properties/sale") || pageName.includes("/sale")) {
      return "/sale";
    } else if (
      pageName.includes("/properties/rent") ||
      pageName.includes("/rent")
    ) {
      return "/rent";
    } else if (
      pageName.includes("/properties/commercial") ||
      pageName.includes("/commercial")
    ) {
      return "/commercial"; // Add commercial route detection
    } else if (
      pageName.includes("/properties/offplan") ||
      pageName.includes("/offplan")
    ) {
      return "/offplan";
    }
    return null;
  };

  const type = getRouteType();

  const {
    saleProperties,
    rentProperties,
    newOffPlanProperties,
    loading: contextLoading,
    error: contextError,
    currentFilters,
    fetchSingleProperty,
    clearSingleProperty,
    paginationtotalpages,
    currentPage,
    paginationData,
    changePage,
    nextPage,
    previousPage,
    isHeroSearch,
    updatePropertyCoordinates,
    hasActiveFilters, // Add this from context
  } = usePropertyContext();

  // State for component
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showNoResults, setShowNoResults] = useState(false); // ADDED: Track no results state

  // Currency conversion states
  const [selectedCurrency, setSelectedCurrency] = useState("AED");
  const USD_EXCHANGE_RATE = 0.27;

  // Swiper states for image carousel
  const swiperRefs = useRef([]);
  const prevRefs = useRef([]);
  const nextRefs = useRef([]);
  const [activeIndices, setActiveIndices] = useState([]);

  // SEO Accordion state
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // FIXED: Handle data when context properties change

  // FIXED: Complete useEffect with proper data processing logic
  useEffect(() => {
    console.log("PropertyCard: Data effect triggered");
    console.log("PropertyCard: Context loading:", contextLoading);
    console.log("PropertyCard: Has active filters:", hasActiveFilters);

    setLoading(contextLoading);
    setError(contextError);

    let processedData = [];
    let currentPropertyData = null;

    // FIXED: Get the appropriate property data based on route
    if (type === "/sale") {
      currentPropertyData = saleProperties;
    } else if (type === "/rent") {
      currentPropertyData = rentProperties;
    } else if (type === "/commercial") {
      currentPropertyData = saleProperties; // Commercial uses same state as sale
    } else if (type === "/offplan") {
      currentPropertyData = newOffPlanProperties;
    }

    console.log("PropertyCard: Current property data:", currentPropertyData);

    // FIXED: Handle different data states properly
    if (currentPropertyData && typeof currentPropertyData === "object") {
      // Check if this is a response with success property
      if (currentPropertyData.hasOwnProperty("success")) {
        console.log(
          "PropertyCard: Response has success property:",
          currentPropertyData.success
        );

        if (currentPropertyData.success === false) {
          // API explicitly returned no results
          console.log("PropertyCard: API returned no results");
          setData([]);
          setActiveIndices([]);
          setShowNoResults(true);
          setTotalCount(0);
          setTotalPages(0);
          return;
        } else if (currentPropertyData.success === true) {
          // API returned results - extract them
          processedData = extractDataArray(currentPropertyData);
        }
      } else if (Array.isArray(currentPropertyData)) {
        // Direct array response
        processedData = currentPropertyData;
      } else if (
        currentPropertyData.data ||
        currentPropertyData.results ||
        currentPropertyData.properties
      ) {
        // Object with data property
        processedData = extractDataArray(currentPropertyData);
      }
    }

    console.log("PropertyCard: Processed data length:", processedData.length);
    console.log("PropertyCard: Has active filters:", hasActiveFilters);

    // FIXED: Handle the case where we have filters but no results
    if (hasActiveFilters && processedData.length === 0) {
      console.log("PropertyCard: Filters applied but no results found");
      setData([]);
      setActiveIndices([]);
      setShowNoResults(true);
      setTotalCount(0);
      setTotalPages(0);
      return;
    }

    // FIXED: Handle successful results
    if (processedData.length > 0) {
      console.log(
        "PropertyCard: Setting data with",
        processedData.length,
        "properties"
      );

      // Process coordinates for properties that have them
      const dataWithCoordinates = processedData.map((property) => {
        const processedProperty = { ...property };

        if (
          property.address_information?.latitude &&
          property.address_information?.longitude
        ) {
          processedProperty.coordinates = {
            latitude: parseFloat(property.address_information.latitude),
            longitude: parseFloat(property.address_information.longitude),
          };
        }

        if (!processedProperty.coordinates && property.custom_fields) {
          const lat = property.custom_fields["pba__latitude_property"];
          const lng = property.custom_fields["pba__longitude_property"];

          if (lat && lng) {
            processedProperty.coordinates = {
              latitude: parseFloat(lat),
              longitude: parseFloat(lng),
            };
          }
        }

        return processedProperty;
      });

      setData(dataWithCoordinates);
      setActiveIndices(dataWithCoordinates.map(() => 0));
      updatePropertyCoordinates(dataWithCoordinates);
      setShowNoResults(false);

      // Update pagination info from context
      setTotalPages(paginationtotalpages || 0);
      if (paginationData) {
        setTotalCount(
          paginationData.totalActiveProperties ||
            paginationData.totalCount ||
            dataWithCoordinates.length
        );
      } else {
        setTotalCount(dataWithCoordinates.length);
      }

      console.log(
        "PropertyCard: Data set successfully with",
        dataWithCoordinates.length,
        "properties"
      );
    } else {
      // FIXED: Handle case where we have no data but also no active filters (initial load)
      if (!hasActiveFilters && !contextLoading) {
        console.log(
          "PropertyCard: No active filters and no data - might be initial load with no results"
        );
        setShowNoResults(false); // Don't show "no results" on initial load
      } else if (hasActiveFilters) {
        console.log(
          "PropertyCard: Has active filters but no data - show no results"
        );
        setShowNoResults(true);
      }

      setData([]);
      setActiveIndices([]);
      setTotalCount(0);
      setTotalPages(0);
    }
  }, [
    saleProperties,
    rentProperties,
    newOffPlanProperties,
    contextLoading,
    contextError,
    type,
    paginationtotalpages,
    paginationData,
    isHeroSearch,
    hasActiveFilters, // ADDED: Include hasActiveFilters in dependencies
  ]);
  // Helper function to extract data array from different response structures
  const extractDataArray = (responseData) => {
    console.log("PropertyCard: Extracting data from response:", responseData);

    if (!responseData) {
      console.log("PropertyCard: Response data is null/undefined");
      return [];
    }

    // Handle the Universal Filter response structure first
    if (responseData.success !== undefined) {
      console.log("PropertyCard: Detected Universal Filter response structure");

      if (responseData.success === false) {
        console.log(
          "PropertyCard: API response indicates failure:",
          responseData.message
        );
        return [];
      }

      if (responseData.data && Array.isArray(responseData.data)) {
        console.log(
          "PropertyCard: Found Universal Filter data array with",
          responseData.data.length,
          "items"
        );
        return responseData.data;
      }

      console.log("PropertyCard: Universal Filter response has no data array");
      return [];
    }

    // Handle direct array response
    if (Array.isArray(responseData)) {
      console.log(
        "PropertyCard: Response is array with",
        responseData.length,
        "items"
      );
      return responseData;
    }

    // Handle other response structures
    if (responseData.data && Array.isArray(responseData.data)) {
      console.log(
        "PropertyCard: Found data array with",
        responseData.data.length,
        "items"
      );
      return responseData.data;
    }

    if (responseData.results && Array.isArray(responseData.results)) {
      console.log(
        "PropertyCard: Found results array with",
        responseData.results.length,
        "items"
      );
      return responseData.results;
    }

    if (responseData.properties && Array.isArray(responseData.properties)) {
      console.log(
        "PropertyCard: Found properties array with",
        responseData.properties.length,
        "items"
      );
      return responseData.properties;
    }

    if (responseData.items && Array.isArray(responseData.items)) {
      console.log(
        "PropertyCard: Found items array with",
        responseData.items.length,
        "items"
      );
      return responseData.items;
    }

    console.log(
      "PropertyCard: Could not extract data array from response structure"
    );
    return [];
  };

  // Handle pagination - using context functions
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) {
      return;
    }
    console.log("PropertyCard: Changing to page", newPage);
    changePage(newPage);
  };

  const handlePrevPage = () => {
    console.log("PropertyCard: Going to previous page");
    previousPage();
  };

  const handleNextPage = () => {
    console.log("PropertyCard: Going to next page");
    nextPage();
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Toggle accordion
  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  // Format price with currency conversion
  const formatPrice = (price, currencyCode = "AED") => {
    if (!price || isNaN(price)) return "N/A";

    const numericPrice = parseFloat(price.toString().replace(/,/g, ""));
    let convertedPrice = numericPrice;
    let displayCurrency = selectedCurrency;

    if (selectedCurrency === "USD") {
      convertedPrice = numericPrice * USD_EXCHANGE_RATE;
    }

    const formattedPrice = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: selectedCurrency === "AED" ? 0 : 2,
    }).format(convertedPrice);

    return `${displayCurrency} ${formattedPrice}`;
  };

  // Navigate to single property page and fetch property data
  const getProperty = async (item) => {
    try {
      const propertyId = item.id;

      let propertyType;
      if (type === "/offplan") {
        propertyType = item.custom_fields?.offering_type || "OP";
      } else if (type === "/commercial") {
        propertyType = "Commercial"; // Set proper type for commercial
      } else {
        propertyType =
          item.general_listing_information?.listingtype ||
          (type === "/sale" ? "Sale" : "Rent");
      }

      console.log("PropertyCard: Navigating to property", {
        propertyId,
        propertyType,
        route: type,
      });

      clearSingleProperty();
      await fetchSingleProperty(propertyId, propertyType);
      navigate(`/single-property/?id=${propertyId}&type=${propertyType}`);
    } catch (error) {
      console.error("PropertyCard: Error fetching property data:", error);
      const propertyId = item.id;
      const propertyType =
        item.general_listing_information?.listingtype ||
        (type === "/offplan"
          ? "OP"
          : type === "/commercial"
          ? "Commercial"
          : type === "/sale"
          ? "Sale"
          : "Rent");
      navigate(`/single-property/?id=${propertyId}&type=${propertyType}`);
    }
  };

  // Initialize Swiper navigation after data is loaded
  useEffect(() => {
    if (data.length > 0) {
      swiperRefs.current.forEach((swiper, idx) => {
        if (
          swiper &&
          swiper.params?.navigation &&
          prevRefs.current[idx] &&
          nextRefs.current[idx]
        ) {
          swiper.params.navigation.prevEl = prevRefs.current[idx];
          swiper.params.navigation.nextEl = nextRefs.current[idx];
          swiper.navigation.init();
          swiper.navigation.update();
        }
      });
    }
  }, [data]);

  // FIXED: Helper function to get active filter summary
  const getActiveFilterSummary = () => {
    const filters = [];
    if (currentFilters.address)
      filters.push(`Location: ${currentFilters.address}`);
    if (
      currentFilters.propertyType &&
      currentFilters.propertyType !== "apartment"
    )
      filters.push(`Type: ${currentFilters.propertyType}`);
    if (currentFilters.bedrooms)
      filters.push(`Bedrooms: ${currentFilters.bedrooms}`);
    if (currentFilters.minPrice)
      filters.push(`Min Price: AED ${currentFilters.minPrice}`);
    if (currentFilters.maxPrice)
      filters.push(`Max Price: AED ${currentFilters.maxPrice}`);
    if (currentFilters.developer)
      filters.push(`Developer: ${currentFilters.developer}`);

    return filters.length > 0 ? filters.join(", ") : "No specific filters";
  };

  // Loading state
  if (loading) {
    return (
      <div className="real-estate-container">
        <div className="loading-state">
          <p>Loading properties...</p>
          {hasActiveFilters && (
            <p>Filtering properties based on your criteria...</p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="real-estate-container">
        <div className="error-state">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ADDED: No results state when filters are applied
  if (showNoResults && hasActiveFilters) {
    return (
      <div className="real-estate-container">
        <div className="no-results-state">
          <div className="no-results-content">
            <h2>No Properties Found</h2>
            <p>Sorry, no properties match your current search criteria.</p>
            <div className="current-filters">
              <h3>Current Filters:</h3>
              <p>{getActiveFilterSummary()}</p>
            </div>
            <div className="suggestions">
              <h3>Try:</h3>
              <ul>
                <li>Removing some filters to broaden your search</li>
                <li>Adjusting your price range</li>
                <li>Selecting a different property type</li>
                <li>Searching in a different area</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="reset-search-btn"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ADDED: Initial empty state (no filters, no results)
  if (!loading && data.length === 0 && !hasActiveFilters) {
    return (
      <div className="real-estate-container">
        <div className="empty-state">
          <h2>No Properties Available</h2>
          <p>There are currently no properties available in this category.</p>
        </div>
      </div>
    );
  }

  // Calculate items per page and range for display
  const itemsPerPage =
    paginationData?.itemsPerPage || paginationData?.limit || 10;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="real-estate-container">
      {/* Results Summary */}
      {paginationData && data.length > 0 && (
        <div className="real-estate-results-summary">
          <p>
            Showing {startItem} - {endItem} of {totalCount} properties
            {currentPage > 1 && (
              <span>
                {" "}
                (Page {currentPage} of {totalPages})
              </span>
            )}
            {type === "/offplan" && (
              <span className="property-type-badge"> (Off-Plan)</span>
            )}
            {type === "/sale" && (
              <span className="property-type-badge"> (For Sale)</span>
            )}
            {type === "/rent" && (
              <span className="property-type-badge"> (For Rent)</span>
            )}
            {type === "/commercial" && (
              <span className="property-type-badge"> (Commercial)</span>
            )}
          </p>
        </div>
      )}

      {/* Property Listings */}
      {data.map((item, index) => {
        const propertyImages = item?.listing_media?.images?.image || [];

        return (
          <div
            className="real-estate-listing-card"
            key={item.id || `property-${index}`}
            onClick={() => getProperty(item)}
          >
            <div className="real-estate-image-section">
              <img
                src={
                  propertyImages[activeIndices[index]]
                    ? propertyImages[activeIndices[index]].url
                    : "/placeholder-image.jpg"
                }
                alt="Main property"
                className="real-estate-main-image"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />

              {propertyImages.length > 1 && (
                <div className="real-estate-carousel-wrapper">
                  <button
                    className="real-estate-nav-btn real-estate-nav-prev"
                    ref={(el) => (prevRefs.current[index] = el)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ‹
                  </button>

                  <div className="real-estate-carousel-container">
                    <Swiper
                      modules={[Navigation]}
                      slidesPerView={Math.min(3, propertyImages.length)}
                      spaceBetween={15}
                      onSwiper={(swiper) => {
                        swiperRefs.current[index] = swiper;
                      }}
                      onSlideChange={(swiper) => {
                        setActiveIndices((prev) => {
                          const updated = [...prev];
                          updated[index] = swiper.activeIndex;
                          return updated;
                        });
                      }}
                    >
                      {propertyImages.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <img
                            src={img.url}
                            alt={`real-estate-img-${idx}`}
                            onError={(e) => {
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  <button
                    className="real-estate-nav-btn real-estate-nav-next"
                    ref={(el) => (nextRefs.current[index] = el)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ›
                  </button>
                </div>
              )}

              {propertyImages.length > 0 && (
                <span className="real-estate-image-count">
                  {propertyImages.length}
                </span>
              )}
            </div>

            <div className="real-estate-info-section">
              <div className="real-estate-header">
                <div className="real-estate-title-location">
                  <h2 className="real-estate-property-title">
                    {item.general_listing_information?.listing_title ||
                      "Property"}
                  </h2>
                  <div className="real-estate-address">
                    <MapPin size={17} className="real-estate-location-icon" />
                    <span className="real-estate-location-text">
                      {item.custom_fields?.pba__addresstext_pb ||
                        item.address_information?.address ||
                        "Location not specified"}
                    </span>
                  </div>
                </div>
                <div className="real-estate-pricing">
                  <span className="real-estate-price-amount">
                    {formatPrice(
                      item.general_listing_information?.listingprice,
                      item.general_listing_information?.currency_iso_code
                    )}
                  </span>
                  {type === "/rent" && (
                    <span className="real-estate-price-period">/month</span>
                  )}
                </div>
              </div>

              <p className="real-estate-description">
                {item.general_listing_information?.description ||
                  "No description available."}
              </p>

              <div className="real-estate-amenities">
                <div className="real-estate-amenity">
                  <Building2 size={17} className="real-estate-amenity-icon" />
                  <span className="real-estate-amenity-text">
                    {item.general_listing_information?.propertytype ||
                      "Property"}
                  </span>
                </div>
                <div className="real-estate-amenity">
                  <img src="/Assets/bed.png" alt="" />
                  <span className="real-estate-amenity-text">
                    {item.general_listing_information?.bedrooms || "N/A"} Beds
                  </span>
                </div>
                <div className="real-estate-amenity">
                  <img src="/Assets/bath.png" alt="" />
                  <span className="real-estate-amenity-text">
                    {item.general_listing_information?.fullbathrooms || "N/A"}{" "}
                    Baths
                  </span>
                </div>
                <div className="real-estate-amenity">
                  <img src="/Assets/sq.png" alt="" />
                  <span className="real-estate-amenity-text">
                    {item.general_listing_information?.totalarea
                      ? `${item.general_listing_information.totalarea} sq.ft`
                      : "Area not specified"}
                  </span>
                </div>
              </div>

              <div className="real-estate-footer">
                <div className="real-estate-agent-info">
                  <div className="real-estate-agent-avatar">
                    <img
                      src="https://preview.redd.it/daniel-radcliffe-images-showing-that-he-already-looks-ideal-v0-url4ohi24o0b1.png?width=1401&format=png&auto=webp&s=08946dde24472da1012a02d0c7889c26bfbe81f2"
                      alt="Agent"
                      width={50}
                      height={50}
                      className="real-estate-agent-img"
                    />
                  </div>
                  <div className="real-estate-agent-details">
                    <p className="real-estate-agent-name">
                      {`${item.listing_agent?.listing_agent_firstname || ""} ${
                        item.listing_agent?.listing_agent_lastname || ""
                      }`.trim() || "Agent"}
                    </p>
                    <p className="real-estate-agent-role">
                      {type === "/offplan"
                        ? "Off-Plan Specialist"
                        : type === "/commercial"
                        ? "Commercial Specialist"
                        : "Real Estate Agent"}
                    </p>
                  </div>
                </div>

                <div className="real-estate-actions">
                  <button
                    className="real-estate-call-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>
                      {type === "/offplan"
                        ? "Get Info"
                        : type === "/commercial"
                        ? "Get Commercial Info"
                        : "Call Your Agent"}
                    </span>
                    <span>
                      <img src="/Assets/agent.png" alt="" />
                    </span>
                  </button>
                  <button
                    className="real-estate-icon-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img src="/Assets/whats.png" alt="" />
                  </button>
                  <button
                    className="real-estate-icon-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img src="/Assets/share.png" alt="" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Enhanced Pagination */}
      {totalPages > 1 && data.length > 0 && (
        <div className="real-estate-pagination">
          <button
            className="real-estate-pagination-btn"
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            Previous
          </button>

          <div className="real-estate-pagination-numbers">
            {currentPage > 3 && (
              <>
                <button
                  className="real-estate-pagination-number"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
                {currentPage > 4 && (
                  <span className="pagination-ellipsis">...</span>
                )}
              </>
            )}

            {generatePageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                className={`real-estate-pagination-number ${
                  pageNumber === currentPage ? "active" : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="pagination-ellipsis">...</span>
                )}
                <button
                  className="real-estate-pagination-number"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            className="real-estate-pagination-btn"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Next
          </button>

          <span className="real-estate-pagination-info">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
      <SeoAccordianText
        setIsAccordionOpen={setIsAccordionOpen}
        isAccordionOpen={isAccordionOpen}
        toggleAccordion={toggleAccordion}
        type={type}
        currentFilters={currentFilters}
      />
    </div>
  );
}
