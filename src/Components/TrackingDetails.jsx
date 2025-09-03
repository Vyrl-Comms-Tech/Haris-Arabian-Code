import React from "react";
import { AlertCircle, X } from "lucide-react";
import "../Styles/TrackingDetails.css";

function TrackingDetails({ searchResult }) {
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "High": return "#ef4444";
      case "Medium": return "#f97316";  
      case "Low": return "#22c55e";
      default: return "#1f2937";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Query Received": return "#fbbf24";
      case "Agent Assigned": return "#3b82f6";
      case "Contact Initiated": return "#8b5cf6";
      case "Meeting Scheduled": return "#f97316";
      case "Property Shown": return "#6366f1";
      case "Negotiation": return "#10b981";
      case "Deal Closed Collect Commission From Our Office": return "#22c55e";
      case "Client Not Interested": return "#ef4444";
      case "Cancelled": return "#ef4444";
      default: return "#6b7280";
    }
  };

  // Show not found message
  if (searchResult === "not_found") {
    return (
      <div className="tracking-container">
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #fecaca',
          borderRadius: '8px', 
          padding: '40px',
          textAlign: 'center',
          margin: '20px 0'
        }}>
          <AlertCircle style={{ 
            width: '48px', 
            height: '48px', 
            color: '#ef4444',
            marginBottom: '16px'
          }} />
          <h3 style={{
            color: '#1f2937',
            fontSize: '1.5rem',
            fontWeight: 600,
            margin: '0 0 16px 0'
          }}>
            Tracking Code Not Found
          </h3>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            margin: 0
          }}>
            Please check your tracking code and try again. If you continue to have issues, please contact our support team.
          </p>
        </div>
      </div>
    );
  }

  // Show loading or empty state if no data
  if (!searchResult) {
    return (
      <div className="tracking-container">
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#6b7280'
        }}>
          <p>Enter a tracking code above to view lead details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-container">
      <div className="main-content">
        <div className="lead-overview">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h2 className="section-title">Lead Overview</h2>
            <span style={{
              backgroundColor: getStatusColor(searchResult.status),
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {searchResult.status}
            </span>
          </div>

          <div className="overview-grid">
            <div className="info-item">
              <div className="icon-circle">
                <span className="icon">
                  <img src="/Assets/Profile.png" id="profile-img" alt="" />
                </span>
              </div>
              <div className="info-content">
                <div className="info-label">Referee</div>
                <div className="info-value">{searchResult.refereeName}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-circle">
                <span className="icon">
                  <img src="/Assets/Profile.png" id="profile-img" alt="" />
                </span>
              </div>
              <div className="info-content">
                <div className="info-label">Assigned Agent</div>
                <div className="info-value">
                  {searchResult.assignedAgent || "Not assigned yet"}
                </div>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-circle">
                <span className="icon">
                  <img src="/Assets/Profile.png" id="profile-img" alt="" />
                </span>
              </div>
              <div className="info-content">
                <div className="info-label">Referred by</div>
                <div className="info-value">{searchResult.referrerName}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-circle">
                <span className="icon">
                  <img src="/Assets/Phone.png" id="phone-img" alt="" />
                </span>
              </div>
              <div className="info-content">
                <div className="info-label">Contact preference</div>
                <div className="info-value">{searchResult.contactPreference}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-circle">
                <span className="icon">
                  <img src="/Assets/Location.png" id="location-img" alt="" />
                </span>
              </div>
              <div className="info-content">
                <div className="info-label">Property area</div>
                <div className="info-value">{searchResult.propertyArea}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-circle">
                <span className="icon">
                  <img src="/Assets/Phone.png" id="phone-img" alt="" />
                </span>
              </div>
              <div className="info-content">
                <div className="info-label">Best time to call</div>
                <div className="info-value">{searchResult.bestTimeToContact}</div>
              </div>
            </div>

            <div className="info-item priority-item">
              <div className="icon-circle">
                <span className="icon">
                  <img src="/Assets/Clock.png" id="clock-img" alt="" />
                </span>
              </div>
              <div className="info-content">
                <div className="info-label">Priority</div>
                <div 
                  className="priority-badge"
                  style={{ backgroundColor: getUrgencyColor(searchResult.urgencyLevel) }}
                >
                  {searchResult.urgencyLevel} urgency
                </div>
              </div>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">overall progress</span>
              <span className="progress-percentage">{searchResult.progress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${searchResult.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="need-help">
          <h2 className="section-title">Need help</h2>
          <p className="help-description">
            If you have any questions about your referral or need additional assistance, 
            please don't hesitate to contact our support team.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <div className="icon-circle">
                <span className="icon">
                  <img src="/Assets/Phone.png" id="phone-img" alt="" />
                </span>
              </div>
              <span>+971 4 123 4567</span>
            </div>
            <div className="contact-item">
              <div className="icon-circle" id="mail-contact">
                <span className="icon">
                  <img src="/Assets/mail.png" id="mail-img" alt="" />
                </span>
              </div>
              <span>support@arabianestates.ae</span>
            </div>
          </div>
        </div>
      </div>

      <div className="timeline-section">
        <h2 className="section-title">Progress timeline</h2>
        
        {/* Enhanced Timeline with Progress Bar */}
        <div className="timeline-container">
          <div className="timeline">
            {searchResult.progressSteps.map((step, index) => (
              <React.Fragment key={index}>
                <div className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                  <div className={`step-circle ${step.completed ? 'completed' : ''}`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <div className="step-content">
                    <div className="step-label">{step.step}</div>
                    {step.date && (
                      <div className="step-title">
                        {new Date(step.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                {index < searchResult.progressSteps.length - 1 && (
                  <div className="timeline-connector"></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Dynamic Progress Bar for Timeline */}
          <div className="timeline-progress-bar">
            <div 
              className="timeline-progress-fill"
              style={{ 
                width: `${searchResult.progress}%`,
                transition: 'width 0.8s ease-in-out'
              }}
            ></div>
          </div>
        </div>

        {/* Termination Status */}
        {searchResult.isTerminated && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <X style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#1f2937',
                  margin: '0 0 4px 0'
                }}>
                  {searchResult.terminationReason}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Updated on {new Date(searchResult.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="timeline-info">
        <h2 className="section-title">Timeline information</h2>
        <div className="timeline-info-grid" id="timeline-details">
          <div className="info-item">
            <div className="icon-circle">
              <span className="icon">
                <img src="/Assets/Clock.png" id="clock-img" alt="" />
              </span>
            </div>
            <div className="info-content" id="time-info-content">
              <div className="info-label">Submitted Date</div>
              <div className="info-value">
                {new Date(searchResult.submittedDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-circle">
              <span className="icon">
                <img src="/Assets/Clock.png" id="clock-img" alt="" />
              </span>
            </div>
            <div className="info-content" id="time-info-content">
              <div className="info-label">Last updated</div>
              <div className="info-value">
                {new Date(searchResult.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackingDetails;