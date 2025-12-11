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
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin, Navigation, Plus, Minus, Settings, MoreVertical, X, ChevronRight, Menu, Volume2, VolumeX } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import MapView, { Marker, Circle, Polyline } from "react-native-maps";

import Colors from "@/constants/colors";

interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface RefugeZone {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  radius: number;
}

const REFUGE_ZONES: RefugeZone[] = [
  // Labege (Sud-Est)
  {
    id: "refuge-1",
    latitude: 43.5397,
    longitude: 1.5236,
    name: "Centre Labège",
    radius: 10,
  },
  {
    id: "refuge-2",
    latitude: 43.5450,
    longitude: 1.5180,
    name: "Labège Innopole",
    radius: 10,
  },
  {
    id: "refuge-3",
    latitude: 43.5320,
    longitude: 1.5290,
    name: "Parc Labège Village",
    radius: 10,
  },
  // Blagnac (Nord-Ouest)
  {
    id: "refuge-4",
    latitude: 43.6360,
    longitude: 1.3890,
    name: "Centre Blagnac",
    radius: 10,
  },
  {
    id: "refuge-5",
    latitude: 43.6420,
    longitude: 1.3750,
    name: "Parc de Blagnac",
    radius: 10,
  },
  {
    id: "refuge-6",
    latitude: 43.6290,
    longitude: 1.3960,
    name: "Odyssud Blagnac",
    radius: 10,
  },
  // Colomiers (Ouest)
  {
    id: "refuge-7",
    latitude: 43.6109,
    longitude: 1.3340,
    name: "Centre Colomiers",
    radius: 10,
  },
  {
    id: "refuge-8",
    latitude: 43.6180,
    longitude: 1.3210,
    name: "Parc du Cabirol",
    radius: 10,
  },
  {
    id: "refuge-9",
    latitude: 43.6040,
    longitude: 1.3450,
    name: "Colomiers Lycée",
    radius: 10,
  },
  // Balma (Est)
  {
    id: "refuge-10",
    latitude: 43.6110,
    longitude: 1.4990,
    name: "Centre Balma",
    radius: 10,
  },
  {
    id: "refuge-11",
    latitude: 43.6200,
    longitude: 1.5080,
    name: "Balma Gramont",
    radius: 10,
  },
  {
    id: "refuge-12",
    latitude: 43.6050,
    longitude: 1.4890,
    name: "Parc Balma",
    radius: 10,
  },
  // Castanet-Tolosan (Sud-Est)
  {
    id: "refuge-13",
    latitude: 43.5163,
    longitude: 1.4978,
    name: "Centre Castanet",
    radius: 10,
  },
  {
    id: "refuge-14",
    latitude: 43.5230,
    longitude: 1.5050,
    name: "Castanet Place",
    radius: 10,
  },
  {
    id: "refuge-15",
    latitude: 43.5100,
    longitude: 1.4890,
    name: "Parc Castanet",
    radius: 10,
  },
  // Tournefeuille (Sud-Ouest)
  {
    id: "refuge-16",
    latitude: 43.5851,
    longitude: 1.3440,
    name: "Centre Tournefeuille",
    radius: 10,
  },
  {
    id: "refuge-17",
    latitude: 43.5920,
    longitude: 1.3350,
    name: "Parc du Château",
    radius: 10,
  },
  {
    id: "refuge-18",
    latitude: 43.5780,
    longitude: 1.3520,
    name: "Tournefeuille Mairie",
    radius: 10,
  },
  // Cugnaux (Sud-Ouest)
  {
    id: "refuge-19",
    latitude: 43.5368,
    longitude: 1.3455,
    name: "Centre Cugnaux",
    radius: 10,
  },
  {
    id: "refuge-20",
    latitude: 43.5420,
    longitude: 1.3380,
    name: "Parc de Cugnaux",
    radius: 10,
  },
  {
    id: "refuge-21",
    latitude: 43.5310,
    longitude: 1.3540,
    name: "Cugnaux Sports",
    radius: 10,
  },
  // Muret (Sud)
  {
    id: "refuge-22",
    latitude: 43.4616,
    longitude: 1.3267,
    name: "Centre Muret",
    radius: 10,
  },
  {
    id: "refuge-23",
    latitude: 43.4690,
    longitude: 1.3180,
    name: "Parc de Muret",
    radius: 10,
  },
  {
    id: "refuge-24",
    latitude: 43.4550,
    longitude: 1.3340,
    name: "Muret Gare",
    radius: 10,
  },
  {
    id: "refuge-25",
    latitude: 43.4720,
    longitude: 1.3410,
    name: "Muret Estantens",
    radius: 10,
  },
  // Portet-sur-Garonne (Sud)
  {
    id: "refuge-26",
    latitude: 43.5220,
    longitude: 1.4080,
    name: "Centre Portet",
    radius: 10,
  },
  {
    id: "refuge-27",
    latitude: 43.5180,
    longitude: 1.3980,
    name: "Portet Récébédou",
    radius: 10,
  },
  {
    id: "refuge-28",
    latitude: 43.5280,
    longitude: 1.4150,
    name: "Parc Portet",
    radius: 10,
  },
  // Centre Toulouse
  {
    id: "refuge-29",
    latitude: 43.6047,
    longitude: 1.4410,
    name: "Capitole Toulouse",
    radius: 10,
  },
  {
    id: "refuge-30",
    latitude: 43.5890,
    longitude: 1.4520,
    name: "Arnaud-Bernard",
    radius: 10,
  },
  {
    id: "refuge-31",
    latitude: 43.6200,
    longitude: 1.4300,
    name: "Compans Caffarelli",
    radius: 10,
  },
  {
    id: "refuge-32",
    latitude: 43.5750,
    longitude: 1.4650,
    name: "Saint-Cyprien",
    radius: 10,
  },
  {
    id: "refuge-33",
    latitude: 43.6109,
    longitude: 1.4637,
    name: "Jardin des Plantes",
    radius: 10,
  },
  {
    id: "refuge-34",
    latitude: 43.5970,
    longitude: 1.4284,
    name: "Place Wilson",
    radius: 10,
  },
  {
    id: "refuge-35",
    latitude: 43.5844,
    longitude: 1.4390,
    name: "Quartier Carmes",
    radius: 10,
  },
];

export default function MapsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nearestRefuge, setNearestRefuge] = useState<RefugeZone | null>(null);
  const [showRefugeCard, setShowRefugeCard] = useState(true);
  const [showRefugeDrawer, setShowRefugeDrawer] = useState(false);
  const [selectedRefuge, setSelectedRefuge] = useState<RefugeZone | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<{latitude: number, longitude: number}[]>([]);
  const [isVoiceGuidanceActive, setIsVoiceGuidanceActive] = useState(false);
  const [lastDistance, setLastDistance] = useState<number | null>(null);
  const [isNavigationMode, setIsNavigationMode] = useState(false);
  const mapRef = React.useRef<MapView>(null);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 43.6047,
    longitude: 1.4410,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  
  // Animation for alert pulse
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  // Animation for user location pulse
  const locationPulseAnim = React.useRef(new Animated.Value(1)).current;
  
  // Animation for location indicator jump
  const locationJumpAnim = React.useRef(new Animated.Value(0)).current;
  
  // Animated values for refuge zone rings
  const refugeAnims = React.useRef(
    REFUGE_ZONES.map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    requestLocationPermission();
    
    // Start pulse animation for alert button
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
    
    // Start pulsing animation for user location (faster, more frequent)
    Animated.loop(
      Animated.sequence([
        Animated.timing(locationPulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(locationPulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Start jumping animation for location indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(locationJumpAnim, {
          toValue: -15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(locationJumpAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Start refuge zone animations
    refugeAnims.forEach((anim) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.3,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
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

      // Find nearest refuge after location is set - pass coords directly
      findNearestRefugeWithCoords(coords);

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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  

  const findNearestRefugeWithCoords = (coords: LocationCoords) => {
    let nearest = REFUGE_ZONES[0];
    let minDistance = calculateDistance(coords.latitude, coords.longitude, nearest.latitude, nearest.longitude);

    REFUGE_ZONES.forEach((zone) => {
      const distance = calculateDistance(coords.latitude, coords.longitude, zone.latitude, zone.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = zone;
      }
    });

    setNearestRefuge(nearest);
  };

  const speakDirection = (message: string) => {
    Speech.speak(message, {
      language: 'fr-FR',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  const toggleVoiceGuidance = () => {
    if (isVoiceGuidanceActive) {
      Speech.stop();
      setIsVoiceGuidanceActive(false);
    } else {
      setIsVoiceGuidanceActive(true);
      const targetRefuge = selectedRefuge || nearestRefuge;
      if (targetRefuge) {
        speakDirection(`Guidage vocal activé. Direction ${targetRefuge.name}`);
      }
    }
  };

  const fetchRoute = async (destination: RefugeZone) => {
    if (!location) return;
    
    try {
      // Try OSRM API first
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${location.longitude},${location.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      // Check if response is ok before parsing
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
      
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates.map(
          (coord: [number, number]) => ({
            latitude: coord[1],
            longitude: coord[0],
          })
        );
        setRouteCoordinates(coords);
        setShowRoute(true);
        
        // Calculate distance and provide initial voice guidance
        const distanceKm = (data.routes[0].distance / 1000).toFixed(1);
        const durationMin = Math.round(data.routes[0].duration / 60);
        speakDirection(`Itinéraire trouvé. Distance ${distanceKm} kilomètres. Durée estimée ${durationMin} minutes.`);
        return;
      }
    } catch (error) {
      console.log('OSRM API failed, using fallback route:', error);
    }
    
    // Fallback: Create a simple curved path
    const points = 20;
    const route = [];
    for (let i = 0; i <= points; i++) {
      const fraction = i / points;
      route.push({
        latitude: location.latitude + (destination.latitude - location.latitude) * fraction,
        longitude: location.longitude + (destination.longitude - location.longitude) * fraction,
      });
    }
    setRouteCoordinates(route);
    setShowRoute(true);
  };

  const handleNavigateToRefuge = () => {
    if (nearestRefuge) {
      setIsNavigationMode(true);
      setIsVoiceGuidanceActive(true);
      
      // Immediate voice announcement
      Speech.speak(`Démarrage de la navigation vers ${nearestRefuge.name}`, {
        language: 'fr-FR',
        pitch: 1.0,
        rate: 0.9,
      });
      
      fetchRoute(nearestRefuge);
      mapRef.current?.animateToRegion(
        {
          latitude: nearestRefuge.latitude,
          longitude: nearestRefuge.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    }
  };

  // Voice guidance based on distance updates
  useEffect(() => {
    if (!isVoiceGuidanceActive || !location || !showRoute) return;
    
    const targetRefuge = selectedRefuge || nearestRefuge;
    if (!targetRefuge) return;

    const currentDistance = calculateDistance(
      location.latitude,
      location.longitude,
      targetRefuge.latitude,
      targetRefuge.longitude
    );

    // Provide updates at key milestones
    if (lastDistance === null) {
      setLastDistance(currentDistance);
    } else {
      // Announce at 500m, 200m, 100m, 50m
      if (lastDistance > 0.5 && currentDistance <= 0.5) {
        speakDirection('Vous êtes à 500 mètres du refuge');
      } else if (lastDistance > 0.2 && currentDistance <= 0.2) {
        speakDirection('Vous êtes à 200 mètres du refuge');
      } else if (lastDistance > 0.1 && currentDistance <= 0.1) {
        speakDirection('Vous êtes à 100 mètres du refuge. Vous êtes presque arrivé');
      } else if (lastDistance > 0.05 && currentDistance <= 0.05) {
        speakDirection('Vous êtes à 50 mètres. Le refuge est juste devant vous');
      } else if (lastDistance > 0.02 && currentDistance <= 0.02) {
        speakDirection('Vous êtes arrivé au refuge. Vous êtes en sécurité');
        setIsVoiceGuidanceActive(false);
      }
      setLastDistance(currentDistance);
    }
  }, [location, isVoiceGuidanceActive, showRoute]);

  
    


  const handleStop = () => {
    router.push("/(tabs)");
  };

  const handleCloseRefugeCard = () => {
    setShowRefugeCard(false);
  };

  const getSortedRefugesByDistance = (): (RefugeZone & { distance: number })[] => {
    if (!location) return [];
    return REFUGE_ZONES.map(zone => ({
      ...zone,
      distance: calculateDistance(location.latitude, location.longitude, zone.latitude, zone.longitude)
    })).sort((a, b) => a.distance - b.distance);
  };

  const handleNavigateToRefugeFromDrawer = (refuge: RefugeZone) => {
    // If clicking the nearest refuge, clear selection to show "Nearest Refuge Card"
    if (nearestRefuge && refuge.id === nearestRefuge.id) {
      setSelectedRefuge(null);
    } else {
      setSelectedRefuge(refuge);
    }
    // Ensure the card is visible
    setShowRefugeCard(true);
    mapRef.current?.animateToRegion(
      {
        latitude: refuge.latitude,
        longitude: refuge.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      1000
    );
    setShowRefugeDrawer(false);
  };

  const handleRefugeMarkerPress = (refuge: RefugeZone) => {
    // If clicking the nearest refuge, clear selection to show "Nearest Refuge Card"
    if (nearestRefuge && refuge.id === nearestRefuge.id) {
      setSelectedRefuge(null);
    } else {
      setSelectedRefuge(refuge);
    }
    mapRef.current?.animateToRegion(
      {
        latitude: refuge.latitude,
        longitude: refuge.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      1000
    );
  };

  const handleCloseSelectedRefugeCard = () => {
    setSelectedRefuge(null);
    setShowRoute(false);
    setRouteCoordinates([]);
    setIsVoiceGuidanceActive(false);
    setIsNavigationMode(false);
    Speech.stop();
    setLastDistance(null);
  };

  const handleNavigateToSelectedRefuge = () => {
    if (selectedRefuge) {
      setIsNavigationMode(true);
      setIsVoiceGuidanceActive(true);
      
      // Immediate voice announcement
      Speech.speak(`Démarrage de la navigation vers ${selectedRefuge.name}`, {
        language: 'fr-FR',
        pitch: 1.0,
        rate: 0.9,
      });
      
      fetchRoute(selectedRefuge);
      // You can add additional navigation logic here
      // For example, opening external navigation apps
      mapRef.current?.animateToRegion(
        {
          latitude: selectedRefuge.latitude,
          longitude: selectedRefuge.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const handleStopNavigation = () => {
    setIsNavigationMode(false);
    setShowRoute(false);
    setRouteCoordinates([]);
    setIsVoiceGuidanceActive(false);
    Speech.stop();
    setLastDistance(null);
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
          showsUserLocation={false}
          showsMyLocationButton={false}
          zoomControlEnabled={false}
          onRegionChangeComplete={setCurrentRegion}
        >
          {/* Refuge Zone Circles and Markers */}
          {REFUGE_ZONES.map((zone, index) => (
            <React.Fragment key={zone.id}>
              {/* Animated refuge zone circle */}
              <Circle
                center={{
                  latitude: zone.latitude,
                  longitude: zone.longitude,
                }}
                radius={zone.radius}
                fillColor="#00C85120"
                strokeColor="#00C851"
                strokeWidth={2}
              />

              {/* Refuge zone marker with icon */}
              <Marker
                coordinate={{
                  latitude: zone.latitude,
                  longitude: zone.longitude,
                }}
                title={zone.name}
                onPress={() => handleRefugeMarkerPress(zone)}
              >
                <View style={styles.refugeMarkerContainer}>
                  <Image
                    source={require("@/assets/images/iconVert.png")}
                    style={styles.refugeMarkerIcon}
                  />
                  {/* Show label only when zoomed in (latitudeDelta < 0.05) */}
                  {currentRegion.latitudeDelta < 0.05 && (
                    <Text style={styles.refugeMarkerLabel}>{zone.name}</Text>
                  )}
                </View>
              </Marker>
            </React.Fragment>
          ))}

          {/* User location marker */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Votre position"
            description="Position actuelle"
          >
            <Animated.View style={[styles.userMarkerContainer, { transform: [{ scale: locationPulseAnim }] }]}>
              <Image
                source={require("@/assets/images/iconRose.png")}
                style={styles.userMarkerIcon}
              />
            </Animated.View>
          </Marker>

          {/* Danger zone circle around user location */}
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={location.accuracy * 5}
            fillColor="#E91E6320"
            strokeColor="#E91E63"
            strokeWidth={4}
          />

          {/* Route polyline from user to selected refuge */}
          {showRoute && routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#E91E63"
              strokeWidth={5}
              lineJoin="round"
              lineCap="round"
            />
          )}
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

        {/* Drawer Toggle Button - Top Left */}
        <Pressable
          style={[styles.drawerToggleButton, { top: insets.top + 64 }]}
          onPress={() => setShowRefugeDrawer(true)}
        >
          <Menu size={24} color={Colors.surface} strokeWidth={2.5} />
        </Pressable>
        <View style={[styles.statusIndicator, { top: insets.top + 12 }]}>
          <View style={[styles.statusDot, styles.activeDot]} />
          <Text style={styles.statusText}>Live Location</Text>
        </View>

        {/* Refuge Card - Shows nearest refuge or selected refuge */}
        {showRefugeCard && (selectedRefuge || nearestRefuge) && !isNavigationMode && (
          <View style={[
            selectedRefuge ? styles.selectedRefugeCard : styles.nearestRefugeCard, 
            { top: insets.top + 120 }
          ]}>
            <View style={styles.refugeCardHeaderContainer}>
              <View style={styles.refugeCardHeader}>
                <MapPin 
                  size={20} 
                  color={selectedRefuge ? Colors.primary : Colors.success} 
                  strokeWidth={2.5} 
                />
                <Text style={selectedRefuge ? styles.selectedRefugeCardTitle : styles.refugeCardTitle}>
                  {selectedRefuge ? selectedRefuge.name : "Refuge le plus proche"}
                </Text>
              </View>
              <Pressable 
                style={styles.refugeCardCloseButton}
                onPress={selectedRefuge ? handleCloseSelectedRefugeCard : handleCloseRefugeCard}
              >
                <X size={20} color={Colors.textSecondary} strokeWidth={2.5} />
              </Pressable>
            </View>
            {!selectedRefuge && nearestRefuge && (
              <Text style={styles.refugeCardName}>{nearestRefuge.name}</Text>
            )}
            <View style={styles.refugeCardDistance}>
              <Text style={styles.refugeCardDistanceLabel}>
                {selectedRefuge ? "Distance: " : ""}
                {calculateDistance(
                  location!.latitude, 
                  location!.longitude, 
                  (selectedRefuge || nearestRefuge)!.latitude, 
                  (selectedRefuge || nearestRefuge)!.longitude
                ).toFixed(selectedRefuge ? 2 : 1)} km
              </Text>
            </View>
            
            <Pressable 
              style={selectedRefuge ? styles.selectedRefugeNavigateButton : styles.refugeNavigateButton}
              onPress={selectedRefuge ? handleNavigateToSelectedRefuge : handleNavigateToRefuge}
            >
              <Navigation size={18} color={Colors.surface} strokeWidth={2} />
              <Text style={styles.refugeNavigateButtonText}>
                {selectedRefuge ? "Naviguer vers ce refuge" : "Naviguer"}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Navigation Mode Panel */}
        {isNavigationMode && (selectedRefuge || nearestRefuge) && (
          <View style={[styles.navigationPanel, { top: insets.top + 120 }]}>
            <View style={styles.navigationHeader}>
              <View style={styles.navigationTitleContainer}>
                <Navigation size={20} color={Colors.primary} strokeWidth={2.5} />
                <Text style={styles.navigationTitle}>Navigation en cours</Text>
              </View>
              <Pressable 
                style={styles.navigationCloseButton}
                onPress={handleStopNavigation}
              >
                <X size={20} color={Colors.textSecondary} strokeWidth={2.5} />
              </Pressable>
            </View>
            
            <View style={styles.navigationContent}>
              <View style={styles.navigationDestination}>
                <MapPin size={16} color={Colors.primary} strokeWidth={2} />
                <Text style={styles.navigationDestinationText}>
                  {(selectedRefuge || nearestRefuge)!.name}
                </Text>
              </View>
              
              <View style={styles.navigationStats}>
                <View style={styles.navigationStatItem}>
                  <Text style={styles.navigationStatLabel}>Distance</Text>
                  <Text style={styles.navigationStatValue}>
                    {calculateDistance(
                      location!.latitude, 
                      location!.longitude, 
                      (selectedRefuge || nearestRefuge)!.latitude, 
                      (selectedRefuge || nearestRefuge)!.longitude
                    ).toFixed(2)} km
                  </Text>
                </View>
                
                <View style={styles.navigationStatDivider} />
                
                <View style={styles.navigationStatItem}>
                  <Text style={styles.navigationStatLabel}>Guidage</Text>
                  <Pressable 
                    style={styles.navigationVoiceButton}
                    onPress={toggleVoiceGuidance}
                  >
                    {isVoiceGuidanceActive ? (
                      <Volume2 size={16} color={Colors.success} strokeWidth={2.5} />
                    ) : (
                      <VolumeX size={16} color={Colors.textSecondary} strokeWidth={2.5} />
                    )}
                    <Text style={[
                      styles.navigationVoiceText,
                      isVoiceGuidanceActive && styles.navigationVoiceTextActive
                    ]}>
                      {isVoiceGuidanceActive ? "ON" : "OFF"}
                    </Text>
                  </Pressable>
                </View>
              </View>
              
              {/* Stop Navigation Button */}
              <Pressable 
                style={styles.stopNavigationButton}
                onPress={handleStopNavigation}
              >
                <X size={18} color={Colors.surface} strokeWidth={2.5} />
                <Text style={styles.stopNavigationButtonText}>
                  Arrêter la navigation
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Refuge List Drawer */}
        {showRefugeDrawer && (
          <View style={[styles.drawerOverlay, { top: insets.top }]}>
            <Pressable 
              style={styles.drawerBackdrop}
              onPress={() => setShowRefugeDrawer(false)}
            />
            <View style={[styles.drawerPanel, { top: insets.top + 12, maxHeight: Dimensions.get('window').height - insets.top - 100 }]}>
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>Tous les Refuges</Text>
                <Pressable 
                  onPress={() => setShowRefugeDrawer(false)}
                  style={styles.drawerCloseButton}
                >
                  <X size={20} color={Colors.text} strokeWidth={2.5} />
                </Pressable>
              </View>
              <ScrollView 
                style={styles.drawerContent}
                showsVerticalScrollIndicator={true}
              >
                {getSortedRefugesByDistance().map((refuge, index) => (
                  <Pressable 
                    key={refuge.id}
                    style={styles.refugeListCard}
                    onPress={() => handleNavigateToRefugeFromDrawer(refuge)}
                  >
                    <View style={styles.refugeListCardContent}>
                      <View style={styles.refugeListCardLeft}>
                        <View style={[styles.refugeListCardNumber, { backgroundColor: index === 0 ? Colors.success : Colors.primary }]}>
                          <Text style={styles.refugeListCardNumberText}>{index + 1}</Text>
                        </View>
                        <View style={styles.refugeListCardInfo}>
                          <Text style={styles.refugeListCardName}>{refuge.name}</Text>
                          <Text style={styles.refugeListCardDistance}>{refuge.distance.toFixed(1)} km</Text>
                        </View>
                      </View>
                      <ChevronRight size={20} color={Colors.secondary} strokeWidth={2} />
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
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
                source={require("@/assets/images/iconStopButton.png")}
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
  refugeMarkerContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: 60,
    height: 60,
  },
  refugeMarkerIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginBottom: 4,
  },
  refugeMarkerLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.success,
    backgroundColor: Colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
    textAlign: "center",
    maxWidth: 60,
  },
  userMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  userMarkerIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
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
    backgroundColor: Colors.secondary,
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
    color: Colors.surface,
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
  nearestRefugeCard: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 5,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
    borderTopWidth: 2,
    borderTopColor: Colors.success + "40",
  },
  refugeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refugeCardHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  refugeCardCloseButton: {
    padding: 6,
    marginRight: -6,
  },
  refugeCardTitle: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.success,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  refugeCardName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  refugeCardDistance: {
    marginBottom: 12,
  },
  refugeCardDistanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600" as const,
  },
  voiceToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  voiceToggleText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500" as const,
  },
  voiceToggleTextActive: {
    color: Colors.primary,
    fontWeight: "600" as const,
  },
  refugeNavigateButton: {
    flexDirection: "row",
    backgroundColor: Colors.success,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  refugeNavigateButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.surface,
    letterSpacing: 0.3,
  },
  drawerOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  drawerBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  drawerPanel: {
    position: "absolute",
    left: 12,
    width: 300,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 101,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  drawerCloseButton: {
    padding: 4,
  },
  drawerContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  refugeListCard: {
    paddingVertical: 2,
  },
  refugeListCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 4,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
  },
  refugeListCardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  refugeListCardNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  refugeListCardNumberText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.surface,
  },
  refugeListCardInfo: {
    flex: 1,
  },
  refugeListCardName: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  refugeListCardDistance: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "500" as const,
  },
  drawerToggleButton: {
    position: "absolute",
    left: 16,
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 6,
  },
  selectedRefugeCard: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  selectedRefugeCardTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectedRefugeNavigateButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  navigationPanel: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  navigationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navigationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  navigationTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  navigationCloseButton: {
    padding: 4,
  },
  navigationContent: {
    gap: 12,
  },
  navigationDestination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  navigationDestinationText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text,
    flex: 1,
  },
  navigationStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navigationStatItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  navigationStatLabel: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  navigationStatValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.primary,
  },
  navigationStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  navigationVoiceButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navigationVoiceText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  navigationVoiceTextActive: {
    color: Colors.success,
  },
  stopNavigationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
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
  stopNavigationButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.surface,
    letterSpacing: 0.3,
  },
});

