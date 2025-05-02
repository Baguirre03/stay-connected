// lib/auth.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { User } from "./types";
import { authApi } from "./api";

/**
 * Check if the user is authenticated on the server side
 */
export async function getServerSession(): Promise<{
  user: User | null;
  isAuthenticated: boolean;
}> {
  try {
    // This will work because your API validates the JWT in the cookie
    const { user } = await authApi.getCurrentUser();
    return {
      user,
      isAuthenticated: true,
    };
  } catch (error) {
    return {
      user: null,
      isAuthenticated: false,
    };
  }
}

/**
 * Client-side authentication check (can be used in React components)
 * This doesn't actually verify the token, just checks if a user is in state
 */
export function useAuth() {
  // This would be implemented with React Context and useEffect to fetch current user
  // For now, we're just providing the interface

  // Example implementation would use SWR or React Query to fetch and cache user data
  // const { data, error, mutate } = useSWR('/users/me', fetcher)

  // In a real implementation, you'd fetch the current user and return:
  return {
    isAuthenticated: false, // Will be updated by the actual implementation
    user: null, // Will contain user data if authenticated
    loading: true, // Will be false when the request completes
    login: async (email: string, password: string) => {
      try {
        const response = await authApi.login(email, password);
        // Update local state/context with user data
        return response;
      } catch (error) {
        throw error;
      }
    },
    logout: async () => {
      try {
        await authApi.logout();
        // Clear local state/context
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
    register: async (userData: {
      email: string;
      password: string;
      username: string;
      name?: string;
    }) => {
      try {
        const response = await authApi.register(userData);
        // Update local state/context with user data
        return response;
      } catch (error) {
        throw error;
      }
    },
  };
}

/**
 * Auth middleware helper
 */
export function authMiddleware(request: NextRequest): NextResponse | undefined {
  const authPaths = ["/login", "/register"];
  const isAuthPath = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // For simplicity, we'll just check if the cookie exists
  // In a real app, you might want to actually validate the token
  const token = request.cookies.get("jwt");
  const isAuthenticated = !!token;

  // If not authenticated and not on an auth path, redirect to login
  if (
    !isAuthenticated &&
    !isAuthPath &&
    !request.nextUrl.pathname.startsWith("/api")
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and on an auth path, redirect to dashboard
  if (isAuthenticated && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return undefined;
}
