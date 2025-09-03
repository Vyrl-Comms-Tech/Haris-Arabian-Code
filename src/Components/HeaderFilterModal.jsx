import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react"; // Import the icons
// import '../Styles/HeaderFilterModal.css';
import '../Styles/HeadFilterBar.css'

function HeaderFilterModal({ isOpen, onClose, onApply, onReset, currentFilters }) { // Add currentFilters prop
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedFurnishing, setSelectedFurnishing] = useState("All");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");

  // Initialize modal state with current filter values when modal opens
  useEffect(() => {
    if (isOpen && currentFilters) {
      setSelectedAmenities(Array.isArray(currentFilters.amenities) ? currentFilters.amenities : []);
      setSelectedFurnishing(currentFilters.furnishing || "All");
      setMinSize(currentFilters.minSize || "");
      setMaxSize(currentFilters.maxSize || "");
    }
  }, [isOpen, currentFilters]);

  const amenities = [
    "Balcony",
    "Water View",
    "Private Pool",
    "Beach Access",
    "Gym",
    "Parking",
    "Security",
    "Garden",
    "Elevator",
    "Maid Room",
    "Study Room",
    "Storage",
  ];

  const furnishingOptions = ["All", "Furnished", "Unfurnished"];

  const sizeOptions = [
    { value: "", label: "Select Size" },
    { value: "500", label: "500 sq ft" },
    { value: "1000", label: "1,000 sq ft" },
    { value: "1500", label: "1,500 sq ft" },
    { value: "2000", label: "2,000 sq ft" },
    { value: "2500", label: "2,500 sq ft" },
    { value: "3000", label: "3,000 sq ft" },
    { value: "5000", label: "5,000+ sq ft" },
  ];

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setSelectedAmenities([]);
    setSelectedFurnishing("All");
    setMinSize("");
    setMaxSize("");
    if (onReset) onReset();
  };

  const applyFilters = () => {
    const filters = {
      amenities: selectedAmenities,
      furnishing: selectedFurnishing,
      minSize,
      maxSize,
    };
    
    console.log("Modal applying filters:", filters);
    if (onApply) onApply(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="hf-modal-overlay">
      {/* Background overlay */}
      <div className="hf-modal-background" onClick={onClose} />

      {/* Modal */}
      <div className="hf-modal-container">
        {/* Header */}
        <div className="hf-modal-header">
          <h2 className="hf-modal-title">filters</h2>
          <button onClick={onClose} className="hf-close-button">
            <X className="hf-close-icon" />
          </button>
        </div>

        {/* Content */}
        <div className="hf-modal-content">
          {/* Size Section */}
          <div className="hf-section">
            <h3 className="hf-section-title">Size</h3>
            <div className="hf-size-grid">
              <div className="hf-select-container">
                <select
                  className="hf-select-input"
                  value={minSize}
                  onChange={(e) => setMinSize(e.target.value)}
                >
                  <option value="">Min Size</option>
                  {sizeOptions.slice(1).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="hf-select-icon" />
              </div>
              <div className="hf-select-container">
                <select
                  className="hf-select-input"
                  value={maxSize}
                  onChange={(e) => setMaxSize(e.target.value)}
                >
                  <option value="">Max Size</option>
                  {sizeOptions.slice(1).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="hf-select-icon" />
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="hf-section">
            <h3 className="hf-section-title">Amenities</h3>
            <div className="hf-amenities-grid">
              {amenities.map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`hf-amenity-button ${
                    selectedAmenities.includes(amenity) ? "hf-selected" : ""
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Furnishing Section */}
          <div className="hf-section">
            <h3 className="hf-section-title">Furnishing</h3>
            <div className="hf-furnishing-options">
              {furnishingOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedFurnishing(option)}
                  className={`hf-furnishing-button ${
                    selectedFurnishing === option ? "hf-selected" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="hf-modal-footer">
          <button
            onClick={resetFilters}
            className="hf-footer-button hf-reset-button"
          >
            Reset Filters
          </button>
          <button
            onClick={applyFilters}
            className="hf-footer-button hf-update-button"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeaderFilterModal;