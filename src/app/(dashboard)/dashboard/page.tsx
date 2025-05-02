import { getServerSession } from '@/lib/auth';
import { userApi, friendApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default async function DashboardPage() {
  const { user } = await getServerSession();
  
  // Fetch data for the dashboard
  const [friendsData, requestsData] = await Promise.all([
    friendApi.getAllFriends().catch(() => ({ friends: [] })),
    friendApi.getFriendRequests().catch(() => ({ requests: [] })),
  ]);
  
  const { friends } = friendsData;
  const { requests } = requestsData;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome, {user?.name || user?.username}!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Friends Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Friend Requests ({requests.length})</h3>
          {requests.length > 0 ? (
            <ul className="space-y-2">
              {requests.slice(0, 5).map((request) => (
                <li key={request.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                      {request.sender.name?.[0] || request.sender.username[0]}
                    </div>
                    <span className="ml-3 text-gray-700">{request.sender.name || request.sender.username}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(request.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">You don't have any pending friend requests.</p>
          )}
          
          {requests.length > 5 && (
            <a href="/friends/requests" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
              View all requests
            </a>
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Your Profile</h3>
        {user && (
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-32 text-gray-500">Username:</span>
              <span className="font-medium">{user.username}</span>
            </div>
            <div className="flex items-center">
              <span className="w-32 text-gray-500">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            {user.name && (
              <div className="flex items-center">
                <span className="w-32 text-gray-500">Name:</span>
                <span className="font-medium">{user.name}</span>
              </div>
            )}
            <div className="flex items-center">
              <span className="w-32 text-gray-500">Joined:</span>
              <span className="font-medium">{formatDate(user.createdAt)}</span>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <a href="/profile" className="text-sm text-blue-600 hover:underline">
            Edit profile
          </a>
        </div>
      </div>
    </div>
  );text-lg font-medium mb-4">Friends ({friends.length})</h3>
          {friends.length > 0 ? (
            <ul className="space-y-2">
              {friends.slice(0, 5).map((friend) => (
                <li key={friend.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                      {friend.name?.[0] || friend.username[0]}
                    </div>
                    <span className="ml-3 text-gray-700">{friend.name || friend.username}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">You don't have any friends yet.</p>
          )}
          
          {friends.length > 5 && (
            <a href="/friends" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
              View all friends
            </a>
          )}
        </div>
        
        {/* Friend Requests */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="