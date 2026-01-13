// Socket.IO disabled - Vercel serverless doesn't support persistent connections
// This service is kept as a stub for future migration to a platform that supports WebSockets

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    // Socket.IO disabled for Vercel deployment
    console.log('Socket.IO is disabled on serverless platform');
    return null;
  }

  disconnect() {
    // No-op
  }

  getSocket() {
    return null;
  }

  // Stub methods for future implementation
  emit(event, data) {
    console.log('Socket.IO disabled:', event, data);
  }

  on(event, callback) {
    // No-op
  }
}

const socketService = new SocketService();
export default socketService;
