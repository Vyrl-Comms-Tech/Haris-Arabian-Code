import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Search, Filter, Grid3X3, ChevronDown, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import HeaderFilterModal from "./HeaderFilterModal";
import PropertyMapModal from "../Components/MapView";
import { usePropertyContext } from "../Context/PropertyContext";
import "../Styles/HeaderFilterModal.css";

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
  const [selectedValue, setSelectedValue] = useState(value || defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value, resetTrigger]);

  const handleSelect = useCallback(
    (option) => {
      setSelectedValue(option.label);
      setIsOpen(false);

      if (onSelect) {
        onSelect(option);
      }
    },
    [onSelect]
  );

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className={`custom-dropdown ${className}`}>
      <button
        className="dropdown-trigger"
        onClick={toggleDropdown}
        type="button"
      >
        <span>{selectedValue || placeholder}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="5"
          viewBox="0 0 10 5"
          fill="none"
        >
          <path d="M0 0L5 5L10 0H0Z" fill="#011825" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="dropdown-overlay" onClick={closeDropdown} />
          <div className="dropdown-menu">
            {options.map((option, index) => (
              <button
                key={index}
                className={`dropdown-option ${
                  selectedValue === option.label ? "selected" : ""
                }`}
                onClick={() => handleSelect(option)}
                type="button"
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

export default function PropertyHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("Any");
  // default change currency
  // const [currency, setCurrency] = useState(
  //   singleProperty?.general_listing_information?.currency_iso_code || "AED"
  // );
  const [currency, setCurrency] = useState();
  // FIXED: Unified search states for both inputs
  const [searchLocation, setSearchLocation] = useState("");
  const [regularSearch, setRegularSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [regularSearchSuggestions, setRegularSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRegularSuggestions, setShowRegularSuggestions] = useState(false);
  const [renderSuggestions, setRenderSuggestions] = useState(false);
  const [renderRegularSuggestions, setRenderRegularSuggestions] =
    useState(false);

  // Loading states
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingRegularSuggestions, setLoadingRegularSuggestions] =
    useState(false);

  // CRITICAL FIX: Add ref to track if default filters have been initialized
  const defaultFiltersInitialized = useRef(false);

  // Use refs to store timeout IDs and current values to avoid recreating them
  const debounceTimeoutRef = useRef(null);
  const regularSearchTimeoutRef = useRef(null);
  const blurTimeoutRef = useRef(null);
  const regularBlurTimeoutRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const getRouteType = () => {
    if (
      location.pathname.includes("/properties/sale") ||
      location.pathname.includes("/sale")
    ) {
      return "/sale";
    } else if (
      location.pathname.includes("/properties/rent") ||
      location.pathname.includes("/rent")
    ) {
      return "/rent";
    } else if (
      location.pathname.includes("/properties/commercial") ||
      location.pathname.includes("/commercial")
    ) {
      return "/commercial"; // Add this condition
    } else if (location.pathname === "/properties/newoffplan") {
      return "/newoffplan";
    } else if (
      location.pathname === "/properties/offplan" ||
      location.pathname === "/offplan"
    ) {
      return "/offplan";
    }
    return null;
  };

  // FIXED: Get route type directly from location
  // const applyURLFilters = async (urlFilters, page = 1) => {
  //   try {
  //     console.log("PropertyContext: Applying URL filters:", urlFilters);

  //     setLoading(true);
  //     setError(null);
  //     setFilter(true);
  //     setIsHeroSearch(false);
  //     isFilteringRef.current = true;

  //     setCurrentFilters((prev) => ({
  //       ...prev,
  //       ...urlFilters,
  //     }));

  //     // Handle off-plan routes separately
  //     if (type === "/newoffplan") {
  //       await fetchOffPlanProperties(urlFilters, page);
  //       return;
  //     } else if (type === "/offplan") {
  //       await fetchNewOffPlanProperties(urlFilters, page);
  //       return;
  //     }

  //     // Handle sale, rent, and commercial routes with Universal Filter
  //     const params = new URLSearchParams();
  //     params.append("page", page.toString());

  //     if (urlFilters.offeringType) {
  //       params.append("offeringType", urlFilters.offeringType);
  //     }

  //     Object.entries(urlFilters).forEach(([key, value]) => {
  //       if (
  //         key !== "offeringType" &&
  //         key !== "page" &&
  //         value &&
  //         value !== "" &&
  //         value !== "all" &&
  //         value !== "any"
  //       ) {
  //         if (key === "propertyType") {
  //           params.append(key, value.toLowerCase());
  //         } else {
  //           params.append(key, value);
  //         }
  //       }
  //     });

  //     const url = `${UNIVERSAL_FILTER_URL}?${params.toString()}`;
  //     console.log("PropertyContext: URL filter request:", url);

  //     const response = await axios.get(url);

  //     if (response.data && response.status === 200) {
  //       console.log("PropertyContext: URL filter response:", response.data);

  //       if (response.data.pagination) {
  //         setPaginationData(response.data.pagination);
  //         setpaginationtotalpages(response.data.pagination.totalPages || 1);
  //         setCurrentPage(response.data.pagination.currentPage || page);
  //       }

  //       // Fix: Properly set response data for commercial route
  //       if (urlFilters.offeringType === "RS") {
  //         setSaleProperties(response.data);
  //       } else if (urlFilters.offeringType === "RR") {
  //         setRentProperties(response.data);
  //       } else if (urlFilters.offeringType === "CS") {
  //         setSaleProperties(response.data); // Commercial uses same state as sale
  //       }

  //       setLoading(false);
  //       isFilteringRef.current = false;
  //       return response.data;
  //     } else {
  //       throw new Error(
  //         "Failed to fetch filtered properties from URL parameters"
  //       );
  //     }
  //   } catch (error) {
  //     console.error("PropertyContext: Error applying URL filters:", error);
  //     setError("Error fetching properties with URL filters");
  //     setLoading(false);
  //     isFilteringRef.current = false;
  //     throw error;
  //   }
  // };

  const routeType = getRouteType();
  const isNewOffPlanRoute = location.pathname === "/properties/newoffplan";
  const isOffPlanRoute =
    location.pathname === "/properties/offplan" ||
    location.pathname === "/offplan";

  // Get context values and functions
  const {
    currentFilters,
    updateFilters,
    updateOffPlanFilters,
    updateNewOffPlanFilters,
    resetFilters,
    resetOffPlanFilters,
    resetNewOffPlanFilters,
    loading,
    propertyCoordinates,
    hasURLFilters,
    applyURLFilters, // ADD THIS LINE
  } = usePropertyContext();

  const [resetTrigger, setResetTrigger] = useState(0);

  // CRITICAL FIX: Reset the initialization flag when route changes
  useEffect(() => {
    defaultFiltersInitialized.current = false;
  }, [routeType]);
  const handleChange = (value) => {
    setSelectedGender(value);

    // Perform different actions based on selection
    if (value === "Any") {
      console.log("Action for Any");
      // Call function for Women
    } else if (value === "Offpllan") {
      console.log("Action for Offpllan");
      // Call function for Men
    } else if (value === "Ready") {
      console.log("Action for Ready");
      // Call function for Divided
    }
  };

  // FIXED: Initialize search values from current address filter
  useEffect(() => {
    if (currentFilters.address) {
      if (isNewOffPlanRoute) {
        setSearchLocation(currentFilters.address);
      } else {
        setRegularSearch(currentFilters.address);
      }
    }
  }, [currentFilters.address, isNewOffPlanRoute]);

  // FIXED: Proper default filters based on route

  // Fix the getDefaultFilters function in PropertyHeader.js
  const getDefaultFilters = useCallback(() => {
    if (isNewOffPlanRoute) {
      return {
        propertyCollection: "Sale",
        propertyType: "",
        minPrice: "",
        maxPrice: "",
        bedrooms: "",
        amenities: [],
        furnishing: "All",
        minSize: "",
        maxSize: "",
        developer: "",
        address: "",
      };
    } else if (isOffPlanRoute) {
      return {
        offeringType: "all", // FIXED: Use "all" for offplan
        propertyType: "", // FIXED: Don't default to apartment for offplan
        minPrice: "",
        maxPrice: "",
        bedrooms: "",
        address: "",
        developer: "",
      };
    } else {
      // Handle sale, rent, and commercial routes
      let offeringType = "RS"; // default to sale
      let propertyCollection = "Sale"; // default to sale

      if (routeType === "/sale") {
        offeringType = "RS";
        propertyCollection = "Sale";
      } else if (routeType === "/rent") {
        offeringType = "RR";
        propertyCollection = "Rent";
      } else if (routeType === "/commercial") {
        offeringType = "CS"; // FIXED: Ensure commercial is properly handled
        propertyCollection = "Commercial";
      }

      return {
        offeringType: offeringType,
        propertyCollection: propertyCollection,
        propertyType: routeType === "/commercial" ? "" : "apartment", // FIXED: Don't default to apartment for commercial
        minPrice: "",
        maxPrice: "",
        bedrooms: "",
        amenities: [],
        furnishing: "All",
        minSize: "",
        maxSize: "",
        address: "",
        developer: "",
      };
    }
  }, [isNewOffPlanRoute, isOffPlanRoute, routeType]);
  // Memoized constants
  const propertyCollection = useMemo(
    () => [
      { value: "Sale", label: "Sale" },
      { value: "Rent", label: "Rent" },
      { value: "Commercial", label: "Commercial" },
    ],
    []
  );

  const apartmentOptions = useMemo(
    () => [
      { value: "apartment", label: "Apartment" },
      { value: "villa", label: "Villa" },
      { value: "townhouse", label: "Townhouse" },
      { value: "penthouse", label: "Penthouse" },
      { value: "studio", label: "Studio" },
    ],
    []
  );

  const priceMinOptions = useMemo(
    () => [
      { value: "", label: "Price Min" },
      { value: "50000", label: "AED 50,000" },
      { value: "100000", label: "AED 100,000" },
      { value: "200000", label: "AED 200,000" },
      { value: "500000", label: "AED 500,000" },
      { value: "1000000", label: "AED 1,000,000" },
      { value: "2000000", label: "AED 2,000,000" },
    ],
    []
  );

  const priceMaxOptions = useMemo(
    () => [
      { value: "", label: "Price Max" },
      { value: "100000", label: "AED 100,000" },
      { value: "200000", label: "AED 200,000" },
      { value: "500000", label: "AED 500,000" },
      { value: "1000000", label: "AED 1,000,000" },
      { value: "2000000", label: "AED 2,000,000" },
      { value: "5000000", label: "AED 5,000,000+" },
    ],
    []
  );

  const bedroomOptions = useMemo(
    () => [
      { value: "", label: "Bedroom's" },
      { value: "studio", label: "Studio" },
      { value: "1", label: "1 Bedroom" },
      { value: "2", label: "2 Bedrooms" },
      { value: "3", label: "3 Bedrooms" },
      { value: "4", label: "4 Bedrooms" },
      { value: "5+", label: "5+ Bedrooms" },
    ],
    []
  );
  const currencyOptions = useMemo(
    () => [
      { value: "", label: "AED" },
      { value: "USD", label: "USD" },
      // { value: "1", label: "1 Bedroom" },
      // { value: "2", label: "2 Bedrooms" },
      // { value: "3", label: "3 Bedrooms" },
      // { value: "4", label: "4 Bedrooms" },
      // { value: "5+", label: "5+ Bedrooms" },
    ],
    []
  );

  const developerOptions = useMemo(
    () => [
      { value: "", label: "All Developers" },
      { value: "emaar", label: "Emaar" },
      { value: "object_1", label: "Object 1" },
      { value: "damac", label: "DAMAC" },
      { value: "sobha", label: "Sobha Realty" },
      { value: "dubai_properties", label: "Dubai Properties" },
      { value: "meraas", label: "Meraas" },
      { value: "nakheel", label: "Nakheel" },
      { value: "ellington", label: "Ellington Properties" },
      { value: "azizi", label: "Azizi Developments" },
      { value: "danube", label: "Danube Properties" },
      { value: "omniyat", label: "Omniyat" },
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      { value: "newest", label: "Newest first" },
      { value: "oldest", label: "Oldest first" },
      { value: "price-low", label: "Price: Low to High" },
      { value: "price-high", label: "Price: High to Low" },
      { value: "popular", label: "Most Popular" },
    ],
    []
  );

  // FIXED: Fetch location suggestions function
  const fetchLocationSuggestions = useCallback(
    async (searchTerm, isRegularSearch = false) => {
      try {
        if (isRegularSearch) {
          setLoadingRegularSuggestions(true);
        } else {
          setLoadingSuggestions(true);
        }

        let category = "sale"; // default

        if (isOffPlanRoute || isNewOffPlanRoute) {
          category = "offplan";
        } else if (
          routeType === "/rent" ||
          currentFilters.propertyCollection === "Rent"
        ) {
          category = "rent";
        } else if (
          routeType === "/commercial" ||
          currentFilters.propertyCollection === "Commercial"
        ) {
          category = "commercial"; // Add commercial category
        } else if (
          routeType === "/sale" ||
          currentFilters.propertyCollection === "Sale"
        ) {
          category = "sale";
        }

        console.log(
          "Fetching suggestions for:",
          searchTerm,
          "category:",
          category,
          "route:",
          routeType
        );

        const response = await axios.get(
          `${BASE_URL}/Property-location-suggestions?prefix=${encodeURIComponent(
            searchTerm
          )}&category=${category}`
        );

        console.log("API Response:", response.data);

        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          if (isRegularSearch) {
            setRegularSearchSuggestions(response.data.data);
            setShowRegularSuggestions(true);
          } else {
            setLocationSuggestions(response.data.data);
            setShowSuggestions(true);
          }
          console.log("Suggestions set:", response.data.data);
        } else {
          console.log("No valid suggestions in response");
          if (isRegularSearch) {
            setRegularSearchSuggestions([]);
            setShowRegularSuggestions(false);
          } else {
            setLocationSuggestions([]);
            setShowSuggestions(false);
          }
        }
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        if (isRegularSearch) {
          setRegularSearchSuggestions([]);
          setShowRegularSuggestions(false);
        } else {
          setLocationSuggestions([]);
          setShowSuggestions(false);
        }
      } finally {
        if (isRegularSearch) {
          setLoadingRegularSuggestions(false);
        } else {
          setLoadingSuggestions(false);
        }
      }
    },
    [
      BASE_URL,
      routeType,
      currentFilters.propertyCollection,
      isOffPlanRoute,
      isNewOffPlanRoute,
    ]
  );

  // CRITICAL FIX: Prevent infinite loop in default filter initialization
  useEffect(() => {
    // Skip if route is not valid
    if (!routeType) {
      console.log("HeadFilterBar: Invalid route, skipping initialization");
      return;
    }

    // Skip if already initialized for this route
    if (defaultFiltersInitialized.current) {
      console.log(
        "HeadFilterBar: Default filters already initialized for this route"
      );
      return;
    }

    // Skip if URL has parameters
    if (hasURLFilters && hasURLFilters()) {
      console.log(
        "HeadFilterBar: URL has filters, skipping default initialization"
      );
      defaultFiltersInitialized.current = true;
      return;
    }

    // Skip if context is currently loading
    if (loading) {
      console.log(
        "HeadFilterBar: Context is loading, waiting before initialization"
      );
      return;
    }

    // Check if we need to initialize default filters
    const hasMinimalFilters =
      !currentFilters.propertyType &&
      !currentFilters.minPrice &&
      !currentFilters.maxPrice &&
      !currentFilters.address &&
      !currentFilters.developer;

    // Only initialize if we have minimal filters AND haven't initialized before
    if (hasMinimalFilters) {
      console.log(
        "HeadFilterBar: Initializing default filters for route:",
        routeType
      );
      const defaultFilters = getDefaultFilters();

      // Mark as initialized BEFORE calling update functions to prevent loops
      defaultFiltersInitialized.current = true;

      if (isNewOffPlanRoute) {
        updateOffPlanFilters(defaultFilters);
      } else if (isOffPlanRoute) {
        updateNewOffPlanFilters(defaultFilters);
      } else {
        updateFilters(defaultFilters);
      }
    } else {
      // If we already have filters, just mark as initialized
      defaultFiltersInitialized.current = true;
    }
  }, [
    routeType,
    isNewOffPlanRoute,
    isOffPlanRoute,
    loading,
    hasURLFilters,
    // CRITICAL: Remove these dependencies that cause infinite loops
    // currentFilters, updateFilters, updateOffPlanFilters, updateNewOffPlanFilters, getDefaultFilters
  ]);

  // Helper function to get dropdown label from value with fallback
  const getDropdownLabel = useCallback(
    (filterKey, value) => {
      const optionMaps = {
        propertyCollection: propertyCollection,
        propertyType: apartmentOptions,
        minPrice: priceMinOptions,
        maxPrice: priceMaxOptions,
        bedrooms: bedroomOptions,
        developer: developerOptions,
      };

      const options = optionMaps[filterKey];
      if (options) {
        const option = options.find((opt) => opt.value === value);
        return option ? option.label : value || "";
      }
      return value || "";
    },
    [
      propertyCollection,
      apartmentOptions,
      priceMinOptions,
      priceMaxOptions,
      bedroomOptions,
      developerOptions,
    ]
  );

  // FIXED: Universal filter update function with proper clearing
  const updateFilter = useCallback(
    (filterKey, value, label, forceUpdate = false) => {
      console.log(`Updating filter: ${filterKey} = ${value}`);

      const updatedFilters = {
        ...currentFilters,
        [filterKey]: value,
      };

      console.log("Updated filters:", updatedFilters);

      // Use appropriate update function based on route
      if (isNewOffPlanRoute) {
        updateOffPlanFilters(updatedFilters);
      } else if (isOffPlanRoute) {
        updateNewOffPlanFilters(updatedFilters);
      } else {
        updateFilters(updatedFilters);
      }
    },
    [
      currentFilters,
      isNewOffPlanRoute,
      isOffPlanRoute,
      updateFilters,
      updateOffPlanFilters,
      updateNewOffPlanFilters,
    ]
  );

  // FIXED: Location search handler - now properly updates filters
  const handleLocationSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setRenderSuggestions(true);
      setSearchLocation(value);

      console.log("Location search changed to:", value);

      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // If user clears the search, reset suggestions and address filter immediately
      if (value.trim() === "") {
        setLocationSuggestions([]);
        setShowSuggestions(false);
        updateFilter("address", "", "", true);
        return;
      }

      // Set new debounced timeout for API calls only
      debounceTimeoutRef.current = setTimeout(() => {
        if (value.trim().length >= 2) {
          fetchLocationSuggestions(value.trim(), false);
        } else {
          setLocationSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300);
    },
    [fetchLocationSuggestions, updateFilter]
  );

  // FIXED: Regular search handler - now properly updates filters
  const handleRegularSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setRenderRegularSuggestions(true);
      setRegularSearch(value);

      console.log("Regular search changed to:", value);

      // Clear previous timeout
      if (regularSearchTimeoutRef.current) {
        clearTimeout(regularSearchTimeoutRef.current);
      }

      // If user clears the search, reset suggestions and address filter immediately
      if (value.trim() === "") {
        setRegularSearchSuggestions([]);
        setShowRegularSuggestions(false);
        updateFilter("address", "", "", true);
        return;
      }

      // Set new debounced timeout for API calls only
      regularSearchTimeoutRef.current = setTimeout(() => {
        if (value.trim().length >= 2) {
          fetchLocationSuggestions(value.trim(), true);
        } else {
          setRegularSearchSuggestions([]);
          setShowRegularSuggestions(false);
        }
      }, 300);
    },
    [fetchLocationSuggestions, updateFilter]
  );

  // FIXED: Suggestion click handlers - these update filters immediately
  const handleSuggestionClick = useCallback(
    (suggestion) => {
      setSearchLocation(suggestion);
      setRenderSuggestions(false);
      setShowSuggestions(false);
      updateFilter("address", suggestion, "Address", true);
      console.log("Location suggestion selected:", suggestion);
    },
    [updateFilter]
  );

  const handleRegularSuggestionClick = useCallback(
    (suggestion) => {
      setRegularSearch(suggestion);
      setRenderRegularSuggestions(false);
      setShowRegularSuggestions(false);
      updateFilter("address", suggestion, "Address", true);
      console.log("Regular suggestion selected:", suggestion);
    },
    [updateFilter]
  );

  // Input focus and blur handlers
  const handleInputFocus = useCallback(() => {
    if (searchLocation.trim().length >= 2) {
      setShowSuggestions(true);
    }
  }, [searchLocation]);

  const handleRegularInputFocus = useCallback(() => {
    if (regularSearch.trim().length >= 2) {
      setShowRegularSuggestions(true);
    }
  }, [regularSearch]);

  const handleInputBlur = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    blurTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }, []);

  const handleRegularInputBlur = useCallback(() => {
    if (regularBlurTimeoutRef.current) {
      clearTimeout(regularBlurTimeoutRef.current);
    }
    regularBlurTimeoutRef.current = setTimeout(() => {
      setShowRegularSuggestions(false);
    }, 200);
  }, []);

  // Handler functions for each filter type
  const handleBuySelect = useCallback(
    (option) => {
      console.log("Property collection changed to:", option.value);

      // Navigate to appropriate route
      if (option.value === "Sale") {
        navigate("/properties/sale");
      } else if (option.value === "Rent") {
        navigate("/properties/rent");
      } else if (option.value === "Commercial") {
        navigate("/properties/commercial"); // Add commercial navigation
      }

      const updatedFilters = {
        ...currentFilters,
        propertyCollection: option.value,
        offeringType:
          option.value === "Sale"
            ? "RS"
            : option.value === "Rent"
            ? "RR"
            : option.value === "Commercial"
            ? "CS"
            : "RS",
      };

      updateFilters(updatedFilters);
    },
    [navigate, currentFilters, updateFilters]
  );

  const handleApartmentSelect = useCallback(
    (option) => {
      console.log("Property type changed to:", option.value);
      updateFilter("propertyType", option.value, option.label, true);
    },
    [updateFilter]
  );

  const handlePriceMinSelect = useCallback(
    (option) => {
      console.log("Min price changed to:", option.value);
      updateFilter("minPrice", option.value, option.label, true);
    },
    [updateFilter]
  );

  const handlePriceMaxSelect = useCallback(
    (option) => {
      console.log("Max price changed to:", option.value);
      updateFilter("maxPrice", option.value, option.label, true);
    },
    [updateFilter]
  );

  const handleBedroomSelect = useCallback(
    (option) => {
      console.log("Bedrooms changed to:", option.value);
      updateFilter("bedrooms", option.value, option.label, true);
    },
    [updateFilter]
  );

  const handleDeveloperSelect = useCallback(
    (option) => {
      console.log("Developer changed to:", option.value);
      updateFilter("developer", option.value, option.label, true);
    },
    [updateFilter]
  );

  const handleSortSelect = useCallback(
    (option) => {
      console.log("Sort changed to:", option.value);
      updateFilter("sortBy", option.value, option.label, true);
    },
    [updateFilter]
  );

  // Modal and other handlers
  const handleFilterButtonClick = useCallback(() => {
    setIsFilterModalOpen(true);
    console.log("Filter button clicked - Opening modal");
  }, []);

  const handleModalApply = useCallback(
    (modalFilters) => {
      console.log("Applied modal filters:", modalFilters);

      const updatedFilters = {
        ...currentFilters,
        amenities: modalFilters.amenities || [],
        furnishing: modalFilters.furnishing || "All",
        minSize: modalFilters.minSize || "",
        maxSize: modalFilters.maxSize || "",
      };

      if (isNewOffPlanRoute) {
        updateOffPlanFilters(updatedFilters);
      } else if (isOffPlanRoute) {
        updateNewOffPlanFilters(updatedFilters);
      } else {
        updateFilters(updatedFilters);
      }

      console.log("Updated merged filters:", updatedFilters);
    },
    [
      currentFilters,
      isNewOffPlanRoute,
      isOffPlanRoute,
      updateFilters,
      updateOffPlanFilters,
      updateNewOffPlanFilters,
    ]
  );

  const handleModalReset = useCallback(() => {
    console.log("Reset modal filters");

    const updatedFilters = {
      ...currentFilters,
      amenities: [],
      furnishing: "All",
      minSize: "",
      maxSize: "",
    };

    if (isNewOffPlanRoute) {
      updateOffPlanFilters(updatedFilters);
    } else if (isOffPlanRoute) {
      updateNewOffPlanFilters(updatedFilters);
    } else {
      updateFilters(updatedFilters);
    }

    setResetTrigger((prev) => prev + 1);
  }, [
    currentFilters,
    isNewOffPlanRoute,
    isOffPlanRoute,
    updateFilters,
    updateOffPlanFilters,
    updateNewOffPlanFilters,
  ]);

  const handleMapClick = useCallback(() => {
    console.log("Map button clicked - Opening map modal");
    console.log("Available coordinates:", propertyCoordinates?.length || 0);

    if (propertyCoordinates && propertyCoordinates.length > 0) {
      setIsMapModalOpen(true);
    } else {
      console.warn("No coordinates available for map display");
      alert("No properties with location data available to display on map.");
    }
  }, [propertyCoordinates]);

  const handleMapModalClose = useCallback(() => {
    console.log("Closing map modal");
    setIsMapModalOpen(false);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (regularSearchTimeoutRef.current) {
        clearTimeout(regularSearchTimeoutRef.current);
      }
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      if (regularBlurTimeoutRef.current) {
        clearTimeout(regularBlurTimeoutRef.current);
      }
    };
  }, []);
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (regularSearchTimeoutRef.current) {
        clearTimeout(regularSearchTimeoutRef.current);
      }
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      if (regularBlurTimeoutRef.current) {
        clearTimeout(regularBlurTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="property-header-container">
        <div className="filter-search-bar">
          <div className="spacebtw">
            {/* Show different dropdowns based on route */}
            {isNewOffPlanRoute ? (
              // New Off-Plan specific dropdowns
              <>
                <div className="filter-search-input-container">
                  <input
                    type="text"
                    placeholder="Search new off-plan projects"
                    className="filter-search-input"
                    value={searchLocation}
                    onChange={handleLocationSearch}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <Search className="filter-search-icon" size={20} />

                  {loadingSuggestions && (
                    <div className="search-loading">
                      <div className="loading-spinner"></div>
                    </div>
                  )}

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
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <MapPin size={14} className="suggestion-icon" />
                              <span className="suggestion-text">
                                {suggestion}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}

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

                <CustomDropdown
                  options={priceMinOptions}
                  defaultValue="Price Min"
                  onSelect={handlePriceMinSelect}
                  dropdownName="Minimum Price"
                  value={getDropdownLabel("minPrice", currentFilters.minPrice)}
                  resetTrigger={resetTrigger}
                />

                <CustomDropdown
                  options={priceMaxOptions}
                  defaultValue="Price Max"
                  onSelect={handlePriceMaxSelect}
                  dropdownName="Maximum Price"
                  value={getDropdownLabel("maxPrice", currentFilters.maxPrice)}
                  resetTrigger={resetTrigger}
                />

                <CustomDropdown
                  options={developerOptions}
                  defaultValue="All Developers"
                  onSelect={handleDeveloperSelect}
                  dropdownName="Developer"
                  value={getDropdownLabel(
                    "developer",
                    currentFilters.developer
                  )}
                  resetTrigger={resetTrigger}
                />
              </>
            ) : (
              // Default dropdowns for other routes (including new offplan)
              <>
                <CustomDropdown
                  options={propertyCollection}
                  defaultValue="Sale"
                  className="buy-dropdown"
                  onSelect={handleBuySelect}
                  dropdownName="Buy/Rent/Commercial"
                  value={getDropdownLabel(
                    "propertyCollection",
                    currentFilters.propertyCollection || "Sale"
                  )}
                  resetTrigger={resetTrigger}
                />

                <div className="filter-search-input-container">
                  <input
                    type="text"
                    placeholder="Community & buildings"
                    className="filter-search-input"
                    value={regularSearch}
                    onChange={handleRegularSearchChange}
                    onFocus={handleRegularInputFocus}
                    onBlur={handleRegularInputBlur}
                  />
                  <Search className="filter-search-icon" size={20} />

                  {loadingRegularSuggestions && (
                    <div className="search-loading">
                      <div className="loading-spinner"></div>
                    </div>
                  )}

                  {renderRegularSuggestions &&
                    showRegularSuggestions &&
                    regularSearchSuggestions.length > 0 && (
                      <div className="suggestions-dropdown">
                        {regularSearchSuggestions
                          .slice(0, 8)
                          .map((suggestion, index) => (
                            <div
                              key={index}
                              className="suggestion-item"
                              onClick={() =>
                                handleRegularSuggestionClick(suggestion)
                              }
                            >
                              <MapPin size={14} className="suggestion-icon" />
                              <span className="suggestion-text">
                                {suggestion}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}

                  {showRegularSuggestions &&
                    regularSearch.trim().length >= 2 &&
                    regularSearchSuggestions.length === 0 &&
                    !loadingRegularSuggestions && (
                      <div className="suggestions-dropdown">
                        <div className="suggestion-item no-results">
                          <span>No locations found</span>
                        </div>
                      </div>
                    )}
                </div>

                <CustomDropdown
                  options={apartmentOptions}
                  defaultValue="Apartment"
                  onSelect={handleApartmentSelect}
                  dropdownName="Property Type"
                  value={getDropdownLabel(
                    "propertyType",
                    currentFilters.propertyType || "apartment" // CHANGED: Default to lowercase
                  )}
                  resetTrigger={resetTrigger}
                />

                <CustomDropdown
                  options={priceMinOptions}
                  defaultValue="Price Min"
                  onSelect={handlePriceMinSelect}
                  dropdownName="Minimum Price"
                  value={getDropdownLabel("minPrice", currentFilters.minPrice)}
                  resetTrigger={resetTrigger}
                />

                <CustomDropdown
                  options={priceMaxOptions}
                  defaultValue="Price Max"
                  onSelect={handlePriceMaxSelect}
                  dropdownName="Maximum Price"
                  value={getDropdownLabel("maxPrice", currentFilters.maxPrice)}
                  resetTrigger={resetTrigger}
                />

                <CustomDropdown
                  options={bedroomOptions}
                  defaultValue="Bedroom's"
                  onSelect={handleBedroomSelect}
                  dropdownName="Bedrooms"
                  value={getDropdownLabel("bedrooms", currentFilters.bedrooms)}
                  resetTrigger={resetTrigger}
                />
              </>
            )}
          </div>

          {/* Only show filter button for non-newoffplan routes */}
          {!isNewOffPlanRoute && (
            <button className="filter-button" onClick={handleFilterButtonClick}>
              Filter
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="13"
                viewBox="0 0 17 13"
                fill="none"
              >
                <path
                  d="M1 1.5H16M3.5 6.5H13.5M6.5 11.5H10.5"
                  stroke="#E6E6E6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="filters-header">
        <div className="Property-filters-row">
          <div className="filter-results">
            {/* Display active filters as tags */}
            {currentFilters.propertyType &&
              currentFilters.propertyType !== "apartment" && (
                <div className="f-result">
                  {getDropdownLabel(
                    "propertyType",
                    currentFilters.propertyType
                  )}
                  <button
                    className="tag-close"
                    onClick={() => updateFilter("propertyType", "", "", true)}
                  >
                    ×
                  </button>
                </div>
              )}

            {currentFilters.minPrice && (
              <div className="f-result">
                {getDropdownLabel("minPrice", currentFilters.minPrice)}
                <button
                  className="tag-close"
                  onClick={() => updateFilter("minPrice", "", "", true)}
                >
                  ×
                </button>
              </div>
            )}

            {currentFilters.maxPrice && (
              <div className="f-result">
                {getDropdownLabel("maxPrice", currentFilters.maxPrice)}
                <button
                  className="tag-close"
                  onClick={() => updateFilter("maxPrice", "", "", true)}
                >
                  ×
                </button>
              </div>
            )}

            {currentFilters.bedrooms && (
              <div className="f-result">
                {getDropdownLabel("bedrooms", currentFilters.bedrooms)}
                <button
                  className="tag-close"
                  onClick={() => updateFilter("bedrooms", "", "", true)}
                >
                  ×
                </button>
              </div>
            )}

            {currentFilters.developer && (
              <div className="f-result">
                {getDropdownLabel("developer", currentFilters.developer)}
                <button
                  className="tag-close"
                  onClick={() => updateFilter("developer", "", "", true)}
                >
                  ×
                </button>
              </div>
            )}

            {currentFilters.address && (
              <div className="f-result">
                {currentFilters.address}
                <button
                  className="tag-close"
                  onClick={() => {
                    updateFilter("address", "", "", true);
                    setSearchLocation("");
                    setRegularSearch("");
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Display amenities as individual tags */}
            {currentFilters.amenities &&
              Array.isArray(currentFilters.amenities) &&
              currentFilters.amenities.map((amenity, index) => (
                <div key={`amenity-${index}`} className="f-result">
                  {amenity}
                  <button
                    className="tag-close"
                    onClick={() => {
                      const updatedAmenities = currentFilters.amenities.filter(
                        (a) => a !== amenity
                      );
                      updateFilter("amenities", updatedAmenities, "", true);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

            {/* Show furnishing if not default */}
            {currentFilters.furnishing &&
              currentFilters.furnishing !== "All" && (
                <div className="f-result">
                  {currentFilters.furnishing}
                  <button
                    className="tag-close"
                    onClick={() => updateFilter("furnishing", "All", "", true)}
                  >
                    ×
                  </button>
                </div>
              )}
          </div>

          <div className="filter-bar-row">
            {/* Hide view options for new off-plan route */}
            {/* {!isNewOffPlanRoute && (
              <div className="view-options">
                <span className="view-label">View :</span>
                <label className="radio-option">
                  <div></div>
                  <span className="radio-text" style={{ cursor: "pointer" }}>
                    Off plan
                  </span>
                </label>
                <label className="radio-option">
                  <div></div>
                  <span className="radio-text" style={{ cursor: "pointer" }}>
                    Ready
                  </span>
                </label>
              </div>
            )} */}
            {/* <CustomDropdown
              options={currencyOptions}
              defaultValue="AED"
              onSelect={handleBedroomSelect}
              dropdownName="AED"
              value={getDropdownLabel("AED", currencyOptions.bedrooms)}
              resetTrigger={resetTrigger}
            /> */}
            <div className="mydict">
              <div>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    value="Any"
                    checked={selectedGender === "Any"}
                    onChange={() => handleChange("Any")}
                  />
                  <span id="left-span">Any</span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="radio"
                    value="Men"
                    checked={selectedGender === "Offplan"}
                    onChange={() => handleChange("Offplan")}
                  />
                  <span>Offplan</span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="radio"
                    value="Divided"
                    checked={selectedGender === "Ready"}
                    onChange={() => handleChange("Ready")}
                  />
                  <span id="right-span">Ready</span>
                </label>
              </div>
            </div>
            <div className="small-left-line"></div>{" "}
            <div id="prop-select-holder">
              <select
                className="property-header-container-price-select"
                // value={currency}
                value={"1200"}
                // onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                <option value="PKR">PKR</option>
              </select>
            </div>
            {/* <div className="sort-section">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  d="M12.5 18.5L6.5 16.4L1.85 18.2C1.51667 18.3333 1.20833 18.296 0.925 18.088C0.641667 17.88 0.5 17.6007 0.5 17.25V3.25C0.5 3.03333 0.562667 2.84167 0.688 2.675C0.813333 2.50833 0.984 2.38333 1.2 2.3L6.5 0.5L12.5 2.6L17.15 0.8C17.4833 0.666667 17.7917 0.704333 18.075 0.913C18.3583 1.12167 18.5 1.40067 18.5 1.75V15.75C18.5 15.9667 18.4377 16.1583 18.313 16.325C18.1883 16.4917 18.0173 16.6167 17.8 16.7L12.5 18.5ZM11.5 16.05V4.35L7.5 2.95V14.65L11.5 16.05ZM13.5 16.05L16.5 15.05V3.2L13.5 4.35V16.05ZM2.5 15.8L5.5 14.65V2.95L2.5 3.95V15.8Z"
                  fill="#011825"
                />
              </svg>
              <span className="sort-label">Sort :</span>
              <CustomDropdown
                options={sortOptions}
                defaultValue="Newest first"
                className="sort-dropdown-custom"
                onSelect={handleSortSelect}
                dropdownName="Sort By"
                value={getDropdownLabel(
                  "sortBy",
                  currentFilters.sortBy || "newest"
                )}
                resetTrigger={resetTrigger}
              />
            </div> */}
            {/* <div
              className="map-holder"
              onClick={handleMapClick}
              style={{ cursor: "pointer" }}
            >
              <div className="m-svg-holder">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                >
                  <path
                    d="M12 18.5L6 16.4L1.35 18.2C1.01667 18.3333 0.708333 18.296 0.425 18.088C0.141667 17.88 0 17.6007 0 17.25V3.25C0 3.03333 0.0626666 2.84167 0.188 2.675C0.313333 2.50833 0.484 2.38333 0.7 2.3L6 0.5L12 2.6L16.65 0.8C16.9833 0.666667 17.2917 0.704333 17.575 0.913C17.8583 1.12167 18 1.40067 18 1.75V15.75C18 15.9667 17.9377 16.1583 17.813 16.325C17.6883 16.4917 17.5173 16.6167 17.3 16.7L12 18.5ZM11 16.05V4.35L7 2.95V14.65L11 16.05ZM13 16.05L16 15.05V3.2L13 4.35V16.05ZM2 15.8L5 14.65V2.95L2 3.95V15.8Z"
                    fill="#011825"
                  />
                </svg>
              </div>
              <h3>Map</h3>
            </div> */}
          </div>
        </div>
      </div>
      <div className="filter-bar-row" id="fbar-row2">
        {/* Hide view options for new off-plan route */}
        {/* {!isNewOffPlanRoute && (
          <div className="view-options">
            <span className="view-label">View :</span>
            <label className="radio-option">
              <div></div>
              <span className="radio-text" style={{ cursor: "pointer" }}>
                Off plan
              </span>
            </label>
            <label className="radio-option">
              <div></div>
              <span className="radio-text" style={{ cursor: "pointer" }}>
                Ready
              </span>
            </label>
          </div>
        )} */}
   

        <div className="sort-section">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
          >
            <path
              d="M12.5 18.5L6.5 16.4L1.85 18.2C1.51667 18.3333 1.20833 18.296 0.925 18.088C0.641667 17.88 0.5 17.6007 0.5 17.25V3.25C0.5 3.03333 0.562667 2.84167 0.688 2.675C0.813333 2.50833 0.984 2.38333 1.2 2.3L6.5 0.5L12.5 2.6L17.15 0.8C17.4833 0.666667 17.7917 0.704333 18.075 0.913C18.3583 1.12167 18.5 1.40067 18.5 1.75V15.75C18.5 15.9667 18.4377 16.1583 18.313 16.325C18.1883 16.4917 18.0173 16.6167 17.8 16.7L12.5 18.5ZM11.5 16.05V4.35L7.5 2.95V14.65L11.5 16.05ZM13.5 16.05L16.5 15.05V3.2L13.5 4.35V16.05ZM2.5 15.8L5.5 14.65V2.95L2.5 3.95V15.8Z"
              fill="#011825"
            />
          </svg>
          <span className="sort-label">Sort :</span>
          <CustomDropdown
            options={sortOptions}
            defaultValue="Newest first"
            className="sort-dropdown-custom"
            onSelect={handleSortSelect}
            dropdownName="Sort By"
            value={getDropdownLabel(
              "sortBy",
              currentFilters.sortBy || "newest"
            )}
            resetTrigger={resetTrigger}
          />
        </div>
        <div
          className="map-holder"
          onClick={handleMapClick}
          style={{ cursor: "pointer" }}
        >
          <div className="m-svg-holder">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                d="M12 18.5L6 16.4L1.35 18.2C1.01667 18.3333 0.708333 18.296 0.425 18.088C0.141667 17.88 0 17.6007 0 17.25V3.25C0 3.03333 0.0626666 2.84167 0.188 2.675C0.313333 2.50833 0.484 2.38333 0.7 2.3L6 0.5L12 2.6L16.65 0.8C16.9833 0.666667 17.2917 0.704333 17.575 0.913C17.8583 1.12167 18 1.40067 18 1.75V15.75C18 15.9667 17.9377 16.1583 17.813 16.325C17.6883 16.4917 17.5173 16.6167 17.3 16.7L12 18.5ZM11 16.05V4.35L7 2.95V14.65L11 16.05ZM13 16.05L16 15.05V3.2L13 4.35V16.05ZM2 15.8L5 14.65V2.95L2 3.95V15.8Z"
                fill="#011825"
              />
            </svg>
          </div>
          <h3>Map View</h3>
        </div>
      </div>

      {/* Filter Modal - Only show for non-newoffplan routes */}
      {!isNewOffPlanRoute && (
        <HeaderFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleModalApply}
          onReset={handleModalReset}
          currentFilters={currentFilters}
        />
      )}

      {/* Property Map Modal - Show for all routes */}
      {isMapModalOpen && (
        <PropertyMapModal
          isOpen={isMapModalOpen}
          onClose={handleMapModalClose}
        />
      )}
    </>
  );
}
