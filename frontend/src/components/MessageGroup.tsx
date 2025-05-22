import React from 'react';
import Message from './Message';

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

interface MessageGroupProps {
  messages: MessageData[];
  currentUserId: string;
}

const MessageGroup: React.FC<MessageGroupProps> = ({ messages, currentUserId }) => {
  // Group messages by sender and time (within 5 minutes)
  const groupMessages = (messages: MessageData[]) => {
    const groups: MessageData[][] = [];
    let currentGroup: MessageData[] = [];
    let lastSenderId = '';
    let lastTimestamp = new Date(0);

    messages.forEach((message) => {
      const currentTimestamp = new Date(message.createdAt);
      const timeDiff = (currentTimestamp.getTime() - lastTimestamp.getTime()) / (1000 * 60); // diff in minutes
      
      // Start a new group if sender changes or time gap is more than 5 minutes
      if (message.sender._id !== lastSenderId || timeDiff > 5) {
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
          currentGroup = [];
        }
      }
      
      currentGroup.push(message);
      lastSenderId = message.sender._id;
      lastTimestamp = currentTimestamp;
    });

    // Add the last group if it exists
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const messageGroups = groupMessages(messages);

  // Format date for day separators
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  // Check if we need to show a date separator
  const shouldShowDateSeparator = (currentDate: string, previousDate?: string) => {
    if (!previousDate) return true;
    
    const current = new Date(currentDate).setHours(0, 0, 0, 0);
    const previous = new Date(previousDate).setHours(0, 0, 0, 0);
    
    return current !== previous;
  };

  return (
    <div className="space-y-6">
      {messageGroups.map((group, groupIndex) => {
        const firstMessage = group[0];
        const previousGroup = groupIndex > 0 ? messageGroups[groupIndex - 1] : undefined;
        const previousDate = previousGroup ? previousGroup[0].createdAt : undefined;
        const showDateSeparator = shouldShowDateSeparator(firstMessage.createdAt, previousDate);
        
        return (
          <React.Fragment key={group[0]._id}>
            {showDateSeparator && (
              <div className="flex justify-center my-4">
                <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {formatDate(firstMessage.createdAt)}
                </div>
              </div>
            )}
            <div className="space-y-1">
              {group.map((message) => (
                <Message
                  key={message._id}
                  content={message.content}
                  timestamp={message.createdAt}
                  isOwn={message.sender._id === currentUserId}
                  senderName={message.sender.username}
                  profilePicture={message.sender.profilePicture}
                />
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default MessageGroup;
