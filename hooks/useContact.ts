import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api/client';
import { handleApiError } from '@/lib/api/errorHandling';
import { v4 as uuidv4 } from 'uuid';
import type { ApiResponse } from '@/types/api';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  type: "buyer" | "seller" | "investor" | "other";
  status: "active" | "inactive" | "completed";
  lastContact: string;
  notes?: string;
  conversationCount: number;
  budgetRange?: string;
  propertyTypes?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isManual?: boolean; // Flag to distinguish manual contacts
}

export interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  type: "buyer" | "seller" | "investor" | "other";
  status?: "active" | "inactive" | "completed";
  notes?: string;
  budgetRange?: string;
  propertyTypes?: string;
}

export interface UpdateContactData extends Partial<CreateContactData> {
  id: string;
}

export interface UseContactOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useContact(options: UseContactOptions = {}) {
  const { data: session } = useSession();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch contacts from database
  const fetchContacts = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      setError(null);

      console.log('[useContact] Fetching contacts for user:', (session.user as any).id);

      // Query with associated_account-index and associated_account
      const response = await apiClient.dbSelect({
        table_name: 'ManualContacts',
        index_name: 'associated_account-index',
        key_name: 'associated_account',
        key_value: (session.user as any).id
      });

      console.log('[useContact] Query with associated_account-index:', response);
      console.log('[useContact] Raw contacts from database:', response.data?.items);
      console.log('[useContact] === MANUAL CONTACTS TABLE CONTENTS ===');
      console.log('[useContact] Total contacts found:', response.data?.items?.length || 0);
      if (response.data?.items && response.data.items.length > 0) {
        response.data.items.forEach((contact: any, index: number) => {
          console.log(`[useContact] Contact ${index + 1}:`, {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            'account-id': contact['account-id'],
            associated_account: contact.associated_account,
            allFields: Object.keys(contact),
            fullContact: contact
          });
        });
      } else {
        console.log('[useContact] No contacts found in ManualContacts table');
      }
      console.log('[useContact] === END MANUAL CONTACTS TABLE CONTENTS ===');

      if (response.success && response.data?.items) {
        // Transform database format to frontend format
        const transformedContacts: Contact[] = response.data.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          location: item.location,
          type: item.type,
          status: item.status,
          lastContact: item.last_contact || item.lastContact,
          notes: item.notes,
          conversationCount: item.conversation_count || item.conversationCount || 0,
          budgetRange: item.budget_range || item.budgetRange,
          propertyTypes: item.property_types || item.propertyTypes,
          createdAt: item.created_at || item.createdAt,
          updatedAt: item.updated_at || item.updatedAt,
          userId: item.associated_account,
          isManual: true,
        }));
        
        console.log('[useContact] Transformed contacts:', transformedContacts);
        setContacts(transformedContacts);
      } else {
        console.error('[useContact] Database query failed:', response);
        throw handleApiError(response);
      }
    } catch (err) {
      console.error('[useContact] Error fetching contacts:', err);
      const appError = handleApiError(err);
      setError(appError.message);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  // Load contacts on mount (only on client side)
  useEffect(() => {
    if (session?.user?.email && typeof window !== 'undefined') {
      fetchContacts();
    }
  }, [session?.user?.email, fetchContacts]);

  // Create a new contact
  const createContact = useCallback(async (contactData: CreateContactData): Promise<ApiResponse<Contact>> => {
    if (!session?.user?.email) {
      return {
        success: false,
        error: 'No user session',
        status: 401
      };
    }
    
    const newContact: Contact = {
      id: uuidv4(),
      ...contactData,
      status: contactData.status || 'active',
      lastContact: new Date().toISOString(),
      conversationCount: 0,
      userId: (session.user as any).id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      console.log('[useContact] Creating contact with data:', newContact);
      
      const response = await apiClient.dbUpdate({
        table_name: 'ManualContacts',
        index_name: 'id-index',
        key_name: 'id',
        key_value: newContact.id,
        update_data: {
          id: newContact.id,
          name: newContact.name,
          email: newContact.email,
          phone: newContact.phone || '',
          location: newContact.location || '',
          type: newContact.type,
          status: newContact.status,
          lastContact: newContact.lastContact,
          notes: newContact.notes || '',
          conversationCount: newContact.conversationCount,
          budgetRange: newContact.budgetRange || '',
          propertyTypes: newContact.propertyTypes || '',
          createdAt: newContact.createdAt,
          updatedAt: newContact.updatedAt,
          associated_account: (session.user as any).id
        }
      });
      
      console.log('[useContact] Update response:', response);
      
      if (response.success) {
        setContacts(prev => [...prev, newContact]);
        return {
          success: true,
          data: newContact,
          status: 200
        };
      } else {
        console.error('[useContact] Update failed:', response);
        return {
          success: false,
          error: response.error || 'Failed to create contact',
          status: response.status || 500
        };
      }
    } catch (error) {
      console.error('[useContact] Error creating contact:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500
      };
    }
  }, [session?.user?.email]);

  // Update an existing contact
  const updateContact = useCallback(async (contactData: UpdateContactData): Promise<ApiResponse<Contact>> => {
    if (!session?.user?.email) {
      return {
        success: false,
        error: 'No user session',
        status: 401
      };
    }
    
    // Find the existing contact to merge with updates
    const existingContact = contacts.find(c => c.id === contactData.id);
    if (!existingContact) {
      return {
        success: false,
        error: 'Contact not found',
        status: 404
      };
    }
    
    const updatedContact: Contact = {
      ...existingContact,
      ...contactData,
      updatedAt: new Date().toISOString()
    };
    
    try {
      console.log('[useContact] Updating contact with data:', updatedContact);
      
      const response = await apiClient.dbUpdate({
        table_name: 'ManualContacts',
        index_name: 'id-index',
        key_name: 'id',
        key_value: contactData.id,
        update_data: {
          id: updatedContact.id,
          name: updatedContact.name,
          email: updatedContact.email,
          phone: updatedContact.phone || '',
          location: updatedContact.location || '',
          type: updatedContact.type,
          status: updatedContact.status,
          lastContact: updatedContact.lastContact,
          notes: updatedContact.notes || '',
          conversationCount: updatedContact.conversationCount,
          budgetRange: updatedContact.budgetRange || '',
          propertyTypes: updatedContact.propertyTypes || '',
          createdAt: updatedContact.createdAt,
          updatedAt: updatedContact.updatedAt,
          associated_account: (session.user as any).id
        }
      });
      
      console.log('[useContact] Update response:', response);
      
      if (response.success) {
        setContacts(prev => prev.map(contact => 
          contact.id === contactData.id ? updatedContact : contact
        ));
        return {
          success: true,
          data: updatedContact,
          status: 200
        };
      } else {
        console.error('[useContact] Update failed:', response);
        return {
          success: false,
          error: response.error || 'Failed to update contact',
          status: response.status || 500
        };
      }
    } catch (error) {
      console.error('[useContact] Error updating contact:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500
      };
    }
  }, [session?.user?.email, contacts]);

  // Delete a contact
  const deleteContact = useCallback(async (contactId: string): Promise<ApiResponse<boolean>> => {
    if (!session?.user?.email) {
      return {
        success: false,
        error: 'No user session',
        status: 401
      };
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('[useContact] Deleting contact:', contactId);
      
      // Query all contacts in the ManualContacts table
      const allContactsResponse = await apiClient.dbSelect({
        table_name: 'ManualContacts',
        index_name: 'associated_account-index',
        key_name: 'associated_account',
        key_value: (session.user as any).id
      });
      
      console.log('[useContact] All contacts in ManualContacts table:', allContactsResponse);
      
      const response = await apiClient.dbDelete({
        table_name: 'ManualContacts',
        attribute_name: 'id',
        attribute_value: contactId,
        is_primary_key: true
      });
      
      console.log('[useContact] Delete response:', response);
      
      if (response.success) {
        setContacts(prev => prev.filter(contact => contact.id !== contactId));
        return {
          success: true,
          data: true,
          status: 200
        };
      } else {
        console.error('[useContact] Delete failed:', response);
        return {
          success: false,
          error: response.error || 'Failed to delete contact',
          status: response.status || 500
        };
      }
    } catch (error) {
      console.error('[useContact] Error deleting contact:', error);
      const appError = handleApiError(error);
      setError(appError.message);
      return {
        success: false,
        error: appError.message,
        status: 500
      };
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  // Get a single contact by ID
  const getContact = useCallback((contactId: string): Contact | undefined => {
    return contacts.find(contact => contact.id === contactId);
  }, [contacts]);

  // Search contacts
  const searchContacts = useCallback((searchTerm: string, filters?: {
    type?: string;
    status?: string;
  }): Contact[] => {
    return contacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.phone && contact.phone.includes(searchTerm)) ||
        (contact.location && contact.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = !filters?.type || filters.type === 'all' || contact.type === filters.type;
      const matchesStatus = !filters?.status || filters.status === 'all' || contact.status === filters.status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [contacts]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh contacts
  const refreshContacts = useCallback(async () => {
    await fetchContacts();
    return { success: true, contacts };
  }, [fetchContacts, contacts]);

  return {
    // State
    contacts,
    loading,
    error,
    
    // Actions
    createContact,
    updateContact,
    deleteContact,
    getContact,
    searchContacts,
    clearError,
    refreshContacts,
    fetchContacts,
  };
}

// Hook for managing a single contact
export function useSingleContact(contactId: string) {
  const { getContact, updateContact, deleteContact } = useContact();
  const contact = getContact(contactId);

  const update = useCallback(async (data: Omit<UpdateContactData, 'id'>) => {
    return await updateContact({ ...data, id: contactId });
  }, [updateContact, contactId]);

  const remove = useCallback(async () => {
    return await deleteContact(contactId);
  }, [deleteContact, contactId]);

  return {
    contact,
    update,
    remove,
  };
}

// Hook for contact form management
export function useContactForm() {
  const [formData, setFormData] = useState<CreateContactData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    type: 'other',
    status: 'active',
    notes: '',
    budgetRange: '',
    propertyTypes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateContactData, string>>>({});

  const updateField = useCallback((field: keyof CreateContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof CreateContactData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      type: 'other',
      status: 'active',
      notes: '',
      budgetRange: '',
      propertyTypes: '',
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm,
  };
} 