import React, { useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from "react";
import { View, StyleSheet } from "react-native";

export type MapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  color?: string;
  title?: string;
  subtitle?: string;
  iconUrl?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
};

type Props = {
  latitude: number;
  longitude: number;
  accuracy: number;
  onRegionChange?: (region: { latitude: number; longitude: number }) => void;
  markers?: MapMarker[];
  onMarkerPress?: (markerId: string) => void;
};

export type LeafletMapHandle = {
  centerTo: (lat: number, lng: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

const LeafletMapWeb = forwardRef<LeafletMapHandle, Props>(({ latitude, longitude, accuracy, onRegionChange, markers = [], onMarkerPress }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const center = useMemo<[number, number]>(() => [latitude, longitude], [latitude, longitude]);

  // Dynamically loaded react-leaflet module (client-only)
  const [rl, setRl] = useState<any>(null);
  const [Lmod, setLmod] = useState<any>(null);

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
    // Dynamically import react-leaflet and leaflet on client to avoid SSR issues
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ])
      .then(([rlMod, lMod]) => {
        if (mounted) {
          setRl(rlMod);
          setLmod(lMod);
        }
      })
      .catch(() => {
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

  const { MapContainer, TileLayer, Circle, CircleMarker, Popup, Marker } = rl;

  return (
    <View style={styles.container}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
        <MapContainer center={center} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
          <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap contributors" />
          <CircleMarker
              center={center}
              radius={15}
              pathOptions={{ color: "#fc486b", fillColor: "#fc486b", fillOpacity: 1 }}
          />

          {/* Custom markers */}
          {markers?.map((m) => {
              const size: [number, number] = m.iconSize || [32, 32];
              const anchor: [number, number] = m.iconAnchor || [size[0] / 2, size[1]];
              const icon = Lmod.icon({
                iconUrl: m.iconUrl,
                iconSize: size,
                iconAnchor: anchor,
              });
              return (
                  <Marker
                      key={m.id}
                      position={[m.latitude, m.longitude]}
                      icon={icon}
                      zIndexOffset={20}
                      eventHandlers={{
                        click: () => onMarkerPress?.(m.id),
                      }}
                  >
                    {(m.title || m.subtitle) && (
                        <Popup>
                          <div style={{minWidth: 120}}>
                            {m.title && <div style={{fontWeight: 600}}>{m.title}</div>}
                            {m.subtitle && <div style={{opacity: 0.7}}>{m.subtitle}</div>}
                          </div>
                        </Popup>
                    )}
                  </Marker>
            );
          })}
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
