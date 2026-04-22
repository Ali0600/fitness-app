import { isIOS, isWeb } from '../utils/platform';

let Notifications = null;
if (!isWeb) {
  try {
    Notifications = require('expo-notifications');
  } catch (e) {
    console.warn('expo-notifications not available:', e);
  }
}

export default class NotificationService {
  static async configure() {
    if (!Notifications || !isIOS) return;
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    } catch (e) {
      console.warn('Notifications.setNotificationHandler failed:', e);
    }
  }

  static async requestPermission() {
    if (!Notifications || !isIOS) return false;
    try {
      const { status: existing } = await Notifications.getPermissionsAsync();
      if (existing === 'granted') return true;
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (e) {
      console.warn('requestPermission failed:', e);
      return false;
    }
  }

  static async scheduleRestedNotification(muscleName, triggerDate) {
    if (!Notifications || !isIOS) return null;
    try {
      const now = Date.now();
      const triggerMs = new Date(triggerDate).getTime();
      if (Number.isNaN(triggerMs) || triggerMs <= now) return null;
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Ready to train',
          body: `Your ${muscleName} has rested enough — it's ready to work again.`,
          sound: 'default',
        },
        trigger: { date: new Date(triggerMs) },
      });
      return id;
    } catch (e) {
      console.warn('scheduleRestedNotification failed:', e);
      return null;
    }
  }

  static async cancel(notifId) {
    if (!Notifications || !isIOS || !notifId) return;
    try {
      await Notifications.cancelScheduledNotificationAsync(notifId);
    } catch (e) {
      console.warn('cancel failed:', e);
    }
  }

  static async cancelAll() {
    if (!Notifications || !isIOS) return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {
      console.warn('cancelAll failed:', e);
    }
  }
}
