import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import './NotificationToast.css';

export default function NotificationToast({ notification, onClose }) {
  if (!notification || !notification.title) return null;

  return (
    <div className="notification-toast animate-slide-in-right">
      <div className="toast-icon">
        <Bell size={20} color="#fff" />
      </div>
      <div className="toast-content">
        <h4>{notification.title}</h4>
        <p>{notification.body}</p>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={18} color="#64748B" />
      </button>
    </div>
  );
}
