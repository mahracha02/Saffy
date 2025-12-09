import { useRouter } from "expo-router";

import { Store, CheckCircle, MapPin, Bell, X } from "lucide-react-native";

import React, { useState } from "react";

import { 

  StyleSheet, 

  Text, 

  View, 

  Pressable,

  ScrollView,

  StatusBar,

  Switch,

  SafeAreaView,

} from "react-native";
 
import Colors from "@/constants/colors";
 
interface Alert {

  id: string;

  time: string;

  scenario: string;

  distance: string;

  status: "active" | "resolved";

}
 
const mockAlerts: Alert[] = [

  {

    id: "1",

    time: "Il y a 2 minutes",

    scenario: "Transport",

    distance: "150m",

    status: "active",

  },

  {

    id: "2",

    time: "Il y a 15 minutes",

    scenario: "Rue",

    distance: "450m",

    status: "active",

  },

  {

    id: "3",

    time: "Il y a 1 heure",

    scenario: "Campus",

    distance: "1.2km",

    status: "resolved",

  },

];
 
export default function RefugeProfileScreen() {

  const router = useRouter();

  const [isAvailable, setIsAvailable] = useState(true);

  const [alerts] = useState<Alert[]>(mockAlerts);
 
  const activeAlerts = alerts.filter(a => a.status === "active");
 
  const handleClose = () => {

    router.back();

  };
 
  return (
<View style={styles.container}>
<StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
<SafeAreaView style={styles.safeArea}>
<View style={styles.header}>
<View style={styles.headerTop}>
<View style={styles.headerLeft}>
<Store size={28} color={Colors.scenarios.merchant} strokeWidth={2.5} />
<Text style={styles.title}>Refuge partenaire</Text>
</View>
<Pressable 

              style={styles.closeButton}

              onPress={handleClose}

              testID="close-button"
>
<X size={24} color={Colors.text} strokeWidth={2.5} />
</Pressable>
</View>
<View style={styles.statusCard}>
<View style={styles.statusHeader}>
<View style={styles.statusInfo}>
<Text style={styles.statusTitle}>Statut de disponibilité</Text>
<Text style={styles.statusSubtitle}>

                  {isAvailable ? "Ouvert et prêt à aider" : "Temporairement indisponible"}
</Text>
</View>
<Switch

                value={isAvailable}

                onValueChange={setIsAvailable}

                trackColor={{ false: Colors.border, true: Colors.success }}

                thumbColor={Colors.surface}

                testID="availability-switch"

              />
</View>
</View>
</View>
 
        <ScrollView 

          style={styles.scrollView}

          contentContainerStyle={styles.scrollContent}

          showsVerticalScrollIndicator={false}
>
<View style={styles.section}>
<View style={styles.sectionHeader}>
<Bell size={20} color={Colors.text} strokeWidth={2.5} />
<Text style={styles.sectionTitle}>

                Alertes actives ({activeAlerts.length})
</Text>
</View>
 
            {activeAlerts.length === 0 ? (
<View style={styles.emptyState}>
<CheckCircle size={48} color={Colors.textLight} strokeWidth={2} />
<Text style={styles.emptyStateText}>Aucune alerte active</Text>
<Text style={styles.emptyStateSubtext}>

                  Vous serez notifié en cas d&apos;alerte à proximité
</Text>
</View>

            ) : (
<View style={styles.alertsList}>

                {activeAlerts.map((alert) => (
<View key={alert.id} style={styles.alertCard}>
<View style={styles.alertHeader}>
<View style={styles.alertBadge}>
<View style={styles.alertDot} />
<Text style={styles.alertBadgeText}>En cours</Text>
</View>
<Text style={styles.alertTime}>{alert.time}</Text>
</View>
<View style={styles.alertContent}>
<Text style={styles.alertScenario}>{alert.scenario}</Text>
<View style={styles.alertDistance}>
<MapPin size={16} color={Colors.textSecondary} strokeWidth={2.5} />
<Text style={styles.alertDistanceText}>{alert.distance}</Text>
</View>
</View>
 
                    <Pressable 

                      style={({ pressed }) => [

                        styles.helpButton,

                        pressed && styles.helpButtonPressed

                      ]}

                      onPress={() => console.log("Help alert:", alert.id)}
>
<Text style={styles.helpButtonText}>Proposer mon aide</Text>
</Pressable>
</View>

                ))}
</View>

            )}
</View>
 
          <View style={styles.infoSection}>
<Text style={styles.infoTitle}>Comment ça marche ?</Text>
<View style={styles.infoList}>
<View style={styles.infoItem}>
<View style={styles.infoBullet} />
<Text style={styles.infoText}>

                  Recevez des notifications lorsqu&apos;une alerte est déclenchée à proximité
</Text>
</View>
<View style={styles.infoItem}>
<View style={styles.infoBullet} />
<Text style={styles.infoText}>

                  Proposez votre aide en toute sécurité
</Text>
</View>
<View style={styles.infoItem}>
<View style={styles.infoBullet} />
<Text style={styles.infoText}>

                  Offrez un refuge temporaire si nécessaire
</Text>
</View>
</View>
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

    gap: 16,

  },

  headerTop: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
 
},

  headerLeft: {

    flexDirection: "row",

    alignItems: "center",

    gap: 12,

  },

  title: {

    fontSize: 24,

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

  statusCard: {

    backgroundColor: Colors.surface,

    borderRadius: 16,

    padding: 16,

    shadowColor: Colors.shadow,

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 1,

    shadowRadius: 8,

    elevation: 3,

  },

  statusHeader: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

  },

  statusInfo: {

    flex: 1,

  },

  statusTitle: {

    fontSize: 16,

    fontWeight: "700" as const,

    color: Colors.text,

    marginBottom: 4,

  },

  statusSubtitle: {

    fontSize: 14,

    color: Colors.textSecondary,

  },

  scrollView: {

    flex: 1,

  },

  scrollContent: {

    paddingHorizontal: 24,

    paddingBottom: 32,

  },

  section: {

    marginBottom: 32,

  },

  sectionHeader: {

    flexDirection: "row",

    alignItems: "center",

    gap: 8,

    marginBottom: 16,

  },

  sectionTitle: {

    fontSize: 18,

    fontWeight: "700" as const,

    color: Colors.text,

  },

  emptyState: {

    backgroundColor: Colors.surface,

    borderRadius: 16,

    padding: 32,

    alignItems: "center",

    shadowColor: Colors.shadow,

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 1,

    shadowRadius: 8,

    elevation: 3,

  },

  emptyStateText: {

    fontSize: 16,

    fontWeight: "600" as const,

    color: Colors.text,

    marginTop: 16,

  },

  emptyStateSubtext: {

    fontSize: 14,

    color: Colors.textSecondary,

    textAlign: "center",

    marginTop: 8,

  },

  alertsList: {

    gap: 12,

  },

  alertCard: {

    backgroundColor: Colors.surface,

    borderRadius: 16,

    padding: 16,

    shadowColor: Colors.shadow,

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 1,

    shadowRadius: 8,

    elevation: 3,

    borderLeftWidth: 4,

    borderLeftColor: Colors.primary,

  },

  alertHeader: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 12,

  },

  alertBadge: {

    flexDirection: "row",

    alignItems: "center",

    gap: 6,

    backgroundColor: `${Colors.primary}15`,

    paddingHorizontal: 10,

    paddingVertical: 4,

    borderRadius: 8,

  },

  alertDot: {

    width: 6,

    height: 6,

    borderRadius: 3,

    backgroundColor: Colors.primary,

  },

  alertBadgeText: {

    fontSize: 12,

    fontWeight: "600" as const,

    color: Colors.primary,

  },

  alertTime: {

    fontSize: 12,

    color: Colors.textSecondary,

  },

  alertContent: {

    marginBottom: 12,

  },

  alertScenario: {

    fontSize: 18,

    fontWeight: "700" as const,

    color: Colors.text,

    marginBottom: 8,

  },

  alertDistance: {

    flexDirection: "row",

    alignItems: "center",

    gap: 4,

  },

  alertDistanceText: {

    fontSize: 14,

    color: Colors.textSecondary,

    fontWeight: "500" as const,

  },

  helpButton: {

    backgroundColor: Colors.primary,

    borderRadius: 12,

    paddingVertical: 12,

    paddingHorizontal: 16,

    alignItems: "center",

  },

  helpButtonPressed: {

    opacity: 0.8,

    transform: [{ scale: 0.98 }],

  },

  helpButtonText: {

    fontSize: 14,

    fontWeight: "700" as const,

    color: Colors.surface,

  },

  infoSection: {

    backgroundColor: Colors.surface,

    borderRadius: 16,

    padding: 20,

    shadowColor: Colors.shadow,

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 1,

    shadowRadius: 8,

    elevation: 3,

  },

  infoTitle: {

    fontSize: 18,

    fontWeight: "700" as const,

    color: Colors.text,

    marginBottom: 16,

  },

  infoList: {

    gap: 12,

  },

  infoItem: {

    flexDirection: "row",

    gap: 12,

    alignItems: "flex-start",

  },

  infoBullet: {

    width: 6,

    height: 6,

    borderRadius: 3,

    backgroundColor: Colors.scenarios.merchant,

    marginTop: 6,

  },

  infoText: {

    flex: 1,

    fontSize: 14,

    color: Colors.textSecondary,

    lineHeight: 20,

  },

});

 