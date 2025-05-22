import React, { useState } from 'react';

interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

interface UserListProps {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  currentUserId: string;
  isSidebarOpen?: boolean;
}

const UserList: React.FC<UserListProps> = ({
  users,
  selectedUserId,
  onSelectUser,
  currentUserId,
  isSidebarOpen = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter out the current user from the list and apply search filter
  const filteredUsers = users
    .filter((user) => user._id !== currentUserId)
    .filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div
      className={`border-r h-full overflow-y-auto bg-white flex flex-col ${
        isSidebarOpen ? 'block' : 'hidden lg:block'
      }`}
    >
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Conversations</h2>
      </div>

      {/* Search input */}
      <div className="px-3 py-2 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No users match your search' : 'No users found'}
          </div>
        ) : (
          <ul>
            {filteredUsers.map((user) => (
              <li
                key={user._id}
                onClick={() => onSelectUser(user._id)}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                  selectedUserId === user._id
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : ''
                }`}
              >
                <div className="relative mr-3">
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {user.username}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">Online</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserList;
