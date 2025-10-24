// API Client
// Base URL from the OpenAPI specification
const BASE_URL = 'https://api.corporatesynergysolutions.com/api:6_3szFhR';

// Generic API Response Interface (adjust based on actual API variations if needed)
interface ApiResponse<T = any> {
  // Assuming a common structure; adjust if responses vary significantly
  success?: boolean; // Example common field, may not exist in all responses
  data?: T;
  authToken?: string; // Specific to login/signup
  message?: string; // Common for errors
  error_code?: string;
  // Add other potential top-level fields if they exist across responses
  [key: string]: any; // Allow for other properties not explicitly defined
}

// User structure based on /auth/me response
interface ApiUser {
  id: number;
  eid?: string | null;
  company_id: number;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  phone_number?: string | null;
  // Password shouldn't be returned by /me, omitted here
  is_active: boolean;
  created_at: number; // Assuming timestamp number
  updated_at?: number | null;
  // Add 'role' if it's part of the response, even if not in spec explicitly
  role?: string; 
  // Add 'permissions' if available
  permissions?: string[];
  // Add 'name' temporarily if needed for compatibility before full refactor
  name?: string; 
}


class ApiClient {
  private getAuthHeader(): HeadersInit {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Generic request method
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> { // Return T directly for successful data, throw for errors
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
          ...options.headers,
        },
      });

      // Attempt to parse JSON regardless of status code for error messages
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        // Throw an error with the message from the API or a default
        throw new Error(data.message || `API request failed with status ${response.status}`);
      }

      // For successful requests, return the relevant data part.
      // Adjust based on where the primary data resides (e.g., data.data, data itself)
      // Login/Signup returns authToken at the top level
      if (endpoint.includes('/auth/login') || endpoint.includes('/auth/signup')) {
          return data as T; // Return the whole response containing authToken
      }
      // /auth/me returns the user object directly at the top level according to spec analysis
      if (endpoint.includes('/auth/me')) {
          return data as T;
      }

      // Default assumption for other endpoints (may need adjustment per endpoint)
      return data.data || data as T;

    } catch (error) {
      console.error('API Error:', endpoint, error);
      // Re-throw the error to be caught by the caller
      throw error;
    }
  }

  // Auth endpoints - matching OpenAPI spec

  /**
   * Login and retrieve an authentication token.
   * @param email User's email
   * @param password User's password
   * @returns Promise<{ authToken: string }>
   */
  async login(email: string, password: string): Promise<{ authToken: string }> {
    // Path: /auth/login, Method: POST
    return this.request<{ authToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  /**
   * Signup and retrieve an authentication token.
   * @param signupData Object containing name, email, password
   * @returns Promise<{ authToken: string }>
   */
  async signup(signupData: { name: string, email: string; password: string }): Promise<{ authToken: string }> {
     // Path: /auth/signup, Method: POST
     // Note: API spec uses 'name', ensure this aligns with backend expectation
    return this.request<{ authToken: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
  }

  /**
   * Get the user record belonging to the authentication token.
   * @returns Promise<ApiUser>
   */
  async getMe(): Promise<ApiUser> {
     // Path: /auth/me, Method: GET
    return this.request<ApiUser>('/auth/me');
  }

  // --- Other existing API methods remain below ---

  // Companies
  async getCompanies(page = 1, per_page = 20) {
    return this.request(`/companies?page=${page}&per_page=${per_page}`);
  }

  async getCompany(id: string) {
    return this.request(`/companies/${id}`);
  }

  async createCompany(data: any) {
    return this.request('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Jobs
  async getJobs(page = 1, per_page = 20) {
    return this.request(`/jobs?page=${page}&per_page=${per_page}`);
  }

  async getJob(id: string) {
    return this.request(`/jobs/${id}`);
  }

  async createJob(data: any) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Customers
  async getCustomers(page = 1, per_page = 20) {
    return this.request(`/customers?page=${page}&per_page=${per_page}`);
  }

  async getCustomer(id: string) {
    return this.request(`/customers/${id}`);
  }

  // Calls
  async getCalls(page = 1, per_page = 20) {
    return this.request(`/calls?page=${page}&per_page=${per_page}`);
  }

  // Appointments
  async getAppointments(page = 1, per_page = 20) {
    return this.request(`/appointments?page=${page}&per_page=${per_page}`);
  }

  // Inventory
  async getInventory(page = 1, per_page = 20) {
    return this.request(`/inventory?page=${page}&per_page=${per_page}`);
  }

  // Articles (Knowledge Base)
  async getArticles(page = 1, per_page = 20) {
    return this.request(`/articles?page=${page}&per_page=${per_page}`);
  }

  // Users (example - might need adjustment based on actual API)
  async getUsers(page = 1, per_page = 20) {
    return this.request(`/users?page=${page}&per_page=${per_page}`);
  }
}

// Export the singleton instance
export const api = new ApiClient();
// Export types
export type { ApiResponse, ApiUser };
