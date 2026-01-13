import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    // DISABLE Socket.IO on Vercel by URL check
    const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
    if (isProduction) {
      console.log('Socket.IO disabled - running on Vercel');
      return null;
    }    this.socket = io(SOCKET_URL);

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
