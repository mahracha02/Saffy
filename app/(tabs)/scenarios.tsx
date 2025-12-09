import { useRouter } from "expo-router";
import {
  Building2,
  Bus,
  GraduationCap,
  Hospital,
  MapPin,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
 
type ScenarioType = "street" | "transport" | "merchant" | "campus" | "hospital";
 
interface Scenario {

  id: ScenarioType;

  title: string;

  icon: typeof MapPin;

  color: string;

  description: string;

}
 
const scenarios: Scenario[] = [

  {

    id: "street",

    title: "Rue",

    icon: MapPin,

    color: Colors.scenarios.street,

    description: "Situation dans la rue ou lieu public",

  },

  {

    id: "transport",

    title: "Transport",

    icon: Bus,

    color: Colors.scenarios.transport,

    description: "Dans un bus, métro, train ou taxi",

  },

  {

    id: "merchant",

    title: "Commerçant",

    icon: Building2,

    color: Colors.scenarios.merchant,

    description: "Chez un commerçant ou magasin",

  },

  {

    id: "campus",

    title: "Campus",

    icon: GraduationCap,

    color: Colors.scenarios.campus,

    description: "Sur un campus universitaire",

  },

  {

    id: "hospital",

    title: "Hôpital",

    icon: Hospital,

    color: Colors.scenarios.hospital,

    description: "Dans un établissement médical",

  },

];
 
export default function ScenariosScreen() {

  const router = useRouter();

  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);
 
  const handleScenarioPress = (scenarioId: ScenarioType) => {

    if (selectedScenario === scenarioId) {

      if (typeof Haptics !== 'undefined' && Haptics.notificationAsync) {

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      }

      console.log("Alert sent for scenario:", scenarioId);

      router.push({
        pathname: "/(tabs)/alert-sent",
        params: { type: "standard", scenario: scenarioId },
      });

    } else {

      if (typeof Haptics !== 'undefined' && Haptics.impactAsync) {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      }

      setSelectedScenario(scenarioId);

    }

  };
 
  const handleClose = () => {

    router.back();

  };
 
  return (
<View style={styles.container}>
<StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
<SafeAreaView style={styles.safeArea}>
<View style={styles.header}>
<View style={styles.headerContent}>
<Text style={styles.title}>Choisir le contexte</Text>
<Pressable 

              style={styles.closeButton}

              onPress={handleClose}

              testID="close-button"
>
<X size={24} color={Colors.text} strokeWidth={2.5} />
</Pressable>
</View>
<Text style={styles.instructions}>

            {selectedScenario 

              ? "Appuyer à nouveau pour confirmer l'alerte"

              : "Sélectionner votre situation actuelle"

            }
</Text>
</View>
 
        <ScrollView 

          style={styles.scrollView}

          contentContainerStyle={styles.scrollContent}

          showsVerticalScrollIndicator={false}
>
<View style={styles.scenariosGrid}>

            {scenarios.map((scenario) => {

              const Icon = scenario.icon;

              const isSelected = selectedScenario === scenario.id;
 
              return (
<Pressable

                  key={scenario.id}

                  style={({ pressed }) => [

                    styles.scenarioCard,

                    isSelected && styles.scenarioCardSelected,

                    pressed && styles.scenarioCardPressed,

                  ]}

                  onPress={() => handleScenarioPress(scenario.id)}

                  testID={`scenario-${scenario.id}`}
>
<View 

                    style={[

                      styles.iconContainer,

                      { backgroundColor: isSelected ? scenario.color : `${scenario.color}15` }

                    ]}
>
<Icon 

                      size={32} 

                      color={isSelected ? Colors.surface : scenario.color} 

                      strokeWidth={2.5}

                    />
</View>
<Text 

                    style={[

                      styles.scenarioTitle,

                      isSelected && { color: scenario.color, fontWeight: "700" as const }

                    ]}
>

                    {scenario.title}
</Text>
<Text style={styles.scenarioDescription}>

                    {scenario.description}
</Text>
</Pressable>

              );

            })}
</View>
</ScrollView>
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

  header: {

    paddingHorizontal: 24,

    paddingTop: 16,

    paddingBottom: 20,

  },

  headerContent: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 8,

  },

  title: {

    fontSize: 28,

    fontWeight: "800" as const,

    color: Colors.text,

  },

  closeButton: {

    width: 40,

    height: 40,

    borderRadius: 20,

    backgroundColor: Colors.surface,

    justifyContent: "center",

    alignItems: "center",

    shadowColor: Colors.shadow,

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 1,

    shadowRadius: 4,

    elevation: 2,

  },

  instructions: {

    fontSize: 15,

    color: Colors.textSecondary,

    fontWeight: "500" as const,

  },

  scrollView: {

    flex: 1,

  },

  scrollContent: {

    paddingHorizontal: 24,

    paddingBottom: 32,

  },

  scenariosGrid: {

    gap: 16,

  },

  scenarioCard: {

    backgroundColor: Colors.surface,

    borderRadius: 20,

    padding: 20,

    shadowColor: Colors.shadow,

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 1,

    shadowRadius: 8,

    elevation: 3,

    borderWidth: 2,

    borderColor: "transparent",

  },

  scenarioCardSelected: {

    borderColor: Colors.primary,

    shadowColor: Colors.primary,

    shadowOpacity: 0.2,

    shadowRadius: 12,

    elevation: 6,

  },

  scenarioCardPressed: {

    transform: [{ scale: 0.98 }],

    opacity: 0.9,

  },

  iconContainer: {

    width: 64,

    height: 64,

    borderRadius: 16,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 12,

  },

  scenarioTitle: {

    fontSize: 20,

    fontWeight: "700" as const,

    color: Colors.text,

    marginBottom: 4,

  },

  scenarioDescription: {

    fontSize: 14,

    color: Colors.textSecondary,

    lineHeight: 20,

  },

});

 