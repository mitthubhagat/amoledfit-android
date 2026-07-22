import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { SettingsProvider } from './providers/SettingsProvider';
import { ProgressProvider } from './providers/ProgressProvider';
import { WorkoutSessionProvider } from './providers/WorkoutSessionProvider';
import { HomeScreen } from './screens/HomeScreen';
import { WorkoutScreen } from './screens/WorkoutScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { NutritionScreen } from './screens/NutritionScreen';
import { SettingsScreen } from './screens/SettingsScreen';

function AppShell() {
  return (
    <div className="min-h-screen bg-black">
      <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-black">
        {/* Ambient background glows for the AMOLED glassmorphism theme */}
        <div className="pointer-events-none fixed left-1/2 top-0 h-72 w-72 max-w-md -translate-x-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="pointer-events-none fixed bottom-0 left-1/2 h-72 w-72 max-w-md -translate-x-1/2 rounded-full bg-blue-600/15 blur-[100px]" />

        <main className="relative z-10 min-h-screen px-4 pb-28">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/workout" element={<WorkoutScreen />} />
            <Route path="/progress" element={<ProgressScreen />} />
            <Route path="/nutrition" element={<NutritionScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <SettingsProvider>
        <ProgressProvider>
          <WorkoutSessionProvider>
            <AppShell />
          </WorkoutSessionProvider>
        </ProgressProvider>
      </SettingsProvider>
    </HashRouter>
  );
}
