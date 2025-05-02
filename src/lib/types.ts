// lib/types.ts

export enum FriendRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  // Add any other fields from your Prisma schema
}

export interface FriendRequest {
  id: string;
  senderId: string;
  sender: User;
  receiverId: string;
  receiver: User;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
