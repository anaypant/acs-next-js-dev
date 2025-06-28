// Last Modified: 2024-12-19 by Assistant
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Building, Briefcase, ArrowRight, ChevronDown, Loader2, Sparkles } from 'lucide-react';

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
  data: ProfileData;
  setData: (data: ProfileData) => void;
  onContinue: () => void;
  onBack: () => void;
  loading: boolean;
}

const Step2Profile: React.FC<Step2ProfileProps> = ({
  data,
  setData,
  onContinue,
  onBack,
  loading,
}) => {
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setData({
      ...data,
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
    setData({
      ...data,
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

  const canProceed = data.bio.trim().length > 0 && 
                    data.location.trim().length > 0 && 
                    data.country.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto px-4 py-10"
    >
      {/* Page Header with ACS Gradient */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {PROFILE_TITLE}
        </h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          {PROFILE_SUBTITLE}
        </p>
      </div>

      {/* Profile Information Section */}
      <section className="mb-10 p-8 rounded-xl bg-card border border-border shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          Profile Information
        </h2>
        <div className="space-y-8">
          {/* Bio */}
          <div>
            <label className="block text-base font-semibold text-foreground mb-1">
              Business Bio <span className="text-status-error">*</span>
            </label>
            <p className="text-sm text-muted-foreground mb-2 font-medium">
              Describe your business, target audience, service area, and what makes you unique. This helps ACS personalize responses to your customers.
            </p>
            <textarea
              className="w-full p-4 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary text-base font-medium placeholder-muted-foreground/70 resize-none transition-all duration-200"
              rows={4}
              value={data.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="e.g., 'I'm a real estate agent specializing in luxury homes in downtown Seattle. I help first-time buyers and investors find their perfect property. My focus is on providing personalized service and market expertise to clients looking for homes in the $500K-$2M range.'"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">{data.bio.length}/500 characters</p>
          </div>

          {/* Location with autocomplete */}
          <div className="relative">
            <label className="block text-base font-semibold text-foreground mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />
              Location/City <span className="text-status-error">*</span>
            </label>
            <p className="text-sm text-muted-foreground mb-2 font-medium">
              Enter your city to help us localize your ACS experience.
            </p>
            <div className="relative">
              <input
                type="text"
                className="w-full p-4 pr-10 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary text-base font-medium placeholder-muted-foreground/70 transition-all duration-200"
                value={data.location}
                onChange={(e) => handleLocationChange(e.target.value)}
                placeholder="Start typing your city name..."
                autoComplete="off"
              />
              {isLoadingLocations && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              )}
            </div>
            {isAddressDropdownOpen && (
              <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-2xl backdrop-blur-sm">
                {addressSuggestions.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    {addressSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.uniqueKey}
                        type="button"
                        className="w-full text-left p-3 hover:bg-muted transition-colors text-foreground border-b border-border last:border-b-0 font-medium"
                        onClick={() => selectAddressSuggestion(suggestion)}
                      >
                        <div className="font-semibold text-base text-foreground">{suggestion.city}</div>
                        <div className="text-sm text-muted-foreground">{suggestion.fullAddress}</div>
                      </button>
                    ))}
                  </div>
                ) : !isLoadingLocations && data.location.length > 2 && (
                  <div className="p-3 text-muted-foreground text-sm font-medium">
                    No locations found. Try a different search term.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* State */}
            <div>
              <label className="block text-base font-semibold text-foreground mb-1">
                State/Province
              </label>
              <select
                className="w-full p-4 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary text-base font-medium appearance-none transition-all duration-200"
                value={data.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              >
                <option value="">Select State</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state} className="bg-card text-foreground">
                    {state}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {/* Country */}
            <div>
              <label className="block text-base font-semibold text-foreground mb-1">
                Country <span className="text-status-error">*</span>
              </label>
              <select
                className="w-full p-4 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary text-base font-medium appearance-none transition-all duration-200"
                value={data.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              >
                <option value="">Select Country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country} className="bg-card text-foreground">
                    {country}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Zipcode */}
          <div>
            <label className="block text-base font-semibold text-foreground mb-1">
              Zip/Postal Code
            </label>
            <input
              type="text"
              className="w-full p-4 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary text-base font-medium placeholder-muted-foreground/70 transition-all duration-200"
              value={data.zipcode}
              onChange={(e) => handleInputChange('zipcode', e.target.value)}
              placeholder="Enter your zip or postal code"
              maxLength={10}
            />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-40 mb-10" />

      {/* Work Information Section */}
      <section className="mb-10 p-8 rounded-xl bg-card border border-border shadow-sm">
        <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Building className="w-6 h-6 text-primary" />
          Work Information <span className="text-base text-muted-foreground font-medium">(Optional)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company */}
          <div>
            <label className="block text-base font-semibold text-foreground mb-1">
              Company
            </label>
            <input
              type="text"
              className="w-full p-4 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary text-base font-medium placeholder-muted-foreground/70 transition-all duration-200"
              value={data.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Your company name"
            />
          </div>
          {/* Job Title */}
          <div>
            <label className="block text-base font-semibold text-foreground mb-1 flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-primary" />
              Job Title
            </label>
            <input
              type="text"
              className="w-full p-4 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary text-base font-medium placeholder-muted-foreground/70 transition-all duration-200"
              value={data.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder="Your job title or role"
            />
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-8 py-4 text-lg font-bold text-primary hover:text-primary/80 transition-colors rounded-xl bg-muted border border-border shadow-sm"
        >
          ← Back
        </motion.button>
        <motion.button
          whileHover={{ scale: canProceed ? 1.07 : 1 }}
          whileTap={{ scale: canProceed ? 0.95 : 1 }}
          onClick={onContinue}
          disabled={!canProceed || loading}
          className={`px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:from-primary-light hover:to-secondary-light transition disabled:opacity-50 disabled:cursor-not-allowed ${canProceed ? 'hover:-translate-y-1' : ''}`}
        >
          {loading ? 'Saving...' : 'Save & Continue →'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Step2Profile; 