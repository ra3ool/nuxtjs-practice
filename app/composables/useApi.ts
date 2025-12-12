export interface ApiError {
  message: string;
  statusCode?: number;
  data?: any;
}

export interface LoginResponse {
  user: {
    id: string | number;
    name: string;
    email: string;
    avatar?: string;
  };
  token: string;
  access_token?: string;
}

export interface RegisterResponse {
  user: {
    id: string | number;
    name: string;
    email: string;
    avatar?: string;
  };
  token?: string;
  message?: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface BooksResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

export interface BookResponse {
  id: string | number;
  title: string;
  author: string;
  description?: string;
  cover?: string;
  category?: string;
}

export interface CategoriesResponse {
  data: Array<{
    id: string | number;
    name: string;
    description?: string;
    books_count?: number;
  }>;
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
  const getBooks = async (params: Record<string, any> = {}): Promise<BooksResponse> => {
    try {
      return await api<BooksResponse>('/books', { params });
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  const getBook = async (id: string | number): Promise<BookResponse> => {
    try {
      return await api<BookResponse>(`/books/${id}`);
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  const searchBooks = async (
    query: string,
    params: Record<string, any> = {},
  ): Promise<BooksResponse> => {
    try {
      return await api<BooksResponse>('/books/search', {
        params: { q: query, ...params },
      });
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  // Categories API
  const getCategories = async (): Promise<CategoriesResponse> => {
    try {
      return await api<CategoriesResponse>('/categories');
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  const getCategoryBooks = async (
    id: string | number,
    params: Record<string, any> = {},
  ): Promise<BooksResponse> => {
    try {
      return await api<BooksResponse>(`/categories/${id}/books`, { params });
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  // Auth API
  const login = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    try {
      const response = await api<LoginResponse>('/auth/login', {
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
  }): Promise<RegisterResponse> => {
    try {
      const response = await api<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: userData,
      });
      return response;
    } catch (error: any) {
      throw handleApiError(error);
    }
  };

  const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
    try {
      const response = await api<ForgotPasswordResponse>('/auth/forgot-password', {
        method: 'POST',
        body: { email },
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
    forgotPassword,
    logout,
  };
};
