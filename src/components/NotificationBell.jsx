import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import apiClient from '../api/apiClient';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch from /api/notifications
    // For now, we simulate an empty state or fetch if endpoint existed
    const fetchNotifications = async () => {
      try {
        // const { data } = await apiClient.get('/notifications');
        // setNotifications(data);
        setNotifications([]);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors relative"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-rose-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-14 right-0 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>No new notifications</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {notifications.map(notification => (
                  <li key={notification._id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{notification.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
