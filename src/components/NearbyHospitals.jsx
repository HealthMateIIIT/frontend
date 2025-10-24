import React, { useState, useEffect } from 'react';
import { MapPin, Crosshair, AlertCircle, RefreshCw, Clock } from 'lucide-react';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
  
  return 'Just now';
};

const NearbyHospitals = ({ isOpen, onClose, locationServices }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { hospitals, isLoading, error, isOffline, refreshHospitals, lastUpdated: propsLastUpdated } = locationServices;

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const result = await refreshHospitals();
      if (result?.lastUpdated) {
        setLastUpdated(result.lastUpdated);
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Update lastUpdated when props change
  useEffect(() => {
    if (propsLastUpdated) {
      setLastUpdated(propsLastUpdated);
    }
  }, [propsLastUpdated]);

  const formatDistance = (meters) => {
    if (meters < 100) return `${Math.round(meters)}m away`;
    if (meters < 1000) return `${Math.round(meters / 10) * 10}m away`;
    if (meters < 10000) return `${(meters / 1000).toFixed(1)}km away`;
    return `${Math.round(meters / 1000)}km away`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Nearby Hospitals</h3>
              {lastUpdated && (
                <div className="text-xs text-gray-500 flex items-center mt-1">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Last updated {formatTimeAgo(lastUpdated)}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 ml-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          {isOffline && (
            <div className="bg-yellow-50 text-yellow-700 p-3 rounded-md mb-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Offline Mode</p>
                <p className="text-sm">Showing cached hospital information. Some data might be outdated.</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
              <p>Finding nearby hospitals...</p>
            </div>
          ) : hospitals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Crosshair className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p>No hospitals found nearby.</p>
              <p className="text-sm mt-1">Make sure location services are enabled.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {hospitals.map((hospital, index) => (
                <li key={index} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-full mt-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{hospital.name}</h3>
                      <p className="text-sm text-gray-600">{hospital.address}</p>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span>~{formatDistance(hospital.distance)} away</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="p-3 bg-gray-50 border-t flex justify-between items-center">
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-gray-500">
              {lastUpdated && (
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Last synced: {new Date(lastUpdated).toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || isOffline}
                className="px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-100"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Updating...' : 'Refresh'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyHospitals;
