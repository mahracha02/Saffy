import { useRouter } from "expo-router";
import { AlertCircle, ShieldAlert } from "lucide-react-native";
import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import * as Haptics from "expo-haptics";
 
import Colors from "@/constants/colors";
 
const { width } = Dimensions.get("window");
 
export default function HomeScreen() {
  const router = useRouter();
 
  const handleEmergencyPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    console.log("Emergency alert triggered");
    router.push("/(tabs)/scenarios");
  };
 
  const handleSilentPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    console.log("Silent alert triggered");
    router.push({
      pathname: "/(tabs)/alert-sent",
      params: { type: "silent" },
    });
  };
 
  return (
<View style={styles.container}>
<StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
<SafeAreaView style={styles.safeArea}>
<View style={styles.content}>
<View style={styles.header}>
<Text style={styles.logo}>ZONE ADAPT</Text>
<Text style={styles.subtitle}>Protection instantanée</Text>
</View>
 
          <View style={styles.mainButtonContainer}>
<Pressable 
              style={({ pressed }) => [
                styles.emergencyButton,
                pressed && styles.emergencyButtonPressed
              ]}
              onPress={handleEmergencyPress}
              testID="emergency-button"
>
<View style={styles.buttonContent}>
<ShieldAlert size={64} color={Colors.surface} strokeWidth={2.5} />
<Text style={styles.emergencyButtonText}>ALERTE</Text>
<Text style={styles.emergencyButtonSubtext}>Appuyer pour activer</Text>
</View>
</Pressable>
</View>
 
          <Pressable 
            style={({ pressed }) => [
              styles.silentButton,
              pressed && styles.silentButtonPressed
            ]}
            onPress={handleSilentPress}
            testID="silent-button"
>
<AlertCircle size={20} color={Colors.silent} strokeWidth={2.5} />
<Text style={styles.silentButtonText}>Alerte silencieuse</Text>
</Pressable>
 
          <View style={styles.footer}>
<Pressable 
              style={styles.refugeLink}
              onPress={() => router.push("/(tabs)/refuge-profile")}
>
<Text style={styles.refugeLinkText}>Je suis un refuge / commerçant</Text>
</Pressable>
</View>
</View>
</SafeAreaView>
</View>
  );
}
 
const BUTTON_SIZE = Math.min(width * 0.65, 280);
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 32,
  },
  header: {
    alignItems: "center",
    paddingTop: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.text,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: "500" as const,
  },
  mainButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  emergencyButtonPressed: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContent: {
    alignItems: "center",
    gap: 12,
  },
  emergencyButtonText: {
    fontSize: 32,
    fontWeight: "900" as const,
    color: Colors.surface,
    letterSpacing: 2,
  },
  emergencyButtonSubtext: {
    fontSize: 14,
    color: Colors.surface,
    opacity: 0.9,
    fontWeight: "500" as const,
  },
  silentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: Colors.silent,
  },
  silentButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  silentButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.silent,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 8,
  },
  refugeLink: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  refugeLinkText: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: "500" as const,
    textDecorationLine: "underline" as const,
  },
});