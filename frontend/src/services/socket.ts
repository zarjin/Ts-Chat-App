import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: Array<(message: any) => void> = [];
  private typingHandlers: Array<(data: { userId: string }) => void> = [];
  private stopTypingHandlers: Array<(data: { userId: string }) => void> = [];
  private userStatusHandlers: Array<(data: { userId: string, status: string }) => void> = [];
  private activeUsersHandlers: Array<(userIds: string[]) => void> = [];
  private messageStatusHandlers: Array<(data: { messageId: string, status: string }) => void> = [];

  // Initialize socket connection
  connect(token: string) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io('http://localhost:5000', {
      withCredentials: true,
      autoConnect: false,
    });

    this.socket.connect();

    // Authenticate with token
    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.socket?.emit('authenticate', token);
    });

    // Set up event listeners
    this.setupListeners();
  }

  // Set up socket event listeners
  private setupListeners() {
    if (!this.socket) return;

    // New message handler
    this.socket.on('new_message', (message) => {
      this.messageHandlers.forEach(handler => handler(message));
    });

    // Typing indicator handler
    this.socket.on('typing', (data) => {
      this.typingHandlers.forEach(handler => handler(data));
    });

    // Stop typing handler
    this.socket.on('stop_typing', (data) => {
      this.stopTypingHandlers.forEach(handler => handler(data));
    });

    // User status handler
    this.socket.on('user_status', (data) => {
      this.userStatusHandlers.forEach(handler => handler(data));
    });

    // Active users handler
    this.socket.on('active_users', (userIds) => {
      this.activeUsersHandlers.forEach(handler => handler(userIds));
    });

    // Message status handler
    this.socket.on('message_status', (data) => {
      this.messageStatusHandlers.forEach(handler => handler(data));
    });

    // Reconnection handler
    this.socket.on('reconnect', () => {
      console.log('Reconnected to socket server');
      // Re-authenticate on reconnect
      const token = localStorage.getItem('token');
      if (token) {
        this.socket?.emit('authenticate', token);
      }
    });

    // Error handler
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Disconnect handler
    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
    });
  }

  // Send typing indicator
  sendTyping(senderId: string, receiverId: string) {
    if (!this.socket) return;
    this.socket.emit('typing', { senderId, receiverId });
  }

  // Send stop typing indicator
  sendStopTyping(senderId: string, receiverId: string) {
    if (!this.socket) return;
    this.socket.emit('stop_typing', { senderId, receiverId });
  }

  // Register message handler
  onNewMessage(handler: (message: any) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  // Register typing handler
  onTyping(handler: (data: { userId: string }) => void) {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }

  // Register stop typing handler
  onStopTyping(handler: (data: { userId: string }) => void) {
    this.stopTypingHandlers.push(handler);
    return () => {
      this.stopTypingHandlers = this.stopTypingHandlers.filter(h => h !== handler);
    };
  }

  // Register user status handler
  onUserStatus(handler: (data: { userId: string, status: string }) => void) {
    this.userStatusHandlers.push(handler);
    return () => {
      this.userStatusHandlers = this.userStatusHandlers.filter(h => h !== handler);
    };
  }

  // Register active users handler
  onActiveUsers(handler: (userIds: string[]) => void) {
    this.activeUsersHandlers.push(handler);
    return () => {
      this.activeUsersHandlers = this.activeUsersHandlers.filter(h => h !== handler);
    };
  }

  // Register message status handler
  onMessageStatus(handler: (data: { messageId: string, status: string }) => void) {
    this.messageStatusHandlers.push(handler);
    return () => {
      this.messageStatusHandlers = this.messageStatusHandlers.filter(h => h !== handler);
    };
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Export as singleton
export default new SocketService();
