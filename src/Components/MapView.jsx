import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { usePropertyContext } from '../Context/PropertyContext';
import '../Styles/MapView.css';

const MapView = ({ isOpen, onClose }) => {
  const {
    propertyCoordinates // Get coordinates directly from context
  } = usePropertyContext();

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 25.2048, lng: 55.2708 }); // Dubai default
  const [mapZoom, setMapZoom] = useState(11);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [isModalReady, setIsModalReady] = useState(false);

  console.log("MapView: Received coordinates from context:", propertyCoordinates?.length || 0);

  // Memoize valid coordinates to prevent unnecessary recalculations
  const validCoordinates = useMemo(() => {
    if (!Array.isArray(propertyCoordinates)) return [];
    
    return propertyCoordinates.filter(coord => {
      const isValid = coord && 
                     coord.coordinates && 
                     typeof coord.coordinates.latitude === 'number' && 
                     typeof coord.coordinates.longitude === 'number' && 
                     !isNaN(coord.coordinates.latitude) && 
                     !isNaN(coord.coordinates.longitude) &&
                     coord.coordinates.latitude !== 0 &&
                     coord.coordinates.longitude !== 0;
      
      if (!isValid && coord) {
        console.warn("MapView: Invalid coordinate found:", coord);
      }
      
      return isValid;
    });
  }, [propertyCoordinates]);

  console.log("MapView: Valid coordinates after filtering:", validCoordinates.length);

  // Reset modal state when opening
  useEffect(() => {
    if (isOpen) {
      setIsModalReady(false);
      setSelectedProperty(null);
      // Small delay to ensure proper modal rendering
      const timer = setTimeout(() => {
        setIsModalReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setIsModalReady(false);
      setSelectedProperty(null);
    }
  }, [isOpen]);

  // Calculate map center based on coordinates
  useEffect(() => {
    if (validCoordinates.length > 0 && isOpen && isModalReady) {
      try {
        // Calculate center of all markers
        const avgLat = validCoordinates.reduce((sum, coord) => {
          return sum + coord.coordinates.latitude;
        }, 0) / validCoordinates.length;
        
        const avgLng = validCoordinates.reduce((sum, coord) => {
          return sum + coord.coordinates.longitude;
        }, 0) / validCoordinates.length;
        
        // Validate calculated center
        if (!isNaN(avgLat) && !isNaN(avgLng)) {
          setMapCenter({ lat: avgLat, lng: avgLng });
          
          // Adjust zoom based on number of properties
          if (validCoordinates.length === 1) {
            setMapZoom(15);
          } else if (validCoordinates.length <= 5) {
            setMapZoom(13);
          } else {
            setMapZoom(11);
          }
          
          console.log("MapView: Map center calculated:", { lat: avgLat, lng: avgLng });
        } else {
          console.warn("MapView: Invalid center calculated, using default");
        }
      } catch (error) {
        console.error("MapView: Error calculating map center:", error);
      }
    }
  }, [validCoordinates, isOpen, isModalReady]);

  // Handle Google Maps load
  const handleGoogleMapsLoad = useCallback(() => {
    console.log("MapView: Google Maps loaded successfully!");
    setGoogleMapsLoaded(true);
  }, []);

  // Handle Google Maps error
  const handleGoogleMapsError = useCallback((error) => {
    console.error("MapView: Google Maps loading error:", error);
    setGoogleMapsLoaded(false);
  }, []);

  // Handle map load
  const onMapLoad = useCallback((map) => {
    setMapInstance(map);
    console.log("MapView: Map instance loaded");
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback((coordinate) => {
    setSelectedProperty(coordinate);
    console.log("MapView: Marker clicked:", coordinate);
  }, []);

  // Handle info window close
  const handleInfoWindowClose = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  // Handle property click in info window
  const handlePropertyClick = useCallback((property) => {
    console.log('MapView: Navigate to property:', property);
    // You can implement navigation to property details here
    // Example: navigate(`/single-property/?id=${property.id}&type=${property.listingType}`);
  }, []);

  // Close modal handler with proper cleanup
  const handleCloseModal = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setSelectedProperty(null);
      setIsModalReady(false);
      onClose();
    }
  }, [onClose]);

  // Handle close button click
  const handleCloseButtonClick = useCallback(() => {
    setSelectedProperty(null);
    setIsModalReady(false);
    onClose();
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setSelectedProperty(null);
        setIsModalReady(false);
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Memoize marker icon to prevent recreation
  const markerIcon = useMemo(() => {
    if (typeof window === 'undefined' || !window.google) return null;
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15s15-6.716 15-15C30 6.716 23.284 0 15 0z" fill="#007bff"/>
          <circle cx="15" cy="15" r="6" fill="white"/>
          <path d="M15 30l-6-9h12l-6 9z" fill="#007bff"/>
        </svg>
      `),
      scaledSize: window.google ? new window.google.maps.Size(30, 40) : { width: 30, height: 40 },
      anchor: window.google ? new window.google.maps.Point(15, 40) : { x: 15, y: 40 }
    };
  }, [googleMapsLoaded]);

  // Format price
  const formatPrice = useCallback((price, currency = 'AED') => {
    if (!price || isNaN(price)) return 'Price on request';
    const numericPrice = parseFloat(price);
    return `${currency} ${numericPrice.toLocaleString()}`;
  }, []);

  // Memoize map container style
  const mapContainerStyle = useMemo(() => ({
    width: '100%',
    height: '100%'
  }), []);

  // Memoize map options
  const mapOptions = useMemo(() => ({
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    mapTypeId: 'roadmap',
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  }), []);

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div className="property-map-modal-overlay" onClick={handleCloseModal}>
      <div className="property-map-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="property-map-modal-header">
          <div className="modal-title">
            <h2>Properties Map View</h2>
            <p>{validCoordinates.length} {validCoordinates.length === 1 ? 'property' : 'properties'} found</p>
            {propertyCoordinates?.length > validCoordinates.length && (
              <p style={{ color: '#666', fontSize: '12px' }}>
                ({propertyCoordinates.length - validCoordinates.length} properties without location data)
              </p>
            )}
          </div>
          <button 
            className="modal-close-btn"
            onClick={handleCloseButtonClick}
            aria-label="Close map"
          >
            ×
          </button>
        </div>

        {/* Map Content */}
        <div className="property-map-modal-content">
          {!isModalReady ? (
            <div className="map-loading">
              <div className="loading-spinner"></div>
              <p>Preparing map...</p>
            </div>
          ) : validCoordinates.length === 0 ? (
            <div className="no-properties-message">
              <h3>No Properties with Location Data</h3>
              <p>
                {propertyCoordinates?.length > 0 
                  ? `${propertyCoordinates.length} properties found but none have valid coordinates to display on the map.`
                  : "No properties found with valid coordinates to display on the map."
                }
              </p>
            </div>
          ) : (
            <LoadScript
              googleMapsApiKey="AIzaSyBE08qJpTWuwc3ipnEYaD7HGawoe8_Yzog"
              onLoad={handleGoogleMapsLoad}
              onError={handleGoogleMapsError}
              preventGoogleFontsLoading={true}
              loadingElement={
                <div className="map-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading map...</p>
                </div>
              }
              libraries={[]}
            >
              {googleMapsLoaded && (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={mapZoom}
                  onLoad={onMapLoad}
                  options={mapOptions}
                >
                  {/* Property Markers */}
                  {validCoordinates.map((coordinate, index) => {
                    try {
                      return (
                        <Marker
                          key={`${coordinate.id || index}-${coordinate.coordinates.latitude}-${coordinate.coordinates.longitude}`}
                          position={{
                            lat: coordinate.coordinates.latitude,
                            lng: coordinate.coordinates.longitude
                          }}
                          onClick={() => handleMarkerClick(coordinate)}
                          icon={markerIcon}
                          title={coordinate.title || coordinate.id || 'Property'}
                        />
                      );
                    } catch (error) {
                      console.error("MapView: Error rendering marker:", error, coordinate);
                      return null;
                    }
                  })}

                  {/* Info Window for Selected Property */}
                  {selectedProperty && selectedProperty.coordinates && (
                    <InfoWindow
                      position={{
                        lat: selectedProperty.coordinates.latitude,
                        lng: selectedProperty.coordinates.longitude
                      }}
                      onCloseClick={handleInfoWindowClose}
                      options={{
                        pixelOffset: window.google ? new window.google.maps.Size(0, -40) : undefined
                      }}
                    >
                      <div className="property-info-window">
                        <div className="property-info-image">
                          {selectedProperty.image ? (
                            <img
                              src={selectedProperty.image}
                              alt={selectedProperty.title || selectedProperty.id}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="no-image-placeholder">
                              <span>🏠</span>
                            </div>
                          )}
                        </div>
                        <div className="property-info-details">
                          <h4>{selectedProperty.title || selectedProperty.id || 'Property'}</h4>
                          <p className="property-address">📍 {selectedProperty.address || 'Address not available'}</p>
                          <div className="property-specs">
                            <span className="property-type">{selectedProperty.propertyType || 'Property'}</span>
                            {selectedProperty.bedrooms && selectedProperty.bedrooms !== 'N/A' && (
                              <span className="property-bedrooms">🛏️ {selectedProperty.bedrooms} BR</span>
                            )}
                            {selectedProperty.bathrooms && selectedProperty.bathrooms !== 'N/A' && (
                              <span className="property-bathrooms">🚿 {selectedProperty.bathrooms} BA</span>
                            )}
                            {selectedProperty.area && selectedProperty.area !== 'N/A' && (
                              <span className="property-area">📐 {selectedProperty.area} sq ft</span>
                            )}
                          </div>
                          {selectedProperty.price && (
                            <p className="property-price">
                              {formatPrice(selectedProperty.price, selectedProperty.currency)}
                            </p>
                          )}
                          {selectedProperty.agent && (
                            <div className="property-agent">
                              <span>Agent: {selectedProperty.agent.name || 'N/A'}</span>
                            </div>
                          )}
                          <button
                            className="view-property-btn"
                            onClick={() => handlePropertyClick(selectedProperty.fullProperty || selectedProperty)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              )}
            </LoadScript>
          )}
        </div>

        {/* Properties Count Footer */}
        {isModalReady && validCoordinates.length > 0 && (
          <div className="property-map-modal-footer">
            <div className="properties-summary">
              <span className="marker-legend">
                <span className="marker-icon">📍</span>
                {validCoordinates.length} {validCoordinates.length === 1 ? 'Property' : 'Properties'} Shown
              </span>
              <span className="map-instructions">
                Click on markers to view property details
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;