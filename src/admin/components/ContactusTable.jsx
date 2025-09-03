import { useState, useEffect, useMemo } from "react";
import { Edit2, Trash2, Filter, X } from "lucide-react";
import axios from "axios";
import "../styles/referral-table.css"; // Reuse your existing table styles

// Delete confirmation dialog with API integration

const baseUrl = import.meta.env.VITE_BASE_URL;
const DeleteConfirmDialog = ({ message, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Update this endpoint URL to match your actual delete endpoint
      const response = await axios.get(
        `${baseUrl}/DeleteContact?id=${message._id}`
      );

      if (response.data.success) {
        onConfirm(message._id);
        onClose();
      } else {
        setError(response.data.message || "Failed to delete message");
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      setError("Failed to delete message. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay2" onClick={onClose}>
      <div id="modal-content2" onClick={(e) => e.stopPropagation()}>
        <h3>Confirm Delete</h3>
        <p>
          Are you sure you want to delete this message from{" "}
          <strong>
            {message.firstName} {message.lastName}
          </strong>
          ?
        </p>

        {error && (
          <div
            style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}
          >
            {error}
          </div>
        )}

        <div className="modal-actions">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="btn-danger"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ContactUsTable() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    bestTime: "",
    urgency: "",
    progress: "",
    sortBy: "newest", // newest, oldest
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter options
  const bestTimeOptions = ["Morning", "Afternoon", "Evening", "Anytime"];
  const urgencyOptions = [
    "Immediate",
    "Within 1 month",
    "Within 3 months",
    "No rush",
  ];
  const progressOptions = [
    "New",
    "In Progress",
    "Contacted",
    "Resolved",
    "Follow-up Required",
  ];

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${baseUrl}/GetContact`);

      if (response.data.success) {
        setMessages(response.data.data);
      } else {
        setError("Failed to fetch contact messages");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to fetch contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Enhanced filtering and sorting logic
  const filteredAndSortedMessages = useMemo(() => {
    let result = messages.filter((msg) => {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${msg.firstName} ${msg.lastName}`.toLowerCase();

      // Text search filter
      const matchesSearch =
        fullName.includes(searchLower) ||
        (msg.email || "").toLowerCase().includes(searchLower) ||
        (msg.telephone || "").toLowerCase().includes(searchLower) ||
        (msg.message || "").toLowerCase().includes(searchLower);

      // Best time filter
      const matchesBestTime =
        !filters.bestTime ||
        (msg.best_time_contact || msg.bestTimeToContact || "").toLowerCase() ===
          filters.bestTime.toLowerCase();

      // Urgency filter
      const matchesUrgency =
        !filters.urgency ||
        (msg.urgency_level || msg.urgencyLevel || "").toLowerCase() ===
          filters.urgency.toLowerCase();

      // Progress filter
      const matchesProgress =
        !filters.progress ||
        (msg.progress || msg.status || "New").toLowerCase() ===
          filters.progress.toLowerCase();

      return (
        matchesSearch && matchesBestTime && matchesUrgency && matchesProgress
      );
    });

    // Sort by time
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (filters.sortBy === "newest") {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

    return result;
  }, [messages, searchTerm, filters]);

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      bestTime: "",
      urgency: "",
      progress: "",
      sortBy: "newest",
    });
  };

  const hasActiveFilters =
    filters.bestTime ||
    filters.urgency ||
    filters.progress ||
    filters.sortBy !== "newest";

  // Delete logic
  const handleDelete = (message) => {
    setMessageToDelete(message);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = (deletedId) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== deletedId));
    setDeleteConfirmOpen(false);
    setMessageToDelete(null);
    // Optionally refresh data
    setTimeout(() => fetchMessages(), 500);
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading contact messages...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
          <p>Error: {error}</p>
          <button onClick={fetchMessages} style={{ marginTop: "1rem" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Search and Filter Controls */}
      <div className="filter-search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search messages..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`button ${
              showFilters ? "primary-button" : "outline-button"
            }`}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && (
              <span
                style={{
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
                  [filters.bestTime, filters.urgency, filters.progress].filter(
                    Boolean
                  ).length
                }
              </span>
            )}
          </button>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>
            {/* Showing: {filteredAndSortedMessages.length} of {messages.length} messages */}
          </span>
          <button onClick={fetchMessages} className="button outline-button">
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div
          className="filter-panel"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            border: "1px solid #e9ecef",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            {/* Best Time Filter */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  fontSize: "0.9rem",
                }}
              >
                Best Time to Contact
              </label>
              <select
                value={filters.bestTime}
                onChange={(e) => handleFilterChange("bestTime", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                }}
              >
                <option value="">All Times</option>
                {bestTimeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency Filter */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  fontSize: "0.9rem",
                }}
              >
                Urgency Level
              </label>
              <select
                value={filters.urgency}
                onChange={(e) => handleFilterChange("urgency", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                }}
              >
                <option value="">All Urgency Levels</option>
                {urgencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Progress Filter */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  fontSize: "0.9rem",
                }}
              >
                Progress Status
              </label>
              <select
                value={filters.progress}
                onChange={(e) => handleFilterChange("progress", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                }}
              >
                <option value="">All Statuses</option>
                {progressOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  fontSize: "0.9rem",
                }}
              >
                Sort by Date
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                onClick={clearFilters}
                className="button outline-button"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <X size={16} />
                Clear All Filters
              </button>
              <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                Active filters:{" "}
                {
                  [filters.bestTime, filters.urgency, filters.progress].filter(
                    Boolean
                  ).length
                }
              </span>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="referral-table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hide-on-mobile">Email</th>
                <th className="hide-on-mobile">Phone</th>
                <th className="hide-on-tablet">Best Time</th>
                <th className="hide-on-tablet">Urgency</th>
                <th>Message</th>
                <th className="hide-on-mobile">Progress</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedMessages.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-table">
                    {searchTerm || hasActiveFilters
                      ? "No messages found matching your criteria"
                      : "No messages found"}
                  </td>
                </tr>
              ) : (
                filteredAndSortedMessages.map((msg) => (
                  <tr key={msg._id}>
                    <td>
                      <strong>
                        {msg.firstName} {msg.lastName}
                      </strong>
                    </td>
                    <td className="hide-on-mobile">
                      <a
                        href={`mailto:${msg.email}`}
                        style={{ color: "#3b82f6", textDecoration: "none" }}
                      >
                        {msg.email}
                      </a>
                    </td>
                    <td className="hide-on-mobile">
                      <a
                        href={`tel:${msg.telephone}`}
                        style={{ color: "#3b82f6", textDecoration: "none" }}
                      >
                        {msg.telephone}
                      </a>
                    </td>
                    <td className="hide-on-tablet">
                      <span
                        className="badge badge-info"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {msg.best_time_contact ||
                          msg.bestTimeToContact ||
                          "Anytime"}
                      </span>
                    </td>
                    <td className="hide-on-tablet">
                      <span
                        className={`badge ${
                          (msg.urgency_level || msg.urgencyLevel) ===
                          "Immediate"
                            ? "badge-danger"
                            : (msg.urgency_level || msg.urgencyLevel) ===
                              "Within 1 month"
                            ? "badge-warning"
                            : (msg.urgency_level || msg.urgencyLevel) ===
                              "Within 3 months"
                            ? "badge-info"
                            : "badge-success"
                        }`}
                        style={{ fontSize: "0.75rem" }}
                      >
                        {msg.urgency_level || msg.urgencyLevel || "No rush"}
                      </span>
                    </td>
                    <td>
                      <div style={{ maxWidth: "200px" }}>
                        {msg.message && msg.message.length > 40
                          ? `${msg.message.substring(0, 40)}...`
                          : msg.message || "No message"}
                      </div>
                    </td>
                    <td className="hide-on-mobile">
                      <span
                        className={`badge ${
                          (msg.progress || msg.status) === "Resolved"
                            ? "badge-success"
                            : (msg.progress || msg.status) === "In Progress"
                            ? "badge-info"
                            : (msg.progress || msg.status) === "Contacted"
                            ? "badge-warning"
                            : "badge-secondary"
                        }`}
                        style={{ fontSize: "0.75rem" }}
                      >
                        {msg.progress || msg.status || "New"}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div>
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </div>
                        <small style={{ color: "#999", fontSize: "0.8rem" }}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button delete"
                          onClick={() => handleDelete(msg)}
                          title="Delete message"
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

      {/* Delete confirmation modal */}
      {deleteConfirmOpen && messageToDelete && (
        <DeleteConfirmDialog
          message={messageToDelete}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setMessageToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
