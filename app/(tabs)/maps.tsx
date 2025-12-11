import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Platform,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin, Navigation, Plus, Minus, Settings, MoreVertical } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker, Circle } from "react-native-maps";

import Colors from "@/constants/colors";

interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export default function MapsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = React.useRef<MapView>(null);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  
  // Animation for alert pulse
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    requestLocationPermission();
    
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy || 10,
      };

      setLocation(coords);
      setLoading(false);

      // Center map on user location
      const initialRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setCurrentRegion(initialRegion);
      mapRef.current?.animateToRegion(initialRegion, 1000);
    } catch {
      setError("Failed to get location");
      setLoading(false);
    }
  };

  const handleCenterMap = () => {
    if (location) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        500
      );
    }
  };

  const handleZoomIn = () => {
    const newRegion = {
      ...currentRegion,
      latitudeDelta: Math.max(currentRegion.latitudeDelta - 0.01, 0.005),
      longitudeDelta: Math.max(currentRegion.longitudeDelta - 0.01, 0.005),
    };
    setCurrentRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleZoomOut = () => {
    const newRegion = {
      ...currentRegion,
      latitudeDelta: Math.min(currentRegion.latitudeDelta + 0.01, 0.5),
      longitudeDelta: Math.min(currentRegion.longitudeDelta + 0.01, 0.5),
    };
    setCurrentRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleStop = () => {
    router.push("/(tabs)");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}> En cours de localisation...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (error || !location) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <MapPin size={48} color={Colors.warning} />
            <Text style={styles.errorText}>{error || "Location not available"}</Text>
            <Pressable style={styles.retryButton} onPress={requestLocationPermission}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          zoomControlEnabled={false}
          onRegionChangeComplete={setCurrentRegion}
        >
          {/* User location marker */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            description="Current position"
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerOuter}>
                <View style={styles.markerInner} />
              </View>
            </View>
          </Marker>

          {/* Accuracy circle */}
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={location.accuracy}
            fillColor={`${Colors.primary}20`}
            strokeColor={Colors.primary}
            strokeWidth={1}
          />
        </MapView>

        {/* Control buttons */}
        <View style={styles.controls}>
          <Pressable
            style={[styles.controlButton, styles.centerButton]}
            onPress={handleCenterMap}
          >
            <Navigation size={20} color={Colors.surface} />
          </Pressable>

          <View style={styles.zoomControls}>
            <Pressable
              style={[styles.controlButton, styles.zoomButton]}
              onPress={handleZoomIn}
            >
              <Plus size={20} color={Colors.surface} />
            </Pressable>
            <Pressable
              style={[styles.controlButton, styles.zoomButton]}
              onPress={handleZoomOut}
            >
              <Minus size={20} color={Colors.surface} />
            </Pressable>
          </View>
        </View>

        {/* Status indicator */}
        <View style={[styles.statusIndicator, { top: insets.top + 12 }]}>
          <View style={[styles.statusDot, styles.activeDot]} />
          <Text style={styles.statusText}>Live Location</Text>
        </View>
      </SafeAreaView>

      {/* Bottom Control Bar with FAB - Fixed outside SafeAreaView */}
      <View style={styles.bottomBarContainer}>
        {/* Floating Action Button - Centered and completely outside above bar */}
        <Animated.View style={[styles.stopButtonWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <Pressable 
            style={({ pressed }) => [
              styles.stopButton,
              pressed && styles.stopButtonPressed
            ]}
            onPress={handleStop}
          >
            <View style={styles.stopButtonContent}>
              <Image 
                source={require("@/assets/images/adaptive-icon.png")}
                style={styles.stopButtonIcon}
              />
              <Text style={styles.stopButtonLabel}>Stop</Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* Tab Bar - Below FAB with 3 sections */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom || 12 }]}>
          {/* Left: Settings Icon */}
          <Pressable style={styles.tabBarSection} onPress={() => console.log('Settings')}>
            <Settings size={24} color={Colors.secondary} strokeWidth={2} />
          </Pressable>

          {/* Center: Alert Status */}
          <View style={styles.tabBarCenter}>
            <View style={styles.alertBadge} />
            <Text style={styles.tabBarStatusText}>Vous êtes en alerte</Text>
          </View>

          {/* Right: More Icon */}
          <Pressable style={styles.tabBarSection} onPress={() => console.log('More')}>
            <MoreVertical size={24} color={Colors.secondary} strokeWidth={2} />
          </Pressable>
        </View>
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
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "500" as const,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: Colors.warning,
    textAlign: "center",
    fontWeight: "500" as const,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.surface,
  },
  markerContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  markerOuter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  markerInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  infoCard: {
    position: "absolute",
    bottom: 120,
    left: 16,
    right: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  infoContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500" as const,
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: "600" as const,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  controls: {
    position: "absolute",
    right: 16,
    bottom: 160,
    gap: 12,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  centerButton: {
    backgroundColor: Colors.secondary,
  },
  zoomControls: {
    gap: 8,
  },
  zoomButton: {
    backgroundColor: Colors.secondary,
  },
  statusIndicator: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    zIndex: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  activeDot: {
    backgroundColor: Colors.success,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: "600" as const,
  },
  bottomBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  bottomBar: {
    width: "100%",
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabBarSection: {
    width: 48,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
  },
  alertBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBarStatusText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.secondary,
  },
  stopButtonWrapper: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    zIndex: 10,
  },
  stopButton: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.darkLight,
    borderRadius: 95,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  stopButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.92 }],
  },
  stopButtonContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  stopButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: -12,
    marginTop: -4,
  },
  stopButtonLabel: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.secondary,
    letterSpacing: 0.3,
  },
  stopButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.surface,
    letterSpacing: 0.5,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
});

