// ============================================================================
// Vibration service — uses Capacitor Haptics on native Android,
// falls back to Web Vibration API on browsers.
// ============================================================================

let hapticsPlugin: typeof import('@capacitor/haptics').Haptics | null = null;

async function getHaptics() {
  if (hapticsPlugin) return hapticsPlugin;
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const { Haptics } = await import('@capacitor/haptics');
      hapticsPlugin = Haptics;
      return hapticsPlugin;
    }
  } catch {
    // Not in Capacitor
  }
  return null;
}

export class VibrationService {
  static async light(): Promise<void> {
    try {
      const haptics = await getHaptics();
      if (haptics) {
        const { ImpactStyle } = await import('@capacitor/haptics');
        await haptics.impact({ style: ImpactStyle.Light });
        return;
      }
    } catch {
      // fall through
    }
    try {
      if (navigator.vibrate) navigator.vibrate(30);
    } catch {
      // ignore
    }
  }

  static async medium(): Promise<void> {
    try {
      const haptics = await getHaptics();
      if (haptics) {
        const { ImpactStyle } = await import('@capacitor/haptics');
        await haptics.impact({ style: ImpactStyle.Medium });
        return;
      }
    } catch {
      // fall through
    }
    try {
      if (navigator.vibrate) navigator.vibrate(60);
    } catch {
      // ignore
    }
  }

  static async heavy(): Promise<void> {
    try {
      const haptics = await getHaptics();
      if (haptics) {
        const { ImpactStyle } = await import('@capacitor/haptics');
        await haptics.impact({ style: ImpactStyle.Heavy });
        return;
      }
    } catch {
      // fall through
    }
    try {
      if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    } catch {
      // ignore
    }
  }

  static async success(): Promise<void> {
    try {
      const haptics = await getHaptics();
      if (haptics) {
        const { NotificationType } = await import('@capacitor/haptics');
        await haptics.notification({ type: NotificationType.Success });
        return;
      }
    } catch {
      // fall through
    }
    try {
      if (navigator.vibrate) navigator.vibrate([40, 30, 80]);
    } catch {
      // ignore
    }
  }

  static async warning(): Promise<void> {
    try {
      const haptics = await getHaptics();
      if (haptics) {
        const { NotificationType } = await import('@capacitor/haptics');
        await haptics.notification({ type: NotificationType.Warning });
        return;
      }
    } catch {
      // fall through
    }
    try {
      if (navigator.vibrate) navigator.vibrate([60, 30, 60, 30, 60]);
    } catch {
      // ignore
    }
  }
}
