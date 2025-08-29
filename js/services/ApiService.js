export class ApiService {
  constructor() {
    this.baseUrl = window.location.origin;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User management
  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: userData
    });
  }

  async getUser(userId) {
    return this.request(`/users/${userId}`);
  }

  async getUserBookings(userId) {
    return this.request(`/users/${userId}/bookings`);
  }

  // Owner management
  async createOwner(ownerData) {
    return this.request('/owners', {
      method: 'POST',
      body: ownerData
    });
  }

  async createOwnerDVA(ownerId) {
    return this.request(`/owners/${ownerId}/dva`, {
      method: 'POST'
    });
  }

  async getOwnerDVA(ownerId) {
    return this.request(`/owners/${ownerId}/dva`);
  }

  async getOwnerBookings(ownerId) {
    return this.request(`/owners/${ownerId}/bookings`);
  }

  // Booking management
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: bookingData
    });
  }

  async getBooking(bookingId) {
    return this.request(`/bookings/${bookingId}`);
  }

  async applyReferralDiscount(userId, bookingId) {
    return this.request('/bookings/apply-discount', {
      method: 'POST',
      body: { userId, bookingId }
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}