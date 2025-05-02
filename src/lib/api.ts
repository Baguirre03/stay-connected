// lib/api.ts
import { User, FriendRequest } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
  tags?: string[];
};

/**
 * Base API fetch function that handles cookies and authentication
 */
async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    cache = "no-store",
    tags,
  } = options;

  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Important for sending cookies with requests
    cache,
    ...(tags ? { next: { tags } } : {}),
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

  if (!response.ok) {
    // Attempt to parse error message from response
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // If parsing fails, use status text
      errorMessage = response.statusText;
    }

    throw new Error(`API Error (${response.status}): ${errorMessage}`);
  }

  // For 204 No Content responses
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();
  return data as T;
}

// Authentication APIs
export const authApi = {
  /**
   * Login user and set HTTP-only cookie with JWT
   */
  login: async (email: string, password: string) => {
    return apiFetch<{ user: User }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },

  /**
   * Register a new user
   */
  register: async (userData: {
    email: string;
    password: string;
    username: string;
    name?: string;
  }) => {
    return apiFetch<{ user: User }>("/users/register", {
      method: "POST",
      body: userData,
    });
  },

  /**
   * Get current logged-in user
   */
  getCurrentUser: async () => {
    return apiFetch<{ user: User }>("/users/me");
  },

  /**
   * Logout - this will depend on your backend implementation
   * This function assumes you have a logout endpoint that clears the cookie
   */
  logout: async () => {
    return apiFetch<void>("/auth/logout", {
      method: "POST",
    });
  },
};

// User APIs
export const userApi = {
  /**
   * Get all users
   */
  getAllUsers: async () => {
    return apiFetch<{ users: User[] }>("/users");
  },

  /**
   * Update user
   */
  updateUser: async (userId: string, userData: Partial<User>) => {
    return apiFetch<{ user: User }>(`/users/${userId}`, {
      method: "PATCH",
      body: userData,
    });
  },
};

// Friend APIs
export const friendApi = {
  /**
   * Send a friend request
   */
  sendFriendRequest: async (receiverId: string) => {
    return apiFetch<{ request: FriendRequest }>("/friends/request", {
      method: "POST",
      body: { receiverId },
    });
  },

  /**
   * Accept a friend request
   */
  acceptFriendRequest: async (requestId: string) => {
    return apiFetch<{ request: FriendRequest }>(
      `/friends/accept/${requestId}`,
      {
        method: "PATCH",
      }
    );
  },

  /**
   * Get all friends
   */
  getAllFriends: async () => {
    return apiFetch<{ friends: User[] }>("/friends");
  },

  /**
   * Get all incoming friend requests
   */
  getFriendRequests: async () => {
    return apiFetch<{ requests: FriendRequest[] }>("/friends/requests");
  },
};
