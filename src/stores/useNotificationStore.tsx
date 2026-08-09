import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import type { EventSubscription } from "expo-notifications";
import { create } from "zustand";

export interface NotificationStoreState {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
  notificationListener: EventSubscription | null;
  responseListener: EventSubscription | null;

  startNotifications: () => void;
}

const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  expoPushToken: null,
  notification: null,
  error: null,
  notificationListener: null,
  responseListener: null,

  // Actions
  // Setting up listeners for push notifications
  startNotifications: () => {
    registerForPushNotificationsAsync()
      .then((token) => {
        set({ expoPushToken: token });
      })
      .catch((error) => {
        set({ error });
      });

    // Set up a listener for when a notification is received while the app is running
    set({
      notificationListener: Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log(
            "Notification received while the app is running:",
            notification
          );
          set({ notification });
        }
      ),
    });

    // Set up a listener for when the user interacts with the notification
    set({
      responseListener: Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log(
            "Notification response:",
            JSON.stringify(response, null, 2),
            JSON.stringify(response.notification.request.content.data, null, 2)
          );
          set({ notification: response.notification });

          // Handle the response here, e.g., navigate to a specific screen
        }
      ),
    });

    return () => {
      const { notificationListener, responseListener } = get();

      // Clean up the listeners when the component unmounts
      // Check if we have a current subscription before removing it
      if (notificationListener) {
        notificationListener.remove();
      }
      if (responseListener) {
        responseListener.remove();
      }
    };
  },
}));

// Selectors
export const useExpoPushToken = () =>
  useNotificationStore((state) => state.expoPushToken);

export const useNotification = () =>
  useNotificationStore((state) => state.notification);

export const useNotificationError = () =>
  useNotificationStore((state) => state.error);

export const useStartNotifications = () =>
  useNotificationStore((state) => state.startNotifications);
