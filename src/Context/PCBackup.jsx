// import axios from "axios";
// import { createContext, use, useContext, useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export const PropertyContext = createContext();

// export const PropertyProvider = ({ children }) => {
//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const UNIVERSAL_FILTER_URL = `${BASE_URL}/Universal-filter`;
//   const ALL_HERO_FILTERS_URL = `${BASE_URL}/Universal-filter`;
//   const SINGLE_PROPERTY_URL = `${BASE_URL}/single-property`;

//   // NEW: Updated Offplan endpoints
//   const NEW_OFFPLAN_URL = `${BASE_URL}/offplan-property`; // NEW: Your backend offplan endpoint

//   //3rd party Off-plan specific endpoints (Relly) - for /newoffplan route
//   const OFFPLAN_BASE_URL = import.meta.env.VITE_BASE_URL;
//   const OFFPLAN_MIN_PRICE_URL = `${OFFPLAN_BASE_URL}/offplanminprice`;
//   const OFFPLAN_FILTER_BY_DEVELOPER_URL = `${OFFPLAN_BASE_URL}/offplanfilterbydeveloper`;
//   const OFFPLAN_PROPERTIES_URL = `${OFFPLAN_BASE_URL}/get-offplan-property`;

//   const location = useLocation();
//   const pageName = location.pathname;
//   const navigate = useNavigate();

//   // Updated route detection for both off-plan routes
//   const isNewOffPlanRoute = pageName === "/properties/newoffplan";
//   const isOffPlanRoute =
//     pageName === "/properties/offplan" || pageName === "/offplan";

//   // Updated route detection for /properties/sale and /properties/rent
//   const getRouteType = () => {
//     if (pageName.includes("/properties/sale") || pageName.includes("/sale")) {
//       return "/sale";
//     } else if (
//       pageName.includes("/properties/rent") ||
//       pageName.includes("/rent")
//     ) {
//       return "/rent";
//     } else if (
//       pageName.includes("/properties/commercial") ||
//       pageName.includes("/commercial")
//     ) {
//       return "/commercial";
//     } else if (pageName === "/properties/newoffplan") {
//       return "/newoffplan";
//     } else if (pageName === "/properties/offplan" || pageName === "/offplan") {
//       return "/offplan";
//     }
//     return null;
//   };
//   const type = getRouteType();

//   // All property data states
//   const [saleProperties, setSaleProperties] = useState([]);
//   const [rentProperties, setRentProperties] = useState([]);
//   const [offPlanProperties, setOffPlanProperties] = useState([]); // For /newoffplan route (3rd party)
//   const [newOffPlanProperties, setNewOffPlanProperties] = useState([]); // NEW: For /offplan route (your backend)
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState(false);
//   const [filterData, setFilterData] = useState({});

//   const [propertyCoordinates, setPropertyCoordinates] = useState([]);

//   // Single property data states
//   const [singleProperty, setSingleProperty] = useState(null);
//   const [singlePropertyLoading, setSinglePropertyLoading] = useState(false);
//   const [singlePropertyError, setSinglePropertyError] = useState(null);

//   // Current filters state - updated to include off-plan specific filters
//   const [currentFilters, setCurrentFilters] = useState({
//     offeringType: "RS", // NEW: Use offeringType instead of propertyCollection
//     propertyType: "",
//     minPrice: "",
//     maxPrice: "",
//     bedrooms: "",
//     address: "",
//     developer: "",
//   });

//   // Hero Location Input states
//   const [loationProperties, setloationProperties] = useState([]);

//   // Pagination states
//   const [paginationtotalpages, setpaginationtotalpages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [paginationData, setPaginationData] = useState(null);

//   // Hero search flag - to differentiate between hero search and regular filters
//   const [isHeroSearch, setIsHeroSearch] = useState(false);

//   // NEW: Function to parse URL parameters
//   const parseURLParameters = () => {
//     const searchParams = new URLSearchParams(location.search);
//     const urlFilters = {};

//     // CRITICAL: Handle propertyType with exact matching
//     const propertyTypeValue = searchParams.get("propertyType");
//     if (propertyTypeValue && propertyTypeValue.trim() !== "") {
//       // Don't normalize to lowercase here - keep exact value
//       urlFilters.propertyType = propertyTypeValue.trim();
//       console.log(
//         "PropertyContext: Found propertyType in URL:",
//         propertyTypeValue
//       );
//     }

//     // Handle other parameters (rest stays the same)
//     const parameterMap = {
//       minPrice: "minPrice",
//       maxPrice: "maxPrice",
//       bedrooms: "bedrooms",
//       bathrooms: "bathrooms",
//       address: "address",
//       location: "address",
//       developer: "developer",
//       furnishing: "furnishing",
//       minSize: "minSize",
//       maxSize: "maxSize",
//       amenities: "amenities",
//       sortBy: "sortBy",
//       page: "page",
//     };

//     for (const [urlParam, filterKey] of Object.entries(parameterMap)) {
//       const value = searchParams.get(urlParam);
//       if (value && value.trim() !== "") {
//         urlFilters[filterKey] = value.trim();
//       }
//     }

//     // Set offering type based on current route
//     if (type === "/sale") {
//       urlFilters.offeringType = "RS";
//     } else if (type === "/rent") {
//       urlFilters.offeringType = "RR";
//     } else if (type === "/commercial") {
//       urlFilters.offeringType = "CS";
//     } else if (type === "/offplan") {
//       urlFilters.offeringType = "all";
//     } else if (type === "/newoffplan") {
//       urlFilters.propertyCollection = "Sale";
//     }

//     console.log("PropertyContext: Parsed URL parameters:", urlFilters);
//     return urlFilters;
//   };

//   // NEW: Function to check if URL has filter parameters
//   const hasURLFilters = () => {
//     const searchParams = new URLSearchParams(location.search);
//     const filterParams = [
//       "propertyType",
//       "minPrice",
//       "maxPrice",
//       "bedrooms",
//       "bathrooms",
//       "address",
//       "location",
//       "developer",
//       "furnishing",
//       "minSize",
//       "maxSize",
//       "amenities",
//     ];

//     return filterParams.some(
//       (param) =>
//         searchParams.has(param) && searchParams.get(param).trim() !== ""
//     );
//   };

//   // NEW: Function to apply URL filters
//   const applyURLFilters = async (urlFilters, page = 1) => {
//     try {
//       console.log("PropertyContext: Applying URL filters:", urlFilters);

//       setLoading(true);
//       setError(null);
//       setFilter(true);
//       setIsHeroSearch(false);

//       // Handle different routes
//       if (type === "/newoffplan") {
//         await fetchOffPlanProperties(urlFilters, page);
//         return;
//       } else if (type === "/offplan") {
//         await fetchNewOffPlanProperties(urlFilters, page);
//         return;
//       }

//       // Build query parameters for Universal Filter
//       const params = new URLSearchParams();
//       params.append("page", page.toString());

//       // Add offering type
//       if (urlFilters.offeringType) {
//         params.append("offeringType", urlFilters.offeringType);
//       }

//       // CRITICAL: Handle propertyType without normalization for URL filters
//       if (urlFilters.propertyType && urlFilters.propertyType !== "all") {
//         // Send exact propertyType as received from URL
//         params.append("propertyType", urlFilters.propertyType);
//         console.log(
//           "PropertyContext: Adding propertyType to API:",
//           urlFilters.propertyType
//         );
//       }

//       // Add other filter parameters
//       Object.entries(urlFilters).forEach(([key, value]) => {
//         if (
//           key !== "offeringType" &&
//           key !== "propertyType" &&
//           key !== "page" &&
//           value &&
//           value !== "" &&
//           value !== "all" &&
//           value !== "any"
//         ) {
//           params.append(key, value);
//         }
//       });

//       const url = `${UNIVERSAL_FILTER_URL}?${params.toString()}`;
//       console.log("PropertyContext: URL filter API call:", url);

//       const response = await axios.get(url);
//       console.log("PropertyContext: URL filter response:", response.data);

//       if (response.data && response.status === 200) {
//         // Update pagination data and route to appropriate state
//         if (response.data.pagination) {
//           setPaginationData(response.data.pagination);
//           setpaginationtotalpages(response.data.pagination.totalPages || 1);
//           setCurrentPage(response.data.pagination.currentPage || page);
//         }

//         if (urlFilters.offeringType === "RS") {
//           setSaleProperties(response.data);
//         } else if (urlFilters.offeringType === "RR") {
//           setRentProperties(response.data);
//         } else if (urlFilters.offeringType === "CS") {
//           setSaleProperties(response.data);
//         }

//         setLoading(false);
//         return response.data;
//       } else {
//         throw new Error(
//           "Failed to fetch filtered properties from URL parameters"
//         );
//       }
//     } catch (error) {
//       console.error("PropertyContext: Error applying URL filters:", error);
//       setError("Error fetching properties with URL filters");
//       setLoading(false);
//       throw error;
//     }
//   };

//   // UTILITY FUNCTION: Convert propertyType to lowercase
//   const normalizePropertyType = (propertyType) => {
//     if (!propertyType || propertyType === "all" || propertyType === "") {
//       return propertyType;
//     }
//     return propertyType.toLowerCase();
//   };

//   // Function to fetch single property data
//   const fetchSingleProperty = async (propertyId, propertyType) => {
//     try {
//       setSinglePropertyLoading(true);
//       setSinglePropertyError(null);

//       const response = await axios.get(SINGLE_PROPERTY_URL, {
//         params: {
//           id: propertyId,
//           type: propertyType,
//         },
//       });

//       if (response.data && response.status === 200) {
//         console.log(
//           "PropertyContext: Single property data received:",
//           response.data
//         );

//         const propertyData = response.data.data || response.data;
//         setSingleProperty(propertyData);

//         return propertyData;
//       } else {
//         throw new Error("Failed to fetch single property data");
//       }
//     } catch (error) {
//       console.error("PropertyContext: Error fetching single property:", error);
//       setSinglePropertyError(error.message || "Error fetching property data");
//       setSingleProperty(null);
//       throw error;
//     } finally {
//       setSinglePropertyLoading(false);
//     }
//   };

//   // Function to clear single property data
//   const clearSingleProperty = () => {
//     setSingleProperty(null);
//     setSinglePropertyError(null);
//     setSinglePropertyLoading(false);
//   };

//   // NEW: Function to fetch your backend off-plan properties (for /offplan route)
//   const fetchNewOffPlanProperties = async (filters = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Build query parameters for your backend API
//       const params = new URLSearchParams();
//       params.append("page", page.toString());

//       // Add offeringType filter (default to empty for all off-plan types)
//       if (filters.offeringType && filters.offeringType !== "all") {
//         params.append("offeringType", filters.offeringType);
//       }

//       // Add other filters with propertyType normalization
//       if (filters.propertyType && filters.propertyType !== "all") {
//         params.append(
//           "propertyType",
//           normalizePropertyType(filters.propertyType)
//         );
//       }

//       if (
//         filters.minPrice &&
//         filters.minPrice !== "" &&
//         filters.minPrice !== "any"
//       ) {
//         params.append("minPrice", filters.minPrice);
//       }

//       if (
//         filters.maxPrice &&
//         filters.maxPrice !== "" &&
//         filters.maxPrice !== "any"
//       ) {
//         params.append("maxPrice", filters.maxPrice);
//       }

//       if (
//         filters.bedrooms &&
//         filters.bedrooms !== "" &&
//         filters.bedrooms !== "any"
//       ) {
//         params.append("bedrooms", filters.bedrooms);
//       }

//       if (filters.address && filters.address.trim() !== "") {
//         params.append("address", filters.address.trim());
//       }

//       if (
//         filters.developer &&
//         filters.developer !== "" &&
//         filters.developer !== "any"
//       ) {
//         params.append("developer", filters.developer);
//       }

//       // Use Universal Filter if we have active filters, otherwise use direct offplan endpoint
//       let url;
//       if (
//         Object.keys(filters).length > 0 &&
//         Object.values(filters).some(
//           (val) => val && val !== "" && val !== "all" && val !== "any"
//         )
//       ) {
//         // Use Universal Filter for filtering
//         url = `${UNIVERSAL_FILTER_URL}?${params.toString()}`;
//         console.log(
//           "PropertyContext: Using Universal Filter for off-plan with filters:",
//           url
//         );
//       } else {
//         // Use direct off-plan endpoint for all properties
//         url = `${NEW_OFFPLAN_URL}?page=${page}`;
//         console.log("PropertyContext: Using direct off-plan endpoint:", url);
//       }

//       const response = await axios.get(url);

//       if (response.data && response.status === 200) {
//         console.log(
//           "PropertyContext: New off-plan properties response:",
//           response.data
//         );

//         // Update pagination data
//         if (response.data.pagination) {
//           setPaginationData(response.data.pagination);
//           setpaginationtotalpages(response.data.pagination.totalPages || 1);
//           setCurrentPage(response.data.pagination.currentPage || page);
//         }

//         // Set new off-plan properties
//         setNewOffPlanProperties(response.data);
//         setFilter(Object.keys(filters).length > 0);

//         return response.data;
//       } else {
//         console.error("PropertyContext: New off-plan API failed:", response);
//         setError("Failed to fetch off-plan property data");
//         return [];
//       }
//     } catch (error) {
//       console.error(
//         "PropertyContext: Error fetching new off-plan properties:",
//         error
//       );
//       setError("Error fetching off-plan property data");
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   // EXISTING: Function to fetch old off-plan properties (for /newoffplan route - 3rd party)
//   const fetchOffPlanProperties = async (filters = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);

//       let url = OFFPLAN_PROPERTIES_URL;
//       const params = new URLSearchParams();

//       // Add pagination
//       params.append("page", page.toString());

//       // Check which filter to apply
//       if (
//         filters.minPrice &&
//         filters.minPrice !== "" &&
//         filters.minPrice !== "any"
//       ) {
//         url = `${OFFPLAN_MIN_PRICE_URL}?minPrice=${filters.minPrice}&page=${page}`;
//       } else if (
//         filters.maxPrice &&
//         filters.maxPrice !== "" &&
//         filters.maxPrice !== "any"
//       ) {
//         url = `${OFFPLAN_MIN_PRICE_URL}?minPrice=${filters.maxPrice}&page=${page}`;
//       } else if (
//         filters.developer &&
//         filters.developer !== "" &&
//         filters.developer !== "all"
//       ) {
//         const developerMap = {
//           emaar: "Emaar",
//           damac: "DAMAC",
//           sobha: "Sobha Realty",
//           dubai_properties: "Dubai Properties",
//           meraas: "Meraas",
//           nakheel: "Nakheel",
//           ellington: "Ellington Properties",
//           azizi: "Azizi Developments",
//           danube: "Danube Properties",
//           omniyat: "Omniyat",
//           object_1: "Object 1",
//         };

//         const developerName =
//           developerMap[filters.developer] || filters.developer;
//         url = `${OFFPLAN_FILTER_BY_DEVELOPER_URL}?developer=${encodeURIComponent(
//           developerName
//         )}&page=${page}`;
//       } else {
//         url = `${OFFPLAN_PROPERTIES_URL}?page=${page}`;
//       }

//       console.log(
//         "PropertyContext: Fetching old off-plan properties from:",
//         url
//       );

//       const response = await axios.get(url);

//       if (response.data && response.status === 200) {
//         console.log(
//           "PropertyContext: Old off-plan properties response:",
//           response.data
//         );

//         // Update pagination data
//         if (response.data.pagination) {
//           setPaginationData(response.data.pagination);
//           setpaginationtotalpages(response.data.pagination.totalPages || 1);
//           setCurrentPage(response.data.pagination.currentPage || page);
//         } else {
//           const totalCount =
//             response.data.totalCount || response.data.data?.length || 0;
//           const perPage = 10;
//           const totalPages = Math.ceil(totalCount / perPage);

//           setPaginationData({
//             currentPage: page,
//             totalPages: totalPages,
//             totalCount: totalCount,
//             perPage: perPage,
//             hasNextPage: page < totalPages,
//             hasPrevPage: page > 1,
//           });
//           setpaginationtotalpages(totalPages);
//           setCurrentPage(page);
//         }

//         setOffPlanProperties(response.data);
//         setFilter(true);

//         return response.data;
//       } else {
//         console.error("PropertyContext: Old off-plan API failed:", response);
//         setError("Failed to fetch off-plan property data");
//         return [];
//       }
//     } catch (error) {
//       console.error(
//         "PropertyContext: Error fetching old off-plan properties:",
//         error
//       );
//       setError("Error fetching off-plan property data");
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   // NEW: Function to update new off-plan filters (for /offplan route)
//   const updateNewOffPlanFilters = (newFilters) => {
//     console.log("PropertyContext: Updating new off-plan filters:", newFilters);

//     // UPDATED: Normalize propertyType before setting filters
//     const normalizedFilters = {
//       ...newFilters,
//       propertyType: normalizePropertyType(newFilters.propertyType),
//     };

//     setCurrentFilters(normalizedFilters);
//     setFilter(true);
//     setCurrentPage(1);

//     fetchNewOffPlanProperties(normalizedFilters, 1);
//   };

//   // EXISTING: Function to update old off-plan filters (for /newoffplan route)
//   const updateOffPlanFilters = (newFilters) => {
//     console.log("PropertyContext: Updating old off-plan filters:", newFilters);

//     // UPDATED: Normalize propertyType before setting filters
//     const normalizedFilters = {
//       ...newFilters,
//       propertyType: normalizePropertyType(newFilters.propertyType),
//     };

//     setCurrentFilters(normalizedFilters);
//     setFilter(true);
//     setCurrentPage(1);

//     fetchOffPlanProperties(normalizedFilters, 1);
//   };

//   // NEW: Function to reset new off-plan filters
//   const resetNewOffPlanFilters = () => {
//     const defaultOffPlanFilters = {
//       offeringType: "all", // NEW: Use offeringType
//       propertyType: "",
//       minPrice: "",
//       maxPrice: "",
//       bedrooms: "",
//       address: "",
//       developer: "",
//     };
//     setCurrentFilters(defaultOffPlanFilters);
//     setFilter(false);
//     setCurrentPage(1);

//     fetchNewOffPlanProperties({}, 1);
//   };

//   // EXISTING: Function to reset old off-plan filters
//   const resetOffPlanFilters = () => {
//     const defaultOffPlanFilters = {
//       propertyCollection: "Sale",
//       propertyType: "",
//       minPrice: "",
//       maxPrice: "",
//       bedrooms: "",
//       address: "",
//       developer: "",
//     };
//     setCurrentFilters(defaultOffPlanFilters);
//     setFilter(false);
//     setCurrentPage(1);

//     fetchOffPlanProperties({}, 1);
//   };

//   // UPDATED: Build Hero Filter Parameters Function
//   const buildHeroFilterParams = (filters, page) => {
//     const params = new URLSearchParams();

//     params.append("page", page.toString());
//     params.append("limit", "30");

//     // NEW: Use offeringType instead of propertyCollection for new structure
//     if (filters.offeringType) {
//       params.append("offeringType", filters.offeringType);
//     } else if (filters.propertyCollection) {
//       // Map old propertyCollection to new offeringType
//       const typeMap = {
//         Sale: "RS",
//         Rent: "RR",
//         OffPlan: "all", // For off-plan, we might want all types
//         Commercial: "CS",
//       };
//       params.append(
//         "offeringType",
//         typeMap[filters.propertyCollection] || "RS"
//       );
//     }

//     // UPDATED: Normalize propertyType
//     if (filters.propertyType && filters.propertyType !== "all") {
//       params.append(
//         "propertyType",
//         normalizePropertyType(filters.propertyType)
//       );
//     }

//     if (
//       filters.minPrice &&
//       filters.minPrice !== "" &&
//       filters.minPrice !== "any"
//     ) {
//       params.append("minPrice", filters.minPrice);
//     }

//     if (
//       filters.maxPrice &&
//       filters.maxPrice !== "" &&
//       filters.maxPrice !== "any"
//     ) {
//       params.append("maxPrice", filters.maxPrice);
//     }

//     if (
//       filters.bedrooms &&
//       filters.bedrooms !== "" &&
//       filters.bedrooms !== "any" &&
//       filters.bedrooms !== "all"
//     ) {
//       params.append("bedrooms", filters.bedrooms);
//     }

//     // FIXED: Consistent parameter naming - use 'address' not 'searchLocation'
//     if (filters.address && filters.address.trim() !== "") {
//       params.append("address", filters.address.trim());
//     }

//     return params.toString();
//   };

//   // Function to call All-Hero-filters API (for hero search)
//   const callAllHeroFilters = async (filters, page = 1) => {
//     try {
//       console.log("Working");

//       setLoading(true);
//       setError(null);
//       setIsHeroSearch(true);

//       const queryString = buildHeroFilterParams(filters, page);
//       console.log("Query String ", queryString);
//       const url = `${ALL_HERO_FILTERS_URL}?${queryString}`;

//       console.log("PropertyContext: Calling All-Hero-filters with URL:", url);

//       const response = await axios.get(url);

//       if (response.data && response.status === 200) {
//         console.log(
//           "PropertyContext: All-Hero-filters response:",
//           response.data
//         );

//         if (response.data.pagination) {
//           setPaginationData({
//             ...response.data.pagination,
//             totalActiveProperties:
//               response.data.count || response.data.pagination.totalCount,
//           });
//           setpaginationtotalpages(response.data.pagination.totalPages);
//           setCurrentPage(response.data.pagination.currentPage);
//         }

//         const formattedResponse = {
//           success: response.data.success,
//           data: response.data.data || [],
//           pagination: response.data.pagination,
//           count: response.data.count,
//           appliedFilters: response.data.appliedFilters,
//           message: response.data.message,
//         };

//         // NEW: Updated to handle offeringType
//         if (
//           filters.offeringType === "RS" ||
//           filters.propertyCollection === "Sale"
//         ) {
//           setSaleProperties(formattedResponse);
//         } else if (
//           filters.offeringType === "RR" ||
//           filters.propertyCollection === "Rent"
//         ) {
//           setRentProperties(formattedResponse);
//         } else if (
//           filters.offeringType === "all" ||
//           filters.propertyCollection === "OffPlan"
//         ) {
//           setNewOffPlanProperties(formattedResponse);
//         }

//         return formattedResponse;
//       } else {
//         console.error(
//           "PropertyContext: All-Hero-filters API failed:",
//           response
//         );
//         setError("Failed to fetch filtered property data");
//         return [];
//       }
//     } catch (error) {
//       console.error(
//         "PropertyContext: Error calling All-Hero-filters API:",
//         error
//       );
//       setError("Error fetching filtered property data");
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to call Universal Filter API with pagination (for regular filtering)
//   const callUniversalFilter = async (filters, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
//       setIsHeroSearch(false);

//       const buildUniversalFilterParams = (filters, page) => {
//         const params = new URLSearchParams();

//         params.append("page", page.toString());

//         // NEW: Use offeringType instead of propertyCollection
//         if (filters.offeringType) {
//           params.append("offeringType", filters.offeringType);
//         } else if (filters.propertyCollection) {
//           // Map old propertyCollection to new offeringType
//           const typeMap = {
//             Sale: "RS",
//             Rent: "RR",
//             OffPlan: "all",
//             Commercial: "CS",
//           };
//           params.append(
//             "offeringType",
//             typeMap[filters.propertyCollection] || "RS"
//           );
//         }

//         // FIXED: Use consistent parameter names
//         if (filters.propertyType) {
//           params.append(
//             "propertyType",
//             normalizePropertyType(filters.propertyType)
//           );
//         }
//         if (
//           filters.minPrice &&
//           filters.minPrice !== "" &&
//           filters.minPrice !== "any"
//         ) {
//           params.append("minPrice", filters.minPrice);
//         }
//         if (
//           filters.maxPrice &&
//           filters.maxPrice !== "" &&
//           filters.maxPrice !== "any"
//         ) {
//           params.append("maxPrice", filters.maxPrice);
//         }
//         if (
//           filters.bedrooms &&
//           filters.bedrooms !== "" &&
//           filters.bedrooms !== "any"
//         ) {
//           params.append("bedrooms", filters.bedrooms);
//         }
//         if (
//           filters.bathrooms &&
//           filters.bathrooms !== "" &&
//           filters.bathrooms !== "any"
//         ) {
//           params.append("bathrooms", filters.bathrooms);
//         }
//         if (
//           filters.furnishing &&
//           filters.furnishing !== "" &&
//           filters.furnishing !== "any"
//         ) {
//           params.append("furnishing", filters.furnishing);
//         }
//         if (
//           filters.minSize &&
//           filters.minSize !== "" &&
//           filters.minSize !== "any"
//         ) {
//           params.append("minSize", filters.minSize);
//         }
//         if (
//           filters.maxSize &&
//           filters.maxSize !== "" &&
//           filters.maxSize !== "any"
//         ) {
//           params.append("maxSize", filters.maxSize);
//         }
//         if (
//           filters.amenities &&
//           filters.amenities !== "" &&
//           filters.amenities !== "any"
//         ) {
//           params.append("amenities", filters.amenities);
//         }

//         // FIXED: Use 'address' parameter name consistently (not 'searchLocation')
//         if (filters.address && filters.address.trim() !== "") {
//           params.append("address", filters.address.trim());
//         }

//         if (
//           filters.developer &&
//           filters.developer !== "" &&
//           filters.developer !== "any"
//         ) {
//           params.append("developer", filters.developer);
//         }
//         if (filters.viewMode && filters.viewMode !== "offplan") {
//           params.append("viewMode", filters.viewMode);
//         }
//         if (filters.sortBy && filters.sortBy !== "newest") {
//           params.append("sortBy", filters.sortBy);
//         }

//         return params.toString();
//       };

//       const queryString = buildUniversalFilterParams(filters, page);
//       const url = `${UNIVERSAL_FILTER_URL}?${queryString}`;
//       console.log("URL", url);
//       const response = await axios.get(url);
//       console.log("FIltered data", response);
//       if (response.data && response.status === 200) {
//         if (response.data.pagination) {
//           setPaginationData(response.data.pagination);
//           setpaginationtotalpages(response.data.pagination.totalPages);
//           setCurrentPage(response.data.pagination.currentPage);
//         }

//         // NEW: Updated to handle offeringType
//         if (
//           filters.offeringType === "RS" ||
//           filters.propertyCollection === "Sale"
//         ) {
//           setSaleProperties(response.data);
//         } else if (
//           filters.offeringType === "RR" ||
//           filters.propertyCollection === "Rent"
//         ) {
//           setRentProperties(response.data);
//         } else if (
//           filters.offeringType === "CS" ||
//           filters.propertyCollection === "Commercial"
//         ) {
//           setSaleProperties(response.data); // Commercial uses sale properties state
//         } else if (
//           filters.offeringType === "all" ||
//           filters.propertyCollection === "OffPlan"
//         ) {
//           setNewOffPlanProperties(response.data);
//         }
//       } else {
//         console.error(
//           "PropertyContext: Universal Filter API failed:",
//           response
//         );
//         setError("Failed to fetch filtered property data");
//         return [];
//       }
//     } catch (error) {
//       console.error(
//         "PropertyContext: Error calling Universal Filter API:",
//         error
//       );
//       setError("Error fetching filtered property data");
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to fetch original property data with pagination
//   const fetchOriginalPropertyData = async (page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
//       setIsHeroSearch(false);
//       setFilter(false); // ADD THIS LINE - Mark as no filters applied

//       console.log("Page number is", page);

//       if (type === "/sale") {
//         const response = await axios.get(
//           `${BASE_URL}/sale-properties?page=${page}`
//         );

//         console.log("PropertyContext: Sale properties response:", response);
//         if (response.data && response.status === 200) {
//           setSaleProperties(response.data);

//           if (response.data.pagination) {
//             setPaginationData(response.data.pagination);
//             setpaginationtotalpages(response.data.pagination.totalPages);
//             setCurrentPage(response.data.pagination.currentPage);
//           }
//         } else {
//           setError("Failed to fetch sale property data");
//         }
//       } else if (type === "/rent") {
//         const response = await axios.get(
//           `${BASE_URL}/rent-properties?page=${page}`
//         );
//         console.log(
//           "PropertyContext: Rent properties response:",
//           response.data
//         );
//         if (response.data && response.status === 200) {
//           setRentProperties(response.data);

//           if (response.data.pagination) {
//             setPaginationData(response.data.pagination);
//             setpaginationtotalpages(response.data.pagination.totalPages);
//             setCurrentPage(response.data.pagination.currentPage);
//           }
//         } else {
//           setError("Failed to fetch rent property data");
//         }
//       } else if (type === "/commercial") {
//         const response = await axios.get(
//           `${BASE_URL}/commercial-properties?page=${page}`
//         );
//         console.log(
//           "PropertyContext: Commercial properties response:",
//           response.data
//         );
//         if (response.data && response.status === 200) {
//           setSaleProperties(response.data); // Commercial uses sale properties state
//           if (response.data.pagination) {
//             setPaginationData(response.data.pagination);
//             setpaginationtotalpages(response.data.pagination.totalPages);
//             setCurrentPage(response.data.pagination.currentPage);
//           }
//         } else {
//           setError("Failed to fetch commercial property data");
//         }
//       } else if (type === "/newoffplan") {
//         await fetchOffPlanProperties({}, page);
//       } else if (type === "/offplan") {
//         await fetchNewOffPlanProperties({}, page);
//       }
//     } catch (error) {
//       console.error(
//         "PropertyContext: Error fetching original property data:",
//         error
//       );
//       setError("Error fetching property data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to change page
//   const changePage = (newPage) => {
//     if (newPage >= 1 && newPage <= paginationtotalpages) {
//       setCurrentPage(newPage);
//       console.log("PropertyContext: Changing to page:", newPage);

//       // Check if we have URL filters
//       if (hasURLFilters()) {
//         const urlFilters = parseURLParameters();
//         urlFilters.page = newPage;
//         applyURLFilters(urlFilters, newPage);
//       } else if (isNewOffPlanRoute) {
//         // Handle old off-plan pagination (3rd party)
//         if (hasActiveFilters()) {
//           fetchOffPlanProperties(currentFilters, newPage);
//         } else {
//           fetchOffPlanProperties({}, newPage);
//         }
//       } else if (isOffPlanRoute) {
//         // NEW: Handle new off-plan pagination (your backend)
//         if (hasActiveFilters()) {
//           fetchNewOffPlanProperties(currentFilters, newPage);
//         } else {
//           fetchNewOffPlanProperties({}, newPage);
//         }
//       } else {
//         console.log("ELSE", currentFilters);
//         let filter = hasActiveFilters();
//         console.log("FILTER", filter);

//         // Handle regular pagination
//         if (hasActiveFilters()) {
//           if (isHeroSearch) {
//             callAllHeroFilters(currentFilters, newPage);
//           } else {
//             callUniversalFilter(currentFilters, newPage);
//           }
//         } else {
//           fetchOriginalPropertyData(newPage);
//         }
//       }
//     }
//   };

//   // Getting location coordinates for map view
//   const updatePropertyCoordinates = (coordinates) => {
//     console.log("PropertyContext: Updating property coordinates:", coordinates);
//     setPropertyCoordinates(coordinates);
//   };

//   // Function to go to next page
//   const nextPage = () => {
//     if (currentPage < paginationtotalpages) {
//       changePage(currentPage + 1);
//     }
//   };

//   // Function to go to previous page
//   const previousPage = () => {
//     if (currentPage > 1) {
//       changePage(currentPage - 1);
//     }
//   };

//   // Function to update filters from components (regular filtering)
//   const updateFilters = (newFilters) => {
//     console.log("PropertyContext: Updating filters:", newFilters);

//     // UPDATED: Normalize propertyType before setting filters
//     const normalizedFilters = {
//       ...newFilters,
//       propertyType: normalizePropertyType(newFilters.propertyType),
//     };

//     setCurrentFilters(normalizedFilters);
//     setFilter(true);
//     setCurrentPage(1);

//     if (isNewOffPlanRoute) {
//       // Use old off-plan filtering (3rd party)
//       fetchOffPlanProperties(normalizedFilters, 1);
//     } else if (isOffPlanRoute) {
//       // NEW: Use new off-plan filtering (your backend)
//       fetchNewOffPlanProperties(normalizedFilters, 1);
//     } else {
//       // Call Universal Filter API when filters are updated (regular filtering)
//       callUniversalFilter(normalizedFilters, 1);
//     }
//   };

//   // Function to update filters from Hero component (hero search)
//   const updateHeroFilters = (newFilters, responseData = null) => {
//     console.log("PropertyContext: Updating hero filters:", newFilters);

//     // UPDATED: Normalize propertyType before setting filters
//     const normalizedFilters = {
//       ...newFilters,
//       propertyType: normalizePropertyType(newFilters.propertyType),
//     };

//     setCurrentFilters(normalizedFilters);
//     setFilter(true);
//     setCurrentPage(1);
//     setIsHeroSearch(true);

//     if (responseData) {
//       console.log(
//         "PropertyContext: Setting hero response data directly:",
//         responseData
//       );

//       if (responseData.pagination) {
//         setPaginationData({
//           ...responseData.pagination,
//           totalActiveProperties:
//             responseData.count || responseData.pagination.totalCount,
//         });
//         setpaginationtotalpages(responseData.pagination.totalPages || 1);
//         setCurrentPage(responseData.pagination.currentPage || 1);
//       }

//       const formattedResponse = {
//         success: responseData.success,
//         data: responseData.data || [],
//         pagination: responseData.pagination,
//         count: responseData.count,
//         appliedFilters: responseData.appliedFilters,
//         message: responseData.message,
//       };

//       // NEW: Updated to handle offeringType
//       if (
//         normalizedFilters.offeringType === "RS" ||
//         normalizedFilters.propertyCollection === "Sale"
//       ) {
//         setSaleProperties(formattedResponse);
//       } else if (
//         normalizedFilters.offeringType === "RR" ||
//         normalizedFilters.propertyCollection === "Rent"
//       ) {
//         setRentProperties(formattedResponse);
//       } else if (
//         normalizedFilters.offeringType === "all" ||
//         normalizedFilters.propertyCollection === "OffPlan"
//       ) {
//         setNewOffPlanProperties(formattedResponse);
//       }

//       setLoading(false);
//       setError(null);
//     } else {
//       callAllHeroFilters(normalizedFilters, 1);
//     }
//   };

//   // Function to reset filters
//   const resetFilters = () => {
//     if (isNewOffPlanRoute) {
//       resetOffPlanFilters(); // Old off-plan reset (3rd party)
//     } else if (isOffPlanRoute) {
//       resetNewOffPlanFilters(); // NEW: New off-plan reset (your backend)
//     } else {
//       const defaultFilters = {
//         offeringType: "RS", // NEW: Use offeringType
//         propertyType: "",
//         minPrice: "",
//         maxPrice: "",
//         bedrooms: "",
//         address: "",
//         developer: "",
//       };
//       setCurrentFilters(defaultFilters);
//       setFilter(false);
//       setCurrentPage(1);
//       setIsHeroSearch(false);

//       // Clear URL parameters
//       navigate(location.pathname, { replace: true });
//       fetchOriginalPropertyData(1);
//     }
//   };

//   // Check if we have any active filters (different from defaults)
//   const hasActiveFilters = () => {
//     console.log("Filter state:", filter);
//     console.log("Current Filters in hasActiveFilters:", currentFilters);

//     // Simply return the filter state that you're already managing properly
//     return filter === true;
//   };

//   // UPDATED: Main Hero Filter Properties Function
//   const fetchHeroFilteredProperties = async (filterObject) => {
//     try {
//       console.log(
//         "PropertyContext: Starting hero filter search with:",
//         filterObject
//       );
//       setLoading(true);
//       setError(null);
//       setIsHeroSearch(true);

//       const params = new URLSearchParams();

//       // Handle offeringType from Hero component
//       if (filterObject.offeringType) {
//         params.append("offeringType", filterObject.offeringType);
//       } else if (filterObject.propertyCollection) {
//         // Legacy mapping for backward compatibility
//         const typeMap = {
//           Sale: "RS",
//           Rent: "RR",
//           OffPlan: "all",
//           Commercial: "CS",
//         };
//         params.append(
//           "offeringType",
//           typeMap[filterObject.propertyCollection] || "RS"
//         );
//       } else {
//         // Default fallback
//         params.append("offeringType", "RS");
//       }

//       // Add property type (ensure it's lowercase for consistency)
//       if (
//         filterObject.propertyType &&
//         filterObject.propertyType !== "" &&
//         filterObject.propertyType !== "apartment"
//       ) {
//         // Normalize to lowercase if not already
//         const normalizedPropertyType =
//           typeof filterObject.propertyType === "string"
//             ? filterObject.propertyType.toLowerCase()
//             : filterObject.propertyType;
//         params.append("propertyType", normalizedPropertyType);
//       }

//       // Add other filter parameters
//       if (
//         filterObject.minPrice &&
//         filterObject.minPrice !== "" &&
//         filterObject.minPrice !== "all"
//       ) {
//         params.append("minPrice", filterObject.minPrice);
//       }

//       if (
//         filterObject.maxPrice &&
//         filterObject.maxPrice !== "" &&
//         filterObject.maxPrice !== "all"
//       ) {
//         params.append("maxPrice", filterObject.maxPrice);
//       }

//       if (
//         filterObject.bedrooms &&
//         filterObject.bedrooms !== "" &&
//         filterObject.bedrooms !== "all"
//       ) {
//         params.append("bedrooms", filterObject.bedrooms);
//       }

//       // FIXED: Use consistent parameter name for address/location
//       if (filterObject.address && filterObject.address.trim() !== "") {
//         params.append("address", filterObject.address.trim());
//         console.log(
//           "PropertyContext: Adding address filter:",
//           filterObject.address.trim()
//         );
//       }
//       // Also check for searchLocation as fallback (from Hero component)
//       else if (
//         filterObject.searchLocation &&
//         filterObject.searchLocation.trim() !== ""
//       ) {
//         params.append("address", filterObject.searchLocation.trim());
//         console.log(
//           "PropertyContext: Adding searchLocation as address filter:",
//           filterObject.searchLocation.trim()
//         );
//       }

//       // Add pagination and limit
//       params.append("page", "1");
//       params.append("limit", "30");

//       const filterURL = `${UNIVERSAL_FILTER_URL}?${params.toString()}`;
//       console.log("PropertyContext: Hero Universal Filter URL:", filterURL);

//       const response = await axios.get(filterURL);
//       console.log(
//         "PropertyContext: Hero Universal Filter Response:",
//         response.data
//       );

//       if (response.data && response.data.success) {
//         console.log(
//           "PropertyContext: Properties found:",
//           response.data.data?.length || 0
//         );

//         // Update pagination data
//         if (response.data.pagination) {
//           setPaginationData({
//             ...response.data.pagination,
//             totalActiveProperties:
//               response.data.count || response.data.pagination.totalCount,
//           });
//           setpaginationtotalpages(response.data.pagination.totalPages || 1);
//           setCurrentPage(response.data.pagination.currentPage || 1);
//         }

//         const formattedResponse = {
//           success: response.data.success,
//           data: response.data.data || [],
//           pagination: response.data.pagination,
//           count: response.data.count,
//           appliedFilters: response.data.appliedFilters,
//           message: response.data.message,
//         };

//         // FIXED: Create context filters object with proper parameter names
//         const contextFilters = {
//           offeringType: filterObject.offeringType || "RS",
//           propertyType: filterObject.propertyType
//             ? filterObject.propertyType.toLowerCase()
//             : "apartment",
//           minPrice: filterObject.minPrice || "",
//           maxPrice: filterObject.maxPrice || "",
//           bedrooms: filterObject.bedrooms || "",
//           // FIXED: Use address consistently
//           address: filterObject.address || filterObject.searchLocation || "",
//           bathrooms: filterObject.bathrooms || "",
//           furnishing: filterObject.furnishing || "All",
//           minSize: filterObject.minSize || "",
//           maxSize: filterObject.maxSize || "",
//           amenities: filterObject.amenities || [],
//           developer: filterObject.developer || "",
//           sortBy: filterObject.sortBy || "newest",
//         };

//         setCurrentFilters(contextFilters);
//         setFilter(true);

//         // Route the response to appropriate state based on offeringType
//         if (contextFilters.offeringType === "RS") {
//           console.log(
//             "PropertyContext: Setting sale properties:",
//             formattedResponse
//           );
//           setSaleProperties(formattedResponse);
//         } else if (contextFilters.offeringType === "RR") {
//           console.log(
//             "PropertyContext: Setting rent properties:",
//             formattedResponse
//           );
//           setRentProperties(formattedResponse);
//         } else if (contextFilters.offeringType === "CS") {
//           console.log(
//             "PropertyContext: Setting commercial properties:",
//             formattedResponse
//           );
//           setSaleProperties(formattedResponse); // Commercial uses sale properties state
//         } else if (contextFilters.offeringType === "all") {
//           console.log(
//             "PropertyContext: Setting offplan properties:",
//             formattedResponse
//           );
//           setNewOffPlanProperties(formattedResponse);
//         }

//         setLoading(false);
//         setError(null);

//         return response.data;
//       } else {
//         // Handle no results case with proper filter setup
//         console.log("PropertyContext: API returned success=false or no data");

//         const contextFilters = {
//           offeringType: filterObject.offeringType || "RS",
//           propertyType: filterObject.propertyType
//             ? filterObject.propertyType.toLowerCase()
//             : "apartment",
//           minPrice: filterObject.minPrice || "",
//           maxPrice: filterObject.maxPrice || "",
//           bedrooms: filterObject.bedrooms || "",
//           // FIXED: Use address consistently
//           address: filterObject.address || filterObject.searchLocation || "",
//           bathrooms: filterObject.bathrooms || "",
//           furnishing: filterObject.furnishing || "All",
//           minSize: filterObject.minSize || "",
//           maxSize: filterObject.maxSize || "",
//           amenities: filterObject.amenities || [],
//           developer: filterObject.developer || "",
//           sortBy: filterObject.sortBy || "newest",
//         };

//         setCurrentFilters(contextFilters);
//         setFilter(true);

//         const emptyResponse = {
//           success: false,
//           data: [],
//           pagination: {
//             totalPages: 0,
//             currentPage: 1,
//             totalCount: 0,
//             perPage: 30,
//             hasNextPage: false,
//             hasPreviousPage: false,
//           },
//           count: 0,
//           message: response.data?.message || "No properties found",
//         };

//         setPaginationData(emptyResponse.pagination);
//         setpaginationtotalpages(0);
//         setCurrentPage(1);

//         // Route empty response based on offeringType
//         if (contextFilters.offeringType === "RS") {
//           setSaleProperties(emptyResponse);
//         } else if (contextFilters.offeringType === "RR") {
//           setRentProperties(emptyResponse);
//         } else if (contextFilters.offeringType === "CS") {
//           setSaleProperties(emptyResponse); // Commercial uses sale properties state
//         } else if (contextFilters.offeringType === "all") {
//           setNewOffPlanProperties(emptyResponse);
//         }

//         setLoading(false);
//         setError(null);

//         return { success: false, message: "No properties found" };
//       }
//     } catch (error) {
//       console.error(
//         "PropertyContext: Error fetching hero filtered properties:",
//         error
//       );

//       const contextFilters = {
//         offeringType: filterObject.offeringType || "RS",
//         propertyType: filterObject.propertyType
//           ? filterObject.propertyType.toLowerCase()
//           : "apartment",
//         minPrice: filterObject.minPrice || "",
//         maxPrice: filterObject.maxPrice || "",
//         bedrooms: filterObject.bedrooms || "",
//         // FIXED: Use address consistently
//         address: filterObject.address || filterObject.searchLocation || "",
//         bathrooms: filterObject.bathrooms || "",
//         furnishing: filterObject.furnishing || "All",
//         minSize: filterObject.minSize || "",
//         maxSize: filterObject.maxSize || "",
//         amenities: filterObject.amenities || [],
//         developer: filterObject.developer || "",
//         sortBy: filterObject.sortBy || "newest",
//       };

//       setCurrentFilters(contextFilters);
//       setFilter(true);

//       const errorResponse = {
//         success: false,
//         data: [],
//         pagination: {
//           totalPages: 0,
//           currentPage: 1,
//           totalCount: 0,
//           perPage: 30,
//           hasNextPage: false,
//           hasPreviousPage: false,
//         },
//         count: 0,
//         message: "Error fetching properties",
//       };

//       setPaginationData(errorResponse.pagination);
//       setpaginationtotalpages(0);
//       setCurrentPage(1);

//       // Route error response based on offeringType
//       if (contextFilters.offeringType === "RS") {
//         setSaleProperties(errorResponse);
//       } else if (contextFilters.offeringType === "RR") {
//         setRentProperties(errorResponse);
//       } else if (contextFilters.offeringType === "CS") {
//         setSaleProperties(errorResponse); // Commercial uses sale properties state
//       } else if (contextFilters.offeringType === "all") {
//         setNewOffPlanProperties(errorResponse);
//       }

//       setError("Error fetching filtered property data");
//       setLoading(false);

//       throw error;
//     }
//   };

//   // UPDATED: Load original data when route changes
//   // useEffect(() => {
//   //   if (
//   //     type === "/sale" ||
//   //     type === "/rent" ||
//   //     type === "/commercial" ||
//   //     type === "/newoffplan" ||
//   //     type === "/offplan"
//   //   ) {
//   //     setCurrentPage(1);

//   //     console.log("PropertyContext: Route/URL changed, checking for filters");
//   //     console.log("PropertyContext: Current search params:", location.search);

//   //     // Check if URL has filter parameters first
//   //     if (hasURLFilters()) {
//   //       console.log("PropertyContext: Found URL filters, applying them");
//   //       const urlFilters = parseURLParameters();
//   //       applyURLFilters(urlFilters, 1);
//   //       return;
//   //     }

//   //     if (isHeroSearch && hasActiveFilters()) {
//   //       console.log(
//   //         "PropertyContext: Skipping original data fetch - using hero search results"
//   //       );
//   //       return;
//   //     }

//   //     if (hasActiveFilters()) {
//   //       console.log(
//   //         "PropertyContext: Has active filters, calling appropriate API"
//   //       );

//   //       if (type === "/newoffplan") {
//   //         // Use old off-plan filtering (3rd party)
//   //         fetchOffPlanProperties(currentFilters, 1);
//   //       } else if (type === "/offplan") {
//   //         // NEW: Use new off-plan filtering (your backend)
//   //         fetchNewOffPlanProperties(currentFilters, 1);
//   //       } else {
//   //         if (isHeroSearch) {
//   //           callAllHeroFilters(currentFilters, 1);
//   //         } else {
//   //           callUniversalFilter(currentFilters, 1);
//   //         }
//   //       }
//   //     } else {
//   //       console.log(
//   //         "PropertyContext: No active filters, fetching original data"
//   //       );
//   //       fetchOriginalPropertyData(1);
//   //     }
//   //   }
//   // }, [pageName, type, location.search]); // Added location.search to dependencies

// useEffect(() => {
//   // Wait for route type to be properly determined
//   if (!type) return;
  
//   console.log("PropertyContext: Route/URL changed", { 
//     type, 
//     search: location.search,
//     hasURL: hasURLFilters() 
//   });
//   setCurrentPage(1);
  
//   // PRIORITY 1: Check URL parameters FIRST before anything else
//   if (hasURLFilters()) {
//     console.log("PropertyContext: Found URL filters, applying immediately");
//     const urlFilters = parseURLParameters();
    
//     // CRITICAL: Set filters state immediately to prevent race conditions
//     setCurrentFilters(prev => ({
//       ...prev,
//       ...urlFilters
//     }));
//     setFilter(true);
//     setIsHeroSearch(false); // Make sure this is not hero search
    
//     applyURLFilters(urlFilters, 1);
//     return; // STOP HERE - don't execute any other logic
//   }

//   // PRIORITY 2: Only proceed if no URL filters detected
//   console.log("PropertyContext: No URL filters found, proceeding with other logic");
  
//   if (isHeroSearch && hasActiveFilters()) {
//     console.log("PropertyContext: Skipping - using hero search results");
//     return;
//   }

//   if (hasActiveFilters()) {
//     console.log("PropertyContext: Has active filters from state");
//     if (type === "/newoffplan") {
//       fetchOffPlanProperties(currentFilters, 1);
//     } else if (type === "/offplan") {
//       fetchNewOffPlanProperties(currentFilters, 1);
//     } else {
//       if (isHeroSearch) {
//         callAllHeroFilters(currentFilters, 1);
//       } else {
//         callUniversalFilter(currentFilters, 1);
//       }
//     }
//   } else {
//     console.log("PropertyContext: Loading original data");
//     fetchOriginalPropertyData(1);
//   }
// }, [type, location.search]); // Keep location.search in dependencies
//   const contextValue = {
//     // Data
//     saleProperties,
//     rentProperties,
//     offPlanProperties, // Old off-plan properties state (3rd party - for /newoffplan)
//     newOffPlanProperties, // NEW: New off-plan properties state (your backend - for /offplan)
//     loading,
//     error,

//     // Single property data
//     singleProperty,
//     singlePropertyLoading,
//     singlePropertyError,

//     // Filter states
//     filter,
//     setFilter,
//     filterData,
//     setFilterData,
//     currentFilters,
//     setCurrentFilters,
//     isHeroSearch,
//     isNewOffPlanRoute, // Old off-plan route detection flag
//     isOffPlanRoute, // NEW: New off-plan route detection flag
//     propertyCoordinates,

//     // Pagination states
//     paginationtotalpages,
//     currentPage,
//     paginationData,

//     // Functions
//     updateFilters,
//     updateHeroFilters,
//     resetFilters,
//     callUniversalFilter,
//     callAllHeroFilters,
//     fetchOriginalPropertyData,
//     fetchSingleProperty,
//     clearSingleProperty,
//     hasActiveFilters: hasActiveFilters(),
//     updatePropertyCoordinates,

//     // Old off-plan specific functions (3rd party - for /newoffplan)
//     fetchOffPlanProperties,
//     updateOffPlanFilters,
//     resetOffPlanFilters,

//     // NEW: New off-plan specific functions (your backend - for /offplan)
//     fetchNewOffPlanProperties,
//     updateNewOffPlanFilters,
//     resetNewOffPlanFilters,

//     // Hero Section Filter - Main function called from Hero component
//     fetchHeroFilteredProperties,

//     // NEW: URL parameter functions
//     parseURLParameters,
//     hasURLFilters,
//     applyURLFilters,

//     // Pagination functions
//     changePage,
//     nextPage,
//     previousPage,
//   };

//   return (
//     <PropertyContext.Provider value={contextValue}>
//       {children}
//     </PropertyContext.Provider>
//   );
// };

// // Custom hook to use the PropertyContext
// export const usePropertyContext = () => {
//   const context = useContext(PropertyContext);
//   if (!context) {
//     throw new Error(
//       "usePropertyContext must be used within a PropertyProvider"
//     );
//   }
//   return context;
// };