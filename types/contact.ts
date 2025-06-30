/**
 * Contact-related TypeScript interfaces and types
 * Used for contact management throughout the application
 */

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  type: "buyer" | "seller" | "investor" | "other";
  status: "client" | "lead";
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
  status?: "client" | "lead";
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

export interface ContactFormData extends CreateContactData {
  // Additional form-specific fields if needed
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  type?: string;
  status?: string;
  notes?: string;
  budgetRange?: string;
  propertyTypes?: string;
} 