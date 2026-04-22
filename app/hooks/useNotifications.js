import { useEffect, useRef } from 'react';
import { useAppState } from './useAppState';
import NotificationService from '../services/notificationService';
import { lastWorkedAt } from '../utils/statsUtils';
import { isIOS } from '../utils/platform';

export function useNotifications() {
  const { muscleGroups, workoutLog, settings, setScheduledNotification } = useAppState();
  const lastSyncKey = useRef('');

  useEffect(() => {
    if (!isIOS) return;
    if (!settings?.notificationsEnabled) {
      NotificationService.cancelAll();
      return;
    }

    const key = JSON.stringify({
      wl: workoutLog.map((e) => e.id + '|' + e.timestamp),
      mg: muscleGroups.map((m) => m.id + '|' + m.recommendedRestHours),
    });
    if (key === lastSyncKey.current) return;
    lastSyncKey.current = key;

    (async () => {
      await NotificationService.configure();
      const granted = await NotificationService.requestPermission();
      if (!granted) return;
      await NotificationService.cancelAll();

      for (const mg of muscleGroups) {
        const last = lastWorkedAt(workoutLog, mg.id);
        if (!last) continue;
        const trigger = new Date(new Date(last).getTime() + mg.recommendedRestHours * 3600 * 1000);
        if (trigger.getTime() <= Date.now()) continue;
        const notifId = await NotificationService.scheduleRestedNotification(mg.name, trigger);
        if (notifId) setScheduledNotification(mg.id, notifId);
      }
    })();
  }, [muscleGroups, workoutLog, settings?.notificationsEnabled, setScheduledNotification]);
}
