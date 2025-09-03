import axios from "axios";
import React, { useEffect, useState } from "react";

import { Bath, Bed, Square } from "lucide-react";
function SimilarPropertySection() {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyType = urlParams.get("type"); // 'Rent' or 'Sale'
  const isRental = propertyType?.toLowerCase() === "rent";

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getApiConfig = () => {
    const baseConfig = {
      headers: {
        accept: "application/json",
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJpbmRpY2F0b3IiLCJ0cmFuc2FjdGlvbiJdLCJleHAiOjE3NTM5MDkxOTkuMCwiY29tcGFueSI6IkFyYWJpYW5fRXN0YXRlIiwiY291bnRyeSI6IkFFIiwieWVhcmxpbWl0Ijo0fQ.UM0fwptQeXO4v8faMsQkXFVR66BRcEppIlKZmKGlAkU",
      },
      params: {
        property_id: 26012,
        alias: "last-five",
        currency: "aed",
        measurement: "imp",
        property_type: "Residential",
        property_subtype: "Apartment",
      },
    };

    // Choose endpoint based on property type
    if (isRental) {
      return {
        ...baseConfig,
        baseURL: "https://api.reidin.com/api/v2/AE/transactions/cma2-rents/",
      };
    } else {
      return {
        ...baseConfig,
        baseURL: "https://api.reidin.com/api/v2/AE/transactions/cma2-sales/",
      };
    }
  };
  const fetchSimilarProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiConfig = getApiConfig();
      const response = await axios.get(apiConfig.baseURL, {
        headers: apiConfig.headers,
        params: apiConfig.params,
      });

      if (response.data.status === "OK" && response.data.results) {
        // Transform API data to match component structure
        const transformedProperties = response.data.results.map(
          (property, index) => ({
            id: index + 1,
            price: new Intl.NumberFormat("en-AE").format(property.price),
            currency: "AED",
            address: `${property.property_name}, ${property.location.location_name}, ${property.location.city_name}`,
            type: `${property.activity_type} ${property.property_subtype}`,
            contractType:
              property.rent_type ||
              (property.activity_type.includes("Ready") ? "Ready" : "Off-Plan"),
            baths: 2, // Default value as not in API
            beds: parseInt(property.no_of_bedrooms) || 0,
            sqft: Math.round(property.size),
            pricePerSqft: Math.round(property.price_per_size),
            transactionDate: new Date(
              property.transaction_date
            ).toLocaleDateString("en-CA"), // YYYY-MM-DD format
            unitNumber: property.number_of_unit,
            floor: property.number_of_floors,
            rentType: property.rent_type, // For rental properties
          })
        );

        setProperties(transformedProperties);
      } else {
        setError("No properties found");
      }
    } catch (err) {
      console.error("Error fetching similar properties:", err);
      setError("Failed to load similar properties");
    } finally {
      setLoading(false);
    }
  };
  // Fetch similar properties data on component mount
  useEffect(() => {
    fetchSimilarProperties();
  }, [propertyType]); // Re-fetch when property type changes

  return (
    <div className="similar-properties-section">
      <h2 className="section-title">
        Similar properties {isRental ? "rented" : "sold"} nearby
      </h2>

      {loading && (
        <div className="loading-message">Loading similar properties...</div>
      )}

      {error && (
        <div className="error-message">
          {error}
          <button
            onClick={fetchSimilarProperties}
            style={{ marginLeft: "10px" }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && properties.length > 0 && (
        <div className="properties-list">
          {properties.map((property) => (
            <div key={property.id} className="property-item">
              <div className="property-content">
                <div className="property-price">
                  <span>
                    {property.currency} {property.price}
                    {isRental && <span className="rent-period"> /year</span>}
                  </span>
                  <span>
                    <div className="transaction-date">
                      <p>{property.transactionDate}</p>
                    </div>
                  </span>
                </div>
                <div className="property-address">{property.address}</div>
                <div className="property-type-row">
                  <div className="property-type">
                    {property.type} | {isRental ? "Rent Type" : "Contract Type"}
                    : {isRental ? property.rentType : property.contractType}
                  </div>
                  <div className="property-details">
                    <div className="detail-item">
                      <Bed className="detail-icon" />
                      <span className="detail-value">{property.beds}</span>
                      <span>Beds</span>
                    </div>
                    <div className="detail-item">
                      <Square className="detail-icon" />
                      <span className="detail-value">{property.sqft}</span>
                      <span>sqft</span>
                    </div>
                    <div className="detail-item">
                      <Square className="detail-icon" />
                      <span className="detail-value">
                        {property.pricePerSqft}
                      </span>
                      <span id="small-text">per sq.ft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SimilarPropertySection;
