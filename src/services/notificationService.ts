// ============================================================================
// Notification service — schedules a daily workout reminder.
//
// Strategy (layered, best-effort):
//   1. Capacitor Local Notifications (Android-native, works in background)
//   2. Web Notifications API + Service Worker fallback (browser / PWA)
//   3. Page-level setTimeout (last resort — tab must stay open)
// ============================================================================

// Dynamically import Capacitor so the web build doesn't break if native isn't available
let localNotificationsPlugin: typeof import('@capacitor/local-notifications').LocalNotifications | null = null;

async function getLocalNotifications() {
  if (localNotificationsPlugin) return localNotificationsPlugin;
  try {
    // Only available in a Capacitor native context
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      localNotificationsPlugin = LocalNotifications;
      return localNotificationsPlugin;
    }
  } catch {
    // Not running in Capacitor — fall through to web path
  }
  return null;
}

// ── Runtime Capacitor platform check (sync, no import needed) ───────────────
// Capacitor injects window.Capacitor into the WebView at startup.
// Reading this global avoids CommonJS require() in an ESM module.
function isNativeCapacitor(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.() === true;
  } catch {
    return false;
  }
}

let pageTimeoutId: ReturnType<typeof setTimeout> | null = null;
let swRegistration: ServiceWorkerRegistration | null = null;

// ── Capability checks ───────────────────────────────────────────────────────

export function notificationsSupported(): boolean {
  if (typeof window === 'undefined') return false;
  if (isNativeCapacitor()) return true;
  return 'Notification' in window;
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  if (isNativeCapacitor()) return 'granted'; // handled by requestNotificationPermission()
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

// ── Permission ──────────────────────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  // Try Capacitor native first
  try {
    const plugin = await getLocalNotifications();
    if (plugin) {
      const { display } = await plugin.requestPermissions();
      return display === 'granted';
    }
  } catch {
    // fall through
  }

  // Web Notifications API fallback
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

// ── Service-worker registration (web fallback) ──────────────────────────────

async function ensureSW(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  if (swRegistration) return swRegistration;
  try {
    swRegistration = await navigator.serviceWorker.register('./notification-sw.js', { scope: './' });
    await navigator.serviceWorker.ready;
    return swRegistration;
  } catch {
    return null;
  }
}

function postToSW(message: object) {
  ensureSW().then((reg) => {
    const target = reg?.active ?? navigator.serviceWorker.controller;
    target?.postMessage(message);
  });
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function msUntilNextTime(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

function nextFireDate(hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

// ── Public API ───────────────────────────────────────────────────────────────

const REMINDER_NOTIFICATION_ID = 1001;

export async function scheduleDailyReminder(hhmm: string, enabled: boolean) {
  // --- Cancel existing page-level timer ---
  if (pageTimeoutId) {
    clearTimeout(pageTimeoutId);
    pageTimeoutId = null;
  }

  if (!enabled) {
    // Cancel SW reminder
    try {
      postToSW({ type: 'CANCEL_REMINDER' });
    } catch { /* ignore */ }

    // Cancel Capacitor native reminder
    try {
      const plugin = await getLocalNotifications();
      if (plugin) {
        await plugin.cancel({ notifications: [{ id: REMINDER_NOTIFICATION_ID }] });
      }
    } catch { /* ignore */ }
    return;
  }

  // ── Try Capacitor Local Notifications (Android-native) ──
  try {
    const plugin = await getLocalNotifications();
    if (plugin) {
      const { display } = await plugin.checkPermissions();
      if (display !== 'granted') {
        const { display: newDisplay } = await plugin.requestPermissions();
        if (newDisplay !== 'granted') return;
      }

      // Cancel any existing reminder first
      await plugin.cancel({ notifications: [{ id: REMINDER_NOTIFICATION_ID }] });

      const fireAt = nextFireDate(hhmm);

      await plugin.schedule({
        notifications: [
          {
            id: REMINDER_NOTIFICATION_ID,
            title: 'Time to train 💪',
            body: "Your strength routine is ready. Let's build today's streak!",
            schedule: {
              at: fireAt,
              repeats: true,
              every: 'day',
            },
            channelId: 'workout-reminders',
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#7C3AED',
            sound: undefined,
            actionTypeId: '',
          },
        ],
      });
      return; // Done — native path succeeded
    }
  } catch {
    // Native path failed; fall through to web path
  }

  // ── Web Notifications + Service Worker path ──
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  postToSW({ type: 'SCHEDULE_REMINDER', hhmm });

  // Page-level fallback (tab must stay open)
  const fire = () => {
    try {
      new Notification('Time to train 💪', {
        body: "Your strength routine is ready. Let's build today's streak!",
        tag: 'workout-reminder',
      });
    } catch {
      // ignore
    }
    pageTimeoutId = setTimeout(fire, 24 * 60 * 60 * 1000);
  };
  pageTimeoutId = setTimeout(fire, msUntilNextTime(hhmm));
}

// ── Android Notification Channel setup (call once on app start) ─────────────

export async function createAndroidNotificationChannel(): Promise<void> {
  try {
    const plugin = await getLocalNotifications();
    if (!plugin) return;
    await plugin.createChannel({
      id: 'workout-reminders',
      name: 'Workout Reminders',
      description: 'Daily workout reminder notifications',
      importance: 4, // HIGH
      visibility: 1, // PUBLIC
      vibration: true,
      lights: true,
      lightColor: '#7C3AED',
      sound: undefined,
    });
  } catch {
    // ignore — channel creation is optional
  }
}
