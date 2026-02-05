"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Set to true temporarily if you need to create another admin account
const ALLOW_SIGNUP = false;

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { signIn } = useAuthActions();

  // Redirect to admin if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, authLoading, router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await signIn("password", {
        email,
        password,
        flow: isSignUp ? "signUp" : "signIn",
      });
      if (isSignUp) {
        setSuccess("Account created! You can now sign in.");
        setIsSignUp(false);
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError(isSignUp ? "Could not create account" : "Invalid email or password");
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Create Admin Account" : "Admin Login"}</CardTitle>
          <CardDescription>
            {isSignUp ? "Create your admin account" : "Sign in to manage your portfolio"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
                {success}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (isSignUp ? "Creating..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
            {ALLOW_SIGNUP && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                  setSuccess("");
                }}
              >
                {isSignUp ? "Back to Sign In" : "Create Admin Account"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
