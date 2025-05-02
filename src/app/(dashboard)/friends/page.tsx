import { friendApi, userApi } from "@/lib/api";
import { formatDate, getUserInitials } from "@/lib/utils";
import Link from "next/link";

export default async function FriendsPage() {
  // Fetch all friends
  const { friends } = await friendApi
    .getAllFriends()
    .catch(() => ({ friends: [] }));

  // Fetch users to suggest as friends (this is a simplified version)
  const { users } = await userApi.getAllUsers().catch(() => ({ users: [] }));

  // Filter out users who are already friends (real implementation would be more sophisticated)
  const friendIds = new Set(friends.map((friend) => friend.id));
  const suggestedUsers = users
    .filter((user) => !friendIds.has(user.id))
    .slice(0, 5);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Friends</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Friends List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">
                Your Friends ({friends.length})
              </h3>
            </div>

            {friends.length > 0 ? (
              <ul>
                {friends.map((friend) => (
                  <li
                    key={friend.id}
                    className="px-6 py-4 flex items-center justify-between border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                        {getUserInitials(friend.name, friend.username)}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {friend.name || friend.username}
                        </p>
                        <p className="text-sm text-gray-500">{friend.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-4">
                        Friends since {formatDate(friend.createdAt)}
                      </span>
                      {/* Here you would add more actions like message or remove friend */}
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Message
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">You don't have any friends yet.</p>
                <p className="text-gray-500 mt-1">
                  Send friend requests to start connecting!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Friend Suggestions */}
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">Friend Suggestions</h3>
            </div>

            {suggestedUsers.length > 0 ? (
              <ul>
                {suggestedUsers.map((user) => (
                  <li
                    key={user.id}
                    className="px-6 py-4 flex items-center justify-between border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-medium">
                        {getUserInitials(user.name, user.username)}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name || user.username}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    {/* Send friend request button - in real implementation this would be a client component */}
                    <form
                      action={`/api/friends/request?receiverId=${user.id}`}
                      method="post"
                    >
                      <button
                        type="submit"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add Friend
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">
                  No suggestions available right now.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Link
              href="/friends/requests"
              className="block w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Friend Requests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
