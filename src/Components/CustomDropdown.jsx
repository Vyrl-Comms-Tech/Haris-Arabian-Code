import React, { useState, useEffect } from "react";
import "../Styles/CustomDropdown.css";

function CustomDropdown({
  options,
  defaultValue,
  className = "",
  placeholder,
  onSelect,
  dropdownName,
  value,
  resetTrigger,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || placeholder);

  useEffect(() => {
    // Update selected value when value prop changes or reset trigger changes
    const newValue = value || defaultValue || placeholder;
    setSelectedValue(newValue);
  }, [value, defaultValue, placeholder, resetTrigger]);

  const handleSelect = (option) => {
    setSelectedValue(option.label);
    setIsOpen(false);

    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className={`custom-dropdown ${className}`}>
      <button
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label={dropdownName}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedValue || placeholder}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="5"
          viewBox="0 0 10 5"
          fill="none"
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
        >
          <path d="M0 0L5 5L10 0H0Z" fill="#011825" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="dropdown-overlay" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="dropdown-menu" role="listbox">
            {options.map((option, index) => (
              <button
                key={index}
                className={`dropdown-option ${
                  selectedValue === option.label ? "selected" : ""
                }`}
                onClick={() => handleSelect(option)}
                type="button"
                role="option"
                aria-selected={selectedValue === option.label}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CustomDropdown;