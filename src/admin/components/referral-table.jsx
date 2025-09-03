import { useEffect, useState, useMemo } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";
import "../styles/referral-table.css";
import ProgressModal from '../components/ProgressModal';

// Details modal for viewing full referral information
const ReferralDetailsModal = ({ referral, onClose }) => {
  return (
    <div className="modal-overlay2" onClick={onClose}>
      <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="headingtitle">Referral Details</h3>
          <button onClick={onClose} className="close-button" id="close-btn-modal">╳</button>
        </div>
        <div className="modal-body" id="modalbody">
          <div className="details-grid">
            <div className="detail-section">
              <h4>Referrer Information</h4>
              <p><strong>Name:</strong> {referral.referrerName}</p>
              <p><strong>Email:</strong> {referral.referrerEmail}</p>
              <p><strong>Phone:</strong> {referral.referrerPhone}</p>
            </div>
            <div className="detail-section">
              <h4>Referee Information</h4>
              <p><strong>Name:</strong> {referral.refereeName}</p>
              <p><strong>Email:</strong> {referral.refereeEmail}</p>
              <p><strong>Phone:</strong> {referral.refereePhone}</p>
              <p><strong>Relationship:</strong> {referral.relation}</p>
              <p><strong>Preferred Contact:</strong> {referral.contactPreference}</p>
              <p><strong>Best Time to Contact:</strong> {referral.bestTimeToContact}</p>
            </div>
            <div className="detail-section">
              <h4>Property & Query Details</h4>
              <p><strong>Property Area:</strong> {referral.propertyArea}</p>
              <p><strong>Urgency Level:</strong> {referral.urgencyLevel}</p>
              {referral.specialRequirements && (
                <p><strong>Special Requirements:</strong> {referral.specialRequirements}</p>
              )}
              <p><strong>Status:</strong> {referral.progress}</p>
              {referral.trackingCode && (
                <p><strong>Tracking Code:</strong> {referral.trackingCode}</p>
              )}
            </div>
            <div className="detail-section">
              <h4>Timeline</h4>
              <p><strong>Created:</strong> {new Date(referral.createdAt).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(referral.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ReferralTable({ searchTerm = "", referrals = [], filters = {}, onRefresh, onDeleteRequest }) {
  const [editingReferral, setEditingReferral] = useState(null);
  const [viewingReferral, setViewingReferral] = useState(null);

  // Function to map urgency levels to display format
  const getUrgencyLevel = (urgency) => {
    if (!urgency) return "Low";
    if (urgency.includes("1 month") || urgency.includes("immediately") || urgency === "Immediate") return "High";
    if (urgency.includes("3 months")) return "Medium";
    return "Low";
  };

  // Function to get badge class for urgency
  const getUrgencyBadgeClass = (urgency) => {
    const level = getUrgencyLevel(urgency);
    switch (level) {
      case "High": return "badge-danger";
      case "Medium": return "badge-warning";
      default: return "badge-success";
    }
  };

  // Function to get badge class for progress
  const getProgressBadgeClass = (progress) => {
    if (!progress) return "badge-secondary";
    
    switch (progress.toLowerCase()) {
      case "completed":
      case "property received":
      case "property recieved": // Handle typo in API
      case "deal closed":
      case "client interested":
        return "badge-success";
      case "in progress":
      case "contact initiated":
      case "property shared":
      case "deal in progress":
        return "badge-info";
      case "query received":
        return "badge-warning";
      case "client not interested":
      case "no response":
      case "cancelled":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  // Enhanced filtering and sorting with useMemo for performance
  const filteredAndSortedReferrals = useMemo(() => {
    let result = referrals.filter((referral) => {
      // Text search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || (
        (referral.referrerName || "").toLowerCase().includes(searchLower) ||
        (referral.refereeName || "").toLowerCase().includes(searchLower) ||
        (referral.propertyArea || "").toLowerCase().includes(searchLower) ||
        (referral.urgencyLevel || "").toLowerCase().includes(searchLower) ||
        (referral.progress || "").toLowerCase().includes(searchLower) ||
        (referral.trackingCode || "").toLowerCase().includes(searchLower)
      );

      // Property area filter
      const matchesPropertyArea = !filters.propertyArea || 
        (referral.propertyArea || "").toLowerCase() === filters.propertyArea.toLowerCase();

      // Urgency level filter
      const matchesUrgency = !filters.urgencyLevel || 
        (referral.urgencyLevel || "").toLowerCase() === filters.urgencyLevel.toLowerCase();

      // Progress filter
      const matchesProgress = !filters.progress || 
        (referral.progress || "").toLowerCase() === filters.progress.toLowerCase();

      return matchesSearch && matchesPropertyArea && matchesUrgency && matchesProgress;
    });

    // Sorting logic
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "newest":
          result.sort((a, b) => {
            const dateA = new Date(a.lastUpdated || a.createdAt);
            const dateB = new Date(b.lastUpdated || b.createdAt);
            return dateB - dateA; // Newest first
          });
          break;
        case "oldest":
          result.sort((a, b) => {
            const dateA = new Date(a.lastUpdated || a.createdAt);
            const dateB = new Date(b.lastUpdated || b.createdAt);
            return dateA - dateB; // Oldest first
          });
          break;
        case "urgency":
          result.sort((a, b) => {
            const urgencyOrder = { "High": 3, "Medium": 2, "Low": 1 };
            const urgencyA = urgencyOrder[getUrgencyLevel(a.urgencyLevel)] || 0;
            const urgencyB = urgencyOrder[getUrgencyLevel(b.urgencyLevel)] || 0;
            return urgencyB - urgencyA; // Most urgent first
          });
          break;
        case "alphabetical":
          result.sort((a, b) => {
            const nameA = (a.refereeName || "").toLowerCase();
            const nameB = (b.refereeName || "").toLowerCase();
            return nameA.localeCompare(nameB);
          });
          break;
        default:
          // Default to newest first
          result.sort((a, b) => {
            const dateA = new Date(a.lastUpdated || a.createdAt);
            const dateB = new Date(b.lastUpdated || b.createdAt);
            return dateB - dateA;
          });
      }
    } else {
      // Default sorting (newest first)
      result.sort((a, b) => {
        const dateA = new Date(a.lastUpdated || a.createdAt);
        const dateB = new Date(b.lastUpdated || b.createdAt);
        return dateB - dateA;
      });
    }

    return result;
  }, [referrals, searchTerm, filters]);

  const handleUpdateProgress = (id, progress) => {
    // This will trigger a refresh from the parent component
    // The parent component will update the referrals state
    setEditingReferral(null);
    
    // Refresh data from API after a brief delay
    setTimeout(() => {
      if (onRefresh) {
        onRefresh();
      }
    }, 500);
  };

  const handleEdit = (referral) => {
    setEditingReferral(referral);
  };

  const handleView = (referral) => {
    setViewingReferral(referral);
  };

  const handleDelete = (referral) => {
    // Pass delete request to parent component
    if (onDeleteRequest) {
      onDeleteRequest(referral);
    }
  };

  return (
    <>
      <div className="table-container">
        <div className="table-responsive">
          <table className="referral-table">
            <thead>
              <tr>
                <th>Tracking Code</th>
                <th>Referrer Name</th>
                <th className="hide-on-mobile">Referrer Email</th>
                <th className="hide-on-mobile">Referrer Phone</th>
                <th className="hide-on-tablet">Relation</th>
                <th>Property Area</th>
                <th>Referee Name</th>
                <th className="hide-on-mobile">Referee Email</th>
                <th className="hide-on-mobile">Referee Phone</th>
                <th className="hide-on-desktop">Contact Preference</th>
                <th className="hide-on-desktop">Best Time</th>
                <th>Urgency</th>
                <th>Progress</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedReferrals.length === 0 ? (
                <tr>
                  <td colSpan={15} className="empty-table">
                    {searchTerm || Object.keys(filters).length > 0 
                      ? "No referrals found matching your criteria" 
                      : "No referrals found"}
                  </td>
                </tr>
              ) : (
                filteredAndSortedReferrals.map((referral) => (
                  <tr key={referral.id}>
                    <td>
                      <span className="tracking-code">{referral.trackingCode || 'N/A'}</span>
                    </td>
                    <td>{referral.referrerName || 'N/A'}</td>
                    <td className="hide-on-mobile">{referral.referrerEmail || 'N/A'}</td>
                    <td className="hide-on-mobile">{referral.referrerPhone || 'N/A'}</td>
                    <td className="hide-on-tablet">{referral.relation || 'N/A'}</td>
                    <td>{referral.propertyArea || 'N/A'}</td>
                    <td>{referral.refereeName || 'N/A'}</td>
                    <td className="hide-on-mobile">{referral.refereeEmail || 'N/A'}</td>
                    <td className="hide-on-mobile">{referral.refereePhone || 'N/A'}</td>
                    <td className="hide-on-desktop">{referral.contactPreference || 'N/A'}</td>
                    <td className="hide-on-desktop">{referral.bestTimeToContact || 'N/A'}</td>
                    <td>
                      <span className={`badge ${getUrgencyBadgeClass(referral.urgencyLevel)}`}>
                        {getUrgencyLevel(referral.urgencyLevel)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getProgressBadgeClass(referral.progress)}`}>
                        {referral.progress || 'Unknown'}
                      </span>
                    </td>
                    <td>{referral.createdAt ? new Date(referral.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="icon-button" 
                          onClick={() => handleView(referral)}
                          title="View Details"
                        >
                          <Eye className="icon-small" />
                          <span className="sr-only">View</span>
                        </button>
                        <button 
                          className="icon-button" 
                          onClick={() => handleEdit(referral)}
                          title="Edit Progress"
                        >
                          <Edit2 className="icon-small" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button 
                          className="icon-button delete" 
                          onClick={() => handleDelete(referral)}
                          title="Delete"
                        >
                          <Trash2 className="icon-small" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Update Modal */}
      {editingReferral && (
        <ProgressModal
          referral={editingReferral}
          onClose={() => setEditingReferral(null)}
          onUpdate={handleUpdateProgress}
        />
      )}

      {/* Details View Modal */}
      {viewingReferral && (
        <ReferralDetailsModal
          referral={viewingReferral}
          onClose={() => setViewingReferral(null)}
        />
      )}
    </>
  );
}