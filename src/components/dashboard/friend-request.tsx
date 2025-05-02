"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { friendApi } from "@/lib/api";

interface FriendRequestActionsProps {
  requestId: string;
}

export default function FriendRequestActions({
  requestId,
}: FriendRequestActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await friendApi.acceptFriendRequest(requestId);
      router.refresh(); // Refresh page to show updated state
    } catch (error) {
      console.error("Failed to accept friend request:", error);
      // You would typically show an error message here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleAccept}
        disabled={isLoading}
        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300"
      >
        {isLoading ? "Accepting..." : "Accept"}
      </button>

      {/* In a real implementation, you would add a reject button that calls a reject API */}
      <button
        disabled={isLoading}
        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100"
      >
        Decline
      </button>
    </div>
  );
}
