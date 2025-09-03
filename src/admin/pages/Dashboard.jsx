import { useEffect, useState } from "react";
import { Plus, Filter, Search } from "lucide-react";
import ReferralTable from "../components/referral-table";
import FilterDropdown from "../components/filter-dropdown";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import "../styles/dashboard.css";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({});

  // Delete modal state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [referralToDelete, setReferralToDelete] = useState(null);

  // Function to fetch referral data from API
  const fetchReferrals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${baseUrl}/AllReferelProperties`
      );

      if (response.data.success) {
        // Transform API data to match your table structure
        const transformedData = response.data.data.map((item) => ({
          id: item._id,
          referrerName: item.referrer.full_name,
          referrerEmail: item.referrer.email,
          referrerPhone: item.referrer.phone,
          relation: item.referee.relationship,
          propertyArea: item.property.area,
          refereeName: item.referee.full_name,
          refereeEmail: item.referee.email,
          refereePhone: item.referee.phone,
          contactPreference: item.referee.preferred_contact,
          bestTimeToContact: item.referee.best_time_contact,
          urgencyLevel: item.query_details.urgency_level,
          specialRequirements: item.query_details.special_requirements,
          progress: item.query_progress.status,
          trackingCode: item.tracking_code,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          lastUpdated: item.query_progress.last_updated,
          notes: item.query_progress.notes,
        }));

        setReferrals(transformedData);
      } else {
        setError("Failed to fetch referrals");
      }
    } catch (err) {
      console.error("Error fetching referrals:", err);
      setError(err.response?.data?.message || "Failed to fetch referrals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  // Calculate analytics
  const totalReferrals = referrals.length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const referralsThisMonth = referrals.filter((referral) => {
    const referralDate = new Date(referral.createdAt);
    return (
      referralDate.getMonth() === currentMonth &&
      referralDate.getFullYear() === currentYear
    );
  }).length;

  // Map urgency levels from API to your expected format
  const getUrgencyLevel = (urgency) => {
    if (
      urgency &&
      (urgency.includes("1 month") ||
        urgency.includes("immediately") ||
        urgency === "Immediate")
    )
      return "High";
    if (urgency && urgency.includes("3 months")) return "Medium";
    return "Low";
  };

  const urgentReferrals = referrals.filter(
    (referral) => getUrgencyLevel(referral.urgencyLevel) === "High"
  ).length;

  // Filter handlers
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  // Delete handlers
  const handleDeleteRequest = (referral) => {
    console.log("Delete request received for:", referral); // Debug log
    setReferralToDelete(referral);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = (deletedId) => {
    console.log("Delete confirmed for ID:", deletedId); // Debug log
    // Remove from local state immediately
    setReferrals((prev) => prev.filter((r) => r.id !== deletedId));
    setDeleteConfirmOpen(false);
    setReferralToDelete(null);

    // Refresh data from API after a brief delay
    setTimeout(() => {
      fetchReferrals();
    }, 500);
  };

  const handleDeleteCancel = () => {
    console.log("Delete cancelled"); // Debug log
    setDeleteConfirmOpen(false);
    setReferralToDelete(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Referral Section</h1>
        </div>
        <div className="loading-container">
          <p>Loading referrals...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Referral Section</h1>
        </div>
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={fetchReferrals} className="button primary-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Referral Section</h1>
        <button onClick={fetchReferrals} className="button outline-button">
          Refresh Data
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="analytics-cards">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Total Referrals</h2>
          </div>
          <div className="card-content">
            <div className="card-value">{totalReferrals}</div>
            <p className="card-description">All time referrals</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Referrals This Month</h2>
          </div>
          <div className="card-content">
            <div className="card-value">{referralsThisMonth}</div>
            <p className="card-description">Current month</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Urgent Leads</h2>
          </div>
          <div className="card-content">
            <div className="card-value urgent">{urgentReferrals}</div>
            <p className="card-description">High urgency referrals</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="filter-search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search referrals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <button
            className={`button ${
              hasActiveFilters ? "primary-button" : "outline-button"
            }`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{ position: "relative" }}
          >
            <Filter className="button-icon" />
            Filter
            {hasActiveFilters && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {
                  Object.keys(filters).filter(
                    (key) => filters[key] && filters[key] !== "newest"
                  ).length
                }
              </span>
            )}
          </button>
          {isFilterOpen && (
            <FilterDropdown
              onClose={() => setIsFilterOpen(false)}
              onApplyFilters={handleApplyFilters}
              currentFilters={filters}
            />
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div
          style={{
            backgroundColor: "#f0f9ff",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            marginBottom: "1rem",
            border: "1px solid #bae6fd",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: "500", fontSize: "0.9rem" }}>
              Active Filters:
            </span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === "newest") return null;
              return (
                <span
                  key={key}
                  style={{
                    backgroundColor: "#1d4ed8",
                    color: "white",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  {key === "propertyArea"
                    ? "Area"
                    : key === "urgencyLevel"
                    ? "Urgency"
                    : key === "progress"
                    ? "Status"
                    : key}
                  : {value}
                </span>
              );
            })}
            <button
              onClick={() => {
                setFilters({});
                setIsFilterOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#dc2626",
                cursor: "pointer",
                fontSize: "0.85rem",
                textDecoration: "underline",
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Referrals Table */}
      <ReferralTable
        searchTerm={searchTerm}
        referrals={referrals}
        filters={filters}
        onRefresh={fetchReferrals}
        onDeleteRequest={handleDeleteRequest}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && referralToDelete && (
        <DeleteConfirmDialog
          referral={referralToDelete}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Add/Edit Referral Modal */}
      {isModalOpen && <ReferralModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
