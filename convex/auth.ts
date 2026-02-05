import { auth, signIn, signOut, store, isAuthenticated } from "./auth.config";
import { getAuthUserId as getAuthUserIdBase } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx } from "./_generated/server";

export { auth, signIn, signOut, store, isAuthenticated };

/**
 * Helper to get the authenticated user ID from context
 * Returns null if user is not authenticated
 */
export async function getAuthUserId(
  ctx: QueryCtx | MutationCtx
): Promise<string | null> {
  return await getAuthUserIdBase(ctx);
}
