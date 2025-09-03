import { useState, useMemo, useEffect } from "react";
import { Edit2, Trash2, RefreshCw, Eye } from "lucide-react";
import axios from "axios";
import "../styles/referral-table.css";
import "../styles/modal.css";
import EditCommunityGuideModal from "./EditCommunityGuideModal";
import AddCommunityGuideModal from "../components/AddCommunityGuideModal";

// Community Guide Details Modal - Shows all complete data including FAQs

const baseUrl = import.meta.env.VITE_BASE_URL;
const CommunityGuideDetailsModal = ({ guide, onClose }) => (
  <div className="modal-overlay2" onClick={onClose}>
    <div
      className="modal-content details-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h3>Community Guide Details</h3>
        <button onClick={onClose} className="close-button" id="close-btn-modal">
          ╳
        </button>
      </div>
      <div className="modal-body" id="mbody">
        <div className="details-grid" id="dgrid">
          <div className="detail-section">
            <h4>Guide Information</h4>
            <p>
              <strong>ID:</strong> {guide._id}
            </p>
            <p>
              <strong>Title:</strong> {guide.title}
            </p>
            <p>
              <strong>Heading:</strong> {guide.heading}
            </p>
            <p>
              <strong>Author:</strong> {guide.author}
            </p>
            <p>
              <strong>Slug:</strong> {guide.slug}
            </p>
            {guide.tags && guide.tags.length > 0 && (
              <div>
                <strong>Tags:</strong>
                <div
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.25rem",
                  }}
                >
                  {guide.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="badge badge-info"
                      style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h4>Content Descriptions</h4>
            {guide.desc1 && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Description 1:</strong>
                <p
                  style={{
                    marginTop: "0.25rem",
                    padding: "0.5rem",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                  }}
                >
                  {guide.desc1}
                </p>
              </div>
            )}
            {guide.desc2 && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Description 2:</strong>
                <p
                  style={{
                    marginTop: "0.25rem",
                    padding: "0.5rem",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                  }}
                >
                  {guide.desc2}
                </p>
              </div>
            )}
            {guide.desc3 && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Description 3:</strong>
                <p
                  style={{
                    marginTop: "0.25rem",
                    padding: "0.5rem",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                  }}
                >
                  {guide.desc3}
                </p>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h4>FAQs ({guide.faqCount || 0})</h4>
            {guide.faqs && guide.faqs.length > 0 ? (
              guide.faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "0.75rem",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Q{faq.index}: {faq.question}
                  </p>
                  <p style={{ color: "#6b7280", margin: 0 }}>A: {faq.answer}</p>
                </div>
              ))
            ) : (
              <p style={{ color: "#6b7280", fontStyle: "italic" }}>
                No FAQs available
              </p>
            )}
          </div>

          <div className="detail-section">
            <h4>Publication Status</h4>
            <p>
              <strong>Status:</strong>
              <span
                className={`badge ${
                  guide.publishedAt ? "badge-success" : "badge-warning"
                }`}
                style={{ marginLeft: "0.5rem" }}
              >
                {guide.publishedAt ? "Published" : "Draft"}
              </span>
            </p>
            {guide.publishedAt && (
              <p>
                <strong>Published:</strong>{" "}
                {new Date(guide.publishedAt).toLocaleString()}
              </p>
            )}
            <p>
              <strong>Created:</strong>{" "}
              {new Date(guide.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated:</strong>{" "}
              {new Date(guide.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Featured Image Section */}
          {guide.image && guide.image.filename && (
            <div className="detail-section">
              <h4>Featured Image</h4>
              <img
                src={`${baseUrl}/uploads/community-guides/${guide.image.filename}`}
                alt={guide.image.originalName || "Community Guide Image"}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <div
                style={{
                  display: "none",
                  padding: "2rem",
                  textAlign: "center",
                  color: "#6b7280",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              >
                Image not available
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginTop: "0.5rem",
                }}
              >
                <strong>File:</strong> {guide.image.originalName}
                <br />
                <strong>Size:</strong> {(guide.image.size / 1024).toFixed(1)} KB
                <br />
                <strong>Type:</strong> {guide.image.mimetype}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Delete confirmation dialog with API integration
const DeleteConfirmDialog = ({ guide, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Safety check for guide object
  if (!guide) {
    console.error("DeleteConfirmDialog: guide prop is undefined");
    return null;
  }

  const handleDelete = async () => {
    // Additional safety check
    if (!guide._id) {
      setError("Missing guide ID. Cannot delete community guide.");
      return;
    }

    setIsDeleting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.get(
        `${baseUrl}/DeleteCommunityGuide?id=${guide._id}`
      );

      if (response.data.success) {
        setSuccess(true);

        // Call the parent's onConfirm function with the guide ID
        setTimeout(() => {
          onConfirm(guide._id);
          onClose();
        }, 1000);
      } else {
        setError(response.data.message || "Failed to delete community guide");
      }
    } catch (err) {
      console.error("Error deleting community guide:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete community guide. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <div className="modal-overlay2" onClick={handleCancel}>
      <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" id="modal-head">
          <h2 className="modal-title">Confirm Deletion</h2>
        </div>

        <div className="modal-body" id="modalbody">
          <p>
            Are you sure you want to delete this community guide? This action
            cannot be undone.
          </p>

          {/* Guide Details */}
          <div className="referral-details">
            <div className="detail-row">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{guide._id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Title:</span>
              <span className="detail-value">{guide.title || "N/A"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Author:</span>
              <span className="detail-value">{guide.author || "N/A"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Created:</span>
              <span className="detail-value">
                {guide.createdAt
                  ? new Date(guide.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">FAQs:</span>
              <span className="detail-value">{guide.faqCount || 0} FAQs</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              <span className="success-text">
                Community guide deleted successfully!
              </span>
            </div>
          )}
        </div>

        <div className="modal-footer" id="modal-footer">
          <button
            className="button outline-button"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="button danger-button"
            onClick={handleDelete}
            disabled={isDeleting || success || !guide._id}
          >
            {isDeleting ? (
              <>
                <span className="loading-spinner"></span>
                Deleting...
              </>
            ) : success ? (
              "Deleted"
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CommunityGuideTable({ onEdit }) {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [guideToDelete, setGuideToDelete] = useState(null);
  const [editGuide, setEditGuide] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewingGuide, setViewingGuide] = useState(null);

  // Fetch community guides from API
  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${baseUrl}/GetCommunityGuides`
      );

      if (response.data.success) {
        // Sort by newest first (most recent createdAt or updatedAt)
        const sortedGuides = [...response.data.data].sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt);
          const dateB = new Date(b.updatedAt || b.createdAt);
          return dateB - dateA; // Descending order (newest first)
        });
        setGuides(sortedGuides);
      } else {
        setError(response.data.message || "Failed to fetch community guides");
      }
    } catch (err) {
      console.error("Error fetching community guides:", err);
      setError(
        err.response?.data?.message || "Failed to fetch community guides"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  // Enhanced search filter - includes tags, descriptions, and FAQs
  const filteredGuides = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return guides.filter(
      (g) =>
        (g.title || "").toLowerCase().includes(searchLower) ||
        (g.heading || "").toLowerCase().includes(searchLower) ||
        (g.author || "").toLowerCase().includes(searchLower) ||
        (g.tags || []).join(" ").toLowerCase().includes(searchLower) ||
        (g.desc1 || "").toLowerCase().includes(searchLower) ||
        (g.desc2 || "").toLowerCase().includes(searchLower) ||
        (g.desc3 || "").toLowerCase().includes(searchLower) ||
        (g.faqs || []).some(
          (faq) =>
            (faq.question || "").toLowerCase().includes(searchLower) ||
            (faq.answer || "").toLowerCase().includes(searchLower)
        ) ||
        (g._id || "").toLowerCase().includes(searchLower)
    );
  }, [guides, searchTerm]);

  const handleEdit = (guide) => {
    setEditGuide(guide);
    setEditModalOpen(true);
  };

  const handleView = (guide) => {
    setViewingGuide(guide);
  };

  const handleSaveEdit = (updated) => {
    setEditModalOpen(false);
    setEditGuide(null);

    // Refresh data to get updated info from API
    setTimeout(() => {
      fetchGuides();
    }, 500);
  };

  const handleAddGuide = () => {
    setAddModalOpen(true);
  };

  const handleSaveAdd = (newGuideData) => {
    setAddModalOpen(false);

    // Refresh data to show new guide from API
    setTimeout(() => {
      fetchGuides();
    }, 500);
  };

  const handleDelete = (guide) => {
    setGuideToDelete(guide);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = (deletedId) => {
    setGuides((prev) => prev.filter((g) => g._id !== deletedId));
    setDeleteConfirmOpen(false);
    setGuideToDelete(null);

    // Refresh data after delete
    setTimeout(() => {
      fetchGuides();
    }, 500);
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <p>Loading community guides...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={fetchGuides} className="button primary-button">
            <RefreshCw className="button-icon" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Search */}
      <div className="filter-search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search guides by title, author, tags, content, FAQs..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>
            Total: {guides.length} guides
          </span>
          <button onClick={fetchGuides} className="button outline-button">
            <RefreshCw className="button-icon" />
            Refresh
          </button>
        </div>
      </div>

      {/* Add guide button */}
      <div style={{ marginBottom: "1rem" }}>
        <button className="button primary-button" onClick={handleAddGuide}>
          Add Community Guide
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="referral-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Heading</th>
                <th className="hide-on-mobile">Author</th>
                <th className="hide-on-mobile">Tags</th>
                <th className="hide-on-tablet">FAQs</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuides.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table">
                    {searchTerm
                      ? "No community guides found matching your search"
                      : "No community guides found"}
                  </td>
                </tr>
              ) : (
                filteredGuides.map((g) => (
                  <tr key={g._id}>
                    <td>
                      {g.image && g.image.filename ? (
                        <img
                          src={`${baseUrl}/uploads/community-guides/${g.image.filename}`}
                          alt={g.image.originalName || "Community Guide"}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "2px solid #e5e7eb",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          backgroundColor: "#f3f4f6",
                          borderRadius: 8,
                          border: "2px solid #e5e7eb",
                          display:
                            g.image && g.image.filename ? "none" : "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          color: "#6b7280",
                          fontWeight: "bold",
                        }}
                      >
                        NO IMG
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: "200px" }}>
                        <strong>{g.title || "Untitled"}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: "200px" }}>
                        {g.heading && g.heading.length > 30
                          ? `${g.heading.substring(0, 30)}...`
                          : g.heading || "No heading"}
                      </div>
                    </td>
                    <td className="hide-on-mobile">
                      <strong style={{ color: "#3b82f6" }}>{g.author}</strong>
                    </td>
                    <td className="hide-on-mobile">
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px",
                          maxWidth: "180px",
                        }}
                      >
                        {(g.tags || []).slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="badge badge-info"
                            style={{ fontSize: "0.7rem", padding: "2px 6px" }}
                          >
                            {tag}
                          </span>
                        ))}
                        {(g.tags || []).length > 2 && (
                          <span
                            className="badge badge-secondary"
                            style={{ fontSize: "0.7rem", cursor: "pointer" }}
                            title={`All tags: ${g.tags.join(", ")}`}
                          >
                            +{(g.tags || []).length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hide-on-tablet">
                      <span
                        className="badge badge-info"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {g.faqCount || 0} FAQs
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: "500" }}>
                          {new Date(g.createdAt).toLocaleDateString()}
                        </div>
                        <small style={{ color: "#999", fontSize: "0.8rem" }}>
                          {new Date(g.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button"
                          title="View Details"
                          onClick={() => handleView(g)}
                        >
                          <Eye className="icon-small" />
                          <span className="sr-only">View</span>
                        </button>
                        <button
                          className="icon-button edit"
                          title="Edit Community Guide"
                          onClick={() => handleEdit(g)}
                        >
                          <Edit2 className="icon-small" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          className="icon-button delete"
                          onClick={() => handleDelete(g)}
                          title="Delete Community Guide"
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

      {/* Community Guide Details Modal */}
      {viewingGuide && (
        <CommunityGuideDetailsModal
          guide={viewingGuide}
          onClose={() => setViewingGuide(null)}
        />
      )}

      {/* Edit Community Guide Modal */}
      <EditCommunityGuideModal
        open={editModalOpen}
        guide={editGuide}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
      />

      {/* Add Community Guide Modal */}
      <AddCommunityGuideModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveAdd}
      />

      {/* Delete confirmation modal */}
      {deleteConfirmOpen && guideToDelete && (
        <DeleteConfirmDialog
          guide={guideToDelete}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setGuideToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
