import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import "../Styles/knowledge-hub-hero.css";

const ReferTrackHero = ({ onSearchResult }) => {
  const [trackingCode, setTrackingCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!trackingCode.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `http://192.168.100.31:8000/Track-Refer-Lead?trackingCode=${trackingCode.trim()}`
      );
      const apiData = await response.json();

      if (apiData.success && apiData.data) {
        // Transform API data to match component structure
        const transformedData = transformApiData(apiData.data, trackingCode.trim());
        onSearchResult(transformedData);
      } else {
        onSearchResult("not_found");
      }
    } catch (error) {
      console.error("Error fetching tracking data:", error);
      setError("Network error. Please try again.");
      onSearchResult("not_found");
    } finally {
      setIsSearching(false);
    }
  };

  // Function to transform API data to match component structure
  const transformApiData = (apiData, trackingCode) => {
    // Map API urgency levels to display format
    const urgencyMapping = {
      "Within 1 month": "High",
      "Within 3 months": "Medium", 
      "Within 6 months": "Low",
    };

    // Calculate progress based on status
    const getProgressFromStatus = (status) => {
      switch (status) {
        case "Query Received": return 15;
        case "Agent Assigned": return 30;
        case "Contact Initiated": return 45;
        case "Meeting Scheduled": return 60;
        case "Property Shown": return 75;
        case "Negotiation": return 90;
        case "Deal Closed Collect Commission From Our Office": return 100;
        case "Client Not Interested": return 0;
        case "Cancelled": return 0;
        default: return 0;
      }
    };

    // Generate progress steps based on current status
    const generateProgressSteps = (currentStatus, submissionDate) => {
      const progressSteps = [
        "Query Received",
        "Agent Assigned", 
        "Contact Initiated",
        "Meeting Scheduled",
        "Property Shown",
        "Negotiation",
        "Deal Closed Collect Commission From Our Office",
      ];

      const terminationStates = ["Client Not Interested", "Cancelled"];
      let currentStepIndex = progressSteps.indexOf(currentStatus);
      
      if (currentStepIndex === -1 && terminationStates.includes(currentStatus)) {
        currentStepIndex = 0;
      }

      return progressSteps.map((step, index) => ({
        step,
        completed: index <= currentStepIndex,
        date: index <= currentStepIndex ? submissionDate.split("T")[0] : null,
      }));
    };

    // Check if current status is a termination state
    const isTerminated = ["Client Not Interested", "Cancelled"].includes(apiData.current_status.status);

    return {
      trackingCode: trackingCode,
      status: apiData.current_status.status,
      progress: getProgressFromStatus(apiData.current_status.status),
      refereeName: apiData.referral_details.referee_name,
      referrerName: apiData.referral_details.referrer_name,
      propertyArea: apiData.referral_details.property_area,
      urgencyLevel: urgencyMapping[apiData.referral_details.urgency_level] || "Medium",
      submittedDate: apiData.tracking_info.submission_date.split("T")[0],
      lastUpdated: apiData.tracking_info.last_updated.split("T")[0],
      contactPreference: "Email", // Default since not provided by API
      bestTimeToContact: "Any time", // Default since not provided by API
      assignedAgent: apiData.current_status.assigned_agent,
      progressSteps: generateProgressSteps(
        apiData.current_status.status,
        apiData.tracking_info.submission_date
      ),
      isTerminated: isTerminated,
      terminationReason: isTerminated ? apiData.current_status.status : null,
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDemoCode = () => {
    setTrackingCode("920713");
  };

  return (
    <>
      <div className="knowledge-hub-hero">
        <div className="knowledge-hub-hero-container">
          <h1>Track your lead</h1>
          <p>
            Enter your tracking code below to check the current progress of your property referral. 
            Our system provides real-time updates on your lead status and keeps you informed throughout 
            the entire process.
          </p>
          
          <div className="knowledge-hub-hero-container-input">
            <input 
              type="text" 
              placeholder="Enter tracking code (e.g., REF123456)"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
            />
            <div 
              className="knowledge-hub-hero-container-input-search"
              onClick={handleSearch}
              style={{ 
                cursor: isSearching ? 'not-allowed' : 'pointer',
                opacity: isSearching ? 0.6 : 1
              }}
            >
              {isSearching ? (
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              ) : (
                <img src="/Assets/search.png" alt="search" />
              )}
            </div>
          </div>

          {/* Demo Code Section */}
          <div style={{ 
            marginTop: '20px', 
            textAlign: 'center',
            color: '#666'
          }}>
            <p style={{ marginBottom: '10px', fontSize: '14px' }}>
              Try this demo tracking code:
            </p>
            <button
              onClick={handleDemoCode}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              920713
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default ReferTrackHero;