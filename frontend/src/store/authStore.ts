import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, LoginResponse } from '@shared/types/auth';
import { STORAGE_KEYS, ENDPOINTS } from '@shared/types/api';
import type { ApiError } from '@shared/types/api';
import axios from 'axios';

// ============================================================
// Auth State Shape
// ============================================================
interface AuthState {
  /** JWT token from Sameera's login response */
  token: string | null;

  /** Authenticated user object: { id, orgId, role, name } */
  user: AuthUser | null;

  /** Derived: true when token is present */
  isAuthenticated: boolean;

  /** Loading flag for login request */
  isLoading: boolean;

  /** Last error message from login attempt */
  error: string | null;

  // ── Actions ──────────────────────────────────────────────
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// ============================================================
// Zustand Store with localStorage Persistence
// ============================================================
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // ── Initial State ──
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ── Login Action ──
      // Calls POST /api/auth/login → stores token + user
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post<LoginResponse>(
            ENDPOINTS.AUTH_LOGIN,
            { email, password }
          );

          const { token, user } = response.data;

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err: unknown) {
          let message = 'Login failed. Please try again.';

          if (axios.isAxiosError(err) && err.response?.data) {
            const apiError = err.response.data as ApiError;
            message = apiError.message || message;
          }

          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });

          throw new Error(message);
        }
      },

      // ── Logout Action ──
      // Clears all auth state + localStorage
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // ── Clear Error ──
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH, // localStorage key: "carbonlens-auth"
      partialize: (state) => ({
        // Only persist token and user, not loading/error state
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
