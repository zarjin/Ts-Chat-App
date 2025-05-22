import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Focus input on component mount
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setIsEmojiPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (message.trim() && !disabled) {
        onSendMessage(message);
        setMessage('');
      }
    }
  };

  // Simple emoji picker (in a real app, you'd use a library like emoji-mart)
  const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '😂', '🙏', '✨', '🤔', '👀'];

  const addEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setIsEmojiPickerOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="border-t bg-white">
      <form onSubmit={handleSubmit} className="flex items-center p-3">
        <div className="relative mr-2">
          <button
            type="button"
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 focus:outline-none"
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
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {isEmojiPickerOpen && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10"
            >
              <div className="grid grid-cols-5 gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl hover:bg-gray-100 rounded p-1 focus:outline-none"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? 'Select a conversation to start chatting'
              : 'Type a message...'
          }
          disabled={disabled}
          className="flex-1 px-4 py-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`px-6 py-3 rounded-r-lg font-medium ${
            !message.trim() || disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } transition-colors`}
        >
          <span className="hidden sm:inline">Send</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:hidden"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>
      <div className="px-3 pb-2 text-xs text-gray-500">
        Press Ctrl+Enter to send
      </div>
    </div>
  );
};

export default ChatInput;
