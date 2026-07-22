import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Initialize Capacitor platform features before rendering
async function bootstrap() {
  // Set up the Android notification channel for reminders
  try {
    const { createAndroidNotificationChannel } = await import('./services/notificationService');
    await createAndroidNotificationChannel();
  } catch {
    // Not in Capacitor or channel already exists — safe to ignore
  }

  // On native Android, hide the splash screen after React is mounted
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const { StatusBar, Style } = await import('@capacitor/status-bar');
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#000000' });
    }
  } catch {
    // ignore
  }
}

bootstrap().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
