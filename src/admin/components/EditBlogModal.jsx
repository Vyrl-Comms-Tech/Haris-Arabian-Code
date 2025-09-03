import React, { useState } from "react";
import axios from "axios";
import "../styles/EditBlogmodal.css";



  const baseUrl=import.meta.env.VITE_BASE_URL
export default function EditBlogModal({ open, blog, onClose, onSave }) {

  const [form, setForm] = useState(
    blog || {
      title: "",
      heading: "",
      desc1: "",
      desc2: "",
      desc3: "",
      author: "",
      tags: [],
      image: null,
    }
  );
  
  const [preview, setPreview] = useState(
    blog?.image?.filename ? `${baseUrl}/uploads/${blog.image.filename}` : null
  );
  
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (open && blog) {
      setForm({
        title: blog.title || "",
        heading: blog.heading || "",
        desc1: blog.desc1 || "",
        desc2: blog.desc2 || "",
        desc3: blog.desc3 || "",
        author: blog.author || "",
        tags: blog.tags || [],
        image: blog.image || null,
      });
      setPreview(blog?.image?.filename ? `${baseUrl}/uploads/${blog.image.filename}` : null);
      setTagInput("");
      setError(null);
      setSuccess(false);
    }
  }, [blog, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user starts typing
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

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !form.tags.includes(newTag)) {
        setForm((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
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
        requestData.append('blogId', blog._id);
        requestData.append('title', form.title.trim());
        requestData.append('heading', form.heading.trim());
        requestData.append('desc1', form.desc1.trim());
        requestData.append('desc2', form.desc2.trim());
        requestData.append('desc3', form.desc3.trim());
        requestData.append('author', form.author.trim());
        
        // Handle tags array - convert to JSON string or send individually
        if (form.tags.length > 0) {
          requestData.append('tags', JSON.stringify(form.tags));
        }
        
        // Add the image file
        requestData.append('image', form.image);
        
        headers = {
          'Content-Type': 'multipart/form-data',
        };
      } else {
        // Use JSON when no image update
        requestData = {
          blogId: blog._id,
          title: form.title.trim(),
          heading: form.heading.trim(),
          desc1: form.desc1.trim(),
          desc2: form.desc2.trim(),
          desc3: form.desc3.trim(),
          author: form.author.trim(),
          tags: form.tags
        };
        
        headers = {
          'Content-Type': 'application/json',
        };
      }

      console.log('Sending update data:', hasNewImage ? 'FormData with image' : requestData);

      const response = await axios.post(
        `${baseUrl}/UpdateBlog`,
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
        setError(response.data.message || 'Failed to update blog');
      }
    } catch (err) {
      console.error('Error updating blog:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to update blog. Please try again.'
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
          <h2>Edit Blog</h2>
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
                <label htmlFor="title">Title *</label>
                <input 
                  id="title"
                  name="title" 
                  value={form.title} 
                  onChange={handleChange} 
                  placeholder="Enter blog title"
                  disabled={isLoading}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="heading">Heading *</label>
                <input 
                  id="heading"
                  name="heading" 
                  value={form.heading} 
                  onChange={handleChange} 
                  placeholder="Enter blog heading"
                  disabled={isLoading}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="author">Author *</label>
                <input 
                  id="author"
                  name="author" 
                  value={form.author} 
                  onChange={handleChange} 
                  placeholder="Enter author name"
                  disabled={isLoading}
                  required 
                />
              </div>
            </div>

            {/* Content Sections */}
            <div className="form-section">
              <h3>Content</h3>
              
              <div className="form-group">
                <label htmlFor="desc1">Description 1 *</label>
                <textarea 
                  id="desc1"
                  name="desc1" 
                  value={form.desc1} 
                  onChange={handleChange} 
                  placeholder="Enter first description"
                  rows="4"
                  disabled={isLoading}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="desc2">Description 2 *</label>
                <textarea 
                  id="desc2"
                  name="desc2" 
                  value={form.desc2} 
                  onChange={handleChange} 
                  placeholder="Enter second description"
                  rows="4"
                  disabled={isLoading}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="desc3">Description 3 *</label>
                <textarea 
                  id="desc3"
                  name="desc3" 
                  value={form.desc3} 
                  onChange={handleChange} 
                  placeholder="Enter third description"
                  rows="4"
                  disabled={isLoading}
                  required 
                />
              </div>
            </div>

            {/* Tags Section */}
            <div className="form-section">
              <h3>Tags</h3>
              
              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagAdd}
                  placeholder="Type tag and press Enter or comma to add"
                  disabled={isLoading}
                />
                <small className="form-hint">Press Enter or comma (,) to add tags</small>
              </div>
              
              {form.tags.length > 0 && (
                <div className="tags-display">
                  {form.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => handleTagRemove(tag)}
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Image Section */}
            <div className="form-section">
              <h3>Featured Image</h3>
              
              <div className="form-group">
                <label htmlFor="image">Image</label>
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
                      alt="Blog preview"
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
              <span className="success-text">Blog updated successfully!</span>
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