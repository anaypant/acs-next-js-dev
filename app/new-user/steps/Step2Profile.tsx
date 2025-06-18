// Last Modified: 2024-12-19 by Assistant
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Building, Briefcase, ArrowRight, ChevronDown, Loader2 } from 'lucide-react';

const PROFILE_TITLE = "Tell Us About Yourself";
const PROFILE_SUBTITLE = "Help us personalize your ACS experience with some basic information.";
const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Spain", "Italy", "Netherlands", "Other"
];
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

interface ProfileData {
  bio: string;
  location: string;
  state: string;
  country: string;
  zipcode: string;
  company: string;
  jobTitle: string;
}

interface LocationSuggestion {
  fullAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  displayName: string;
  uniqueKey: string;
}

interface Step2ProfileProps {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  handleProfileSubmit: () => void;
  loading: boolean;
  setStep: (step: number) => void;
}

const Step2Profile: React.FC<Step2ProfileProps> = ({
  profileData,
  setProfileData,
  handleProfileSubmit,
  loading,
  setStep,
}) => {
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value,
    });
  };

  // Debounced location search function
  const searchLocations = useCallback(async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setIsAddressDropdownOpen(false);
      return;
    }

    setIsLoadingLocations(true);
    
    try {
      // Use OpenStreetMap Nominatim API for geocoding (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=8&` +
        `countrycodes=us,ca,gb,au,de,fr,es,it,nl&` +
        `featuretype=city`,
        {
          headers: {
            'User-Agent': 'ACS-NextJS-App/1.0 (support@automatedconsultancy.com)'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Process and deduplicate results
        const processedSuggestions: LocationSuggestion[] = [];
        const seenCities = new Set<string>();
        
        data.forEach((item: any) => {
          if (!item.address) return;
          
          const address = item.address;
          const city = address.city || address.town || address.village || address.hamlet || '';
          const state = address.state || address.region || address.province || '';
          const country = address.country || '';
          const postcode = address.postcode || address.postal_code || '';
          
          // Skip if no city name
          if (!city) return;
          
          // Map country names to our dropdown values
          let mappedCountry = country;
          switch (country) {
            case 'United States of America':
            case 'United States':
              mappedCountry = 'United States';
              break;
            case 'United Kingdom':
            case 'England':
            case 'Scotland':
            case 'Wales':
            case 'Northern Ireland':
              mappedCountry = 'United Kingdom';
              break;
            case 'Deutschland':
              mappedCountry = 'Germany';
              break;
            case 'España':
              mappedCountry = 'Spain';
              break;
            case 'France':
            case 'République française':
              mappedCountry = 'France';
              break;
            default:
              if (!COUNTRIES.includes(country)) {
                mappedCountry = 'Other';
              }
              break;
          }
          
          // Create unique key for deduplication
          const uniqueKey = `${city.toLowerCase()}-${state.toLowerCase()}-${mappedCountry.toLowerCase()}`;
          
          // Skip duplicates
          if (seenCities.has(uniqueKey)) return;
          seenCities.add(uniqueKey);
          
          const suggestion: LocationSuggestion = {
            fullAddress: `${city}${state ? ', ' + state : ''}${mappedCountry ? ', ' + mappedCountry : ''}`,
            city: city.trim(),
            state: state.trim(),
            country: mappedCountry.trim(),
            zipCode: postcode.trim(),
            displayName: item.display_name,
            uniqueKey
          };
          
          processedSuggestions.push(suggestion);
        });
        
        // Sort by relevance (shorter display names first, then alphabetically)
        processedSuggestions.sort((a, b) => {
          const aRelevance = a.city.toLowerCase().indexOf(query.toLowerCase());
          const bRelevance = b.city.toLowerCase().indexOf(query.toLowerCase());
          
          if (aRelevance !== bRelevance) {
            return aRelevance - bRelevance;
          }
          
          return a.fullAddress.localeCompare(b.fullAddress);
        });
        
        // Limit to 5 most relevant results
        const limitedSuggestions = processedSuggestions.slice(0, 5);
        
        setAddressSuggestions(limitedSuggestions);
        setIsAddressDropdownOpen(limitedSuggestions.length > 0);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      // Show error state but don't break the UI
      setAddressSuggestions([]);
      setIsAddressDropdownOpen(false);
    } finally {
      setIsLoadingLocations(false);
    }
  }, []);

  const handleLocationChange = (value: string) => {
    handleInputChange('location', value);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search (500ms delay)
    const newTimeout = setTimeout(() => {
      searchLocations(value);
    }, 500);
    
    setSearchTimeout(newTimeout);
    
    // If input is cleared, close dropdown immediately
    if (value.length === 0) {
      setAddressSuggestions([]);
      setIsAddressDropdownOpen(false);
      setIsLoadingLocations(false);
    }
  };

  const selectAddressSuggestion = (suggestion: LocationSuggestion) => {
    setProfileData({
      ...profileData,
      location: suggestion.city,
      state: suggestion.state,
      country: suggestion.country,
      zipcode: suggestion.zipCode,
    });
    setIsAddressDropdownOpen(false);
    setAddressSuggestions([]);
    setIsLoadingLocations(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const canProceed = profileData.bio.trim().length > 0 && 
                    profileData.location.trim().length > 0 && 
                    profileData.country.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          {PROFILE_TITLE}
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          {PROFILE_SUBTITLE}
        </p>
      </div>

      <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-semibold">Profile Information</h2>
        </div>

        <div className="space-y-6">
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Business Bio <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Describe your business, target audience, service area, and what makes you unique. This helps ACS personalize responses to your customers.
            </p>
            <textarea
              className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 resize-none"
              rows={4}
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="e.g., 'I'm a real estate agent specializing in luxury homes in downtown Seattle. I help first-time buyers and investors find their perfect property. My focus is on providing personalized service and market expertise to clients looking for homes in the $500K-$2M range.'"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-1">{profileData.bio.length}/500 characters</p>
          </div>

          {/* Location with autocomplete */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location/City <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-3 pr-10 rounded-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                value={profileData.location}
                onChange={(e) => handleLocationChange(e.target.value)}
                placeholder="Start typing your city name..."
                autoComplete="off"
              />
              {isLoadingLocations && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                </div>
              )}
            </div>
            
            {isAddressDropdownOpen && (
              <div className="absolute z-20 w-full mt-1 bg-black/95 border border-white/20 rounded-lg shadow-2xl backdrop-blur-sm">
                {addressSuggestions.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    {addressSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.uniqueKey}
                        type="button"
                        className="w-full text-left p-3 hover:bg-white/10 transition-colors text-white border-b border-white/5 last:border-b-0"
                        onClick={() => selectAddressSuggestion(suggestion)}
                      >
                        <div className="font-medium">{suggestion.city}</div>
                        <div className="text-sm text-gray-400">{suggestion.fullAddress}</div>
                      </button>
                    ))}
                  </div>
                ) : !isLoadingLocations && profileData.location.length > 2 && (
                  <div className="p-3 text-gray-400 text-sm">
                    No locations found. Try a different search term.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                State/Province
              </label>
              <div className="relative">
                <select
                  className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 appearance-none"
                  value={profileData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                >
                  <option value="">Select State</option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state} className="bg-gray-800">
                      {state}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 appearance-none"
                  value={profileData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country} className="bg-gray-800">
                      {country}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Zipcode */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Zip/Postal Code
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
              value={profileData.zipcode}
              onChange={(e) => handleInputChange('zipcode', e.target.value)}
              placeholder="Enter your zip or postal code"
              maxLength={10}
            />
          </div>

          {/* Optional fields */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-medium text-gray-300 mb-4">
              <Building className="w-5 h-5 inline mr-2" />
              Work Information <span className="text-sm text-gray-400">(Optional)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                  value={profileData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Your company name"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Job Title
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                  value={profileData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder="Your job title or role"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep(1)}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
          >
            Back
          </motion.button>
          
          <motion.button
            whileHover={{ scale: canProceed ? 1.05 : 1 }}
            whileTap={{ scale: canProceed ? 0.95 : 1 }}
            onClick={handleProfileSubmit}
            disabled={!canProceed || loading}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 ${
              canProceed
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                : 'bg-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            {loading ? 'Saving...' : 'Continue'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step2Profile; 