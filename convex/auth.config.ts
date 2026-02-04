import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  session: {
    totalDurationMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    inactiveDurationMs: 7 * 24 * 60 * 60 * 1000, // 7 days idle timeout
  },
});
