// API Client for Xano Backend
// Replace BASE_URL with your actual Xano instance URL
const BASE_URL = 'https://your-xano-instance.xano.io/api:v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error_code?: string;
  message?: string;
  page?: number;
  per_page?: number;
  total?: number;
}

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData: any) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

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

  // Users
  async getUsers(page = 1, per_page = 20) {
    return this.request(`/users?page=${page}&per_page=${per_page}`);
  }
}

export const api = new ApiClient();
export type { ApiResponse };
