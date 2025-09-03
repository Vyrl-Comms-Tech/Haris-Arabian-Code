import { useState, useMemo, useEffect } from "react";
import { Edit2, Trash2, RefreshCw, Eye, FileText } from "lucide-react";
import axios from "axios";
import "../styles/referral-table.css";
import AgentsBlogModal from "./AgentsBlogModal";
// Updated EditAgentModal component with integrated update endpoint
const EditAgentModal = ({ open, agent, onClose, onSave }) => {
  const baseUrl = "http://192.168.100.31:8000";

  const [form, setForm] = useState(
    agent || {
      agentName: "",
      designation: "",
      reraNumber: "",
      specialistAreas: [],
      email: "",
      phone: "",
      whatsapp: "",
      image: null,
      activeSaleListings: 0,
      propertiesSoldLast15Days: 0,
      isActive: true,
      agentLanguage: "",
    }
  );

  const [preview, setPreview] = useState(
    agent?.imageUrl ? `${baseUrl}${agent.imageUrl}` : null
  );

  const [specialistInput, setSpecialistInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open && agent) {
      setForm({
        agentName: agent.agentName || "",
        designation: agent.designation || "",
        reraNumber: agent.reraNumber || "",
        specialistAreas: agent.specialistAreas || [],
        email: agent.email || "",
        phone: agent.phone || "",
        whatsapp: agent.whatsapp || "",
        image: agent.image || null,
        activeSaleListings: agent.activeSaleListings || 0,
        propertiesSoldLast15Days: agent.propertiesSoldLast15Days || 0,
        isActive: agent.isActive !== undefined ? agent.isActive : true,
        agentLanguage: agent.agentLanguage || "",
      });
      setPreview(agent?.imageUrl ? `${baseUrl}${agent.imageUrl}` : null);
      setSpecialistInput("");
      setError(null);
      setSuccess(false);
    }
  }, [agent, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
    setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSpecialistInputChange = (e) => {
    setSpecialistInput(e.target.value);
  };

  const handleSpecialistAdd = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newArea = specialistInput.trim();
      if (newArea && !form.specialistAreas.includes(newArea)) {
        setForm((prev) => ({
          ...prev,
          specialistAreas: [...prev.specialistAreas, newArea],
        }));
      }
      setSpecialistInput("");
    }
  };

  const handleSpecialistRemove = (areaToRemove) => {
    setForm((prev) => ({
      ...prev,
      specialistAreas: prev.specialistAreas.filter(
        (area) => area !== areaToRemove
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Check if we have a new image file to upload
      const hasNewImage = form.image instanceof File;

      let requestData;
      let headers;

      if (hasNewImage) {
        // Use FormData when uploading image
        requestData = new FormData();
        requestData.append("agentId", agent.agentId);
        requestData.append("agentName", form.agentName.trim());
        requestData.append("designation", form.designation.trim());
        requestData.append("reraNumber", form.reraNumber.trim());
        requestData.append("email", form.email.trim());
        requestData.append("phone", form.phone.trim());
        requestData.append("whatsapp", form.whatsapp.trim());
        requestData.append("activeSaleListings", form.activeSaleListings);
        requestData.append(
          "propertiesSoldLast15Days",
          form.propertiesSoldLast15Days
        );
        requestData.append("isActive", form.isActive);
        requestData.append("agentLanguage", form.agentLanguage.trim());

        // Handle specialistAreas array
        if (form.specialistAreas.length > 0) {
          requestData.append(
            "specialistAreas",
            JSON.stringify(form.specialistAreas)
          );
        }

        // Add the image file
        requestData.append("image", form.image);

        headers = {
          "Content-Type": "multipart/form-data",
        };
      } else {
        // Use FormData for consistency with backend expectations
        requestData = new FormData();
        requestData.append("agentId", agent.agentId);
        requestData.append("agentName", form.agentName.trim());
        requestData.append("designation", form.designation.trim());
        requestData.append("reraNumber", form.reraNumber.trim());
        requestData.append("email", form.email.trim());
        requestData.append("phone", form.phone.trim());
        requestData.append("whatsapp", form.whatsapp.trim());
        requestData.append("activeSaleListings", form.activeSaleListings);
        requestData.append(
          "propertiesSoldLast15Days",
          form.propertiesSoldLast15Days
        );
        requestData.append("isActive", form.isActive);
        requestData.append("agentLanguage", form.agentLanguage.trim());

        if (form.specialistAreas.length > 0) {
          requestData.append(
            "specialistAreas",
            JSON.stringify(form.specialistAreas)
          );
        }

        headers = {
          "Content-Type": "multipart/form-data",
        };
      }

      console.log("Sending agent update data to:", `${baseUrl}/update-agent`);

      // Use the integrated update endpoint
      const response = await axios.post(
        `${baseUrl}/update-agent`,
        requestData,
        { headers }
      );

      if (response.data.success) {
        setSuccess(true);

        // Call the parent onSave function with updated data
        setTimeout(() => {
          onSave(response.data.data); // Pass the updated agent data from response
          onClose();
        }, 1500);
      } else {
        setError(response.data.error || "Failed to update agent");
      }
    } catch (err) {
      console.error("Error updating agent:", err);

      // Handle specific error cases
      if (err.response?.data?.error?.includes("email")) {
        setError(
          "This email address is already in use by another agent. Please use a different email."
        );
      } else if (err.response?.data?.error?.includes("duplicate key")) {
        setError(
          "The provided information conflicts with existing data. Please check your input."
        );
      } else {
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to update agent. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <div className="modal-overlay2" onClick={handleCancel}>
      <div
        className="modal-content edit-blog-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Edit Agent</h2>
          <button
            type="button"
            className="close-button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-blog-form">
          <div className="form-sections">
            {/* Basic Information */}
            <div className="form-section">
              <h3>Basic Information</h3>

              <div className="form-group">
                <label htmlFor="agentName">Agent Name *</label>
                <input
                  id="agentName"
                  name="agentName"
                  value={form.agentName}
                  onChange={handleChange}
                  placeholder="Enter agent name"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="designation">Designation *</label>
                <input
                  id="designation"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Enter designation"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reraNumber">RERA Number *</label>
                <input
                  id="reraNumber"
                  name="reraNumber"
                  value={form.reraNumber}
                  onChange={handleChange}
                  placeholder="Enter RERA number"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="agentLanguage">Agent Language</label>
                <input
                  id="agentLanguage"
                  name="agentLanguage"
                  value={form.agentLanguage}
                  onChange={handleChange}
                  placeholder="Enter preferred language"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h3>Contact Information</h3>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="whatsapp">WhatsApp</label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp number"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Specialist Areas */}
            <div className="form-section">
              <h3>Specialist Areas</h3>

              <div className="form-group">
                <label htmlFor="specialistAreas">Specialist Areas</label>
                <input
                  id="specialistAreas"
                  type="text"
                  value={specialistInput}
                  onChange={handleSpecialistInputChange}
                  onKeyDown={handleSpecialistAdd}
                  placeholder="Type area and press Enter or comma to add"
                  disabled={isLoading}
                />
                <small className="form-hint">
                  Press Enter or comma (,) to add specialist areas
                </small>
              </div>

              {form.specialistAreas.length > 0 && (
                <div className="tags-display">
                  {form.specialistAreas.map((area, index) => (
                    <span key={index} className="tag-item">
                      {area}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => handleSpecialistRemove(area)}
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div className="form-section">
              <h3>Performance Metrics</h3>

              <div className="form-group">
                <label htmlFor="activeSaleListings">Active Sale Listings</label>
                <input
                  id="activeSaleListings"
                  name="activeSaleListings"
                  type="number"
                  min="0"
                  value={form.activeSaleListings}
                  onChange={handleNumberChange}
                  placeholder="Enter number of active listings"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="propertiesSoldLast15Days">
                  Properties Sold (Last 15 Days)
                </label>
                <input
                  id="propertiesSoldLast15Days"
                  name="propertiesSoldLast15Days"
                  type="number"
                  min="0"
                  value={form.propertiesSoldLast15Days}
                  onChange={handleNumberChange}
                  placeholder="Enter properties sold in last 15 days"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="isActive"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleChange}
                    disabled={isLoading}
                    style={{ width: "auto" }}
                  />
                  Agent is Active
                </label>
              </div>
            </div>

            {/* Profile Image */}
            <div className="form-section">
              <h3>Profile Image</h3>

              <div className="form-group">
                <label htmlFor="image">Agent Photo</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
                <small className="form-hint">
                  Max size: 5MB. Supported formats: JPG, PNG, GIF
                  <br />
                  <strong>Note:</strong> New image will be uploaded with the
                  update
                </small>

                {preview && (
                  <div className="image-preview">
                    <img
                      src={preview}
                      alt="Agent preview"
                      style={{
                        marginTop: 10,
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "2px solid #e5e7eb",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              <span className="success-text">Agent updated successfully!</span>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || success}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Updating...
                </>
              ) : success ? (
                "Updated!"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Blog Details Modal
// const BlogDetailsModal = ({ blogs, agentName, onClose }) => (
//   <div className="modal-overlay2" onClick={onClose}>
//     <div
//       className="modal-content details-modal"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="modal-header">
//         <h3>
//           {agentName}'s Blogs ({blogs.length})
//         </h3>
//         <button onClick={onClose} className="close-button" id="close-btn-modal">
//           ╳
//         </button>
//       </div>
//       <div className="modal-body" id="mbody">
//         {blogs.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
//             No blogs found for this agent
//           </div>
//         ) : (
//           <div className="blogs-list">
//             {blogs.map((blog, index) => (
//               <div
//                 key={blog._id}
//                 className="blog-item"
//                 style={{
//                   border: "1px solid #e5e7eb",
//                   borderRadius: "8px",
//                   padding: "1rem",
//                   marginBottom: "1rem",
//                   backgroundColor: "#f9fafb",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "flex-start",
//                     marginBottom: "0.5rem",
//                   }}
//                 >
//                   <h4
//                     style={{
//                       margin: "0",
//                       color: "#1f2937",
//                       fontSize: "1.1rem",
//                     }}
//                   >
//                     {blog.title}
//                   </h4>
//                   <span
//                     className={`badge ${
//                       blog.isPublished ? "badge-success" : "badge-warning"
//                     }`}
//                     style={{ fontSize: "0.75rem", padding: "2px 6px" }}
//                   >
//                     {blog.isPublished ? "Published" : "Draft"}
//                   </span>
//                 </div>

//                 <div
//                   style={{
//                     fontSize: "0.9rem",
//                     color: "#6b7280",
//                     marginBottom: "0.5rem",
//                   }}
//                 >
//                   <strong>Slug:</strong> {blog.slug}
//                 </div>

//                 <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
//                   <div>
//                     <strong>Created:</strong>{" "}
//                     {new Date(blog.createdAt).toLocaleString()}
//                   </div>
//                   <div>
//                     <strong>Updated:</strong>{" "}
//                     {new Date(blog.updatedAt).toLocaleString()}
//                   </div>
//                   {blog.publishedAt && (
//                     <div>
//                       <strong>Published:</strong>{" "}
//                       {new Date(blog.publishedAt).toLocaleString()}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );

// Agent Details Modal
const AgentDetailsModal = ({ agent, onClose }) => (
  <div className="modal-overlay2" onClick={onClose}>
    <div
      className="modal-content details-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h3>Agent Details</h3>
        <button onClick={onClose} className="close-button" id="close-btn-modal">
          ╳
        </button>
      </div>
      <div className="modal-body" id="mbody">
        <div className="details-grid" id="dgrid">
          <div className="detail-section">
            <h4>Agent Information</h4>
            <p>
              <strong>ID:</strong> {agent._id}
            </p>
            <p>
              <strong>Agent ID:</strong> {agent.agentId}
            </p>
            <p>
              <strong>Name:</strong> {agent.agentName}
            </p>
            <p>
              <strong>Designation:</strong> {agent.designation}
            </p>
            <p>
              <strong>RERA Number:</strong> {agent.reraNumber}
            </p>
            <p>
              <strong>Email:</strong> {agent.email}
            </p>
            <p>
              <strong>Phone:</strong> {agent.phone}
            </p>
            <p>
              <strong>WhatsApp:</strong> {agent.whatsapp}
            </p>
            {agent.agentLanguage && (
              <p>
                <strong>Language:</strong> {agent.agentLanguage}
              </p>
            )}
          </div>

          <div className="detail-section">
            <h4>Professional Details</h4>
            {agent.specialistAreas && agent.specialistAreas.length > 0 && (
              <div>
                <strong>Specialist Areas:</strong>
                <div
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.25rem",
                  }}
                >
                  {agent.specialistAreas.map((area, i) => (
                    <span
                      key={i}
                      className="badge badge-info"
                      style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p>
              <strong>Active Sale Listings:</strong>{" "}
              {agent.activeSaleListings || 0}
            </p>
            <p>
              <strong>Properties Sold (Last 15 Days):</strong>{" "}
              {agent.propertiesSoldLast15Days || 0}
            </p>
            <p>
              <strong>Total Properties:</strong> {agent.properties?.length || 0}
            </p>
            <p>
              <strong>Total Blogs:</strong> {agent.blogs?.length || 0}
            </p>
          </div>

          <div className="detail-section">
            <h4>Status & Dates</h4>
            <p>
              <strong>Status:</strong>
              <span
                className={`badge ${
                  agent.isActive ? "badge-success" : "badge-warning"
                }`}
                style={{ marginLeft: "0.5rem" }}
              >
                {agent.isActive ? "Active" : "Inactive"}
              </span>
            </p>
            <p>
              <strong>Registered:</strong>{" "}
              {new Date(agent.registeredDate).toLocaleString()}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(agent.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated:</strong>{" "}
              {new Date(agent.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Agent Image Section */}
          {agent.imageUrl && (
            <div className="detail-section">
              <h4>Profile Image</h4>
              <img
                src={`http://192.168.100.31:8000${agent.imageUrl}`}
                alt={agent.agentName || "Agent Image"}
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
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Delete confirmation dialog
const DeleteConfirmDialog = ({ agent, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.delete(
        `http://192.168.100.31:8000/agents/${agent._id}` // Adjust endpoint as needed
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onConfirm(agent._id);
          onClose();
        }, 1000);
      } else {
        setError(response.data.message || "Failed to delete agent");
      }
    } catch (err) {
      console.error("Error deleting agent:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete agent. Please try again."
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
          <p>Are you sure you want to delete this agent?</p>

          <div className="referral-details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">
                {agent.agentName || "Unknown"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Agent ID:</span>
              <span className="detail-value">{agent.agentId || "N/A"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{agent.email || "N/A"}</span>
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
              <span className="success-text">Agent deleted successfully!</span>
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

export default function AgentTable({ onEdit }) {
  const baseUrl = "http://192.168.100.31:8000";
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [editAgent, setEditAgent] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewingAgent, setViewingAgent] = useState(null);
  const [viewingBlogs, setViewingBlogs] = useState(null);

  // Fetch agents from API
  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${baseUrl}/Allagents`);
      console.log(response);

      if (response.data) {
        // Process the data to handle object fields properly
        const processedAgents = Array.isArray(response.data)
          ? response.data
          : response.data.data || [response.data];

        const cleanedAgents = processedAgents.map((agent) => ({
          ...agent,
          agentName: agent.agentName || "",
          designation: agent.designation || "",
          reraNumber: agent.reraNumber || "",
          email: agent.email || "",
          phone: agent.phone || "",
          whatsapp: agent.whatsapp || "",
          agentId: agent.agentId || "",
          agentLanguage: agent.agentLanguage || "",
          specialistAreas: Array.isArray(agent.specialistAreas)
            ? agent.specialistAreas
            : [],
          isActive: agent.isActive !== undefined ? agent.isActive : true,
          activeSaleListings: agent.activeSaleListings || 0,
          propertiesSoldLast15Days: agent.propertiesSoldLast15Days || 0,
          blogs: Array.isArray(agent.blogs) ? agent.blogs : [],
        }));

        setAgents(cleanedAgents);
      } else {
        setError("No agent data received");
      }
    } catch (err) {
      console.error("Error fetching agents:", err);
      setError(err.response?.data?.message || "Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Enhanced search filter
  const filteredAgents = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return agents.filter(
      (agent) =>
        String(agent.agentName || "")
          .toLowerCase()
          .includes(searchLower) ||
        String(agent.designation || "")
          .toLowerCase()
          .includes(searchLower) ||
        String(agent.email || "")
          .toLowerCase()
          .includes(searchLower) ||
        String(agent.phone || "")
          .toLowerCase()
          .includes(searchLower) ||
        String(agent.agentId || "")
          .toLowerCase()
          .includes(searchLower) ||
        String(agent.reraNumber || "")
          .toLowerCase()
          .includes(searchLower) ||
        (Array.isArray(agent.specialistAreas)
          ? agent.specialistAreas.join(" ")
          : ""
        )
          .toLowerCase()
          .includes(searchLower)
    );
  }, [agents, searchTerm]);

  const handleEdit = (agent) => {
    setEditAgent(agent);
    setEditModalOpen(true);
  };

  const handleView = (agent) => {
    setViewingAgent(agent);
  };

  const handleViewBlogs = (agent) => {
    setViewingBlogs(agent);
  };

  const handleSaveEdit = (updatedAgent) => {
    console.log("Agent updated successfully:", updatedAgent);
    setEditModalOpen(false);
    setEditAgent(null);

    // Update the agent in the local state immediately for better UX
    if (updatedAgent) {
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.agentId === updatedAgent.agentId ? updatedAgent : agent
        )
      );
    }

    // Refresh the data from server to ensure consistency
    setTimeout(() => {
      fetchAgents();
    }, 1000);
  };

  const handleAddAgent = () => {
    setAddModalOpen(true);
  };

  const handleSaveAdd = (newAgentData) => {
    setAddModalOpen(false);
    setTimeout(() => {
      fetchAgents();
    }, 500);
  };

  const handleDelete = (agent) => {
    setAgentToDelete(agent);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = (deletedId) => {
    setAgents((prev) => prev.filter((a) => a._id !== deletedId));
    setDeleteConfirmOpen(false);
    setAgentToDelete(null);
    setTimeout(() => {
      fetchAgents();
    }, 500);
  };

  // Get blog statistics
  const getBlogStats = (blogs) => {
    if (!blogs || blogs.length === 0)
      return { total: 0, published: 0, drafts: 0 };

    const published = blogs.filter((blog) => blog.isPublished).length;
    const drafts = blogs.length - published;

    return {
      total: blogs.length,
      published,
      drafts,
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading agents...</p>
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
          <button onClick={fetchAgents} className="button primary-button">
            <RefreshCw className="button-icon" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
          padding: "1rem",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}
          >
            {agents.filter((a) => a.isActive).length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
            Active Agents
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}
          >
            {agents.reduce((sum, a) => sum + (a.properties?.length || 0), 0)}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
            Total Properties
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}
          >
            {agents.reduce((sum, a) => sum + (a.blogs?.length || 0), 0)}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
            Total Blogs
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#8b5cf6" }}
          >
            {agents.reduce((sum, a) => sum + (a.activeSaleListings || 0), 0)}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
            Active Listings
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="filter-search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search agents by name, email, phone, agent ID, RERA number..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>
            Total: {agents.length} agents ({filteredAgents.length} shown)
          </span>
          <button onClick={fetchAgents} className="button outline-button">
            <RefreshCw className="button-icon" />
            Refresh
          </button>
          <button className="button primary-button" onClick={handleAddAgent}>
            Add Agent
          </button>
        </div>
      </div>
      {/* Search */}

      {/* Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="referral-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Agent Name</th>
                <th>Agent ID</th>
                <th className="hide-on-mobile">Designation</th>
                <th className="hide-on-mobile">Email</th>
                <th className="hide-on-mobile">Phone</th>
                <th>Status</th>
                <th>Properties</th>
                <th>Blogs</th>
                <th className="hide-on-mobile">Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={11} className="empty-table">
                    {searchTerm
                      ? "No agents found matching your search"
                      : "No agents found"}
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => {
                  const blogStats = getBlogStats(agent.blogs);

                  return (
                    <tr key={agent._id}>
                      <td>
                        {agent.imageUrl ? (
                          <img
                            src={`${baseUrl}${agent.imageUrl}`}
                            alt={agent.agentName || "Agent"}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: "50%",
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
                            borderRadius: "50%",
                            border: "2px solid #e5e7eb",
                            display: agent.imageUrl ? "none" : "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            color: "#6b7280",
                            fontWeight: "bold",
                          }}
                        >
                          {agent.agentName
                            ? agent.agentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "NA"}
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: "200px" }}>
                          <strong>{agent.agentName || "Unknown"}</strong>
                          {agent.reraNumber && (
                            <div style={{ fontSize: "0.8rem", color: "#666" }}>
                              RERA: {agent.reraNumber}
                            </div>
                          )}
                          {agent.agentLanguage && (
                            <div style={{ fontSize: "0.7rem", color: "#999" }}>
                              Lang: {agent.agentLanguage}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: "#3b82f6" }}>
                          {agent.agentId || "N/A"}
                        </strong>
                      </td>
                      <td className="hide-on-mobile">
                        {agent.designation || "N/A"}
                      </td>
                      <td className="hide-on-mobile">
                        <div style={{ maxWidth: "200px", fontSize: "0.9rem" }}>
                          {agent.email || "N/A"}
                        </div>
                      </td>
                      <td className="hide-on-mobile">{agent.phone || "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${
                            agent.isActive ? "badge-success" : "badge-warning"
                          }`}
                          style={{ fontSize: "0.7rem", padding: "2px 6px" }}
                        >
                          {agent.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontWeight: "500" }}>
                            {agent.properties?.length || 0}
                          </div>
                          <small style={{ color: "#999", fontSize: "0.8rem" }}>
                            Total
                          </small>
                        </div>
                      </td>
                      <td>
                        <div
                          style={{ textAlign: "center", cursor: "pointer" }}
                          onClick={() => handleViewBlogs(agent)}
                          title="Click to view blogs"
                        >
                          <div style={{ fontWeight: "500", color: "#3b82f6" }}>
                            {blogStats.total}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#666" }}>
                            <span style={{ color: "#10b981" }}>
                              {blogStats.published}P
                            </span>
                            {blogStats.drafts > 0 && (
                              <span
                                style={{ color: "#f59e0b", marginLeft: "4px" }}
                              >
                                {blogStats.drafts}D
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="hide-on-mobile">
                        <div
                          style={{ textAlign: "center", fontSize: "0.8rem" }}
                        >
                          <div style={{ color: "#10b981", fontWeight: "500" }}>
                            {agent.activeSaleListings || 0}
                          </div>
                          <div style={{ color: "#666", fontSize: "0.7rem" }}>
                            Active
                          </div>
                          {agent.propertiesSoldLast15Days > 0 && (
                            <div
                              style={{ color: "#3b82f6", fontSize: "0.7rem" }}
                            >
                              {agent.propertiesSoldLast15Days} sold
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="icon-button"
                            title="View Details"
                            onClick={() => handleView(agent)}
                          >
                            <Eye className="icon-small" />
                            <span className="sr-only">View</span>
                          </button>
                          <button
                            className="icon-button"
                            title="View Blogs"
                            onClick={() => handleViewBlogs(agent)}
                          >
                            <FileText className="icon-small" />
                            <span className="sr-only">Blogs</span>
                          </button>
                          <button
                            className="icon-button edit"
                            title="Edit Agent"
                            onClick={() => handleEdit(agent)}
                          >
                            <Edit2 className="icon-small" />
                            <span className="sr-only">Edit</span>
                          </button>
                          <button
                            className="icon-button delete"
                            onClick={() => handleDelete(agent)}
                            title="Delete Agent"
                          >
                            <Trash2 className="icon-small" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Details Modal */}
      {viewingAgent && (
        <AgentDetailsModal
          agent={viewingAgent}
          onClose={() => setViewingAgent(null)}
        />
      )}

      {/* Blog Details Modal */}
      {viewingBlogs && (
        <AgentsBlogModal
          blogs={viewingBlogs.blogs || []}
          agentName={viewingBlogs.agentName}
          onClose={() => setViewingBlogs(null)}
        />
      )}

      {/* Edit Agent Modal */}
      {editModalOpen && (
        <EditAgentModal
          open={editModalOpen}
          agent={editAgent}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Add Agent Modal */}
      {/* {addModalOpen && (
        <AddAgentModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSave={handleSaveAdd}
        />
      )} */}

      {/* Delete confirmation modal */}
      {deleteConfirmOpen && agentToDelete && (
        <DeleteConfirmDialog
          agent={agentToDelete}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setAgentToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
