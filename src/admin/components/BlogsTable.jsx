import { useState, useMemo, useEffect } from "react";
import { Edit2, Trash2, RefreshCw, Eye } from "lucide-react";
import axios from "axios";
import "../styles/referral-table.css";
import EditBlogModal from "./EditBlogModal";
import AddBlogModal from "../components/AddBlogModal";

// Blog Details Modal - Now shows all complete data


const baseUrl = import.meta.env.VITE_BASE_URL;
const BlogDetailsModal = ({ blog, onClose }) => (
  <div className="modal-overlay2" onClick={onClose}>
    <div
      className="modal-content details-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h3>Blog Details</h3>
        <button onClick={onClose} className="close-button" id="close-btn-modal">
          ╳
        </button>
      </div>
      <div className="modal-body" id="mbody">
        <div className="details-grid" id="dgrid">
          <div className="detail-section">
            <h4>Blog Information</h4>
            <p>
              <strong>ID:</strong> {blog._id}
            </p>
            <p>
              <strong>Title:</strong> {blog.title}
            </p>
            <p>
              <strong>Heading:</strong> {blog.heading}
            </p>
            <p>
              <strong>Author:</strong>{" "}
              {typeof blog.author === "object"
                ? blog.author.agentName || "Unknown"
                : blog.author}
            </p>
            <p>
              <strong>Slug:</strong> {blog.slug}
            </p>
            {blog.tags && blog.tags.length > 0 && (
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
                  {blog.tags.map((tag, i) => (
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
            {blog.desc1 && (
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
                  {blog.desc1}
                </p>
              </div>
            )}
            {blog.desc2 && (
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
                  {blog.desc2}
                </p>
              </div>
            )}
            {blog.desc3 && (
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
                  {blog.desc3}
                </p>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h4>Publication Status</h4>
            <p>
              <strong>Status:</strong>
              <span
                className={`badge ${
                  blog.publishedAt ? "badge-success" : "badge-warning"
                }`}
                style={{ marginLeft: "0.5rem" }}
              >
                {blog.publishedAt ? "Published" : "Draft"}
              </span>
            </p>
            {blog.publishedAt && (
              <p>
                <strong>Published:</strong>{" "}
                {new Date(blog.publishedAt).toLocaleString()}
              </p>
            )}
            <p>
              <strong>Created:</strong>{" "}
              {new Date(blog.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated:</strong>{" "}
              {new Date(blog.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Featured Image Section */}
          {blog.image && blog.image.filename && (
            <div className="detail-section">
              <h4>Featured Image</h4>
              <img
                src={`${baseUrl}/uploads/${blog.image.filename}`}
                alt={blog.image.originalName || "Blog Image"}
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
                <strong>File:</strong> {blog.image.originalName}
                <br />
                <strong>Size:</strong> {(blog.image.size / 1024).toFixed(1)} KB
                <br />
                <strong>Type:</strong> {blog.image.mimetype}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Delete confirmation dialog with API integration
const DeleteConfirmDialog = ({ blog, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.delete(
        `${baseUrl}/DeleteBlog?id=${blog._id}`
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onConfirm(blog._id);
          onClose();
        }, 1000);
      } else {
        setError(response.data.message || "Failed to delete blog");
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete blog. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this blog?</p>

          <div className="referral-details">
            <div className="detail-row">
              <span className="detail-label">Title:</span>
              <span className="detail-value">{blog.title || "Untitled"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Author:</span>
              <span className="detail-value">
                {typeof blog.author === "object"
                  ? blog.author.agentName || "Unknown"
                  : blog.author || "Unknown"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Created:</span>
              <span className="detail-value">
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              <span className="success-text">Blog deleted successfully!</span>
            </div>
          )}
        </div>

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
            disabled={isDeleting || success}
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

export default function BlogTable({ onEdit }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [editBlog, setEditBlog] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewingBlog, setViewingBlog] = useState(null);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${baseUrl}/GetBlogs`);

      if (response.data.success) {
        // Process the data to handle object fields properly
        const processedBlogs = response.data.data.map((blog) => ({
          ...blog,
          // Ensure author is properly handled if it's an object
          author:
            typeof blog.author === "object"
              ? blog.author.agentName || "Unknown"
              : blog.author || "Unknown",
          // Ensure tags is always an array
          tags: Array.isArray(blog.tags) ? blog.tags : [],
          // Ensure other fields are strings
          title: blog.title || "",
          heading: blog.heading || "",
          desc1: blog.desc1 || "",
          desc2: blog.desc2 || "",
          desc3: blog.desc3 || "",
          slug: blog.slug || "",
        }));

        setBlogs(processedBlogs);
      } else {
        setError(response.data.message || "Failed to fetch blogs");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.response?.data?.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Enhanced search filter - now includes tags
  const filteredBlogs = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return blogs.filter(
      (b) =>
        String(b.title || "")
          .toLowerCase()
          .includes(searchLower) ||
        String(b.heading || "")
          .toLowerCase()
          .includes(searchLower) ||
        String(b.author || "")
          .toLowerCase()
          .includes(searchLower) ||
        (Array.isArray(b.tags) ? b.tags.join(" ") : "")
          .toLowerCase()
          .includes(searchLower) ||
        String(b.desc1 || "")
          .toLowerCase()
          .includes(searchLower) ||
        String(b.desc2 || "")
          .toLowerCase()
          .includes(searchLower) ||
        String(b.desc3 || "")
          .toLowerCase()
          .includes(searchLower) ||
        String(b._id || "")
          .toLowerCase()
          .includes(searchLower)
    );
  }, [blogs, searchTerm]);

  const handleEdit = (blog) => {
    setEditBlog(blog);
    setEditModalOpen(true);
  };

  const handleView = (blog) => {
    setViewingBlog(blog);
  };

  const handleSaveEdit = (updated) => {
    setEditModalOpen(false);
    setEditBlog(null);

    // Refresh data to get updated info from API
    setTimeout(() => {
      fetchBlogs();
    }, 500);
  };

  const handleAddBlog = () => {
    setAddModalOpen(true);
  };

  const handleSaveAdd = (newBlogData) => {
    setAddModalOpen(false);

    // Refresh data to show new blog from API
    setTimeout(() => {
      fetchBlogs();
    }, 500);
  };

  const handleDelete = (blog) => {
    setBlogToDelete(blog);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = (deletedId) => {
    setBlogs((prev) => prev.filter((b) => b._id !== deletedId));
    setDeleteConfirmOpen(false);
    setBlogToDelete(null);

    // Refresh data after delete
    setTimeout(() => {
      fetchBlogs();
    }, 500);
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <p>Loading blogs...</p>
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
          <button onClick={fetchBlogs} className="button primary-button">
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
            placeholder="Search blogs by title, author, tags, content..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>
            Total: {blogs.length} blogs
          </span>
          <button onClick={fetchBlogs} className="button outline-button">
            <RefreshCw className="button-icon" />
            Refresh
          </button>
        </div>
      </div>

      {/* Add blog button */}
      <div style={{ marginBottom: "1rem" }}>
        <button className="button primary-button" onClick={handleAddBlog}>
          Add Blog
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
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-table">
                    {searchTerm
                      ? "No blogs found matching your search"
                      : "No blogs found"}
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((b) => (
                  <tr key={b._id}>
                    <td>
                      {b.image && b.image.filename ? (
                        <img
                          src={`${baseUrl}/uploads/${b.image.filename}`}
                          alt={b.image.originalName || "Blog"}
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
                            b.image && b.image.filename ? "none" : "flex",
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
                        <strong>{b.title || "Untitled"}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: "200px" }}>
                        {b.heading && b.heading.length > 30
                          ? `${b.heading.substring(0, 30)}...`
                          : b.heading || "No heading"}
                      </div>
                    </td>
                    <td className="hide-on-mobile">
                      <strong style={{ color: "#3b82f6" }}>
                        {String(b.author || "Unknown")}
                      </strong>
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
                        {Array.isArray(b.tags) &&
                          b.tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="badge badge-info"
                              style={{ fontSize: "0.7rem", padding: "2px 6px" }}
                            >
                              {String(tag)}
                            </span>
                          ))}
                        {Array.isArray(b.tags) && b.tags.length > 2 && (
                          <span
                            className="badge badge-secondary"
                            style={{ fontSize: "0.7rem", cursor: "pointer" }}
                            title={`All tags: ${b.tags.join(", ")}`}
                          >
                            +{b.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: "500" }}>
                          {new Date(b.createdAt).toLocaleDateString()}
                        </div>
                        <small style={{ color: "#999", fontSize: "0.8rem" }}>
                          {new Date(b.createdAt).toLocaleTimeString([], {
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
                          onClick={() => handleView(b)}
                        >
                          <Eye className="icon-small" />
                          <span className="sr-only">View</span>
                        </button>
                        <button
                          className="icon-button edit"
                          title="Edit Blog"
                          onClick={() => handleEdit(b)}
                        >
                          <Edit2 className="icon-small" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          className="icon-button delete"
                          onClick={() => handleDelete(b)}
                          title="Delete Blog"
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

      {/* Blog Details Modal */}
      {viewingBlog && (
        <BlogDetailsModal
          blog={viewingBlog}
          onClose={() => setViewingBlog(null)}
        />
      )}

      {/* Edit Blog Modal */}
      <EditBlogModal
        open={editModalOpen}
        blog={editBlog}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
      />

      {/* Add Blog Modal */}
      <AddBlogModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveAdd}
      />

      {/* Delete confirmation modal */}
      {deleteConfirmOpen && blogToDelete && (
        <DeleteConfirmDialog
          blog={blogToDelete}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setBlogToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
