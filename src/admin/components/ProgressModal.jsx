import { useState } from "react";
import axios from "axios";

const STATUS_OPTIONS = [
  "Query Received",
  "Agent Assigned", 
  "Contact Initiated", 
  "Meeting Scheduled",
  "Property Shown",
  "Negotiation",
  
  // "Deal in Progress",
  "Deal Closed Collect Commission From Our Office",

  // if deal is cancelled
  "Client Not Interested",
  "Cancelled"
];


  const baseUrl=import.meta.env.VITE_BASE_URL

export default function ProgressModal({ referral, onClose, onUpdate }) {
  const [progress, setProgress] = useState(referral.progress || STATUS_OPTIONS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If no change in progress, just close
    if (progress === referral.progress) {
      onClose();
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Make API call to update the referral status
      const response = await axios.get(
        `${baseUrl}/Update-Refer-Lead?newStatus=${encodeURIComponent(progress)}&trackingId=${referral.trackingCode}`
      );
      // console.log(response)

      if (response.data.success) {
        setSuccess(true);
        
        // Update the parent component
        if (onUpdate) {
          onUpdate(referral.id, progress);
        }

        // Close modal after brief success display
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setError(response.data.message || 'Failed to update progress');
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to update progress. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      setProgress(referral.progress || STATUS_OPTIONS[0]);
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <div className="progress-modal-overlay" onClick={handleCancel}>
      <div className="progress-modal" onClick={e => e.stopPropagation()}>
        <h3 className="progress-modal-title">
          Update Progress for {referral.refereeName}
        </h3>
        
        {/* Tracking Code Display */}
        <div className="tracking-info">
          <span className="tracking-label">Tracking Code:</span>
          <span className="tracking-code">{referral.trackingCode}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="progress-modal-body">
            <label htmlFor="progress-dropdown" className="progress-modal-label">
              Update Query Progress:
            </label>
            <select
              id="progress-dropdown"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="progress-modal-select"
              disabled={isLoading}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* Current vs New Status Display */}
            {progress !== referral.progress && (
              <div className="status-change-preview">
                <div className="status-item">
                  <span className="status-label">Current:</span>
                  <span className="status-value current">{referral.progress}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">New:</span>
                  <span className="status-value new">{progress}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                Progress updated successfully!
              </div>
            )}
          </div>

          <div className="progress-modal-footer">
            <button 
              type="button" 
              className="progress-modal-btn outline" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="progress-modal-btn primary"
              disabled={isLoading || progress === referral.progress}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : (
                'Update Progress'
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .progress-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .progress-modal {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 32px 0 rgba(0,0,0,0.17);
          min-width: 320px;
          max-width: 90vw;
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        .progress-modal-title {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #232323;
        }
        .tracking-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          padding: 0.75rem;
          background-color: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }
        .tracking-label {
          font-weight: 500;
          color: #495057;
          font-size: 0.9rem;
        }
        .tracking-code {
          font-family: 'Courier New', monospace;
          background-color: #e9ecef;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
          color: #495057;
          font-size: 0.85rem;
        }
        .progress-modal-body {
          margin-bottom: 1.5rem;
        }
        .progress-modal-label {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          display: block;
        }
        .progress-modal-select {
          width: 100%;
          padding: 0.5rem 0.7rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          margin-top: 0.4rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .progress-modal-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .progress-modal-select:disabled {
          background-color: #f8f9fa;
          color: #6c757d;
          cursor: not-allowed;
        }
        .status-change-preview {
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 6px;
        }
        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .status-item:last-child {
          margin-bottom: 0;
        }
        .status-label {
          font-weight: 500;
          color: #0c4a6e;
          font-size: 0.9rem;
        }
        .status-value {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .status-value.current {
          background-color: #f1f5f9;
          color: #475569;
        }
        .status-value.new {
          background-color: #dcfce7;
          color: #166534;
        }
        .error-message,
        .success-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 6px;
          margin-top: 1rem;
          font-size: 0.9rem;
          font-weight: 500;
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
        .progress-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .progress-modal-btn {
          padding: 0.5rem 1.1rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .progress-modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .progress-modal-btn.primary {
          background: #3b82f6;
          color: #fff;
        }
        .progress-modal-btn.outline {
          background: #fff;
          border: 1.5px solid #bbb;
          color: #222;
        }
        .progress-modal-btn.outline:hover:not(:disabled) {
          background: #f6f7f9;
        }
        .progress-modal-btn.primary:hover:not(:disabled) {
          background: #2563eb;
        }
        .spinner {
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
        @media (max-width: 480px) {
          .progress-modal {
            min-width: 280px;
            padding: 1.5rem;
          }
          .progress-modal-footer {
            flex-direction: column;
          }
          .progress-modal-btn {
            justify-content: center;
          }
          .status-change-preview {
            padding: 0.5rem;
          }
          .status-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}