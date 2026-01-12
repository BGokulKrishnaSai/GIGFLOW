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
      socketService.onHired((data) => {
        dispatch(addNotification({
          type: 'hire',
          title: '🎉 Congratulations!',
          message: data.message,
          gig: data.gig,
          bid: data.bid,
        }));
      });
    }

    return () => {
      socketService.offHired();
    };
  }, [isAuthenticated, dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleDismiss = (id) => {
    dispatch(clearNotification(id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.3 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className={`max-w-sm bg-white rounded-lg shadow-lg border-l-4 ${
              notification.type === 'hire' ? 'border-green-500' : 'border-blue-500'
            } p-4 cursor-pointer hover:shadow-xl transition-shadow`}
            onClick={() => handleMarkAsRead(notification.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {notification.title}
                </h4>
                <p className="text-gray-700 text-sm mt-1">
                  {notification.message}
                </p>
                {notification.gig && (
                  <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                    <p className="font-medium text-green-800">{notification.gig.title}</p>
                    <p className="text-green-600">Budget: ₹{notification.gig.budget}</p>
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss(notification.id);
                }}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            {!notification.read && (
              <div className="mt-2 flex justify-end">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}