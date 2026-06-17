const API_BASE_URL = 'http://localhost:8080/api/vehicles';

/**
 * Custom error class for API failures.
 * Captures status code and parsed JSON body (e.g. Spring Boot validation error payload).
 */
export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload; // Structured error payload from Spring Boot (e.g., field validation errors)
  }
}

/**
 * Helper to process the response, handling HTTP success/error codes.
 */
async function handleResponse(response) {
  if (response.status === 204) {
    return null; // 204 No Content
  }

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorMessage = data?.message || `HTTP request failed with status ${response.status}`;
    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
}

export const vehicleApi = {
  /**
   * Retrieves all vehicles, or searches them if a query is provided.
   */
  async getVehicles(searchQuery = '') {
    const url = searchQuery 
      ? `${API_BASE_URL}?search=${encodeURIComponent(searchQuery)}`
      : API_BASE_URL;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Retrieves a single vehicle by ID.
   */
  async getVehicle(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse(response);
  },

  /**
   * Creates a new vehicle in the database.
   */
  async createVehicle(vehicleData) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleData),
    });
    return handleResponse(response);
  },

  /**
   * Updates an existing vehicle by ID.
   */
  async updateVehicle(id, vehicleData) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleData),
    });
    return handleResponse(response);
  },

  /**
   * Deletes a vehicle by ID.
   */
  async deleteVehicle(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
};
