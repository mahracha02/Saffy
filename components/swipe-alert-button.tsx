import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Text,
  Pressable,
  Platform,
} from "react-native";
import { ShieldAlert, MapPin, Bus } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
  type SharedValue,
} from "react-native-reanimated";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");
const BUTTON_SIZE = Math.min(width * 0.65, 280);
const SCENARIO_SIZE = 100;
const SCENARIO_DISTANCE = BUTTON_SIZE / 2 + 120;
const SWIPE_THRESHOLD = 100;
const HIGHLIGHT_THRESHOLD = 60;

interface SwipeAlertButtonProps {
  onScenarioSelect: (scenario: "street" | "transport") => void;
}

export const SwipeAlertButton = ({ onScenarioSelect }: SwipeAlertButtonProps) => {
  // Shared animation values for Reanimated v3
  const buttonScaleProgress = useSharedValue(0);
  const scenarioProgress = useSharedValue(0);
  const scenarioOpacity = useSharedValue(0);
  const streetHighlight = useSharedValue(0);
  const transportHighlight = useSharedValue(0);
  const curveProgress = useSharedValue(0);

  // Pan responder for gesture detection
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Button grows on touch
        buttonScaleProgress.value = withSpring(1, {
          damping: 12,
          mass: 1,
          stiffness: 100,
        });
        scenarioOpacity.value = withTiming(1, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      },
      onPanResponderMove: (_evt, { dy, dx }) => {
        // Only track upward swipes (negative dy)
        if (dy < 0) {
          const distance = Math.abs(dy);
          const progress = Math.min(distance / SWIPE_THRESHOLD, 1);

          // Update scenario position and opacity based on swipe progress
          scenarioProgress.value = progress;

          // Highlight detection - determine which scenario is being targeted
          const horizontalOffset = dx;
          const distanceToStreet = Math.abs(horizontalOffset + 80); // Left target
          const distanceToTransport = Math.abs(horizontalOffset - 80); // Right target

          if (progress > 0.5) {
            if (distanceToStreet < HIGHLIGHT_THRESHOLD) {
              if (Platform.OS !== "web") {
                Haptics.selectionAsync();
              }
              streetHighlight.value = 1;
              transportHighlight.value = 0;
            } else if (distanceToTransport < HIGHLIGHT_THRESHOLD) {
              if (Platform.OS !== "web") {
                Haptics.selectionAsync();
              }
              streetHighlight.value = 0;
              transportHighlight.value = 1;
            }
          }

          curveProgress.value = progress;
        }
      },
      onPanResponderRelease: (_evt, { dy, dx }) => {
        const distance = Math.abs(dy);
        const progress = Math.min(distance / SWIPE_THRESHOLD, 1);

        if (progress > 0.6) {
          const distanceToStreet = Math.abs(dx + 80);
          const distanceToTransport = Math.abs(dx - 80);

          if (distanceToStreet < HIGHLIGHT_THRESHOLD) {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
            onScenarioSelect("street");
          } else if (distanceToTransport < HIGHLIGHT_THRESHOLD) {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
            onScenarioSelect("transport");
          } else {
            // Reset if no valid target
            resetAnimation();
          }
        } else {
          // Reset if not swiped far enough
          resetAnimation();
        }
      },
    })
  ).current;

  const resetAnimation = () => {
    buttonScaleProgress.value = withSpring(0, {
      damping: 12,
      mass: 1,
      stiffness: 100,
    });
    scenarioProgress.value = withTiming(0, {
      duration: 300,
      easing: Easing.in(Easing.cubic),
    });
    scenarioOpacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.in(Easing.cubic),
    });
    streetHighlight.value = withTiming(0, { duration: 200 });
    transportHighlight.value = withTiming(0, { duration: 200 });
    curveProgress.value = withTiming(0, { duration: 300 });
  };

  // Button animated style
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(buttonScaleProgress.value, [0, 1], [1, 1.12], Extrapolate.CLAMP),
      },
    ],
    shadowOpacity: interpolate(buttonScaleProgress.value, [0, 1], [0.4, 0.6], Extrapolate.CLAMP),
  }));

  // Calculate polar coordinates for scenario buttons
  const getScenarioPosition = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * SCENARIO_DISTANCE,
      y: -Math.sin(rad) * SCENARIO_DISTANCE, // Negative to move UP
    };
  };

  const streetPos = getScenarioPosition(120); // Top-left
  const transportPos = getScenarioPosition(60); // Top-right

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Curved connector visual */}
      <CurveConnector progress={curveProgress} />

      {/* Street Scenario (Left) */}
      <ScenarioOption
        label="Rue"
        icon="street"
        position={streetPos}
        progress={scenarioProgress}
        highlight={streetHighlight}
        onSelect={() => onScenarioSelect("street")}
      />

      {/* Transport Scenario (Right) */}
      <ScenarioOption
        label="Transport"
        icon="transport"
        position={transportPos}
        progress={scenarioProgress}
        highlight={transportHighlight}
        onSelect={() => onScenarioSelect("transport")}
      />

      {/* Main Alert Button */}
      <Animated.View style={[styles.buttonWrapper, buttonAnimatedStyle]}>
        <Pressable
          style={styles.emergencyButton}
          onLongPress={() => {
            // Long press as fallback
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
          }}
        >
          <View style={styles.buttonContent}>
            <ShieldAlert size={64} color={Colors.surface} strokeWidth={2.5} />
            <Text style={styles.emergencyButtonText}>ALERTE</Text>
            <Text style={styles.emergencyButtonSubtext}>Glisser vers le haut</Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

interface ScenarioOptionProps {
  label: string;
  icon: "street" | "transport";
  position: { x: number; y: number };
  progress: SharedValue<number>;
  highlight: SharedValue<number>;
  onSelect: () => void;
}

const ScenarioOption = ({
  label,
  icon,
  position,
  progress,
  highlight,
  onSelect,
}: ScenarioOptionProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translationY = interpolate(progress.value, [0, 1], [-50, position.y], Extrapolate.CLAMP);
    const translationX = interpolate(progress.value, [0, 1], [0, position.x], Extrapolate.CLAMP);
    const scale = interpolate(
      progress.value,
      [0, 0.7, 1],
      [0.3, 0.9, 1],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(progress.value, [0, 0.3, 1], [0, 0.6, 1], Extrapolate.CLAMP);

    const highlightScale = interpolate(highlight.value, [0, 1], [1, 1.2], Extrapolate.CLAMP);

    return {
      transform: [
        { translateX: translationX },
        { translateY: translationY },
        { scale: scale * highlightScale },
      ],
      opacity,
      shadowOpacity: interpolate(highlight.value, [0, 1], [0.3, 0.6], Extrapolate.CLAMP),
    };
  });

  const color = icon === "street" ? Colors.scenarios.street : Colors.scenarios.transport;
  const iconColor = Colors.surface;
  const getIcon = () => {
    if (icon === "street") {
      return <MapPin size={36} color={iconColor} strokeWidth={2.5} />;
    } else {
      return <Bus size={36} color={iconColor} strokeWidth={2.5} />;
    }
  };

  return (
    <Animated.View style={[styles.scenarioWrapper, animatedStyle]}>
      <Pressable
        style={({ pressed }) => [
          styles.scenarioButton,
          { backgroundColor: color },
          pressed && styles.scenarioPressed,
        ]}
        onPress={onSelect}
      >
        <View style={styles.scenarioContent}>
          {getIcon()}
          <Text style={styles.scenarioLabel}>{label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const CurveConnector = ({ progress }: { progress: SharedValue<number> }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <Animated.View
      style={[
        styles.curveContainer,
        animatedStyle,
        {
          pointerEvents: "none",
        },
      ]}
    >
      <View style={styles.curveLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BUTTON_SIZE + 300,
    height: BUTTON_SIZE + 150,
    justifyContent: "center",
    paddingTop: 100,
    alignItems: "center",
    position: "relative",
  },
  buttonWrapper: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyButton: {
    width: "100%",
    height: "100%",
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
  scenarioWrapper: {
    position: "absolute",
    width: SCENARIO_SIZE,
    height: SCENARIO_SIZE,
  },
  scenarioButton: {
    width: "100%",
    height: "100%",
    borderRadius: SCENARIO_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  scenarioContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 8,
  },
  scenarioPressed: {
    opacity: 0.8,
  },
  scenarioLabel: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.surface,
    letterSpacing: 0.2,
  },
  curveContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  curveLine: {
    position: "absolute",
    width: 2,
    height: SCENARIO_DISTANCE * 0.6,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    borderRadius: 1,
  },
});

export default SwipeAlertButton;
