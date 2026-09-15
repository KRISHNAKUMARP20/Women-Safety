import { NotificationAlert } from '../types';

export const notificationService = {
  async getNotifications(): Promise<NotificationAlert[]> {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/notifications`);
    const data = await res.json();
    return data.notifications || [];
  },

  async markAsRead(id: string): Promise<void> {
    await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  async sendBroadcast(message: string, type: 'info' | 'warning' | 'emergency'): Promise<void> {
    await fetch(`${import.meta.env.VITE_API_URL || ''}/api/notifications/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, type, timestamp: new Date().toISOString() }),
    });
  },
};
