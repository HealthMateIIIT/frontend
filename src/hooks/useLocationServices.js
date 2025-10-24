import { useState, useEffect } from 'react';

const HOSPITAL_CACHE_KEY = 'cachedHospitals';
const LOCATION_UPDATE_THRESHOLD = 10000; // 10km in meters
const CACHE_EXPIRY_DAYS = 7; // Cache expires after 7 days

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Convert latitude and longitude from degrees to radians
  const toRad = (value) => (value * Math.PI) / 180;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Convert to meters
  
  return distance;
};

const useLocationServices = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!window.navigator.onLine);
  
  // More reliable online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      console.log('Online status: online');
      setIsOffline(false);
    };
    
    const handleOffline = () => {
      console.log('Online status: offline');
      setIsOffline(true);
    };
    
    // Set initial state
    setIsOffline(!window.navigator.onLine);
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connectivity by making a HEAD request to a reliable endpoint
    const checkConnectivity = async () => {
      try {
        await fetch('https://www.google.com/favicon.ico', { 
          method: 'HEAD',
          cache: 'no-store',
          mode: 'no-cors'
        });
        if (isOffline) {
          console.log('Network connectivity confirmed');
          setIsOffline(false);
        }
      } catch (err) {
        console.log('No network connectivity');
        setIsOffline(true);
      }
    };
    
    // Initial check
    checkConnectivity();
    
    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check if cache is expired
  const isCacheExpired = (cachedData) => {
    if (!cachedData?.timestamp) return true;
    const expiryDate = new Date(cachedData.timestamp);
    expiryDate.setDate(expiryDate.getDate() + CACHE_EXPIRY_DAYS);
    return new Date() > expiryDate;
  };

  // Get cached hospitals with metadata
  const getCachedHospitals = () => {
    const cachedData = localStorage.getItem(HOSPITAL_CACHE_KEY);
    if (!cachedData) return { hospitals: [], lastUpdated: null };
    
    try {
      const parsedData = JSON.parse(cachedData);
      if (isCacheExpired(parsedData)) {
        localStorage.removeItem(HOSPITAL_CACHE_KEY);
        return { hospitals: [], lastUpdated: null };
      }
      return {
        hospitals: parsedData.hospitals || [],
        lastUpdated: parsedData.lastUpdated || parsedData.timestamp || null,
        location: parsedData.location || null
      };
    } catch (e) {
      console.error('Error parsing cached hospitals:', e);
      return { hospitals: [], lastUpdated: null };
    }
  };

  // Cache hospitals
  const cacheHospitals = (hospitalsToCache, userLocation) => {
    try {
      const cacheData = {
        hospitals: hospitalsToCache,
        location: userLocation,
        timestamp: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(HOSPITAL_CACHE_KEY, JSON.stringify(cacheData));
      return cacheData;
    } catch (e) {
      console.error('Error caching hospitals:', e);
      return null;
    }
  };

  // Fetch nearby hospitals using Overpass API
  const fetchNearbyHospitals = async (lat, lon) => {
    if (isOffline) {
      const cached = getCachedHospitals();
      return { ...cached, isCached: true };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if we have recent data for this location
      const cached = getCachedHospitals();
      if (cached.location) {
        const distance = calculateDistance(
          lat, 
          lon, 
          cached.location.lat, 
          cached.location.lon
        );
        
        // If we have recent data for nearby location, use it
        if (distance < 10000 && cached.hospitals?.length > 0) { // 10km radius
          console.log('Using cached hospital data for nearby location');
          return { 
            hospitals: cached.hospitals, 
            lastUpdated: cached.lastUpdated,
            location: cached.location,
            isCached: true 
          };
        }
      }
      
      console.log('Fetching hospitals from Overpass API...');
      const radius = 10000; // 10km in meters
      
      // Overpass API query to get hospitals
      const overpassQuery = `
        [out:json];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lon});
          way["amenity"="hospital"](around:${radius},${lat},${lon});
          relation["amenity"="hospital"](around:${radius},${lat},${lon});
        );
        out body;
        >;
        out skel qt;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: overpassQuery,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the response
      const hospitalsList = [];
      const processedIds = new Set();
      
      // Process nodes (points)
      if (data.elements) {
        data.elements.forEach(element => {
          if (element.type === 'node' && element.tags?.name) {
            const distance = calculateDistance(lat, lon, element.lat, element.lon);
            if (distance <= radius) {
              hospitalsList.push({
                id: element.id,
                name: element.tags.name,
                address: element.tags['addr:street'] || '',
                lat: element.lat,
                lon: element.lon,
                distance: distance
              });
              processedIds.add(element.id);
            }
          }
        });
      }
      
      // Sort by distance and limit to 15 nearest hospitals
      const nearbyHospitals = hospitalsList
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 15);
      
      console.log(`Found ${nearbyHospitals.length} hospitals nearby`);
      
      // Cache the results
      const cacheResult = cacheHospitals(nearbyHospitals, { lat, lon });
      
      return { 
        hospitals: nearbyHospitals,
        lastUpdated: cacheResult?.lastUpdated || new Date().toISOString(),
        location: { lat, lon },
        isCached: false
      };
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setError('Failed to fetch hospitals. Using cached data if available.');
      return getCachedHospitals();
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we need to update location
  const checkLocationUpdate = async (newLocation) => {
    if (isOffline) {
      console.log('Offline mode: Using cached location data');
      return false;
    }
    
    const cachedData = localStorage.getItem(HOSPITAL_CACHE_KEY);
    if (!cachedData) return true;
    
    try {
      const { location: cachedLocation, timestamp } = JSON.parse(cachedData);
      if (!cachedLocation) return true;
      
      // If cache is older than 1 hour, update
      const cacheAge = Date.now() - new Date(timestamp).getTime();
      if (cacheAge > 60 * 60 * 1000) { // 1 hour in milliseconds
        console.log('Cache is older than 1 hour, updating...');
        return true;
      }
      
      const distance = calculateDistance(
        newLocation.latitude,
        newLocation.longitude,
        cachedLocation.lat,
        cachedLocation.lon
      );
      
      console.log(`Distance from cached location: ${distance.toFixed(0)}m`);
      return distance > LOCATION_UPDATE_THRESHOLD;
    } catch (e) {
      console.error('Error checking location update:', e);
      return true;
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  // Initialize location tracking
  useEffect(() => {
    let isMounted = true;
    let locationInterval;
    
    const initLocation = async () => {
      if (!isMounted) return;
      
      try {
        const position = await getCurrentLocation();
        if (!isMounted) return;
        
        setLocation(position);
        
        // Check if we need to update hospitals
        const shouldUpdate = await checkLocationUpdate(position);
        if (!isMounted) return;
        
        if (shouldUpdate) {
          console.log('Updating hospital data...');
          const nearbyHospitals = await fetchNearbyHospitals(
            position.latitude,
            position.longitude
          );
          if (isMounted) {
            setHospitals(nearbyHospitals);
          }
        } else {
          console.log('Using cached hospital data');
          const cached = getCachedHospitals();
          if (isMounted) {
            setHospitals(cached);
          }
        }
      } catch (error) {
        console.error('Error initializing location:', error);
        if (isMounted) {
          setError('Unable to retrieve your location. Please enable location services.');
          // Try to use cached data if available
          const cached = getCachedHospitals();
          setHospitals(cached);
        }
      }
    };
    
    // Initial location setup
    initLocation();
    
    // Set up periodic location check (every 5 minutes)
    locationInterval = setInterval(() => {
      if (isMounted && !isOffline) {
        console.log('Performing periodic location check...');
        initLocation();
      }
    }, 5 * 60 * 1000);
    
    // Cleanup
    return () => {
      isMounted = false;
      if (locationInterval) clearInterval(locationInterval);
    };
  }, [isOffline]); // Add isOffline as a dependency

  // Manually refresh hospitals
  const refreshHospitals = async () => {
    if (!location) return;
    const nearbyHospitals = await fetchNearbyHospitals(location.latitude, location.longitude);
    setHospitals(nearbyHospitals);
    return nearbyHospitals;
  };

  // Ensure we return the correct structure
  const getHospitalsData = () => {
    if (hospitals && Array.isArray(hospitals)) {
      return {
        hospitals,
        lastUpdated: null,
        location: location || null,
        isCached: false
      };
    }
    return getCachedHospitals();
  };

  return {
    location,
    hospitals: getHospitalsData().hospitals,
    lastUpdated: getHospitalsData().lastUpdated,
    isLoading,
    error,
    isOffline,
    refreshHospitals,
    getCachedHospitals: () => getCachedHospitals(),
  };
};

export default useLocationServices;
