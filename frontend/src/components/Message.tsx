import React from 'react';

interface MessageProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
  senderName?: string;
  profilePicture?: string;
}

const Message: React.FC<MessageProps> = ({
  content,
  timestamp,
  isOwn,
  senderName,
  profilePicture = '/default-avatar.png',
}) => {
  // Format the timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return (
        date.toLocaleDateString([], {
          month: 'short',
          day: 'numeric',
        }) +
        ' ' +
        date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }
  };

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}
    >
      <div
        className={`flex max-w-[75%] ${
          isOwn ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {!isOwn && (
          <div className="mr-2 flex-shrink-0 self-end">
            <img
              src={profilePicture}
              alt={senderName || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          </div>
        )}
        <div
          className={`rounded-lg px-4 py-2 shadow-sm ${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
          }`}
        >
          {!isOwn && senderName && (
            <div className="font-semibold text-xs mb-1 text-blue-600">
              {senderName}
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
          <div
            className={`text-xs mt-1 flex items-center justify-end ${
              isOwn ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            <span>{formatTime(timestamp)}</span>
            {isOwn && (
              <svg
                className="h-4 w-4 ml-1 text-blue-100"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
