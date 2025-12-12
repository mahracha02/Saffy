import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Settings as SettingsIcon,
  ChevronLeft,
  Volume2,
  MapPin,
  Navigation,
  Bell,
  RotateCcw,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { useSettings } from "@/contexts/SettingsContext";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, updateSettings, resetSettings: contextResetSettings } =
    useSettings();

  const resetSettings = () => {
    Alert.alert(
      "Réinitialiser les paramètres",
      "Êtes-vous sûr de vouloir restaurer les paramètres par défaut ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Réinitialiser",
          onPress: () => {
            contextResetSettings();
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleGoBack = () => {
    router.back();
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <ChevronLeft size={24} color={Colors.text} strokeWidth={2.5} />
          </Pressable>
          <View style={styles.headerContent}>
            <SettingsIcon size={24} color={Colors.primary} strokeWidth={2.5} />
            <Text style={styles.headerTitle}>Paramètres Carte</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={true}
          contentInsetAdjustmentBehavior="automatic"
        >
          {/* Voice Guidance Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Volume2 size={20} color={Colors.primary} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Guidage Vocal</Text>
            </View>

            <SettingItem
              label="Activer le guidage vocal"
              description="Recevoir des annonces audio pendant la navigation"
              value={settings.voiceGuidanceEnabled}
              onChange={(value) =>
                updateSettings({ voiceGuidanceEnabled: value })
              }
            />

            {settings.voiceGuidanceEnabled && (
              <>
                <SliderSetting
                  label="Vitesse de parole"
                  description="Vitesse du texte parlé (0.5x - 2.0x)"
                  value={settings.voiceSpeechRate}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  onChange={(value) =>
                    updateSettings({ voiceSpeechRate: value })
                  }
                  format={(v) => `${v.toFixed(1)}x`}
                />

                <SliderSetting
                  label="Tonalité de la voix"
                  description="Hauteur du ton de la voix (0.5 - 2.0)"
                  value={settings.voicePitch}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  onChange={(value) =>
                    updateSettings({ voicePitch: value })
                  }
                  format={(v) => `${v.toFixed(1)}`}
                />

                <SelectSetting
                  label="Distance de notification d'arrivée"
                  description="Annoncer l'arrivée à"
                  value={settings.arrivalNotificationDistance}
                  options={[
                    { label: "50 m", value: 50 },
                    { label: "100 m", value: 100 },
                    { label: "200 m", value: 200 },
                    { label: "500 m", value: 500 },
                  ]}
                  onChange={(value) =>
                    updateSettings({
                      arrivalNotificationDistance: value,
                    })
                  }
                />
              </>
            )}
          </View>

          {/* Map Display Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={Colors.primary} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Affichage Carte</Text>
            </View>

            <SettingItem
              label="Afficher les marqueurs de refuge"
              description="Afficher les emplacements des refuges sur la carte"
              value={settings.showRefugeMarkers}
              onChange={(value) =>
                updateSettings({ showRefugeMarkers: value })
              }
            />

            <SettingItem
              label="Afficher les zones de danger"
              description="Afficher les zones d'alerte autour de vous"
              value={settings.showDangerZone}
              onChange={(value) =>
                updateSettings({ showDangerZone: value })
              }
            />

            <SettingItem
              label="Afficher les rayons des refuges"
              description="Afficher les zones de couverture de chaque refuge"
              value={settings.showRefugeRadius}
              onChange={(value) =>
                updateSettings({ showRefugeRadius: value })
              }
            />

            <SettingItem
              label="Visualiser les routes"
              description="Afficher le trajet avec une ligne colorée"
              value={settings.routeVisualizationEnabled}
              onChange={(value) =>
                updateSettings({ routeVisualizationEnabled: value })
              }
            />

            <SelectSetting
              label="Type de carte"
              description="Sélectionner le style de la carte"
              value={settings.mapType}
              options={[
                { label: "Standard", value: "standard" },
                { label: "Satellite", value: "satellite" },
                { label: "Hybride", value: "hybrid" },
              ]}
              onChange={(value) =>
                updateSettings({ mapType: value as any })
              }
            />
          </View>

          {/* Navigation Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Navigation size={20} color={Colors.primary} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Navigation</Text>
            </View>

            <SettingItem
              label="Zoom automatique"
              description="Zoomer automatiquement en arrivant à destination"
              value={settings.autoZoomNavigation}
              onChange={(value) =>
                updateSettings({ autoZoomNavigation: value })
              }
            />

            <SelectSetting
              label="Unité de distance"
              description="Afficher les distances en"
              value={settings.distanceUnit}
              options={[
                { label: "Kilomètres (km)", value: "km" },
                { label: "Mètres (m)", value: "m" },
              ]}
              onChange={(value) =>
                updateSettings({ distanceUnit: value })
              }
            />
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color={Colors.primary} strokeWidth={2} />
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>

            <SettingItem
              label="Notifications activées"
              description="Recevoir des notifications pendant la navigation"
              value={settings.notificationsEnabled}
              onChange={(value) =>
                updateSettings({ notificationsEnabled: value })
              }
            />

            <SettingItem
              label="Retours haptiques"
              description="Vibrations pour les événements importants"
              value={settings.hapticFeedbackEnabled}
              onChange={(value) =>
                updateSettings({ hapticFeedbackEnabled: value })
              }
            />
          </View>

          {/* Reset Section */}
          <View style={styles.section}>
            <Pressable style={styles.resetButton} onPress={resetSettings}>
              <RotateCcw size={18} color={Colors.surface} strokeWidth={2.5} />
              <Text style={styles.resetButtonText}>
                Réinitialiser les paramètres
              </Text>
            </Pressable>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Reusable Toggle Setting Component
function SettingItem({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.border, true: Colors.success }}
        thumbColor={value ? Colors.success : Colors.textSecondary}
      />
    </View>
  );
}

// Reusable Slider Setting Component
function SliderSetting({
  label,
  description,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
}) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderValue}>{format(value)}</Text>
        <View style={styles.sliderTrack}>
          <View
            style={[
              styles.sliderFill,
              {
                width: `${(((value - min) / (max - min)) * 100) % 101}%`,
              },
            ]}
          />
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>{format(min)}</Text>
          <Text style={styles.sliderLabel}>{format(max)}</Text>
        </View>
      </View>
    </View>
  );
}

// Reusable Select Setting Component
function SelectSetting({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string;
  description: string;
  value: any;
  options: { label: string; value: any }[];
  onChange: (value: any) => void;
}) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.optionButton,
              value === option.value && styles.optionButtonActive,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[
                styles.optionLabel,
                value === option.value && styles.optionLabelActive,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "400",
  },
  sliderContainer: {
    width: 120,
  },
  sliderValue: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
    textAlign: "right",
    marginBottom: 8,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  sliderFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  optionsContainer: {
    flexDirection: "column",
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  optionLabelActive: {
    color: Colors.surface,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.warning,
    borderRadius: 10,
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.surface,
  },
});
