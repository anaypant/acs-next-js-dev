"use client"

import { X, AlertTriangle, Loader2, User2, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useContactForm } from "@/hooks/useContact"
import { useLocation } from "@/hooks/useLocation"
import type { Contact, CreateContactData } from "@/types/contact"
import type { LocationSuggestion } from "@/types/location"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from 'react-hot-toast'

interface ContactEditProfileCardProps {
  contact?: Contact | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (contactData: CreateContactData) => Promise<void>
  onDelete?: (contactId: string) => Promise<void>
}

export function ContactEditProfileCard({ 
  contact, 
  isOpen, 
  onClose, 
  onSubmit,
  onDelete
}: ContactEditProfileCardProps) {
  const { data: session } = useSession()
  const [locationError, setLocationError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Use location autocomplete hook
  const {
    isDropdownOpen: isLocationDropdownOpen,
    suggestions: locationSuggestions,
    isLoading: isLocationLoading,
    handleLocationChange,
    selectLocation,
    closeDropdown: closeLocationDropdown
  } = useLocation()

  // Use enhanced contact form hook
  const { 
    formData, 
    errors, 
    isSubmitting,
    updateField, 
    validateForm, 
    validateField,
    resetForm, 
    setSubmitting,
  } = useContactForm()

  // Pre-fill form when editing or reset when adding new
  useEffect(() => {
    if (isOpen) {
      if (contact) {
        Object.entries(contact).forEach(([key, value]) => {
          if (key in formData) {
            updateField(key as keyof CreateContactData, value || '')
          }
        })
      } else {
        resetForm();
      }
    }
    // eslint-disable-next-line
  }, [contact, isOpen]);

  // Update the location selection to validate and show errors
  const selectLocationSuggestion = (suggestion: LocationSuggestion) => {
    selectLocation(suggestion, (locationData) => {
      // Only set location if it has city, state, and country
      if (suggestion.city && suggestion.state && suggestion.country) {
        updateField('location', suggestion.fullAddress);
        setLocationError(null); // Clear error
      } else {
        // Show error if incomplete
        setLocationError('Please select a complete location with city, state, and country');
      }
    });
  };

  // Update location input change to validate
  const handleLocationInputChange = (value: string) => {
    handleLocationChange(value, (locationValue) => {
      updateField('location', locationValue);
      
      // Validate location on input change
      if (locationValue) {
        const parts = locationValue.split(',').map(part => part.trim());
        if (parts.length < 3) {
          setLocationError('Please select a complete location (city, state, country)');
        } else {
          setLocationError(null);
        }
      } else {
        setLocationError(null);
      }
    });
  };

  // Add location validation to the form
  const validateLocation = (location: string | undefined) => {
    if (!location || location.length < 3) return 'Please select a complete location (city, state, country)';
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add location validation
    const locationError = validateLocation(formData.location);
    if (locationError) {
      toast.error(locationError, {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim() || '',
        location: formData.location?.trim() || '',
        type: formData.type,
        status: formData.status,
        budgetRange: formData.budgetRange?.trim() || '',
        propertyTypes: formData.propertyTypes?.trim() || '',
        notes: formData.notes?.trim() || '',
        lastContact: new Date().toISOString(),
        conversationCount: contact?.conversationCount || 0,
        createdAt: contact?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        associated_account: session?.user?.email || ''
      };

      await onSubmit(contactData);
      
      // Close modal and reset form
      onClose();
      resetForm();
      closeLocationDropdown();
      setLocationError(null);
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    resetForm();
    closeLocationDropdown();
    setLocationError(null);
  };

  // Handle delete contact
  const handleDelete = async () => {
    if (contact && onDelete) {
      try {
        await onDelete(contact.id);
        setShowDeleteModal(false);
        onClose();
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast.error('Failed to delete contact', {
          duration: 3000,
          position: 'top-right',
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {contact ? 'Edit Contact' : 'Add New Contact'}
              </h2>
              <div className="flex items-center gap-2">
                {contact && onDelete && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Delete contact"
                  >
                    <Trash2 className="w-5 h-5 text-status-error" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name <span className="text-status-error">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Full name"
                  className={cn(errors.name && "border-status-error focus:ring-status-error")}
                />
                {errors.name && (
                  <p className="text-xs text-status-error mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email <span className="text-status-error">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value.toLowerCase())}
                  placeholder="email@example.com"
                  className={cn(errors.email && "border-status-error focus:ring-status-error")}
                />
                {errors.email && (
                  <p className="text-xs text-status-error mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(123) 456-7890"
                  className={cn(errors.phone && "border-status-error focus:ring-status-error")}
                />
                {errors.phone && (
                  <p className="text-xs text-status-error mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleLocationInputChange(e.target.value)}
                    placeholder="Start typing city name..."
                    autoComplete="off"
                    className={cn(
                      "transition-all duration-200",
                      locationError 
                        ? "border-status-error focus:ring-status-error focus:border-status-error" 
                        : "border-border focus:ring-primary focus:border-primary"
                    )}
                  />
                  {isLocationLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    </div>
                  )}
                </div>
                {locationError && (
                  <p className="text-xs text-status-error mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {locationError}
                  </p>
                )}
                {isLocationDropdownOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-2xl backdrop-blur-sm">
                    {locationSuggestions.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto scrollbar-hide">
                        {locationSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.uniqueKey}
                            type="button"
                            className="w-full text-left p-3 hover:bg-muted transition-colors text-foreground border-b border-border last:border-b-0 font-medium"
                            onClick={() => selectLocationSuggestion(suggestion)}
                          >
                            <div className="font-semibold text-sm text-foreground">{suggestion.city}</div>
                            <div className="text-xs text-muted-foreground">{suggestion.fullAddress}</div>
                          </button>
                        ))}
                      </div>
                    ) : !isLocationLoading && formData.location && formData.location.length > 2 && (
                      <div className="p-3 text-muted-foreground text-xs font-medium">
                        No locations found. Try a different search term.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Type and Status in a row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type dropdown */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-card-foreground mb-2">
                  Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => updateField('type', e.target.value as any)}
                  className="w-full px-4 py-3 rounded-lg border border-border transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary text-card-foreground bg-background"
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="investor">Investor</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Updated Status dropdown */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-card-foreground mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value as any)}
                  className="w-full px-4 py-3 rounded-lg border border-border transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary text-card-foreground bg-background"
                >
                  <option value="lead">Lead</option>
                  <option value="client">Client</option>
                </select>
              </div>
            </div>

            {/* Budget Range and Property Types Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Budget Range
                </label>
                <Input
                  type="text"
                  value={formData.budgetRange}
                  onChange={(e) => updateField('budgetRange', e.target.value)}
                  placeholder="e.g., 300k-500k, 1M, 500,000"
                  className={cn(errors.budgetRange && "border-status-error focus:ring-status-error")}
                />
                {errors.budgetRange && (
                  <p className="text-xs text-status-error mt-1">{errors.budgetRange}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Property Types
                </label>
                <Input
                  type="text"
                  value={formData.propertyTypes}
                  onChange={(e) => updateField('propertyTypes', e.target.value)}
                  placeholder="e.g., Condo, Townhouse, Single Family"
                  className={cn(errors.propertyTypes && "border-status-error focus:ring-status-error")}
                />
                {errors.propertyTypes && (
                  <p className="text-xs text-status-error mt-1">{errors.propertyTypes}</p>
                )}
              </div>
            </div>

            {/* Notes with character counter */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-card-foreground mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                onBlur={() => validateField('notes')}
                rows={3}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                  "focus:ring-2 focus:ring-primary focus:border-primary",
                  "text-card-foreground bg-background resize-none",
                  errors.notes 
                    ? "border-status-error focus:border-status-error focus:ring-status-error/20" 
                    : "border-border"
                )}
                placeholder="Add notes about this contact..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.notes && (
                  <p className="text-sm text-status-error flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.notes}
                  </p>
                )}
                <p className={cn(
                  "text-xs ml-auto",
                  formData.notes && formData.notes.length > 450 ? "text-status-error" : "text-muted-foreground"
                )}>
                  {formData.notes?.length || 0}/500
                </p>
              </div>
            </div>

            {/* Summary error message */}
            {Object.keys(errors).length > 0 && (
              <div className="p-3 bg-status-error/10 border border-status-error/20 rounded-lg">
                <p className="text-sm text-status-error flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Please correct the highlighted fields before submitting.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-border rounded-lg text-card-foreground hover:bg-muted transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || Object.keys(errors).length > 0}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                  isSubmitting || Object.keys(errors).length > 0
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-gradient-to-r from-midnight-700 to-midnight-600 text-white hover:from-midnight-600 hover:to-midnight-700"
                )}
              >
                {isSubmitting ? 'Saving...' : (contact ? 'Update Contact' : 'Create Contact')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && contact && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-status-error/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-status-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">Delete Contact</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-background-muted rounded-lg">
                <p className="text-card-foreground font-medium">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg text-card-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-status-error text-white rounded-lg hover:bg-status-error/90 transition-colors font-medium"
                >
                  Delete Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 