import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addNotification, markAsRead, clearNotification } from '../redux/slices/notificationSlice';
import socketService from '../services/socketService';

export default function NotificationCenter() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      // Listen for hire notifications
      const handleHired = (data) => {
        dispatch(addNotification({
          type: 'hire',
          title: '🎉 Congratulations!',
          message: data.message,
          gig: data.gig,
          bid: data.bid,
        }));
      };

      const socket = socketService.getSocket();
      if (socket) {
        socket.on('hired', handleHired);
      }

      return () => {
        if (socket) {
          socket.off('hired', handleHired);
        }
      };
    }
  }, [isAuthenticated, dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleDismiss = (id) => {
    dispatch(clearNotification(id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <AnimatePresence>
        {notifications.filter(n => !n.read).map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="mb-3 bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => handleDismiss(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
