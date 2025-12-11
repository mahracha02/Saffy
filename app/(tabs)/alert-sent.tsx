import { useRouter, useLocalSearchParams } from "expo-router";
import { CheckCircle, Shield, Phone, MapPin } from "lucide-react-native";
import React, { useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable,
  StatusBar,
  Animated,
  SafeAreaView,
} from "react-native";
 
import Colors from "@/constants/colors";
 
const scenarioNames: Record<string, string> = {
  street: "Rue",
  transport: "Transport",
  merchant: "Commerçant",
  campus: "Campus",
  hospital: "Hôpital",
  silent: "Silencieuse"
};

export default function AlertSentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const alertType = params.type as string;
  const scenario = params.scenario as string;
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
 
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, [scaleAnim, fadeAnim]);
 
  const isSilent = alertType === "silent";
  const scenarioName = scenario ? scenarioNames[scenario] : "";
 
  const handleDone = () => {
    router.dismissAll();
    router.replace("/(tabs)/maps");
  };
 
  return (
<View style={styles.container}>
<StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
<SafeAreaView style={styles.safeArea}>
<View style={styles.content}>
<Animated.View 
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              }
            ]}
>
<CheckCircle size={80} color={Colors.surface} strokeWidth={2.5} />
</Animated.View>
 
          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
<Text style={styles.title}>Alerte envoyée</Text>
            {scenarioName && (
<Text style={styles.scenario}>Contexte: {scenarioName}</Text>
            )}
            {isSilent && (
<Text style={styles.silent}>Mode silencieux activé</Text>
            )}
</Animated.View>
 
          <Animated.View style={[styles.instructionsContainer, { opacity: fadeAnim }]}>
<View style={styles.instructionCard}>
<Shield size={24} color={Colors.secondary} strokeWidth={2.5} />
<View style={styles.instructionText}>
<Text style={styles.instructionTitle}>Vos contacts alertés</Text>
<Text style={styles.instructionDescription}>
                  Vos contacts d&apos;urgence ont été notifiés de votre situation et de votre localisation.
</Text>
</View>
</View>
 
            <View style={styles.instructionCard}>
<MapPin size={24} color={Colors.secondary} strokeWidth={2.5} />
<View style={styles.instructionText}>
<Text style={styles.instructionTitle}>Position partagée</Text>
<Text style={styles.instructionDescription}>
                  Votre localisation est partagée en temps réel avec vos contacts de confiance.
</Text>
</View>
</View>
 
            <View style={styles.instructionCard}>
<Phone size={24} color={Colors.secondary} strokeWidth={2.5} />
<View style={styles.instructionText}>
<Text style={styles.instructionTitle}>Aide en route</Text>
<Text style={styles.instructionDescription}>
                  Les refuges et commerçants partenaires à proximité ont été alertés.
</Text>
</View>
</View>
</Animated.View>
 
          <Animated.View style={[styles.actionsContainer, { opacity: fadeAnim }]}>
<Pressable 
              style={({ pressed }) => [
                styles.emergencyCallButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => console.log("Emergency call: 112")}
>
<Phone size={20} color={Colors.surface} strokeWidth={2.5} />
<Text style={styles.emergencyCallText}>Appeler le 112</Text>
</Pressable>
 
            <Pressable 
              style={({ pressed }) => [
                styles.doneButton,
                pressed && styles.buttonPressed
              ]}
              onPress={handleDone}
              testID="done-button"
>
<Text style={styles.doneButtonText} onPress={handleDone}>Passer à la carte</Text>
</Pressable>
</Animated.View>
</View>
</SafeAreaView>
</View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GreenLight,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.surface,
    marginBottom: 8,
    textAlign: "center",
  },
  scenario: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.surface,
    opacity: 0.9,
    marginTop: 4,
  },
  silent: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.surface,
    opacity: 0.8,
    marginTop: 4,
  },
  instructionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  instructionCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    alignItems: "flex-start",
  },
  instructionText: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  instructionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  emergencyCallButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    backgroundColor: Colors.darkLight,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  emergencyCallText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.surface,
  },
  doneButton: {
    paddingVertical: 16,
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.surface,
    alignItems: "center",
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.surface,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});