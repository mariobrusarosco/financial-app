import { API_BASE_URL, DEFAULT_HEADERS, DEFAULT_TIMEOUT, ERROR_MESSAGES } from './config';

/**
 * API client error class
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Handle API response and check for errors
 */
async function handleResponse(response: Response) {
  let data;
  
  try {
    // Try to parse the response as JSON
    data = await response.json();
  } catch (error) {
    // If parsing fails, use the response text
    data = await response.text();
  }

  // If the response is not ok, throw an error
  if (!response.ok) {
    // Get the appropriate error message based on the status code
    const errorMessage = 
      response.status === 401 ? ERROR_MESSAGES.UNAUTHORIZED :
      response.status === 403 ? ERROR_MESSAGES.FORBIDDEN :
      response.status === 404 ? ERROR_MESSAGES.NOT_FOUND :
      response.status >= 500 ? ERROR_MESSAGES.SERVER_ERROR :
      data.message || 'An error occurred';
    
    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
}

/**
 * Create request options with default headers and body
 */
function createRequestOptions(method: string, options: RequestInit = {}, data?: any): RequestInit {
  const headers = {
    ...DEFAULT_HEADERS,
    ...options.headers,
  };

  const requestOptions: RequestInit = {
    method,
    headers,
    ...options,
  };

  // Add the body if data is provided
  if (data) {
    requestOptions.body = JSON.stringify(data);
  }

  return requestOptions;
}

/**
 * API client with methods for making API requests
 */
export const apiClient = {
  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = createRequestOptions('GET', options);
    
    try {
      const response = await fetch(url, requestOptions);
      return handleResponse(response) as Promise<T>;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0);
    }
  },

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = createRequestOptions('POST', options, data);
    
    try {
      const response = await fetch(url, requestOptions);
      return handleResponse(response) as Promise<T>;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0);
    }
  },

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = createRequestOptions('PUT', options, data);
    
    try {
      const response = await fetch(url, requestOptions);
      return handleResponse(response) as Promise<T>;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0);
    }
  },

  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = createRequestOptions('PATCH', options, data);
    
    try {
      const response = await fetch(url, requestOptions);
      return handleResponse(response) as Promise<T>;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0);
    }
  },

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestOptions = createRequestOptions('DELETE', options);
    
    try {
      const response = await fetch(url, requestOptions);
      return handleResponse(response) as Promise<T>;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0);
    }
  },
}; 