import { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../styles/filter-dropdown.css";

export default function FilterDropdown({ onClose, onApplyFilters, currentFilters = {} }) {
  const [filters, setFilters] = useState({
    propertyArea: currentFilters.propertyArea || "",
    urgencyLevel: currentFilters.urgencyLevel || "",
    progress: currentFilters.progress || "",
    sortBy: currentFilters.sortBy || "newest"
  });

  // Property area options (you can customize these based on your data)
  const propertyAreas = [
    "Downtown", "Suburb", "Rural", "Beachfront", "City Center", 
    "Industrial", "Residential", "Commercial", "Mixed Use"
  ];

  // Urgency levels matching your API enum values
  const urgencyLevels = [
    { value: "Immediate", label: "Extreme (Immediate)" },
    { value: "Within 1 month", label: "High (Within 1 month)" },
    { value: "Within 3 months", label: "Medium (Within 3 months)" },
    { value: "No rush", label: "Low (No rush)" }
  ];

  // Progress statuses based on your getProgressBadgeClass function
  const progressStatuses = [
    "Query Received",
    "Agent Assigned", 
    "Contact Initiated",
    "Meeting Scheduled",
    "Property Shown",
    "Negotiation",
    "Deal Closed",
    "Client Not Interested",
    "Cancelled",
    "In Progress",
    "Completed",
    "Property Received"
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApplyFilters = () => {
    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    
    onApplyFilters(cleanFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      propertyArea: "",
      urgencyLevel: "",
      progress: "",
      sortBy: "newest"
    };
    setFilters(clearedFilters);
    onApplyFilters({});
    onClose();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "" && value !== "newest");

  return (
    <div className="filter-dropdown">
      <div className="filter-header">
        <h3>Filter Referrals</h3>
        <button className="close-filter-btn" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      
      <div className="filter-body">
        {/* <div className="form-group">
          <label htmlFor="propertyArea">Property Area</label>
          <select 
            id="propertyArea" 
            value={filters.propertyArea} 
            onChange={(e) => handleFilterChange('propertyArea', e.target.value)}
          >
            <option value="">All Areas</option>
            {propertyAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div> */}

        <div className="form-group">
          <label htmlFor="urgencyLevel">Urgency Level</label>
          <select 
            id="urgencyLevel" 
            value={filters.urgencyLevel} 
            onChange={(e) => handleFilterChange('urgencyLevel', e.target.value)}
          >
            <option value="">All Urgency Levels</option>
            {urgencyLevels.map(urgency => (
              <option key={urgency.value} value={urgency.value}>
                {urgency.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="progress">Progress Status</label>
          <select 
            id="progress" 
            value={filters.progress} 
            onChange={(e) => handleFilterChange('progress', e.target.value)}
          >
            <option value="">All Statuses</option>
            {progressStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sortBy">Sort Order</label>
          <select 
            id="sortBy" 
            value={filters.sortBy} 
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="urgency">Most Urgent First</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="active-filters">
            <h4>Active Filters:</h4>
            <div className="filter-tags">
              {filters.propertyArea && (
                <span className="filter-tag">
                  Area: {filters.propertyArea}
                  <button onClick={() => handleFilterChange('propertyArea', '')}>×</button>
                </span>
              )}
              {filters.urgencyLevel && (
                <span className="filter-tag">
                  Urgency: {urgencyLevels.find(u => u.value === filters.urgencyLevel)?.label}
                  <button onClick={() => handleFilterChange('urgencyLevel', '')}>×</button>
                </span>
              )}
              {filters.progress && (
                <span className="filter-tag">
                  Status: {filters.progress}
                  <button onClick={() => handleFilterChange('progress', '')}>×</button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="filter-footer">
        <button className="button outline-button" onClick={handleClearFilters}>
          Clear All
        </button>
        <button className="button primary-button" onClick={handleApplyFilters}>
          Apply Filters
          {/* Apply Filters {hasActiveFilters && `(${Object.values(filters).filter(v => v && v !== "newest").length})`} */}
        </button>
      </div>
    </div>
  );
}