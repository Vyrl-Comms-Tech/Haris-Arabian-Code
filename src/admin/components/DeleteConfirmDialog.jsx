import React, { useState } from "react";
import axios from "axios";
import "../styles/modal.css";

export default function DeleteConfirmDialog({ referral, onClose, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const baseUrl=import.meta.env.VITE_BASE_URL

  // Safety check for referral object
  if (!referral) {
    console.error("DeleteConfirmDialog: referral prop is undefined");
    return null;
  }

  const handleDelete = async () => {
    // Additional safety check
    if (!referral.trackingCode) {
      setError("Missing tracking code. Cannot delete referral.");
      return;
    }

    setIsDeleting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.get(
        `${baseUrl}/Delete-Refer-Lead?trackingId=${referral.trackingCode}`
      );
      

      if (response.data.success) {
        setSuccess(true);
        
        // Call the parent's onConfirm function with the referral ID
        setTimeout(() => {
          onConfirm(referral.id);
          onClose();
        }, 1000);
      } else {
        setError(response.data.message || 'Failed to delete referral');
      }
    } catch (err) {
      console.error('Error deleting referral:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to delete referral. Please try again.'
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
      <div className="modal delete-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header" id="modal-head">
          <h2 className="modal-title">Confirm Deletion</h2>
        </div>
        
        <div className="modal-body" id="modalbody">
          <p>Are you sure you want to delete this referral? This action cannot be undone.</p>
          
          {/* Referral Details */}
          <div className="referral-details">
            <div className="detail-row">
              <span className="detail-label">Tracking Code:</span>
              <span className="tracking-code">{referral.trackingCode || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Referee:</span>
              <span className="detail-value">{referral.refereeName || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Property Area:</span>
              <span className="detail-value">{referral.propertyArea || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value">{referral.progress || 'N/A'}</span>
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
              <span className="success-text">Referral deleted successfully!</span>
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
            disabled={isDeleting || success || !referral.trackingCode}
          >
            {isDeleting ? (
              <>
                <span className="loading-spinner"></span>
                Deleting...
              </>
            ) : success ? (
              'Deleted'
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}