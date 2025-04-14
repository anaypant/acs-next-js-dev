// types/auth.ts

// Example User type - adjust based on data from Cognito/useAuth hook
export interface User {
    id: string; // e.g., Cognito sub (subject) claim
    email: string | null;
    name?: string | null;
    profileImageUrl?: string | null; // If you store avatar URLs
    // Add other relevant user attributes from Cognito
  }
  
  // You might also define the context shape here
  export interface AuthContextType {
      user: User | null;
      isLoading: boolean;
      login: () => void; // Function to initiate login redirect
      logout: () => Promise<void>; // Function to call logout API endpoint
      // Add other context values if needed (e.g., tokens, specific roles)
  }