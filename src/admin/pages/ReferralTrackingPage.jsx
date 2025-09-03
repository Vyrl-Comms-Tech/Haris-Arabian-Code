import React, { useState } from "react";
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  X,
} from "lucide-react";
import "../styles/ReferralTrackingPage.css";

  const baseUrl=import.meta.env.VITE_BASE_URL

const ReferralTrackingPage = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!trackingCode.trim()) return;

    setIsSearching(true);

    try {
      const response = await fetch(
        `${baseUrl}/Track-Refer-Lead?trackingCode=${trackingCode.trim()}`
      );
      const apiData = await response.json();

      if (apiData.success && apiData.data) {
        // Transform API data to match component structure
        const transformedData = transformApiData(
          apiData.data,
          trackingCode.trim()
        );
        setSearchResult(transformedData);
      } else {
        setSearchResult("not_found");
      }
    } catch (error) {
      console.error("Error fetching tracking data:", error);
      setSearchResult("not_found");
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
        case "Query Received":
          return 15;
        case "Agent Assigned":
          return 30;
        case "Contact Initiated":
          return 45;
        case "Meeting Scheduled":
          return 60;
        case "Property Shown":
          return 75;
        case "Negotiation":
          return 90;
        case "Deal Closed Collect Commission From Our Office":
          return 100;
        case "Client Not Interested":
          return 0;
        case "Cancelled":
          return 0;
        default:
          return 0;
      }
    };

    // Generate progress steps based on current status (excluding termination states)
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
      
      // If current status is a termination state, find the last completed progress step
      let currentStepIndex = progressSteps.indexOf(currentStatus);
      if (currentStepIndex === -1 && terminationStates.includes(currentStatus)) {
        // For termination states, we need to determine how far the process got
        // This would ideally come from API, but for now we'll assume it stopped at Query Received
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
      urgencyLevel:
        urgencyMapping[apiData.referral_details.urgency_level] || "Medium",
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Query Received":
        return "status-yellow";
      case "Agent Assigned":
        return "status-blue";
      case "Contact Initiated":
        return "status-purple";
      case "Meeting Scheduled":
        return "status-orange";
      case "Property Shown":
        return "status-indigo";
      case "Negotiations":
        return "status-emerald";
      case "Deal Closed Collect Commission From Our Office":
        return "status-green";
      case "Client Not Interested":
        return "status-red";
      case "Cancelled":
        return "status-red";
      default:
        return "status-gray";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "High":
        return "urgency-high";
      case "Medium":
        return "urgency-medium";
      case "Low":
        return "urgency-low";
      default:
        return "urgency-default";
    }
  };

  return (
    <div className="referral-tracking-page">
      <div className="ref-container">
        {/* Header */}
        <div className="header">
          <h1 className="titlelead">Track Your Lead</h1>
          <p className="subtitle">
            Enter your tracking code below to check the current progress of your
            property referral
          </p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-content">
            <div>
              <label htmlFor="trackingCode" className="input-label">
                Tracking Code
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="trackingCode"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your tracking code (e.g., REF123456)"
                  className="tracking-input"
                  disabled={isSearching}
                />
                {/* <Search className="search-icon" /> */}
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !trackingCode.trim()}
              className="search-button"
            >
              {isSearching ? (
                <>
                  <div className="spinner"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="button-icon" />
                  Track Lead
                </>
              )}
            </button>
          </div>

          {/* Demo codes */}
          <div className="demo-codes">
            <p className="demo-text">Try this demo tracking code:</p>
            <div className="demo-buttons">
              <button
                onClick={() => setTrackingCode("920713")}
                className="demo-button"
              >
                920713
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResult === "not_found" && (
          <div className="not-found-section">
            <div className="not-found-content">
              <AlertCircle className="not-found-icon" />
              <h3 className="not-found-title">Tracking Code Not Found</h3>
              <p className="not-found-text">
                Please check your tracking code and try again. If you continue
                to have issues, please contact our support team.
              </p>
            </div>
          </div>
        )}

        {searchResult && searchResult !== "not_found" && (
          <div className="results-section">
            {/* Lead Overview */}
            <div className="lead-overview">
              <div className="overview-header">
                <h2 className="overview-title">Lead Overview</h2>
                <span
                  className={`status-badge ${getStatusColor(
                    searchResult.status
                  )}`}
                >
                  {searchResult.status}
                </span>
              </div>

              <div className="overview-grid">
                <div className="overview-column">
                  <div className="info-item">
                    <User className="info-icon" />
                    <div>
                      <p className="info-label">Referee</p>
                      <p className="info-value">{searchResult.refereeName}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <User className="info-icon" />
                    <div>
                      <p className="info-label">Referred by</p>
                      <p className="info-value">{searchResult.referrerName}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <MapPin className="info-icon" />
                    <div>
                      <p className="info-label">Property Area</p>
                      <p className="info-value">{searchResult.propertyArea}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <AlertCircle className="info-icon" />
                    <div>
                      <p className="info-label">Urgency Level</p>
                      <span
                        className={`urgency-badge ${getUrgencyColor(
                          searchResult.urgencyLevel
                        )}`}
                      >
                        {searchResult.urgencyLevel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="overview-column">
                  <div className="info-item">
                    <Phone className="info-icon" />
                    <div>
                      <p className="info-label">Assigned Agent</p>
                      <p className="info-value">
                        {searchResult.assignedAgent || "Not assigned yet"}
                      </p>
                    </div>
                  </div>
                  <div className="info-item">
                    <Phone className="info-icon" />
                    <div>
                      <p className="info-label">Contact Preference</p>
                      <p className="info-value">
                        {searchResult.contactPreference}
                      </p>
                    </div>
                  </div>
                  <div className="info-item">
                    <Clock className="info-icon" />
                    <div>
                      <p className="info-label">Best Time to Contact</p>
                      <p className="info-value">
                        {searchResult.bestTimeToContact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-header">
                  <span className="progress-label">Overall Progress</span>
                  <span className="progress-percentage">
                    {searchResult.progress}%
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${searchResult.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="timeline-section">
              <h3 className="timeline-title">Progress Timeline</h3>
              <div className="timeline-container">
                {/* Main Progress Timeline */}
                <div className="timeline-content">
                  {searchResult.progressSteps.map((step, index) => (
                    <div key={index} className="timeline-item">
                      <div
                        className={`timeline-icon ${
                          step.completed ? "completed" : "pending"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="timeline-check" />
                        ) : (
                          <Clock className="timeline-clock" />
                        )}
                      </div>
                      <div className="timeline-content-item">
                        <p
                          className={`timeline-step ${
                            step.completed ? "completed-text" : "pending-text"
                          }`}
                        >
                          {step.step}
                        </p>
                        {step.date && (
                          <p className="timeline-date">
                            Completed on{" "}
                            {new Date(step.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Termination Status (if applicable) */}
                {searchResult.isTerminated && (
                  <div className="termination-status">
                    <div className="termination-item">
                      <div className="termination-icon">
                        <X className="termination-x" />
                      </div>
                      <div className="termination-content">
                        <p className="termination-text">
                          {searchResult.terminationReason}
                        </p>
                        <p className="termination-date">
                          Updated on{" "}
                          {new Date(searchResult.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Info */}
            <div className="timeline-info-section">
              <h3 className="timeline-info-title">Timeline Information</h3>
              <div className="timeline-info-grid">
                <div className="info-item">
                  <Calendar className="info-icon" />
                  <div>
                    <p className="info-label">Submitted Date</p>
                    <p className="info-value">
                      {new Date(
                        searchResult.submittedDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="info-item">
                  <Clock className="info-icon" />
                  <div>
                    <p className="info-label">Last Updated</p>
                    <p className="info-value">
                      {new Date(searchResult.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="contact-section">
              <h3 className="contact-title">Need Help?</h3>
              <p className="contact-text">
                If you have any questions about your referral or need additional
                assistance, please don't hesitate to contact our support team.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span className="contact-detail">+971 4 123 4567</span>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span className="contact-detail">
                    support@arabianestate.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralTrackingPage;