import axios from "axios";
import {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const UNIVERSAL_FILTER_URL = `${BASE_URL}/Universal-filter`;
  const ALL_HERO_FILTERS_URL = `${BASE_URL}/Universal-filter`;
  const SINGLE_PROPERTY_URL = `${BASE_URL}/single-property`;

  // NEW: Updated Offplan endpoints
  const NEW_OFFPLAN_URL = `${BASE_URL}/offplan-property`; // NEW: Your backend offplan endpoint

  //3rd party Off-plan specific endpoints (Relly) - for /newoffplan route
  const OFFPLAN_BASE_URL = import.meta.env.VITE_BASE_URL;
  const OFFPLAN_MIN_PRICE_URL = `${OFFPLAN_BASE_URL}/offplanminprice`;
  const OFFPLAN_FILTER_BY_DEVELOPER_URL = `${OFFPLAN_BASE_URL}/offplanfilterbydeveloper`;
  const OFFPLAN_PROPERTIES_URL = `${OFFPLAN_BASE_URL}/get-offplan-property`;

  // All property data states
  const [saleProperties, setSaleProperties] = useState([]);
  const [rentProperties, setRentProperties] = useState([]);
  const [offPlanProperties, setOffPlanProperties] = useState([]);
  const [newOffPlanProperties, setNewOffPlanProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(false);
  const [filterData, setFilterData] = useState({});

  const [propertyCoordinates, setPropertyCoordinates] = useState([]);

  const location = useLocation();
  const pageName = location.pathname;
  const navigate = useNavigate();

  // CRITICAL FIX: Add refs to prevent infinite loops
  const isInitialLoadRef = useRef(true);
  const lastLocationRef = useRef(null);
  const isFilteringRef = useRef(false);

  // Updated route detection for both off-plan routes
  const isNewOffPlanRoute = pageName === "/properties/newoffplan";
  const isOffPlanRoute =
    pageName === "/properties/offplan" || pageName === "/offplan";

  // Updated route detection for /properties/sale and /properties/rent
  const getRouteType = () => {
    if (pageName.includes("/properties/sale") || pageName.includes("/sale")) {
      return "/sale";
    } else if (
      pageName.includes("/properties/rent") ||
      pageName.includes("/rent")
    ) {
      return "/rent";
    } else if (
      pageName.includes("/properties/commercial") ||
      pageName.includes("/commercial")
    ) {
      return "/commercial"; // This was already correct
    } else if (pageName === "/properties/newoffplan") {
      return "/newoffplan";
    } else if (pageName === "/properties/offplan" || pageName === "/offplan") {
      return "/offplan";
    }
    return null;
  };

  const type = getRouteType();

  // Single property data states
  const [singleProperty, setSingleProperty] = useState(null);
  const [singlePropertyLoading, setSinglePropertyLoading] = useState(false);
  const [singlePropertyError, setSinglePropertyError] = useState(null);

  // Current filters state - updated to include off-plan specific filters
  const [currentFilters, setCurrentFilters] = useState({
    offeringType: "RS",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    address: "",
    developer: "",
  });

  // Hero Location Input states
  const [loationProperties, setloationProperties] = useState([]);

  // Pagination states
  const [paginationtotalpages, setpaginationtotalpages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState(null);

  // Hero search flag
  const [isHeroSearch, setIsHeroSearch] = useState(false);

  // NEW: Function to parse URL parameters
  const parseURLParameters = () => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {};

    const parameterMap = {
      propertyType: "propertyType",
      minPrice: "minPrice",
      maxPrice: "maxPrice",
      bedrooms: "bedrooms",
      bathrooms: "bathrooms",
      address: "address",
      location: "address",
      developer: "developer",
      furnishing: "furnishing",
      minSize: "minSize",
      maxSize: "maxSize",
      amenities: "amenities",
      sortBy: "sortBy",
      page: "page",
    };

    for (const [urlParam, filterKey] of Object.entries(parameterMap)) {
      const value = searchParams.get(urlParam);
      if (value && value.trim() !== "") {
        urlFilters[filterKey] = value.trim();
      }
    }

    // FIXED: Properly set offeringType for all routes including commercial and offplan
    if (type === "/sale") {
      urlFilters.offeringType = "RS";
    } else if (type === "/rent") {
      urlFilters.offeringType = "RR";
    } else if (type === "/commercial") {
      urlFilters.offeringType = "CS"; // FIXED: This was missing proper handling
    } else if (type === "/offplan") {
      urlFilters.offeringType = "offplan"; // FIXED: Changed from "offplan" to "all"
    } else if (type === "/newoffplan") {
      urlFilters.propertyCollection = "Sale";
    }

    console.log("PropertyContext: Parsed URL parameters:", urlFilters);
    return urlFilters;
  };
  // NEW: Function to check if URL has filter parameters
  const hasURLFilters = () => {
    const searchParams = new URLSearchParams(location.search);
    const filterParams = [
      "propertyType",
      "minPrice",
      "maxPrice",
      "bedrooms",
      "bathrooms",
      "address",
      "location",
      "developer",
      "furnishing",
      "minSize",
      "maxSize",
      "amenities",
    ];

    return filterParams.some(
      (param) =>
        searchParams.has(param) && searchParams.get(param).trim() !== ""
    );
  };

  // NEW: Function to apply URL filters
  const applyURLFilters = async (urlFilters, page = 1) => {
    try {
      console.log("PropertyContext: Applying URL filters:", urlFilters);

      setLoading(true);
      setError(null);
      setFilter(true);
      setIsHeroSearch(false);
      isFilteringRef.current = true;

      setCurrentFilters((prev) => ({
        ...prev,
        ...urlFilters,
      }));

      // Handle off-plan routes separately - these use different endpoints
      if (type === "/newoffplan") {
        await fetchOffPlanProperties(urlFilters, page);
        return;
      } else if (type === "/offplan") {
        // FIXED: Use Universal Filter for offplan instead of separate endpoint
        // This allows URL parameters to work properly
        const params = new URLSearchParams();
        params.append("page", page.toString());

        if (urlFilters.offeringType) {
          params.append("offeringType", urlFilters.offeringType);
        }

        Object.entries(urlFilters).forEach(([key, value]) => {
          if (
            key !== "offeringType" &&
            key !== "page" &&
            value &&
            value !== "" &&
            value !== "all" &&
            value !== "any"
          ) {
            if (key === "propertyType") {
              params.append(key, value.toLowerCase());
            } else {
              params.append(key, value);
            }
          }
        });

        const url = `${UNIVERSAL_FILTER_URL}?${params.toString()}`;
        console.log("PropertyContext: Offplan URL filter request:", url);

        const response = await axios.get(url);

        if (response.data && response.status === 200) {
          if (response.data.pagination) {
            setPaginationData(response.data.pagination);
            setpaginationtotalpages(response.data.pagination.totalPages || 1);
            setCurrentPage(response.data.pagination.currentPage || page);
          }

          setNewOffPlanProperties(response.data); // Set offplan data
          setLoading(false);
          isFilteringRef.current = false;
          return response.data;
        }
      }

      // Handle sale, rent, and commercial routes with Universal Filter
      const params = new URLSearchParams();
      params.append("page", page.toString());

      if (urlFilters.offeringType) {
        params.append("offeringType", urlFilters.offeringType);
      }

      Object.entries(urlFilters).forEach(([key, value]) => {
        if (
          key !== "offeringType" &&
          key !== "page" &&
          value &&
          value !== "" &&
          value !== "all" &&
          value !== "any"
        ) {
          if (key === "propertyType") {
            params.append(key, value.toLowerCase());
          } else {
            params.append(key, value);
          }
        }
      });

      const url = `${UNIVERSAL_FILTER_URL}?${params.toString()}`;
      console.log("PropertyContext: URL filter request:", url);

      const response = await axios.get(url);

      if (response.data && response.status === 200) {
        console.log("PropertyContext: URL filter response:", response.data);

        if (response.data.pagination) {
          setPaginationData(response.data.pagination);
          setpaginationtotalpages(response.data.pagination.totalPages || 1);
          setCurrentPage(response.data.pagination.currentPage || page);
        }

        // FIXED: Properly set response data for all routes
        if (urlFilters.offeringType === "RS") {
          setSaleProperties(response.data);
        } else if (urlFilters.offeringType === "RR") {
          setRentProperties(response.data);
        } else if (urlFilters.offeringType === "CS") {
          setSaleProperties(response.data); // Commercial uses same state as sale
        }

        setLoading(false);
        isFilteringRef.current = false;
        return response.data;
      } else {
        throw new Error(
          "Failed to fetch filtered properties from URL parameters"
        );
      }
    } catch (error) {
      console.error("PropertyContext: Error applying URL filters:", error);
      setError("Error fetching properties with URL filters");
      setLoading(false);
      isFilteringRef.current = false;
      throw error;
    }
  };

  // UTILITY FUNCTION: Convert propertyType to lowercase
  const normalizePropertyType = (propertyType) => {
    if (!propertyType || propertyType === "all" || propertyType === "") {
      return propertyType;
    }
    return propertyType.toLowerCase();
  };

  // Function to fetch single property data
  const fetchSingleProperty = async (propertyId, propertyType) => {
    try {
      setSinglePropertyLoading(true);
      setSinglePropertyError(null);

      const response = await axios.get(SINGLE_PROPERTY_URL, {
        params: {
          id: propertyId,
          type: propertyType,
        },
      });

      if (response.data && response.status === 200) {
        console.log(
          "PropertyContext: Single property data received:",
          response.data
        );
        const propertyData = response.data.data || response.data;
        setSingleProperty(propertyData);
        return propertyData;
      } else {
        throw new Error("Failed to fetch single property data");
      }
    } catch (error) {
      console.error("PropertyContext: Error fetching single property:", error);
      setSinglePropertyError(error.message || "Error fetching property data");
      setSingleProperty(null);
      throw error;
    } finally {
      setSinglePropertyLoading(false);
    }
  };

  // Function to clear single property data
  const clearSingleProperty = () => {
    setSingleProperty(null);
    setSinglePropertyError(null);
    setSinglePropertyLoading(false);
  };

  // CRITICAL FIX: Prevent recursive calls in off-plan functions
  const fetchNewOffPlanProperties = useCallback(
    async (filters = {}, page = 1) => {
      // Prevent recursive calls
      if (isFilteringRef.current && !filters.hasOwnProperty("minPrice")) {
        console.log(
          "PropertyContext: Skipping fetchNewOffPlanProperties - already filtering"
        );
        return;
      }

      try {
        setLoading(true);
        setError(null);
        isFilteringRef.current = true;

        const params = new URLSearchParams();
        params.append("page", page.toString());

        if (filters.offeringType && filters.offeringType !== "all") {
          params.append("offeringType", filters.offeringType);
        }

        if (filters.propertyType && filters.propertyType !== "all") {
          params.append(
            "propertyType",
            normalizePropertyType(filters.propertyType)
          );
        }

        if (
          filters.minPrice &&
          filters.minPrice !== "" &&
          filters.minPrice !== "any"
        ) {
          params.append("minPrice", filters.minPrice);
        }

        if (
          filters.maxPrice &&
          filters.maxPrice !== "" &&
          filters.maxPrice !== "any"
        ) {
          params.append("maxPrice", filters.maxPrice);
        }

        if (
          filters.bedrooms &&
          filters.bedrooms !== "" &&
          filters.bedrooms !== "any"
        ) {
          params.append("bedrooms", filters.bedrooms);
        }

        if (filters.address && filters.address.trim() !== "") {
          params.append("address", filters.address.trim());
        }

        if (
          filters.developer &&
          filters.developer !== "" &&
          filters.developer !== "any"
        ) {
          params.append("developer", filters.developer);
        }

        let url;
        if (
          Object.keys(filters).length > 0 &&
          Object.values(filters).some(
            (val) => val && val !== "" && val !== "all" && val !== "any"
          )
        ) {
          url = `${UNIVERSAL_FILTER_URL}?${params.toString()}`;
          console.log(
            "PropertyContext: Using Universal Filter for off-plan with filters:",
            url
          );
        } else {
          url = `${NEW_OFFPLAN_URL}?page=${page}`;
          console.log("PropertyContext: Using direct off-plan endpoint:", url);
        }

        const response = await axios.get(url);

        if (response.data && response.status === 200) {
          console.log(
            "PropertyContext: New off-plan properties response:",
            response.data
          );

          if (response.data.pagination) {
            setPaginationData(response.data.pagination);
            setpaginationtotalpages(response.data.pagination.totalPages || 1);
            setCurrentPage(response.data.pagination.currentPage || page);
          }

          setNewOffPlanProperties(response.data);
          setFilter(Object.keys(filters).length > 0);

          return response.data;
        } else {
          console.error("PropertyContext: New off-plan API failed:", response);
          setError("Failed to fetch off-plan property data");
          return [];
        }
      } catch (error) {
        console.error(
          "PropertyContext: Error fetching new off-plan properties:",
          error
        );
        setError("Error fetching off-plan property data");
        return [];
      } finally {
        setLoading(false);
        isFilteringRef.current = false;
      }
    },
    [UNIVERSAL_FILTER_URL, NEW_OFFPLAN_URL]
  );

  // CRITICAL FIX: Prevent recursive calls in old off-plan functions
  const fetchOffPlanProperties = useCallback(
    async (filters = {}, page = 1) => {
      // Prevent recursive calls
      if (isFilteringRef.current && !filters.hasOwnProperty("minPrice")) {
        console.log(
          "PropertyContext: Skipping fetchOffPlanProperties - already filtering"
        );
        return;
      }

      try {
        setLoading(true);
        setError(null);
        isFilteringRef.current = true;

        let url = OFFPLAN_PROPERTIES_URL;
        const params = new URLSearchParams();

        params.append("page", page.toString());

        if (
          filters.minPrice &&
          filters.minPrice !== "" &&
          filters.minPrice !== "any"
        ) {
          url = `${OFFPLAN_MIN_PRICE_URL}?minPrice=${filters.minPrice}&page=${page}`;
        } else if (
          filters.maxPrice &&
          filters.maxPrice !== "" &&
          filters.maxPrice !== "any"
        ) {
          url = `${OFFPLAN_MIN_PRICE_URL}?minPrice=${filters.maxPrice}&page=${page}`;
        } else if (
          filters.developer &&
          filters.developer !== "" &&
          filters.developer !== "all"
        ) {
          const developerMap = {
            emaar: "Emaar",
            damac: "DAMAC",
            sobha: "Sobha Realty",
            dubai_properties: "Dubai Properties",
            meraas: "Meraas",
            nakheel: "Nakheel",
            ellington: "Ellington Properties",
            azizi: "Azizi Developments",
            danube: "Danube Properties",
            omniyat: "Omniyat",
            object_1: "Object 1",
          };

          const developerName =
            developerMap[filters.developer] || filters.developer;
          url = `${OFFPLAN_FILTER_BY_DEVELOPER_URL}?developer=${encodeURIComponent(
            developerName
          )}&page=${page}`;
        } else {
          url = `${OFFPLAN_PROPERTIES_URL}?page=${page}`;
        }

        console.log(
          "PropertyContext: Fetching old off-plan properties from:",
          url
        );

        const response = await axios.get(url);

        if (response.data && response.status === 200) {
          console.log(
            "PropertyContext: Old off-plan properties response:",
            response.data
          );

          if (response.data.pagination) {
            setPaginationData(response.data.pagination);
            setpaginationtotalpages(response.data.pagination.totalPages || 1);
            setCurrentPage(response.data.pagination.currentPage || page);
          } else {
            const totalCount =
              response.data.totalCount || response.data.data?.length || 0;
            const perPage = 10;
            const totalPages = Math.ceil(totalCount / perPage);

            setPaginationData({
              currentPage: page,
              totalPages: totalPages,
              totalCount: totalCount,
              perPage: perPage,
              hasNextPage: page < totalPages,
              hasPrevPage: page > 1,
            });
            setpaginationtotalpages(totalPages);
            setCurrentPage(page);
          }

          setOffPlanProperties(response.data);
          setFilter(true);

          return response.data;
        } else {
          console.error("PropertyContext: Old off-plan API failed:", response);
          setError("Failed to fetch off-plan property data");
          return [];
        }
      } catch (error) {
        console.error(
          "PropertyContext: Error fetching old off-plan properties:",
          error
        );
        setError("Error fetching off-plan property data");
        return [];
      } finally {
        setLoading(false);
        isFilteringRef.current = false;
      }
    },
    [
      OFFPLAN_PROPERTIES_URL,
      OFFPLAN_MIN_PRICE_URL,
      OFFPLAN_FILTER_BY_DEVELOPER_URL,
    ]
  );

  // CRITICAL FIX: Prevent infinite loops in filter update functions
  const updateNewOffPlanFilters = useCallback(
    (newFilters) => {
      if (isFilteringRef.current) {
        console.log(
          "PropertyContext: Skipping updateNewOffPlanFilters - currently filtering"
        );
        return;
      }

      console.log(
        "PropertyContext: Updating new off-plan filters:",
        newFilters
      );

      const normalizedFilters = {
        ...newFilters,
        propertyType: normalizePropertyType(newFilters.propertyType),
      };

      setCurrentFilters(normalizedFilters);
      setFilter(true);
      setCurrentPage(1);

      fetchNewOffPlanProperties(normalizedFilters, 1);
    },
    [fetchNewOffPlanProperties]
  );

  const updateOffPlanFilters = useCallback(
    (newFilters) => {
      if (isFilteringRef.current) {
        console.log(
          "PropertyContext: Skipping updateOffPlanFilters - currently filtering"
        );
        return;
      }

      console.log(
        "PropertyContext: Updating old off-plan filters:",
        newFilters
      );

      const normalizedFilters = {
        ...newFilters,
        propertyType: normalizePropertyType(newFilters.propertyType),
      };

      setCurrentFilters(normalizedFilters);
      setFilter(true);
      setCurrentPage(1);

      fetchOffPlanProperties(normalizedFilters, 1);
    },
    [fetchOffPlanProperties]
  );

  // NEW: Function to reset new off-plan filters
  const resetNewOffPlanFilters = useCallback(() => {
    const defaultOffPlanFilters = {
      offeringType: "all",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      address: "",
      developer: "",
    };
    setCurrentFilters(defaultOffPlanFilters);
    setFilter(false);
    setCurrentPage(1);

    fetchNewOffPlanProperties({}, 1);
  }, [fetchNewOffPlanProperties]);

  // EXISTING: Function to reset old off-plan filters
  const resetOffPlanFilters = useCallback(() => {
    const defaultOffPlanFilters = {
      propertyCollection: "Sale",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      address: "",
      developer: "",
    };
    setCurrentFilters(defaultOffPlanFilters);
    setFilter(false);
    setCurrentPage(1);

    fetchOffPlanProperties({}, 1);
  }, [fetchOffPlanProperties]);

  // UPDATED: Build Hero Filter Parameters Function
  const buildHeroFilterParams = (filters, page) => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", "30");

    if (filters.offeringType) {
      params.append("offeringType", filters.offeringType);
    } else if (filters.propertyCollection) {
      const typeMap = {
        Sale: "RS",
        Rent: "RR",
        OffPlan: "all",
        Commercial: "CS",
      };
      params.append(
        "offeringType",
        typeMap[filters.propertyCollection] || "RS"
      );
    }

    if (filters.propertyType && filters.propertyType !== "all") {
      params.append(
        "propertyType",
        normalizePropertyType(filters.propertyType)
      );
    }

    if (
      filters.minPrice &&
      filters.minPrice !== "" &&
      filters.minPrice !== "any"
    ) {
      params.append("minPrice", filters.minPrice);
    }

    if (
      filters.maxPrice &&
      filters.maxPrice !== "" &&
      filters.maxPrice !== "any"
    ) {
      params.append("maxPrice", filters.maxPrice);
    }

    if (
      filters.bedrooms &&
      filters.bedrooms !== "" &&
      filters.bedrooms !== "any" &&
      filters.bedrooms !== "all"
    ) {
      params.append("bedrooms", filters.bedrooms);
    }

    if (filters.address && filters.address.trim() !== "") {
      params.append("address", filters.address.trim());
    }

    return params.toString();
  };

  // Function to call All-Hero-filters API (for hero search)
  const callAllHeroFilters = async (filters, page = 1) => {
    try {
      console.log("Working");

      setLoading(true);
      setError(null);
      setIsHeroSearch(true);

      const queryString = buildHeroFilterParams(filters, page);
      console.log("Query String ", queryString);
      const url = `${ALL_HERO_FILTERS_URL}?${queryString}`;

      console.log("PropertyContext: Calling All-Hero-filters with URL:", url);

      const response = await axios.get(url);

      if (response.data && response.status === 200) {
        console.log(
          "PropertyContext: All-Hero-filters response:",
          response.data
        );

        if (response.data.pagination) {
          setPaginationData({
            ...response.data.pagination,
            totalActiveProperties:
              response.data.count || response.data.pagination.totalCount,
          });
          setpaginationtotalpages(response.data.pagination.totalPages);
          setCurrentPage(response.data.pagination.currentPage);
        }

        const formattedResponse = {
          success: response.data.success,
          data: response.data.data || [],
          pagination: response.data.pagination,
          count: response.data.count,
          appliedFilters: response.data.appliedFilters,
          message: response.data.message,
        };

        if (
          filters.offeringType === "RS" ||
          filters.propertyCollection === "Sale"
        ) {
          setSaleProperties(formattedResponse);
        } else if (
          filters.offeringType === "RR" ||
          filters.propertyCollection === "Rent"
        ) {
          setRentProperties(formattedResponse);
        } else if (
          filters.offeringType === "all" ||
          filters.propertyCollection === "OffPlan"
        ) {
          setNewOffPlanProperties(formattedResponse);
        }

        return formattedResponse;
      } else {
        console.error(
          "PropertyContext: All-Hero-filters API failed:",
          response
        );
        setError("Failed to fetch filtered property data");
        return [];
      }
    } catch (error) {
      console.error(
        "PropertyContext: Error calling All-Hero-filters API:",
        error
      );
      setError("Error fetching filtered property data");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to call Universal Filter API with pagination (for regular filtering)
  const callUniversalFilter = async (filters, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      setIsHeroSearch(false);

      const buildUniversalFilterParams = (filters, page) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());

        if (filters.offeringType) {
          params.append("offeringType", filters.offeringType);
        } else if (filters.propertyCollection) {
          const typeMap = {
            Sale: "RS",
            Rent: "RR",
            OffPlan: "all",
            Commercial: "CS",
          };
          params.append(
            "offeringType",
            typeMap[filters.propertyCollection] || "RS"
          );
        }

        if (filters.propertyType) {
          params.append(
            "propertyType",
            normalizePropertyType(filters.propertyType)
          );
        }
        if (
          filters.minPrice &&
          filters.minPrice !== "" &&
          filters.minPrice !== "any"
        ) {
          params.append("minPrice", filters.minPrice);
        }
        if (
          filters.maxPrice &&
          filters.maxPrice !== "" &&
          filters.maxPrice !== "any"
        ) {
          params.append("maxPrice", filters.maxPrice);
        }
        if (
          filters.bedrooms &&
          filters.bedrooms !== "" &&
          filters.bedrooms !== "any"
        ) {
          params.append("bedrooms", filters.bedrooms);
        }
        if (
          filters.bathrooms &&
          filters.bathrooms !== "" &&
          filters.bathrooms !== "any"
        ) {
          params.append("bathrooms", filters.bathrooms);
        }
        if (
          filters.furnishing &&
          filters.furnishing !== "" &&
          filters.furnishing !== "any"
        ) {
          params.append("furnishing", filters.furnishing);
        }
        if (
          filters.minSize &&
          filters.minSize !== "" &&
          filters.minSize !== "any"
        ) {
          params.append("minSize", filters.minSize);
        }
        if (
          filters.maxSize &&
          filters.maxSize !== "" &&
          filters.maxSize !== "any"
        ) {
          params.append("maxSize", filters.maxSize);
        }
        if (
          filters.amenities &&
          filters.amenities !== "" &&
          filters.amenities !== "any"
        ) {
          params.append("amenities", filters.amenities);
        }

        if (filters.address && filters.address.trim() !== "") {
          params.append("address", filters.address.trim());
        }

        if (
          filters.developer &&
          filters.developer !== "" &&
          filters.developer !== "any"
        ) {
          params.append("developer", filters.developer);
        }
        if (filters.viewMode && filters.viewMode !== "offplan") {
          params.append("viewMode", filters.viewMode);
        }
        if (filters.sortBy && filters.sortBy !== "newest") {
          params.append("sortBy", filters.sortBy);
        }

        return params.toString();
      };

      const queryString = buildUniversalFilterParams(filters, page);
      const url = `${UNIVERSAL_FILTER_URL}?${queryString}`;
      console.log("URL", url);
      const response = await axios.get(url);
      console.log("FIltered data", response);
      if (response.data && response.status === 200) {
        if (response.data.pagination) {
          setPaginationData(response.data.pagination);
          setpaginationtotalpages(response.data.pagination.totalPages);
          setCurrentPage(response.data.pagination.currentPage);
        }

        if (
          filters.offeringType === "RS" ||
          filters.propertyCollection === "Sale"
        ) {
          setSaleProperties(response.data);
        } else if (
          filters.offeringType === "RR" ||
          filters.propertyCollection === "Rent"
        ) {
          setRentProperties(response.data);
        } else if (
          filters.offeringType === "CS" ||
          filters.propertyCollection === "Commercial"
        ) {
          setSaleProperties(response.data);
        } else if (
          filters.offeringType === "all" ||
          filters.propertyCollection === "OffPlan"
        ) {
          setNewOffPlanProperties(response.data);
        }
      } else {
        console.error(
          "PropertyContext: Universal Filter API failed:",
          response
        );
        setError("Failed to fetch filtered property data");
        return [];
      }
    } catch (error) {
      console.error(
        "PropertyContext: Error calling Universal Filter API:",
        error
      );
      setError("Error fetching filtered property data");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch original property data with pagination
  const fetchOriginalPropertyData = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      setIsHeroSearch(false);
      setFilter(false);

      console.log("Page number is", page);

      if (type === "/sale") {
        const response = await axios.get(
          `${BASE_URL}/sale-properties?page=${page}`
        );

        console.log("PropertyContext: Sale properties response:", response);
        if (response.data && response.status === 200) {
          setSaleProperties(response.data);

          if (response.data.pagination) {
            setPaginationData(response.data.pagination);
            setpaginationtotalpages(response.data.pagination.totalPages);
            setCurrentPage(response.data.pagination.currentPage);
          }
        } else {
          setError("Failed to fetch sale property data");
        }
      } else if (type === "/rent") {
        const response = await axios.get(
          `${BASE_URL}/rent-properties?page=${page}`
        );
        console.log(
          "PropertyContext: Rent properties response:",
          response.data
        );
        if (response.data && response.status === 200) {
          setRentProperties(response.data);

          if (response.data.pagination) {
            setPaginationData(response.data.pagination);
            setpaginationtotalpages(response.data.pagination.totalPages);
            setCurrentPage(response.data.pagination.currentPage);
          }
        } else {
          setError("Failed to fetch rent property data");
        }
      } else if (type === "/commercial") {
        // Add commercial route handling
        const response = await axios.get(
          `${BASE_URL}/commercial-properties?page=${page}`
        );
        console.log(
          "PropertyContext: Commercial properties response:",
          response.data
        );
        if (response.data && response.status === 200) {
          setSaleProperties(response.data); // Commercial uses same state as sale
          if (response.data.pagination) {
            setPaginationData(response.data.pagination);
            setpaginationtotalpages(response.data.pagination.totalPages);
            setCurrentPage(response.data.pagination.currentPage);
          }
        } else {
          setError("Failed to fetch commercial property data");
        }
      } else if (type === "/newoffplan") {
        await fetchOffPlanProperties({}, page);
      } else if (type === "/offplan") {
        await fetchNewOffPlanProperties({}, page);
      }
    } catch (error) {
      console.error(
        "PropertyContext: Error fetching original property data:",
        error
      );
      setError("Error fetching property data");
    } finally {
      setLoading(false);
    }
  };

  // Function to change page
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= paginationtotalpages) {
      setCurrentPage(newPage);
      console.log("PropertyContext: Changing to page:", newPage);

      if (hasURLFilters()) {
        const urlFilters = parseURLParameters();
        urlFilters.page = newPage;
        applyURLFilters(urlFilters, newPage);
      } else if (isNewOffPlanRoute) {
        if (hasActiveFilters()) {
          fetchOffPlanProperties(currentFilters, newPage);
        } else {
          fetchOffPlanProperties({}, newPage);
        }
      } else if (isOffPlanRoute) {
        if (hasActiveFilters()) {
          fetchNewOffPlanProperties(currentFilters, newPage);
        } else {
          fetchNewOffPlanProperties({}, newPage);
        }
      } else {
        console.log("ELSE", currentFilters);
        let filter = hasActiveFilters();
        console.log("FILTER", filter);

        if (hasActiveFilters()) {
          if (isHeroSearch) {
            callAllHeroFilters(currentFilters, newPage);
          } else {
            callUniversalFilter(currentFilters, newPage);
          }
        } else {
          fetchOriginalPropertyData(newPage);
        }
      }
    }
  };

  // Getting location coordinates for map view
  const updatePropertyCoordinates = (coordinates) => {
    setPropertyCoordinates(coordinates);
  };

  // Function to go to next page
  const nextPage = () => {
    if (currentPage < paginationtotalpages) {
      changePage(currentPage + 1);
    }
  };

  // Function to go to previous page
  const previousPage = () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  };

  // CRITICAL FIX: Prevent infinite loops in regular filter updates
  const updateFilters = useCallback(
    (newFilters) => {
      if (isFilteringRef.current) {
        console.log(
          "PropertyContext: Skipping updateFilters - currently filtering"
        );
        return;
      }

      console.log("PropertyContext: Updating filters:", newFilters);

      const normalizedFilters = {
        ...newFilters,
        propertyType: normalizePropertyType(newFilters.propertyType),
      };

      setCurrentFilters(normalizedFilters);
      setFilter(true);
      setCurrentPage(1);

      if (isNewOffPlanRoute) {
        fetchOffPlanProperties(normalizedFilters, 1);
      } else if (isOffPlanRoute) {
        fetchNewOffPlanProperties(normalizedFilters, 1);
      } else {
        callUniversalFilter(normalizedFilters, 1);
      }
    },
    [
      isNewOffPlanRoute,
      isOffPlanRoute,
      fetchOffPlanProperties,
      fetchNewOffPlanProperties,
      callUniversalFilter,
    ]
  );

  // Function to update filters from Hero component (hero search)
  const updateHeroFilters = (newFilters, responseData = null) => {
    console.log("PropertyContext: Updating hero filters:", newFilters);

    const normalizedFilters = {
      ...newFilters,
      propertyType: normalizePropertyType(newFilters.propertyType),
    };

    setCurrentFilters(normalizedFilters);
    setFilter(true);
    setCurrentPage(1);
    setIsHeroSearch(true);

    if (responseData) {
      console.log(
        "PropertyContext: Setting hero response data directly:",
        responseData
      );

      if (responseData.pagination) {
        setPaginationData({
          ...responseData.pagination,
          totalActiveProperties:
            responseData.count || responseData.pagination.totalCount,
        });
        setpaginationtotalpages(responseData.pagination.totalPages || 1);
        setCurrentPage(responseData.pagination.currentPage || 1);
      }

      const formattedResponse = {
        success: responseData.success,
        data: responseData.data || [],
        pagination: responseData.pagination,
        count: responseData.count,
        appliedFilters: responseData.appliedFilters,
        message: responseData.message,
      };

      if (
        normalizedFilters.offeringType === "RS" ||
        normalizedFilters.propertyCollection === "Sale"
      ) {
        setSaleProperties(formattedResponse);
      } else if (
        normalizedFilters.offeringType === "RR" ||
        normalizedFilters.propertyCollection === "Rent"
      ) {
        setRentProperties(formattedResponse);
      } else if (
        normalizedFilters.offeringType === "all" ||
        normalizedFilters.propertyCollection === "OffPlan"
      ) {
        setNewOffPlanProperties(formattedResponse);
      }

      setLoading(false);
      setError(null);
    } else {
      callAllHeroFilters(normalizedFilters, 1);
    }
  };

  // Function to reset filters
  const resetFilters = () => {
    if (isNewOffPlanRoute) {
      resetOffPlanFilters();
    } else if (isOffPlanRoute) {
      resetNewOffPlanFilters();
    } else {
      const defaultFilters = {
        offeringType: "RS",
        propertyType: "",
        minPrice: "",
        maxPrice: "",
        bedrooms: "",
        address: "",
        developer: "",
      };
      setCurrentFilters(defaultFilters);
      setFilter(false);
      setCurrentPage(1);
      setIsHeroSearch(false);

      navigate(location.pathname, { replace: true });
      fetchOriginalPropertyData(1);
    }
  };

  // Check if we have any active filters (different from defaults)
  const hasActiveFilters = () => {
    console.log("Filter state:", filter);
    console.log("Current Filters in hasActiveFilters:", currentFilters);
    return filter === true;
  };

  // UPDATED: Main Hero Filter Properties Function
  const fetchHeroFilteredProperties = async (filterObject) => {
    try {
      console.log(
        "PropertyContext: Starting hero filter search with:",
        filterObject
      );
      setLoading(true);
      setError(null);
      setIsHeroSearch(true);

      const params = new URLSearchParams();

      if (filterObject.offeringType) {
        params.append("offeringType", filterObject.offeringType);
      } else if (filterObject.propertyCollection) {
        const typeMap = {
          Sale: "RS",
          Rent: "RR",
          OffPlan: "all",
          Commercial: "CS",
        };
        params.append(
          "offeringType",
          typeMap[filterObject.propertyCollection] || "RS"
        );
      } else {
        params.append("offeringType", "RS");
      }

      if (
        filterObject.propertyType &&
        filterObject.propertyType !== "" &&
        filterObject.propertyType !== "apartment"
      ) {
        const normalizedPropertyType =
          typeof filterObject.propertyType === "string"
            ? filterObject.propertyType.toLowerCase()
            : filterObject.propertyType;
        params.append("propertyType", normalizedPropertyType);
      }

      if (
        filterObject.minPrice &&
        filterObject.minPrice !== "" &&
        filterObject.minPrice !== "all"
      ) {
        params.append("minPrice", filterObject.minPrice);
      }

      if (
        filterObject.maxPrice &&
        filterObject.maxPrice !== "" &&
        filterObject.maxPrice !== "all"
      ) {
        params.append("maxPrice", filterObject.maxPrice);
      }

      if (
        filterObject.bedrooms &&
        filterObject.bedrooms !== "" &&
        filterObject.bedrooms !== "all"
      ) {
        params.append("bedrooms", filterObject.bedrooms);
      }

      if (filterObject.address && filterObject.address.trim() !== "") {
        params.append("address", filterObject.address.trim());
        console.log(
          "PropertyContext: Adding address filter:",
          filterObject.address.trim()
        );
      } else if (
        filterObject.searchLocation &&
        filterObject.searchLocation.trim() !== ""
      ) {
        params.append("address", filterObject.searchLocation.trim());
        console.log(
          "PropertyContext: Adding searchLocation as address filter:",
          filterObject.searchLocation.trim()
        );
      }

      params.append("page", "1");
      params.append("limit", "30");

      const filterURL = `${UNIVERSAL_FILTER_URL}?${params.toString()}`;
      console.log("PropertyContext: Hero Universal Filter URL:", filterURL);

      const response = await axios.get(filterURL);
      console.log(
        "PropertyContext: Hero Universal Filter Response:",
        response.data
      );

      if (response.data && response.data.success) {
        console.log(
          "PropertyContext: Properties found:",
          response.data.data?.length || 0
        );

        if (response.data.pagination) {
          setPaginationData({
            ...response.data.pagination,
            totalActiveProperties:
              response.data.count || response.data.pagination.totalCount,
          });
          setpaginationtotalpages(response.data.pagination.totalPages || 1);
          setCurrentPage(response.data.pagination.currentPage || 1);
        }

        const formattedResponse = {
          success: response.data.success,
          data: response.data.data || [],
          pagination: response.data.pagination,
          count: response.data.count,
          appliedFilters: response.data.appliedFilters,
          message: response.data.message,
        };

        const contextFilters = {
          offeringType: filterObject.offeringType || "RS",
          propertyType: filterObject.propertyType
            ? filterObject.propertyType.toLowerCase()
            : "apartment",
          minPrice: filterObject.minPrice || "",
          maxPrice: filterObject.maxPrice || "",
          bedrooms: filterObject.bedrooms || "",
          address: filterObject.address || filterObject.searchLocation || "",
          bathrooms: filterObject.bathrooms || "",
          furnishing: filterObject.furnishing || "All",
          minSize: filterObject.minSize || "",
          maxSize: filterObject.maxSize || "",
          amenities: filterObject.amenities || [],
          developer: filterObject.developer || "",
          sortBy: filterObject.sortBy || "newest",
        };

        setCurrentFilters(contextFilters);
        setFilter(true);

        if (contextFilters.offeringType === "RS") {
          console.log(
            "PropertyContext: Setting sale properties:",
            formattedResponse
          );
          setSaleProperties(formattedResponse);
        } else if (contextFilters.offeringType === "RR") {
          console.log(
            "PropertyContext: Setting rent properties:",
            formattedResponse
          );
          setRentProperties(formattedResponse);
        } else if (contextFilters.offeringType === "CS") {
          console.log(
            "PropertyContext: Setting commercial properties:",
            formattedResponse
          );
          setSaleProperties(formattedResponse);
        } else if (contextFilters.offeringType === "all") {
          console.log(
            "PropertyContext: Setting offplan properties:",
            formattedResponse
          );
          setNewOffPlanProperties(formattedResponse);
        }

        setLoading(false);
        setError(null);

        return response.data;
      } else {
        console.log("PropertyContext: API returned success=false or no data");

        const contextFilters = {
          offeringType: filterObject.offeringType || "RS",
          propertyType: filterObject.propertyType
            ? filterObject.propertyType.toLowerCase()
            : "apartment",
          minPrice: filterObject.minPrice || "",
          maxPrice: filterObject.maxPrice || "",
          bedrooms: filterObject.bedrooms || "",
          address: filterObject.address || filterObject.searchLocation || "",
          bathrooms: filterObject.bathrooms || "",
          furnishing: filterObject.furnishing || "All",
          minSize: filterObject.minSize || "",
          maxSize: filterObject.maxSize || "",
          amenities: filterObject.amenities || [],
          developer: filterObject.developer || "",
          sortBy: filterObject.sortBy || "newest",
        };

        setCurrentFilters(contextFilters);
        setFilter(true);

        const emptyResponse = {
          success: false,
          data: [],
          pagination: {
            totalPages: 0,
            currentPage: 1,
            totalCount: 0,
            perPage: 30,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          count: 0,
          message: response.data?.message || "No properties found",
        };

        setPaginationData(emptyResponse.pagination);
        setpaginationtotalpages(0);
        setCurrentPage(1);

        if (contextFilters.offeringType === "RS") {
          setSaleProperties(emptyResponse);
        } else if (contextFilters.offeringType === "RR") {
          setRentProperties(emptyResponse);
        } else if (contextFilters.offeringType === "CS") {
          setSaleProperties(emptyResponse);
        } else if (contextFilters.offeringType === "all") {
          setNewOffPlanProperties(emptyResponse);
        }

        setLoading(false);
        setError(null);

        return { success: false, message: "No properties found" };
      }
    } catch (error) {
      console.error(
        "PropertyContext: Error fetching hero filtered properties:",
        error
      );

      const contextFilters = {
        offeringType: filterObject.offeringType || "RS",
        propertyType: filterObject.propertyType
          ? filterObject.propertyType.toLowerCase()
          : "apartment",
        minPrice: filterObject.minPrice || "",
        maxPrice: filterObject.maxPrice || "",
        bedrooms: filterObject.bedrooms || "",
        address: filterObject.address || filterObject.searchLocation || "",
        bathrooms: filterObject.bathrooms || "",
        furnishing: filterObject.furnishing || "All",
        minSize: filterObject.minSize || "",
        maxSize: filterObject.maxSize || "",
        amenities: filterObject.amenities || [],
        developer: filterObject.developer || "",
        sortBy: filterObject.sortBy || "newest",
      };

      setCurrentFilters(contextFilters);
      setFilter(true);

      const errorResponse = {
        success: false,
        data: [],
        pagination: {
          totalPages: 0,
          currentPage: 1,
          totalCount: 0,
          perPage: 30,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        count: 0,
        message: "Error fetching properties",
      };

      setPaginationData(errorResponse.pagination);
      setpaginationtotalpages(0);
      setCurrentPage(1);

      if (contextFilters.offeringType === "RS") {
        setSaleProperties(errorResponse);
      } else if (contextFilters.offeringType === "RR") {
        setRentProperties(errorResponse);
      } else if (contextFilters.offeringType === "CS") {
        setSaleProperties(errorResponse);
      } else if (contextFilters.offeringType === "all") {
        setNewOffPlanProperties(errorResponse);
      }

      setError("Error fetching filtered property data");
      setLoading(false);

      throw error;
    }
  };

  // CRITICAL FIX: Improved useEffect with proper guards
  useEffect(() => {
    // Skip if not a valid route
    if (
      !type ||
      !(
        type === "/sale" ||
        type === "/rent" ||
        type === "/commercial" ||
        type === "/newoffplan" ||
        type === "/offplan"
      )
    ) {
      return;
    }

    // Skip if currently filtering to prevent loops
    if (isFilteringRef.current) {
      console.log("PropertyContext: Skipping effect - currently filtering");
      return;
    }

    // Check if this is the same location to prevent unnecessary re-runs
    const currentLocation = `${location.pathname}${location.search}`;
    if (
      lastLocationRef.current === currentLocation &&
      !isInitialLoadRef.current
    ) {
      console.log("PropertyContext: Same location, skipping effect");
      return;
    }

    lastLocationRef.current = currentLocation;
    setCurrentPage(1);

    console.log("PropertyContext: Route/URL changed, checking for filters");
    console.log("PropertyContext: Current search params:", location.search);

    // CRITICAL: Check if URL has filter parameters first
    if (hasURLFilters()) {
      console.log("PropertyContext: Found URL filters, applying them");
      const urlFilters = parseURLParameters();
      console.log("PropertyContext: Parsed URL filters:", urlFilters);
      applyURLFilters(urlFilters, 1);
      isInitialLoadRef.current = false;
      return;
    }

    // Skip if hero search is active and we have filters
    if (isHeroSearch && hasActiveFilters()) {
      console.log(
        "PropertyContext: Skipping original data fetch - using hero search results"
      );
      isInitialLoadRef.current = false;
      return;
    }

    // Handle active filters
    if (hasActiveFilters()) {
      console.log(
        "PropertyContext: Has active filters, calling appropriate API"
      );

      if (type === "/newoffplan") {
        fetchOffPlanProperties(currentFilters, 1);
      } else if (type === "/offplan") {
        fetchNewOffPlanProperties(currentFilters, 1);
      } else {
        if (isHeroSearch) {
          callAllHeroFilters(currentFilters, 1);
        } else {
          callUniversalFilter(currentFilters, 1);
        }
      }
    } else {
      console.log("PropertyContext: No active filters, fetching original data");
      fetchOriginalPropertyData(1);
    }

    isInitialLoadRef.current = false;
  }, [location.pathname, location.search]); // IMPORTANT: Keep these dependencies
  const contextValue = {
    // Data
    saleProperties,
    rentProperties,
    offPlanProperties,
    newOffPlanProperties,
    loading,
    error,

    // Single property data
    singleProperty,
    singlePropertyLoading,
    singlePropertyError,

    // Filter states
    filter,
    setFilter,
    filterData,
    setFilterData,
    currentFilters,
    setCurrentFilters,
    isHeroSearch,
    isNewOffPlanRoute,
    isOffPlanRoute,
    propertyCoordinates,

    // Pagination states
    paginationtotalpages,
    currentPage,
    paginationData,

    // Functions
    updateFilters,
    updateHeroFilters,
    resetFilters,
    callUniversalFilter,
    callAllHeroFilters,
    fetchOriginalPropertyData,
    fetchSingleProperty,
    clearSingleProperty,
    hasActiveFilters: hasActiveFilters(),
    updatePropertyCoordinates,

    // Old off-plan specific functions (3rd party - for /newoffplan)
    fetchOffPlanProperties,
    updateOffPlanFilters,
    resetOffPlanFilters,

    // NEW: New off-plan specific functions (your backend - for /offplan)
    fetchNewOffPlanProperties,
    updateNewOffPlanFilters,
    resetNewOffPlanFilters,

    // Hero Section Filter - Main function called from Hero component
    fetchHeroFilteredProperties,

    // NEW: URL parameter functions
    parseURLParameters,
    hasURLFilters,
    applyURLFilters,

    // Pagination functions
    changePage,
    nextPage,
    previousPage,
  };

  return (
    <PropertyContext.Provider value={contextValue}>
      {children}
    </PropertyContext.Provider>
  );
};

// Custom hook to use the PropertyContext
export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error(
      "usePropertyContext must be used within a PropertyProvider"
    );
  }
  return context;
};
