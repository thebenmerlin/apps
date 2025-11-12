import { useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export function useNotifications() {
  const isNative = Capacitor.isNativePlatform();

  // Initialize and request permissions
  const initializeNotifications = useCallback(async () => {
    try {
      if (isNative) {
        // Request permissions for native platform
        const permission = await LocalNotifications.requestPermissions();
        if (permission.display === 'granted') {
          console.log('Notification permissions granted');
        } else {
          console.log('Notification permissions denied');
        }
      } else {
        // Request browser notifications
        if ('Notification' in window && Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          console.log('Browser notification permission:', permission);
        }
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }, [isNative]);

  // Schedule a notification
  const scheduleNotification = useCallback(
    async (taskId: string, title: string, body: string, scheduleDate: string) => {
      try {
        const scheduleTime = new Date(scheduleDate);

        if (isNative) {
          // Use Capacitor Local Notifications for native
          await LocalNotifications.schedule({
            notifications: [
              {
                id: parseInt(taskId.replace(/\D/g, '').slice(0, 9)) || Math.floor(Math.random() * 1000000),
                title,
                body,
                schedule: {
                  at: scheduleTime,
                  allowWhileIdle: true,
                },
                sound: undefined,
                attachments: undefined,
                actionTypeId: '',
                extra: { taskId },
              },
            ],
          });
          console.log('Native notification scheduled');
        } else {
          // Use browser Notification API as fallback
          if ('Notification' in window && Notification.permission === 'granted') {
            const timeUntilNotification = scheduleTime.getTime() - Date.now();
            if (timeUntilNotification > 0) {
              setTimeout(() => {
                new Notification(title, {
                  body,
                  icon: '/icons/icon-192x192.png',
                  badge: '/icons/icon-96x96.png',
                  tag: taskId,
                });
              }, timeUntilNotification);
              console.log('Browser notification scheduled');
            }
          } else {
            console.log('Browser notifications not available or not permitted');
          }
        }
      } catch (error) {
        console.error('Error scheduling notification:', error);
      }
    },
    [isNative]
  );

  // Cancel a notification
  const cancelNotification = useCallback(
    async (taskId: string) => {
      try {
        if (isNative) {
          const notificationId = parseInt(taskId.replace(/\D/g, '').slice(0, 9)) || 0;
          await LocalNotifications.cancel({
            notifications: [{ id: notificationId }],
          });
          console.log('Notification cancelled');
        }
      } catch (error) {
        console.error('Error cancelling notification:', error);
      }
    },
    [isNative]
  );

  // Listen for notification actions (native only)
  useEffect(() => {
    if (isNative) {
      const actionListener = LocalNotifications.addListener(
        'localNotificationActionPerformed',
        (notification) => {
          console.log('Notification action performed:', notification);
          // Handle notification tap - could navigate to task
        }
      );

      return () => {
        actionListener.remove();
      };
    }
  }, [isNative]);

  return {
    initializeNotifications,
    scheduleNotification,
    cancelNotification,
    isNative,
  };
}
