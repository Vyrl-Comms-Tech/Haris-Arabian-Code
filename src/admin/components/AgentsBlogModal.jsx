import React from "react";

function AgentsBlogModal({ blogs, agentName, onClose }) {
  return (
    <div className="modal-overlay2" onClick={onClose}>
      <div
        className="details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>
            {agentName}'s Blogs ({blogs.length})
          </h3>
          <button
            onClick={onClose}
            className="close-button"
            id="close-btn-modal"
          >
            ╳
          </button>
        </div>
        <div className="" id="mbody">
          {blogs.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#666",width:'min-content' }}
            >
              No blogs found for this agent
            </div>
          ) : (
            <div className="blogs-list"
            style={{display:'flex',gap:'10px'}}
            >
              {blogs.map((blog, index) => (
                <div
                  key={blog._id || blog.blogId?.$oid || index}
                  className="blog-item"
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0",
                        color: "#1f2937",
                        fontSize: "1.1rem",
                      }}
                    >
                      {blog.title}
                    </h4>
                    <span
                      className={`badge ${
                        blog.isPublished ? "badge-success" : "badge-warning"
                      }`}
                      style={{ fontSize: "0.75rem", padding: "2px 6px" }}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#6b7280",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <strong>Slug:</strong> {blog.slug}
                  </div>

                  {/* Blog Image Preview */}
                  {blog.image && (
                    <div style={{ marginBottom: "0.5rem" }}>
                      <strong style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                        Image:
                      </strong>
                      <div style={{ marginTop: "0.25rem" }}>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "#9ca3af",
                            fontStyle: "italic",
                          }}
                        >
                          {blog.image.originalName || blog.image.filename}
                        </span>
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                    <div>
                      <strong>Created:</strong>{" "}
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleString()
                        : "N/A"}
                    </div>
                    <div>
                      <strong>Updated:</strong>{" "}
                      {blog.updatedAt
                        ? new Date(blog.updatedAt).toLocaleString()
                        : "N/A"}
                    </div>
                    {blog.publishedAt && (
                      <div>
                        <strong>Published:</strong>{" "}
                        {new Date(blog.publishedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentsBlogModal;
