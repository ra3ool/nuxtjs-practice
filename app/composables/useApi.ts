export interface ApiError {
  message: string;
  statusCode?: number;
  data?: any;
}

export const useApi = () => {
  const config = useRuntimeConfig();
  const { token } = useAuth();

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    onRequest({ request, options }) {
      // Add auth token if available
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        };
      }
    },
    onRequestError({ error }) {
      console.error('API Request Error:', error);
    },
    onResponseError({ response }) {
      // Handle 401 Unauthorized - clear auth and redirect to login
      if (response.status === 401) {
        const { clearAuth } = useAuth();
        clearAuth();
        if (process.client && !window.location.pathname.startsWith('/auth')) {
          navigateTo('/auth/login');
        }
      }
    },
  });

  // Books API
  const getBooks = async (params: Record<string, any> = {}) => {
    try {
      return await api('/books', { params });
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  const getBook = async (id: string | number) => {
    try {
      return await api(`/books/${id}`);
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  const searchBooks = async (
    query: string,
    params: Record<string, any> = {},
  ) => {
    try {
      return await api('/books/search', {
        params: { q: query, ...params },
      });
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  // Categories API
  const getCategories = async () => {
    try {
      return await api('/categories');
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  const getCategoryBooks = async (
    id: string | number,
    params: Record<string, any> = {},
  ) => {
    try {
      return await api(`/categories/${id}/books`, { params });
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  // Auth API
  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api('/auth/login', {
        method: 'POST',
        body: credentials,
      });
      return response;
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await api('/auth/register', {
        method: 'POST',
        body: userData,
      });
      return response;
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  const logout = async () => {
    try {
      return await api('/auth/logout', { method: 'POST' });
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  const handleApiError = (error: any): ApiError => {
    if (error.response) {
      return {
        message:
          error.response._data?.message || error.message || 'An error occurred',
        statusCode: error.response.status,
        data: error.response._data,
      };
    }

    return {
      message: error.message || 'Network error. Please check your connection.',
    };
  };

  return {
    getBooks,
    getBook,
    searchBooks,
    getCategories,
    getCategoryBooks,
    login,
    register,
    logout,
  };
};
