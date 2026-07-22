import type { AppSettings } from "../models/types";
import { BOX, readBox, writeBox } from "./storage";

export const defaultSettings: AppSettings = {
  darkMode: true,
  reminderEnabled: true,
  reminderTime: "04:00",
  restBetweenSetsSec: 90,
  restAfterPairSec: 90,
  soundOn: true,
  vibrationOn: true,
};

export function getSettings(): AppSettings {
  return readBox<AppSettings>(BOX.SETTINGS, defaultSettings);
}

export function saveSettings(settings: AppSettings): void {
  writeBox(BOX.SETTINGS, settings);
}
