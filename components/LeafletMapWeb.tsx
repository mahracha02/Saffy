import React, { useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from "react";
import { View, StyleSheet } from "react-native";

type Props = {
  latitude: number;
  longitude: number;
  accuracy: number;
  onRegionChange?: (region: { latitude: number; longitude: number }) => void;
};

export type LeafletMapHandle = {
  centerTo: (lat: number, lng: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

const LeafletMapWeb = forwardRef<LeafletMapHandle, Props>(({ latitude, longitude, accuracy, onRegionChange }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const center = useMemo<[number, number]>(() => [latitude, longitude], [latitude, longitude]);

  // Dynamically loaded react-leaflet module (client-only)
  const [rl, setRl] = useState<any>(null);

  // Exposed API implementation
  const apiRef = useRef<LeafletMapHandle | null>(null);
  useImperativeHandle(ref, () => ({
    centerTo: (lat, lng) => apiRef.current?.centerTo(lat, lng),
    zoomIn: () => apiRef.current?.zoomIn(),
    zoomOut: () => apiRef.current?.zoomOut(),
  }));

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // Inject Leaflet CSS via <link> to avoid Metro CSS MIME issues
    const existing = document.getElementById("leaflet-css") as HTMLLinkElement | null;
    if (!existing) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    let mounted = true;
    // Dynamically import react-leaflet on client to avoid "window is not defined"
    import("react-leaflet").then((mod) => {
      if (mounted) setRl(mod);
    }).catch(() => {
      // ignore; component will render empty container
    });
    return () => {
      mounted = false;
    };
  }, []);

  // If not on client or module not loaded yet, render an empty container to preserve layout
  if (typeof window === "undefined" || !rl) {
    return <View style={styles.container} />;
  }

  // Controller component that uses the dynamically loaded useMap
  const Controller = ({
    center: ctr,
    onRegionChange: onChange,
    expose,
  }: {
    center: [number, number];
    onRegionChange?: (region: { latitude: number; longitude: number }) => void;
    expose: (api: LeafletMapHandle) => void;
  }) => {
    const map = rl.useMap();

    useEffect(() => {
      map.setView(ctr, 15, { animate: true });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctr[0], ctr[1]]);

    useEffect(() => {
      const onMoveEnd = () => {
        const c = map.getCenter();
        onChange?.({ latitude: c.lat, longitude: c.lng });
      };
      map.on("moveend", onMoveEnd);
      return () => {
        map.off("moveend", onMoveEnd);
      };
    }, [map, onChange]);

    useEffect(() => {
      expose({
        centerTo: (lat: number, lng: number) => map.setView([lat, lng], map.getZoom(), { animate: true }),
        zoomIn: () => map.zoomIn(),
        zoomOut: () => map.zoomOut(),
      });
    }, [expose, map]);

    return null;
  };

  const { MapContainer, TileLayer, Circle, CircleMarker } = rl;

  return (
    <View style={styles.container}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
        <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <Circle center={center} radius={Math.max(accuracy, 5)} pathOptions={{ color: "#5E81AC", fillColor: "#5E81AC", fillOpacity: 0.2 }} />
          <CircleMarker center={center} radius={7} pathOptions={{ color: "#2563EB", fillColor: "#2563EB", fillOpacity: 1 }} />
          <Controller center={center} onRegionChange={onRegionChange} expose={(api) => (apiRef.current = api)} />
        </MapContainer>
      </div>
    </View>
  );
});

export default LeafletMapWeb;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
