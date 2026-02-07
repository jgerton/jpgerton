import { useAuthActions } from "@convex-dev/auth/react";

/**
 * Hook to access authentication actions (signIn, signOut)
 * Re-exported from @convex-dev/auth/react for convenience
 */
export { useAuthActions };

/**
 * Authentication state types
 */
export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
};
