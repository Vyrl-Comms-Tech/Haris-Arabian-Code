import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import "../Styles/Hero.css";
import axios from "axios";
import Navbar from "./Navbar";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePropertyContext } from "../Context/PropertyContext";
import CustomDropdown from "../Components/CustomDropdown";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

function Hero() {
  // Filter states - Updated to match PropertyHeader pattern
  const [activeTab, setActiveTab] = useState("Buy");
  const [propertyType, setPropertyType] = useState("apartment"); // Default to lowercase apartment
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  // Location suggestions states
  const [searchLocation, setSearchLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [renderSuggestions, setRenderSuggestions] = useState(false);

  // Loading states
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Reset trigger for dropdowns
  const [resetTrigger, setResetTrigger] = useState(0);

  // Base API URL
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const { fetchHeroFilteredProperties } = usePropertyContext();

  // Use refs to store timeout IDs and current values to avoid recreating them
  const debounceTimeoutRef = useRef(null);
  const blurTimeoutRef = useRef(null);

  // Memoized constants
  const tabs = useMemo(() => ["Buy", "Rent", "Commercial", "Off Plan"], []);

  // Updated property type options with lowercase values to match PropertyHeader
  const propertyTypeOptions = useMemo(() => [
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
    { value: "townhouse", label: "Townhouse" },
    { value: "penthouse", label: "Penthouse" },
    { value: "studio", label: "Studio" },
  ], []);

  const bedroomOptions = useMemo(() => [
    { value: "", label: "Beds" },
    { value: "studio", label: "Studio" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5+", label: "5+" },
  ], []);

  const priceMinOptions = useMemo(() => [
    { value: "", label: "Price Min" },
    { value: "100000", label: "100,000" },
    { value: "200000", label: "200,000" },
    { value: "500000", label: "500,000" },
    { value: "750000", label: "750,000" },
    { value: "1000000", label: "1,000,000" },
  ], []);

  const priceMaxOptions = useMemo(() => [
    { value: "", label: "Price Max" },
    { value: "500000", label: "500,000" },
    { value: "1000000", label: "1,000,000" },
    { value: "2000000", label: "2,000,000" },
    { value: "5000000", label: "5,000,000" },
    { value: "10000000", label: "10,000,000" },
  ], []);

  // Memoized helper function
  const getCurrentDropdownValue = useCallback((filterKey, currentValue) => {
    const labelMaps = {
      propertyType: {
        apartment: "Apartment",
        villa: "Villa",
        townhouse: "Townhouse",
        penthouse: "Penthouse",
        studio: "Studio",
      },
      bedrooms: {
        "": "Beds",
        studio: "Studio",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        "5+": "5+",
      },
      priceMin: {
        "": "Price Min",
        100000: "100,000",
        200000: "200,000",
        500000: "500,000",
        750000: "750,000",
        1000000: "1,000,000",
      },
      priceMax: {
        "": "Price Max",
        500000: "500,000",
        1000000: "1,000,000",
        2000000: "2,000,000",
        5000000: "5,000,000",
        10000000: "10,000,000",
      },
    };

    return labelMaps[filterKey][currentValue] || currentValue;
  }, []);

  // Memoized scroll functions
  const scrollToSection = useCallback((target) => {
    gsap.to(window, {
      duration: 1.2,
      scrollTo: {
        y: target,
      },
      ease: "power2.inOut",
    });
  }, []);

  const jumpToReferProperty = useCallback(() => {
    const target = document.getElementById("referproperty-section");

    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "auto" });

      gsap.fromTo(
        target,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    } else {
      console.warn("Target section not found or not a valid DOM element.");
    }
  }, []);

  // Updated build filter function to match Universal Filter endpoint requirements
  const buildFilterObject = useCallback(() => {
    const filterObject = {};

    // Map tab to offeringType (using new structure)
    const tabToOfferingType = {
      Buy: "RS", // Residential Sale
      Rent: "RR", // Residential Rent
      Commercial: "CS", // Commercial Sale
      "Off Plan": "all", // All off-plan types
    };

    filterObject.offeringType = tabToOfferingType[activeTab];

    // Add property type (already lowercase)
    if (propertyType && propertyType !== "apartment") {
      filterObject.propertyType = propertyType;
    }

    // Add price filters
    if (priceMin && priceMin.trim() !== "") {
      filterObject.minPrice = priceMin.trim();
    }

    if (priceMax && priceMax.trim() !== "") {
      filterObject.maxPrice = priceMax.trim();
    }

    // Add bedroom filter
    if (bedrooms && bedrooms !== "") {
      filterObject.bedrooms = bedrooms;
    }

    // Add location filter
    if (searchLocation && searchLocation.trim() !== "") {
      filterObject.address = searchLocation.trim();
    }

    console.log("Building Hero filter object:", filterObject);
    return filterObject;
  }, [activeTab, propertyType, priceMin, priceMax, bedrooms, searchLocation]);

  // Fetch location suggestions function - updated to match PropertyHeader pattern
  const fetchLocationSuggestions = useCallback(async (searchTerm) => {
    try {
      setLoadingSuggestions(true);
      
      // Determine category based on active tab
      let category = 'sale'; // default
      
      if (activeTab === "Off Plan") {
        category = 'offplan';
      } else if (activeTab === "Rent") {
        category = 'rent';
      } else if (activeTab === "Commercial") {
        category = 'commercial';
      }
      
      console.log('Hero: Fetching suggestions for:', searchTerm, 'category:', category, 'tab:', activeTab);
      
      const response = await axios.get(
        `${BASE_URL}/Property-location-suggestions?prefix=${encodeURIComponent(
          searchTerm
        )}&category=${category}`
      );

      console.log('Hero: API Response:', response.data);

      if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data)) {
        setLocationSuggestions(response.data.data);
        setShowSuggestions(true);
        console.log('Hero: Suggestions set:', response.data.data);
      } else {
        console.log('Hero: No valid suggestions in response');
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Hero: Error fetching location suggestions:", error);
      setLocationSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  }, [BASE_URL, activeTab]);

  // Memoized dropdown handlers
  const handlePropertyTypeSelect = useCallback((option) => {
    setPropertyType(option.value);
    console.log("Hero: Property type changed to:", option.value);
  }, []);

  const handlePriceMinSelect = useCallback((option) => {
    setPriceMin(option.value);
    console.log("Hero: Min price changed to:", option.value);
  }, []);

  const handlePriceMaxSelect = useCallback((option) => {
    setPriceMax(option.value);
    console.log("Hero: Max price changed to:", option.value);
  }, []);

  const handleBedroomsSelect = useCallback((option) => {
    setBedrooms(option.value);
    console.log("Hero: Bedrooms changed to:", option.value);
  }, []);

  // Optimized location search handler with stable reference
  const handleLocationSearch = useCallback((e) => {
    const value = e.target.value;
    setRenderSuggestions(true);
    setSearchLocation(value);

    console.log("Hero: Location search changed to:", value);

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // If user clears the search, reset suggestions immediately
    if (value.trim() === "") {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Set new debounced timeout
    debounceTimeoutRef.current = setTimeout(() => {
      if (value.trim().length >= 2) {
        fetchLocationSuggestions(value.trim());
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  }, [fetchLocationSuggestions]);

  // Memoized suggestion click handler
  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchLocation(suggestion);
    setRenderSuggestions(false);
    setShowSuggestions(false);
    
    console.log("Hero: Location suggestion selected:", suggestion);
  }, []);

  // Memoized input focus handler
  const handleInputFocus = useCallback(() => {
    if (searchLocation.trim().length >= 2) {
      setShowSuggestions(true);
    }
  }, [searchLocation]);

  // Memoized input blur handler
  const handleInputBlur = useCallback(() => {
    // Clear any existing timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    // Set a new timeout
    blurTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }, []);

  // Memoized tab change handler
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    
    console.log("Hero: Tab changed to:", tab);

    // Reset all filters when changing tabs
    setLocationSuggestions([]);
    setShowSuggestions(false);
    setPropertyType("apartment"); // Reset to default
    setPriceMin("");
    setPriceMax("");
    setBedrooms("");
    setSearchLocation("");
    
    setResetTrigger(prev => prev + 1);
  }, []);

  // Updated search click handler to use Universal Filter
  const handleSearchClick = useCallback(async () => {
    const filtervalues = {
      activeTab,
      propertyType,
      priceMin,
      priceMax,
      bedrooms,
      searchLocation,
    };
    console.log("Hero: Filter values:", filtervalues);
    setLoadingSearch(true);

    try {
      const filterObject = buildFilterObject();
      console.log("Hero: Filter object to be sent:", filterObject);

      const result = await fetchHeroFilteredProperties(filterObject);
      console.log("Hero: Search result:", result);
      
      // Determine navigation path based on active tab
      let navigationPath;
      switch (activeTab) {
        case "Rent":
          navigationPath = "/properties/rent";
          break;
        case "Commercial":
          navigationPath = "/properties/commercial";
          break;
        case "Off Plan":
          navigationPath = "/properties/offplan";
          break;
        case "Buy":
        default:
          navigationPath = "/properties/sale";
          break;
      }
      
      if (result && result.success) {
        console.log("Hero: Navigating to:", navigationPath);
        navigate(navigationPath);
      } else {
        console.log("Hero: No results found, navigating to:", navigationPath);
        navigate(navigationPath);
      }
    } catch (error) {
      console.error("Hero: Error during search:", error);
      // Still navigate even on error
      const navigationPath = activeTab === "Rent" ? "/properties/rent" : 
                           activeTab === "Commercial" ? "/properties/commercial" :
                           activeTab === "Off Plan" ? "/properties/offplan" : "/properties/sale";
      navigate(navigationPath);
    } finally {
      setLoadingSearch(false);
    }
  }, [
    activeTab,
    propertyType,
    priceMin,
    priceMax,
    bedrooms,
    searchLocation,
    buildFilterObject,
    fetchHeroFilteredProperties,
    navigate,
  ]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  console.log("Hero: Component rendered with activeTab:", activeTab);

  return (
    <>
      <div className="hero-section">
        {/* bg img */}
        <img src="/Assets/Rectangle1.jpg" id="heroimg" alt="" />

        {/* Main Content */}
        <div className="main-content">
          {/* Navbar */}
          <Navbar />
          <div className="centersection">
            <h1 id="heroheading">
              Find Your Dream <br /> Property in Dubai
            </h1>
            <h1 id="heroheading2">
              Dubai real estate agency known for clarity, expertise, and curated property <br/> solutions across the UAE
            </h1>

            {/* Searchbar section */}
            <div className="search-section">
              {/* Navigation Tabs */}
              <div className="tab-container">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`tab ${activeTab === tab ? "active-tab" : ""}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Filters - All in one row */}
              <div className="filters-container">
                <div className="filters-row">
                  {/* Search Input with Location Suggestions */}
                  <div className="search-input-container">
                    <div className="search-wrapper">
                      <input
                        type="text"
                        placeholder="Community or building"
                        className="search-input"
                        value={searchLocation}
                        onChange={handleLocationSearch}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                      <Search size={17} className="search-icon" />

                      {/* Loading indicator */}
                      {loadingSuggestions && (
                        <div className="search-loading">
                          <div className="loading-spinner"></div>
                        </div>
                      )}

                      {/* Suggestions dropdown */}
                      {renderSuggestions &&
                        showSuggestions &&
                        locationSuggestions.length > 0 && (
                          <div className="suggestions-dropdown">
                            {locationSuggestions
                              .slice(0, 8)
                              .map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="suggestion-item"
                                  onClick={() =>
                                    handleSuggestionClick(suggestion)
                                  }
                                >
                                  <MapPin
                                    size={14}
                                    className="suggestion-icon"
                                  />
                                  <span className="suggestion-text">
                                    {suggestion}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}

                      {/* No suggestions message */}
                      {showSuggestions &&
                        searchLocation.trim().length >= 2 &&
                        locationSuggestions.length === 0 &&
                        !loadingSuggestions && (
                          <div className="suggestions-dropdown">
                            <div className="suggestion-item no-results">
                              <span>No locations found</span>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Property Type Filter - Custom Dropdown */}
                  <div className="filter-group">
                    <label className="filter-label" id="hero-label">Property type</label>
                    <CustomDropdown
                      options={propertyTypeOptions}
                      defaultValue="Apartment"
                      onSelect={handlePropertyTypeSelect}
                      dropdownName="Property Type"
                      value={getCurrentDropdownValue("propertyType", propertyType)}
                      resetTrigger={resetTrigger}
                      className="hero-dropdown"
                    />
                  </div>
                  <div className="filterrow"></div>

                  {/* Bedrooms Filter - Custom Dropdown */}
                  <div className="filter-group">
                    <label className="filter-label" id="hero-label">Bedrooms</label>
                    <CustomDropdown
                      options={bedroomOptions}
                      defaultValue="Beds"
                      onSelect={handleBedroomsSelect}
                      dropdownName="Bedrooms"
                      value={getCurrentDropdownValue("bedrooms", bedrooms)}
                      resetTrigger={resetTrigger}
                      className="hero-dropdown"
                    />
                  </div>

                  <div className="filterrow"></div>

                  {/* Min Price Filter - Custom Dropdown */}
                  <div className="filter-group">
                    <label className="filter-label" id="hero-label">Min Price</label>
                    <CustomDropdown
                      options={priceMinOptions}
                      defaultValue="Price Min"
                      onSelect={handlePriceMinSelect}
                      dropdownName="Minimum Price"
                      value={getCurrentDropdownValue("priceMin", priceMin)}
                      resetTrigger={resetTrigger}
                      className="hero-dropdown"
                    />
                  </div>

                  <div className="filterrow"></div>
                  {/* Max Price Filter - Custom Dropdown */}
                  <div className="filter-group">
                    <label className="filter-label" id="hero-label">Max Price</label>
                    <CustomDropdown
                      options={priceMaxOptions}
                      defaultValue="Price Max"
                      onSelect={handlePriceMaxSelect}
                      dropdownName="Maximum Price"
                      value={getCurrentDropdownValue("priceMax", priceMax)}
                      resetTrigger={resetTrigger}
                      className="hero-dropdown"
                    />
                  </div>

                  <div className="filterrow"></div>

                  {/* Search Button */}
                  <button
                    className="search-button"
                    onClick={handleSearchClick}
                    disabled={loadingSearch}
                  >
                    {loadingSearch ? (
                      <div className="loading-spinner-small"></div>
                    ) : (
                      <Search size={20} color="white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Box Grid Section */}
          <div className="boxessection">
            <div className="herobox" id="box1">
              <div className="imgholder">
                <img src="/Assets/calculator.svg" alt="" />
              </div>
              <div>
                <h5>
                  Mortgage <br /> Calculator
                </h5>
              </div>
            </div>

            <div className="herobox" id="box2">
              <div className="imgholder">
                <img src="/Assets/calculator.svg" alt="" />
              </div>
              <div>
                <h5>
                  Rental Yield <br /> Calculator
                </h5>
              </div>
            </div>
            <div className="herobox" id="box3">
              <div className="imgholder">
                <img src="/Assets/calculator.svg" alt="" />
              </div>
              <div>
                <h5>
                  Buy vs Rent <br /> Calculator
                </h5>
              </div>
            </div>
            <div className="herobox" id="box4">
              <div className="imgholder">
                <img src="/Assets/home.svg" alt="" />
              </div>
              <div>
                <h5>
                  List your <br /> Property
                </h5>
              </div>
            </div>
            <div className="herobox" id="box5">
              <div className="imgholder">
                <img src="/Assets/kb.svg" alt="" />
              </div>
              <div>
                <h5>
                  Knowledge <br /> Base
                </h5>
              </div>
            </div>
            <div className="herobox" id="box6">
              <div className="imgholder">
                <img src="/Assets/agent.svg" alt="" />
              </div>
              <div>
                <h5>
                  Find your <br /> Agent
                </h5>
              </div>
            </div>
            <div className="herobox" id="box7">
              <div className="imgholder">
                <img src="/Assets/valuate.svg" alt="" />
              </div>
              <div>
                <h5>
                  Valuate your <br /> Property
                </h5>
              </div>
            </div>
          </div>

          <div className="sideballs-section">
            <div
              className="ball"
              style={{ cursor: "pointer" }}
              onClick={() => scrollToSection("#section1")}
            >
              <p>01</p>
            </div>
            <div
              className="ball"
              style={{ cursor: "pointer" }}
              onClick={() => scrollToSection(".TrustedPartner")}
            >
              <p>02</p>
            </div>
            <div
              className="ball"
              style={{ cursor: "pointer" }}
              onClick={jumpToReferProperty}
            >
              <p>03</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;