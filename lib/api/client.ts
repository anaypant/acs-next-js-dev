import { handleApiError } from './errorHandling';
import type { 
  ApiResponse, 
  RequestOptions, 
  DbSelectParams, 
  DbSelectResponse,
  DbUpdateParams,
  DbUpdateResponse,
  DbDeleteParams,
  DbDeleteResponse,
  ThreadFilters,
  ThreadUpdate,
} from '@/types/api';
import type { Thread, Conversation } from '@/types/conversation';
import type { LCPEmailRequest } from '@/types/lcp';

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}/${endpoint}`;
    const cacheKey = `${options.method || 'GET'}:${url}:${JSON.stringify(options.body)}`;
    
    // Check cache for GET requests
    if (options.method === 'GET' || !options.method) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        credentials: 'include',
      });

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      const hasContent = contentType && contentType.includes('application/json');
      
      let data: any;
      
      if (hasContent) {
        try {
          const responseText = await response.text();
          // Only try to parse JSON if there's actual content
          if (responseText.trim()) {
            data = JSON.parse(responseText);
          } else {
            console.warn(`[ApiClient] Empty response body for ${endpoint}`);
            data = null;
          }
        } catch (jsonError) {
          const responseText = await response.text().catch(() => 'Unable to read response text');
          console.error(`[ApiClient] JSON parsing error for ${endpoint}:`, {
            error: jsonError instanceof Error ? jsonError.message : String(jsonError),
            status: response.status,
            statusText: response.statusText,
            url,
            responseLength: responseText?.length || 0,
            responsePreview: responseText?.substring(0, 200) || 'No content'
          });
          data = null;
        }
      } else {
        console.warn(`[ApiClient] Non-JSON response for ${endpoint}:`, {
          contentType,
          status: response.status,
          statusText: response.statusText
        });
        data = null;
      }
      
      if (!response.ok) {
        throw handleApiError({ status: response.status, data });
      }

      const result: ApiResponse<T> = {
        success: true,
        data,
        status: response.status,
      };

      // Cache successful GET requests
      if (options.method === 'GET' || !options.method) {
        this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      }

      return result;
    } catch (error) {
      // More robust error logging
      const errorInfo = {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
        url,
        endpoint,
        method: options.method || 'GET'
      };
      
      console.error(`[ApiClient] Request error for ${endpoint}:`, errorInfo);
      
      const appError = handleApiError(error);
      return {
        success: false,
        error: appError.message,
        status: appError.status || 500,
      };
    }
  }

  // Database operations
  async dbSelect(params: DbSelectParams): Promise<ApiResponse<DbSelectResponse>> {
    return this.request('db/select', { method: 'POST', body: params });
  }

  async dbUpdate(params: DbUpdateParams): Promise<ApiResponse<DbUpdateResponse>> {
    return this.request('db/update', { method: 'POST', body: params });
  }

  async dbDelete(params: DbDeleteParams): Promise<ApiResponse<DbDeleteResponse>> {
    return this.request('db/delete', { method: 'POST', body: params });
  }

  // LCP operations
  async getThreads(filters?: ThreadFilters): Promise<ApiResponse<{ data: any[] }>> {
    // Ensure we always send a proper request body, even if filters is undefined
    const requestBody = filters || {};
    return this.request('lcp/get_all_threads', { method: 'POST', body: requestBody });
  }

  async getThreadById(conversationId: string): Promise<ApiResponse<Thread>> {
    return this.request(`lcp/getThreadById`, { method: 'POST', body: { conversationId } });
  }

  async updateThread(conversationId: string, updates: ThreadUpdate): Promise<ApiResponse<Thread>> {
    return this.request('lcp/update_thread', { method: 'POST', body: { conversationId, updates } });
  }

  async deleteThread(conversationId: string): Promise<ApiResponse<void>> {
    return this.request('lcp/delete_thread', { method: 'POST', body: { conversationId } });
  }

  async markNotSpam(conversationId: string): Promise<ApiResponse<void>> {
    return this.request('lcp/mark_not_spam', { method: 'POST', body: { conversationId } });
  }

  async sendEmail(emailRequest: LCPEmailRequest): Promise<ApiResponse<void>> {
    return this.request('lcp/send_email', { method: 'POST', body: emailRequest });
  }

  async getLLMResponse(request: any): Promise<ApiResponse<any>> {
    return this.request('lcp/get_llm_response', { method: 'POST', body: request });
  }

  // Authentication operations
  async login(credentials: { email: string; password: string; provider?: string; name?: string }): Promise<ApiResponse<any>> {
    return this.request('api/auth/login', { method: 'POST', body: credentials });
  }

  async signup(userData: any): Promise<ApiResponse<any>> {
    return this.request('api/auth/signup', { method: 'POST', body: userData });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request('auth/logout', { method: 'POST' });
  }

  // Contact operations
  async submitContact(formData: any): Promise<ApiResponse<void>> {
    return this.request('contact', { method: 'POST', body: formData });
  }

  // Usage statistics
  async getUsageStats(): Promise<ApiResponse<any>> {
    return this.request('usage/stats', { method: 'GET' });
  }

  // Domain verification
  async verifyDomain(domain: string): Promise<ApiResponse<any>> {
    return this.request('domain/verify-identity', { method: 'POST', body: { domain } });
  }

  async verifyDKIM(domain: string): Promise<ApiResponse<any>> {
    return this.request('domain/verify-dkim', { method: 'POST', body: { domain } });
  }

  async verifyEmailValidity(uid: string, email: string): Promise<ApiResponse<any>> {
    return this.request('domain/verify-email-validity', { method: 'POST', body: { uid, newEmail: email } });
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Clear specific cache entry
  clearCacheEntry(pattern: string): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((value, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Set authentication token
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authentication token
  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Server-side API client for NextAuth callbacks
export class ServerApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    // For server-side calls, we need to use the full URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL_DEV || 'http://localhost:3000';
    this.baseURL = host.replace(/\/$/, ''); // Remove trailing slash
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}/${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      const hasContent = contentType && contentType.includes('application/json');
      
      let data: any;
      
      if (hasContent) {
        try {
          const responseText = await response.text();
          // Only try to parse JSON if there's actual content
          if (responseText.trim()) {
            data = JSON.parse(responseText);
          } else {
            data = null;
          }
        } catch (jsonError) {
          const responseText = await response.text().catch(() => 'Unable to read response text');
          console.error(`[ServerApiClient] JSON parsing error for ${endpoint}:`, {
            error: jsonError instanceof Error ? jsonError.message : String(jsonError),
            status: response.status,
            statusText: response.statusText,
            url,
            responseLength: responseText?.length || 0,
            responsePreview: responseText?.substring(0, 200) || 'No content'
          });
          data = null;
        }
      } else {
        console.warn(`[ServerApiClient] Non-JSON response for ${endpoint}:`, {
          contentType,
          status: response.status,
          statusText: response.statusText
        });
        data = null;
      }
      
      if (!response.ok) {
        throw handleApiError({ status: response.status, data });
      }

      const result: ApiResponse<T> = {
        success: true,
        data,
        status: response.status,
      };

      return result;
    } catch (error) {
      // More robust error logging
      const errorInfo = {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
        url,
        endpoint,
        method: options.method || 'GET'
      };
      
      console.error(`[ServerApiClient] Request error for ${endpoint}:`, errorInfo);
      
      const appError = handleApiError(error);
      return {
        success: false,
        error: appError.message,
        status: appError.status || 500,
      };
    }
  }

  // Authentication operations
  async login(credentials: { email: string; password: string; provider?: string; name?: string }): Promise<ApiResponse<any>> {
    return this.request('api/auth/login', { method: 'POST', body: credentials });
  }

  async signup(userData: any): Promise<ApiResponse<any>> {
    return this.request('api/auth/signup', { method: 'POST', body: userData });
  }
}

// Server-side singleton instance
export const serverApiClient = new ServerApiClient(); 