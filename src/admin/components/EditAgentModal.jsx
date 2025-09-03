import React, { useState } from "react";
import axios from "axios";
import "../styles/EditBlogmodal.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function EditAgentModal({ open, agent, onClose, onSave }) {
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
    }
  );
  
  const [preview, setPreview] = useState(
    agent?.imageUrl ? `${baseUrl}${agent.imageUrl}` : null
  );
  
  const [specialistInput, setSpecialistInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
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
      [name]: type === 'checkbox' ? checked : value 
    }));
    setError(null);
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: parseInt(value) || 0
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
      if (!file.type.startsWith('image/')) {
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
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newArea = specialistInput.trim();
      if (newArea && !form.specialistAreas.includes(newArea)) {
        setForm((prev) => ({
          ...prev,
          specialistAreas: [...prev.specialistAreas, newArea]
        }));
      }
      setSpecialistInput("");
    }
  };

  const handleSpecialistRemove = (areaToRemove) => {
    setForm((prev) => ({
      ...prev,
      specialistAreas: prev.specialistAreas.filter(area => area !== areaToRemove)
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
        requestData.append('agentId', agent._id);
        requestData.append('agentName', form.agentName.trim());
        requestData.append('designation', form.designation.trim());
        requestData.append('reraNumber', form.reraNumber.trim());
        requestData.append('email', form.email.trim());
        requestData.append('phone', form.phone.trim());
        requestData.append('whatsapp', form.whatsapp.trim());
        requestData.append('activeSaleListings', form.activeSaleListings);
        requestData.append('propertiesSoldLast15Days', form.propertiesSoldLast15Days);
        requestData.append('isActive', form.isActive);
        
        // Handle specialistAreas array
        if (form.specialistAreas.length > 0) {
          requestData.append('specialistAreas', JSON.stringify(form.specialistAreas));
        }
        
        // Add the image file
        requestData.append('image', form.image);
        
        headers = {
          'Content-Type': 'multipart/form-data',
        };
      } else {
        // Use JSON when no image update
        requestData = {
          agentId: agent._id,
          agentName: form.agentName.trim(),
          designation: form.designation.trim(),
          reraNumber: form.reraNumber.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          whatsapp: form.whatsapp.trim(),
          activeSaleListings: form.activeSaleListings,
          propertiesSoldLast15Days: form.propertiesSoldLast15Days,
          isActive: form.isActive,
          specialistAreas: form.specialistAreas
        };
        
        headers = {
          'Content-Type': 'application/json',
        };
      }

      console.log('Sending agent update data:', hasNewImage ? 'FormData with image' : requestData);

      const response = await axios.post(
        `${baseUrl}/UpdateAgent`,
        requestData,
        { headers }
      );

      if (response.data.success) {
        setSuccess(true);
        
        // Call the parent onSave function with updated data
        setTimeout(() => {
          onSave(form);
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update agent');
      }
    } catch (err) {
      console.error('Error updating agent:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to update agent. Please try again.'
      );
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
      <div className="modal-content edit-blog-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Agent</h2>
          <button type="button" className="close-button" onClick={handleCancel} disabled={isLoading}>
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
                <small className="form-hint">Press Enter or comma (,) to add specialist areas</small>
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
                <label htmlFor="propertiesSoldLast15Days">Properties Sold (Last 15 Days)</label>
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
                <label htmlFor="isActive" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    id="isActive"
                    name="isActive" 
                    type="checkbox"
                    checked={form.isActive} 
                    onChange={handleChange} 
                    disabled={isLoading}
                    style={{ width: 'auto' }}
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
                  Max size: 5MB. Supported formats: JPG, PNG, GIF<br/>
                  <strong>Note:</strong> New image will be uploaded with the update
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
                        border: "2px solid #e5e7eb"
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
            <button type="button" className="btn-secondary" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading || success}>
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Updating...
                </>
              ) : success ? (
                'Updated!'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .edit-blog-modal {
          max-width: 800px;
          width: 90vw;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: all 0.2s;
        }

        .close-button:hover:not(:disabled) {
          background-color: #f3f4f6;
          color: #374151;
        }

        .close-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .edit-blog-form {
          padding: 1.5rem;
        }

        .form-sections {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .form-section h3 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 1.125rem;
          font-weight: 600;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input:disabled,
        .form-group textarea:disabled {
          background-color: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }

        .form-hint {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .tags-display {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .tag-item {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background-color: #dbeafe;
          color: #1d4ed8;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .tag-remove {
          background: none;
          border: none;
          color: #1d4ed8;
          cursor: pointer;
          font-weight: bold;
          font-size: 0.875rem;
          padding: 0;
          margin-left: 0.25rem;
        }

        .tag-remove:hover:not(:disabled) {
          color: #1e40af;
        }

        .tag-remove:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .image-preview {
          margin-top: 0.75rem;
        }

        .error-message,
        .success-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 6px;
          margin: 1.5rem 0;
          font-size: 0.9rem;
        }

        .error-message {
          background-color: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .success-message {
          background-color: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .error-icon,
        .success-icon {
          font-size: 1rem;
        }

        .error-text,
        .success-text {
          font-weight: 500;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-secondary,
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-secondary {
          background-color: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background-color: #e5e7eb;
        }

        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .btn-secondary:disabled,
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .edit-blog-modal {
            width: 95vw;
            margin: 0.5rem;
          }

          .modal-header,
          .edit-blog-form {
            padding: 1rem;
          }

          .form-section {
            padding: 1rem;
          }

          .modal-actions {
            flex-direction: column;
          }

          .btn-secondary,
          .btn-primary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}