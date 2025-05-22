import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';

// Store active connections
interface UserSocket {
  userId: string;
  socketId: string;
}

class SocketService {
  private io: Server | null = null;
  private activeUsers: UserSocket[] = [];

  // Initialize Socket.io server
  initialize(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: 'http://localhost:5173', // Frontend URL
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupListeners();
    console.log('Socket.io server initialized');
  }

  // Set up socket event listeners
  private setupListeners() {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Authenticate user
      socket.on('authenticate', (token: string) => {
        try {
          // Verify JWT token
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
          ) as { userId: string };
          const userId = decoded.userId;

          // Add user to active users
          this.activeUsers.push({ userId, socketId: socket.id });
          console.log(`User ${userId} authenticated with socket ${socket.id}`);

          // Join user to their own room for private messages
          socket.join(userId);

          // Notify others that user is online
          this.io?.emit('user_status', { userId, status: 'online' });

          // Send active users list to all clients
          this.io?.emit('active_users', this.getActiveUserIds());
        } catch (error) {
          console.error('Authentication error:', error);
          socket.disconnect();
        }
      });

      // Handle typing events
      socket.on(
        'typing',
        ({
          senderId,
          receiverId,
        }: {
          senderId: string;
          receiverId: string;
        }) => {
          // Send typing notification to receiver
          this.io?.to(receiverId).emit('typing', { userId: senderId });
        }
      );

      // Handle stop typing events
      socket.on(
        'stop_typing',
        ({
          senderId,
          receiverId,
        }: {
          senderId: string;
          receiverId: string;
        }) => {
          this.io?.to(receiverId).emit('stop_typing', { userId: senderId });
        }
      );

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);

        // Find user by socket id
        const user = this.activeUsers.find((u) => u.socketId === socket.id);
        if (user) {
          // Remove user from active users
          this.activeUsers = this.activeUsers.filter(
            (u) => u.socketId !== socket.id
          );

          // Notify others that user is offline
          this.io?.emit('user_status', {
            userId: user.userId,
            status: 'offline',
          });

          // Send updated active users list
          this.io?.emit('active_users', this.getActiveUserIds());
        }
      });
    });
  }

  // Get list of active user IDs
  private getActiveUserIds(): string[] {
    return [...new Set(this.activeUsers.map((u) => u.userId))];
  }

  // Send message to a specific user
  sendPrivateMessage(senderId: string, receiverId: string, message: any) {
    if (!this.io) return;

    // Send to receiver's room
    this.io.to(receiverId).emit('new_message', {
      ...message,
      senderId,
    });
  }

  // Send message delivery status
  sendMessageStatus(
    messageId: string,
    receiverId: string,
    status: 'delivered' | 'read'
  ) {
    if (!this.io) return;

    this.io.to(receiverId).emit('message_status', {
      messageId,
      status,
    });
  }

  // Get Socket.io instance
  getIO(): Server | null {
    return this.io;
  }
}

// Export as singleton
export default new SocketService();
