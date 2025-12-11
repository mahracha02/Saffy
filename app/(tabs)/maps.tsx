import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin, Navigation, Plus, Minus, X } from "lucide-react-native";
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

  useEffect(() => {
    requestLocationPermission();
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
    router.back();
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
      <SafeAreaView style={styles.safeArea}>
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

        {/* Location info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoContent}>
            <View style={styles.infoRow}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={styles.infoLabel}>Latitude</Text>
              <Text style={styles.infoValue}>{location.latitude.toFixed(4)}</Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={styles.infoLabel}>Longitude</Text>
              <Text style={styles.infoValue}>{location.longitude.toFixed(4)}</Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={16} color={Colors.GreenLight} />
              <Text style={styles.infoLabel}>Accuracy</Text>
              <Text style={styles.infoValue}>{Math.round(location.accuracy)}m</Text>
            </View>
          </View>
        </View>

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
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, styles.activeDot]} />
          <Text style={styles.statusText}>Live Location</Text>
        </View>

        {/* Bottom Control Bar */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom || 16 }]}>
          <Pressable 
            style={({ pressed }) => [
              styles.stopButton,
              pressed && styles.stopButtonPressed
            ]}
            onPress={handleStop}
          >
            <X size={24} color={Colors.surface} strokeWidth={2.5} />
            <Text style={styles.stopButtonText}>Arrêter</Text>
          </Pressable>
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
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  centerButton: {
    backgroundColor: Colors.primary,
  },
  zoomControls: {
    gap: 8,
  },
  zoomButton: {
    backgroundColor: Colors.primary,
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
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  stopButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  stopButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.surface,
    letterSpacing: 0.5,
  },
});

