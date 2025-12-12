import React, { createContext, useState, useContext } from "react";

export interface MapSettings {
  voiceGuidanceEnabled: boolean;
  showRefugeMarkers: boolean;
  showDangerZone: boolean;
  showRefugeRadius: boolean;
  notificationsEnabled: boolean;
  distanceUnit: "km" | "m";
  voiceSpeechRate: number;
  voicePitch: number;
  mapType: "standard" | "satellite" | "hybrid";
  autoZoomNavigation: boolean;
  hapticFeedbackEnabled: boolean;
  routeVisualizationEnabled: boolean;
  arrivalNotificationDistance: number;
}

export const DEFAULT_SETTINGS: MapSettings = {
  voiceGuidanceEnabled: true,
  showRefugeMarkers: true,
  showDangerZone: true,
  showRefugeRadius: true,
  notificationsEnabled: true,
  distanceUnit: "km",
  voiceSpeechRate: 0.9,
  voicePitch: 1.0,
  mapType: "standard",
  autoZoomNavigation: true,
  hapticFeedbackEnabled: true,
  routeVisualizationEnabled: true,
  arrivalNotificationDistance: 100,
};

interface SettingsContextType {
  settings: MapSettings;
  updateSettings: (newSettings: Partial<MapSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<MapSettings>(DEFAULT_SETTINGS);

  const updateSettings = (newSettings: Partial<MapSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
