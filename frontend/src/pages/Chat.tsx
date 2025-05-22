import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import UserList from '../components/UserList';
import MessageGroup from '../components/MessageGroup';
import ChatInput from '../components/ChatInput';
import { useAuth } from '../hooks/useAuth';
import { getAllUsers, getMessages, sendMessage } from '../services/api';

interface MessageData {
  _id: string;
  sender: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  receiver: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  content: string;
  createdAt: string;
}

interface UserData {
  _id: string;
  username: string;
  profilePicture: string;
}

const Chat: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Fetch messages when a user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUserId) {
        try {
          setLoading(true);
          const response = await getMessages(selectedUserId);
          setMessages(response.messages);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setLoading(false);
        }
      }
    };

    if (selectedUserId) {
      fetchMessages();
    }
  }, [selectedUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedUserId || !user) return;

    try {
      const response = await sendMessage(selectedUserId, content);

      // Add the new message to the messages list
      const newMessage: MessageData = {
        _id: response.data._id,
        sender: {
          _id: user.id,
          username: user.username,
          profilePicture: user.profilePicture,
        },
        receiver: {
          _id: selectedUserId,
          username: users.find((u) => u._id === selectedUserId)?.username || '',
          profilePicture:
            users.find((u) => u._id === selectedUserId)?.profilePicture || '',
        },
        content: response.data.content,
        createdAt: response.data.createdAt,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const selectedUser = users.find((u) => u._id === selectedUserId);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with user list */}
      <div
        className={`${
          isSidebarOpen ? 'w-full md:w-1/3 lg:w-1/4' : 'w-0'
        } md:block transition-all duration-300 ease-in-out ${
          !isSidebarOpen && 'hidden'
        }`}
      >
        <UserList
          users={users}
          selectedUserId={selectedUserId}
          onSelectUser={handleSelectUser}
          currentUserId={user?.id || ''}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        {selectedUser ? (
          <div className="bg-white p-4 border-b flex items-center justify-between shadow-sm">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2 md:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="relative">
                <img
                  src={selectedUser.profilePicture || '/default-avatar.png'}
                  alt={selectedUser.username}
                  className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                />
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedUser.username}
                </h2>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 focus:outline-none ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 border-b flex items-center shadow-sm">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2 md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              Select a conversation
            </h2>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-200 mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : selectedUserId ? (
            messages.length > 0 ? (
              <div>
                <MessageGroup
                  messages={messages}
                  currentUserId={user?.id || ''}
                />
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-center">
                  No messages yet. Start a conversation!
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
              <p className="text-center">Select a user to start chatting</p>
            </div>
          )}
        </div>

        {/* Chat input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={!selectedUserId}
        />
      </div>
    </div>
  );
};

export default Chat;
