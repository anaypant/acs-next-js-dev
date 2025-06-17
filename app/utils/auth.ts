import { Session, User } from 'next-auth';

/**
 * Handles session cookie management
 * @param session The current session object
 * @returns void
 */
export const handleSessionCookie = (session: Session): void => {
    // First try to get session_id from session.sessionId (set by NextAuth session callback)
    if ((session as any).sessionId) {
        const secure = process.env.NODE_ENV === 'production' ? '; secure' : '';
        const cookieString = `session_id=${(session as any).sessionId}; path=/; samesite=lax${secure}`;
        document.cookie = cookieString;
        return;
    }
    
    // Fallback to session.sessionCookie (legacy approach)
    const sessionCookie = (session as any).sessionCookie;
    if (sessionCookie) {
        // Parse session_id from the cookie string - handle multiple formats
        let match = sessionCookie.match(/session_id=([^;,\s]+)/);
        if (!match) {
            // Try alternative format without quotes
            match = sessionCookie.match(/session_id=([^;]+)/);
        }
        if (match?.[1]) {
            const secure = process.env.NODE_ENV === 'production' ? '; secure' : '';
            const cookieString = `session_id=${match[1]}; path=/; samesite=lax${secure}`;
            document.cookie = cookieString;
        } else {
        }
    }
};

/**
 * Determines the redirect path based on authentication type
 * @param authType The authentication type ('new' | 'existing')
 * @returns string The redirect path
 */
export const getAuthRedirectPath = (authType?: string): string => {
    return authType === 'existing' ? '/dashboard' : '/new-user';
};

/**
 * Handles authentication errors and returns appropriate error message
 * @param error The error object
 * @returns string The error message
 */
export const handleAuthError = (error: any): string => {
    console.error('Authentication Error:', error);
    
    if (error?.status === 401) {
        return 'Incorrect username or password';
    }
    if (error?.status === 404) {
        return 'User does not exist';
    }
    if (error?.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

/**
 * Validates form data for authentication
 * @param formData The form data object
 * @returns { isValid: boolean; error?: string }
 */
export const validateAuthForm = (formData: { email?: string; password?: string }): { isValid: boolean; error?: string } => {
    if (!formData.email || !formData.password) {
        return { isValid: false, error: 'Please fill in all fields' };
    }
    if (!formData.email.includes('@')) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }
    if (formData.password.length < 6) {
        return { isValid: false, error: 'Password must be at least 6 characters long' };
    }
    return { isValid: true };
};

/**
 * Clears all authentication-related data
 * @returns void
 */
export const clearAuthData = (): void => {
    // Clear localStorage items
    localStorage.removeItem('authType');
    localStorage.removeItem('next-auth.session-token');
    
    // Clear sessionStorage items
    sessionStorage.removeItem('next-auth.session-token');
    
    // Clear cookies
    const secure = process.env.NODE_ENV === 'production' ? '; secure' : '';
    document.cookie = `session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax${secure}`;
    document.cookie = `next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax${secure}`;
    document.cookie = `next-auth.callback-url=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax${secure}`;
    document.cookie = `next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax${secure}`;
};

/**
 * Formats user data for authentication
 * @param user The user object
 * @param provider The authentication provider
 * @returns Formatted user data
 */
export const formatUserData = (user: User, provider: string = 'form') => {
    return {
        email: user.email,
        name: user.name,
        provider,
        authType: user.authType || 'existing',
    };
};

/**
 * Sets the authentication type in localStorage
 * @param type The authentication type ('new' | 'existing')
 * @returns void
 */
export const setAuthType = (type: 'new' | 'existing'): void => {
    localStorage.setItem('authType', type);
};

/**
 * Gets the current authentication type from localStorage
 * @returns 'new' | 'existing' | null
 */
export const getAuthType = (): 'new' | 'existing' | null => {
    return localStorage.getItem('authType') as 'new' | 'existing' | null;
};

/**
 * Validates a session object
 * @param session The session object to validate
 * @returns boolean indicating if the session is valid
 */
export const validateSession = (session: any): boolean => {
    if (!session?.user) return false;
    return true;
};

/**
 * Formats session data for client-side use
 * @param session The raw session data
 * @returns Formatted session data
 */
export const formatSession = (session: any) => {
    if (!session?.user) return null;
    
    return {
        user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            provider: session.user.provider,
            authType: session.user.authType,
            accessToken: session.user.accessToken
        }
    };
}; 