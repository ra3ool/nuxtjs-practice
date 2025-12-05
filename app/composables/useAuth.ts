export interface User {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const state = useState<AuthState>('auth', () => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }));

  // Initialize auth state from localStorage on client
  if (process.client) {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (token && userStr) {
      try {
        state.value.token = token;
        state.value.user = JSON.parse(userStr);
        state.value.isAuthenticated = true;
      } catch (error) {
        console.error('Failed to parse user data:', error);
        clearAuth();
      }
    }
  }

  const setAuth = (user: User, token: string) => {
    state.value.user = user;
    state.value.token = token;
    state.value.isAuthenticated = true;

    if (process.client) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  };

  const clearAuth = () => {
    state.value.user = null;
    state.value.token = null;
    state.value.isAuthenticated = false;

    if (process.client) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  const logout = async () => {
    const { logout: apiLogout } = useApi();

    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      clearAuth();
      await navigateTo('/auth/login');
    }
  };

  return {
    user: computed(() => state.value.user),
    token: computed(() => state.value.token),
    isAuthenticated: computed(() => state.value.isAuthenticated),
    setAuth,
    clearAuth,
    logout,
  };
};
