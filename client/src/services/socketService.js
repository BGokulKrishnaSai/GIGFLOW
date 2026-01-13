import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
        // Disable Socket.IO in production to avoid errors
    if (import.meta.env.PROD && !import.meta.env.VITE_ENABLE_SOCKET_IO) {
      console.log('Socket.IO disabled in production');
      return null;
    }


    this.socket = io(SOCKET_URL);

        // Handle connection errors gracefully
    this.socket.on('connect_error', (error) => {
      console.warn('Socket.IO connection failed:', error.message);
      // Silently fail - app continues without real-time features
    });

    this.socket.on('error', (error) => {
      console.warn('Socket.IO error:', error);
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      // Join user-specific room for notifications
      this.socket.emit('join-user-room', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Listen for hire notifications
  onHired(callback) {
    if (this.socket) {
      this.socket.on('hired', callback);
    }
  }

  // Remove listeners
  offHired() {
    if (this.socket) {
      this.socket.off('hired');
    }
  }
}

export default new SocketService();
