import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, MessageCircle, Mail, Share2 } from "lucide-react";
import "../Styles/property-card.css";
import axios from "axios";
import "../Styles/OffplanCard.css";
import { usePropertyContext } from "../Context/PropertyContext";

const OffplanCard = () => {
  const navigate = useNavigate();
  
  // Get data from PropertyContext instead of managing local state
  const { 
    offPlanProperties, 
    loading, 
    error, 
    currentPage, 
    paginationData,
    changePage,
    nextPage: contextNextPage,
    previousPage: contextPreviousPage,
    fetchOffPlanProperties,
    currentFilters
  } = usePropertyContext();

  // Local state for UI interactions
  const [localError, setLocalError] = useState(null);

  // Handle property details navigation
  const handlePropertyDetails = async (property) => {
    const property_id = property.apiId;
    try {
      if (property_id) {
        const { data } = await axios.get(
          `http://192.168.100.31:8000/get-offplan-single-property/?property_id=${property_id}`
        );
        console.log("Fetched property details:", data);
        // Navigate to detail page with the fetched data
        navigate(`/property/${property_id}`, {
          state: {
            propertyData: data.data,
            basicInfo: property, // Pass the basic property info as well
          },
        });
      }
    } catch (err) {
      console.log("Error fetching property details:", err);
      setLocalError("Failed to fetch property details");
      // Clear error after 3 seconds
      setTimeout(() => setLocalError(null), 3000);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (paginationData && page >= 1 && page <= paginationData.totalPages) {
      changePage(page);
    }
  };

  // Handle previous page
  const handlePrevPage = () => {
    contextPreviousPage();
  };

  // Handle next page
  const handleNextPage = () => {
    contextNextPage();
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    if (!paginationData || !paginationData.totalPages) return [];

    const { totalPages } = paginationData;
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Complex pagination logic for many pages
      if (currentPage <= 3) {
        // Show first 4 pages, ellipsis, and last page
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        if (totalPages > 5) {
          pageNumbers.push("...");
          pageNumbers.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show first page, ellipsis, and last 4 pages
        pageNumbers.push(1);
        if (totalPages > 5) {
          pageNumbers.push("...");
        }
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show first page, ellipsis, current page with neighbors, ellipsis, last page
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Format price helper function
  const formatPrice = (minPrice, maxPrice, currency = "AED") => {
    if (maxPrice && minPrice && minPrice !== maxPrice) {
      return `From ${currency} ${minPrice?.toLocaleString()} - ${currency} ${maxPrice?.toLocaleString()}`;
    }
    if (minPrice && minPrice > 0) {
      return `${currency} ${minPrice?.toLocaleString()}`;
    }
    return "Price on Request";
  };

  // Format completion date
  const formatCompletionDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Handle action buttons
  const handleCall = (e, property) => {
    e.stopPropagation();
    // Implement call functionality
    console.log("Calling agent for property:", property.name);
  };

  const handleWhatsApp = (e, property) => {
    e.stopPropagation();
    // Implement WhatsApp functionality
    console.log("Opening WhatsApp for property:", property.name);
  };

  const handleEmail = (e, property) => {
    e.stopPropagation();
    // Implement email functionality
    console.log("Opening email for property:", property.name);
  };

  const handleShare = (e, property) => {
    e.stopPropagation();
    // Implement share functionality
    console.log("Sharing property:", property.name);
  };

  // Initial data fetch when component mounts
  useEffect(() => {
    // Only fetch if we don't have data already (PropertyContext might have already loaded it)
    if (!offPlanProperties || !offPlanProperties.data || offPlanProperties.data.length === 0) {
      console.log("OffplanCard: Fetching initial off-plan properties");
      fetchOffPlanProperties({}, 1);
    }
  }, []);

  // Get properties data from context
  const getPropertiesData = () => {
    if (!offPlanProperties) return [];
    
    // Handle different response structures
    if (offPlanProperties.data) {
      return offPlanProperties.data;
    }
    
    // Fallback for direct array
    if (Array.isArray(offPlanProperties)) {
      return offPlanProperties;
    }
    
    return [];
  };

  const properties = getPropertiesData();

  // Show loading state
  if (loading) {
    return (
      <div className="offplan-container">
        <div className="loading" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading off-plan properties...
        </div>
      </div>
    );
  }

  // Show error state
  if (error || localError) {
    return (
      <div className="offplan-container">
        <div className="error" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          fontSize: '18px',
          color: '#e74c3c',
          textAlign: 'center'
        }}>
          {localError || error}
        </div>
      </div>
    );
  }

  // Show no results state
  if (!properties || properties.length === 0) {
    return (
      <div className="offplan-container">
        <div className="no-results" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          fontSize: '18px',
          color: '#666',
          textAlign: 'center'
        }}>
          <h3>No off-plan properties found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      </div>
    );
  }

  // Get total pages for pagination
  const totalPages = paginationData?.totalPages || 1;

  return (
    <div className="offplan-container">
      {/* Results Summary */}
      {paginationData && (
        <div className="results-summary" style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '5px',
          fontSize: '14px',
          color: '#666'
        }}>
          Showing {properties.length} of {paginationData.totalCount || 0} off-plan properties
          {currentFilters && Object.keys(currentFilters).some(key => 
            currentFilters[key] && 
            currentFilters[key] !== "" && 
            currentFilters[key] !== "all" &&
            key !== "propertyCollection"
          ) && (
            <span style={{ marginLeft: '10px', fontStyle: 'italic' }}>
              (filtered results)
            </span>
          )}
        </div>
      )}

      {/* Properties Grid */}
      <div className="offplan-properties-grid">
        {properties.map((property) => (
          <div
            key={property._id || property.id}
            className="offplan-property-card"
            onClick={() => handlePropertyDetails(property)}
            style={{ cursor: "pointer" }}
          >
            <div className="offplan-property-image">
              <img
                src={
                  property.mainImageUrl ||
                  property.coverImage?.url ||
                  "/placeholder.svg"
                }
                alt={property.name}
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                }}
              />
              {property.isPartnerProject && (
                <div className="featured-badge">Featured</div>
              )}
            </div>

            <div className="offplan-property-content">
              <h2 className="offplan-property-title">{property.name}</h2>

              <div className="offplan-property-address">
                <img src="/Assets/location.svg" alt="" />
                <span>{property.area}</span>
              </div>

              <div className="offplan-property-details">
                <div className="offplan-detail-row">
                  <span className="offplan-detail-label">Developer :</span>
                  <span className="offplan-detail-value">
                    {property.developer || "N/A"}
                  </span>
                </div>

                <div className="offplan-detail-row">
                  <span className="offplan-detail-label">Handover Date :</span>
                  <span className="offplan-detail-value">
                    {formatCompletionDate(property.completionDate)}
                  </span>
                </div>

                <div className="offplan-detail-row">
                  <span className="offplan-detail-label">Price :</span>
                  <span className="offplan-detail-value">
                    {property.priceRange ||
                      (property.formattedPrice !== "Price on Request"
                        ? property.formattedPrice
                        : formatPrice(
                            property.minPrice,
                            property.maxPrice,
                            property.priceCurrency
                          ))}
                  </span>
                </div>

                <div className="offplan-detail-row">
                  <span className="offplan-detail-label">Status :</span>
                  <span className="offplan-detail-value">
                    {property.saleStatus}
                  </span>
                </div>
              </div>

              <div className="offplan-property-actions">
                <button
                  className="offplan-call-agent-btn"
                  onClick={(e) => handleCall(e, property)}
                >
                  <Phone className="offplan-btn-icon" />
                  Call your Agent
                </button>

                <div className="offplan-action-icons">
                  <button
                    className="offplan-action-btn offplan-whatsapp-btn"
                    onClick={(e) => handleWhatsApp(e, property)}
                  >
                    <MessageCircle className="offplan-action-icon" />
                  </button>
                  <button
                    className="offplan-action-btn offplan-email-btn"
                    onClick={(e) => handleEmail(e, property)}
                  >
                    <Mail className="offplan-action-icon" />
                  </button>
                  <button
                    className="offplan-action-btn offplan-share-btn"
                    onClick={(e) => handleShare(e, property)}
                  >
                    <Share2 className="offplan-action-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {paginationData && totalPages > 1 && (
        <div className="real-estate-pagination">
          {/* Previous Button */}
          <button
            className="real-estate-pagination-btn"
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="real-estate-pagination-numbers">
            {generatePageNumbers().map((pageNumber, index) => (
              <React.Fragment key={index}>
                {pageNumber === "..." ? (
                  <span className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    className={`real-estate-pagination-number ${
                      pageNumber === currentPage ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            className="real-estate-pagination-btn"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Next
          </button>

          {/* Page Info */}
          <span className="real-estate-pagination-info">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default OffplanCard;