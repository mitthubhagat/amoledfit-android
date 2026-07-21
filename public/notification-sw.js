// ============================================================================
// Notification Service Worker — schedules daily reminders even when the
// tab is in the background. Used as fallback when Capacitor native
// notifications are not available (i.e. web/PWA mode).
// ============================================================================

/* global self, setTimeout, clearTimeout */

let scheduledTimeoutId = null;

function msUntilNextTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

function armReminder(hhmm) {
  if (scheduledTimeoutId !== null) {
    clearTimeout(scheduledTimeoutId);
    scheduledTimeoutId = null;
  }

  const fire = () => {
    self.registration.showNotification('Time to train 💪', {
      body: "Your strength routine is ready. Let's build today's streak!",
      tag: 'workout-reminder',
      icon: './favicon.svg',
      badge: './favicon.svg',
      vibrate: [200, 100, 200],
      actions: [
        { action: 'open', title: 'Open App' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    });
    // Re-arm for tomorrow
    scheduledTimeoutId = setTimeout(fire, 24 * 60 * 60 * 1000);
  };

  scheduledTimeoutId = setTimeout(fire, msUntilNextTime(hhmm));
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});

self.addEventListener('message', (event) => {
  const { type, hhmm } = event.data ?? {};
  if (type === 'SCHEDULE_REMINDER' && hhmm) {
    armReminder(hhmm);
  } else if (type === 'CANCEL_REMINDER') {
    if (scheduledTimeoutId !== null) {
      clearTimeout(scheduledTimeoutId);
      scheduledTimeoutId = null;
    }
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
