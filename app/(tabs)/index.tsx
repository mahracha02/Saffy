import { useRouter } from "expo-router";
import { AlertCircle } from "lucide-react-native";
import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import { SwipeAlertButton } from "@/components/swipe-alert-button";
 

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleScenarioSelect = (scenario: "street" | "transport") => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    console.log(`Alert triggered for scenario: ${scenario}`);
    router.push({
      pathname: "/(tabs)/alert-sent",
      params: { 
        type: scenario,
      },
    });
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
<View style={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
<View style={styles.header}>
<Image 
  source={require("@/assets/images/adaptive-icon.png")}
  style={styles.logo}
  resizeMode="contain"
/>
<Text style={styles.appName}>Saffy</Text>
<Text style={styles.subtitle}>Ensemble, créons des lieux plus sûrs.</Text>
</View>
 


<View style={styles.mainButtonContainer}>
  <SwipeAlertButton onScenarioSelect={handleScenarioSelect} />
  
  <View style={styles.footer}>
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
    <Pressable 
      style={styles.refugeLink}
      onPress={() => router.push("/(tabs)/refuge-profile")}
    >
      <Text style={styles.refugeLinkText}>Trouver un refuge à proximité</Text>
    </Pressable>
  </View>
</View>
</View>
</SafeAreaView>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: -8,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    paddingTop: 12,
  },
  logo: {
    width: 140,
    height: 140,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.text,
    marginTop: -12,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "500" as const,
    marginBottom: 80,
  },
  mainButtonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  silentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: Colors.silent,
    marginTop: 12,
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
    paddingBottom: 16,
    marginTop: 12,
  },
  refugeLink: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  refugeLinkText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500" as const,
    textDecorationLine: "underline" as const,
  },
});