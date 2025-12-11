import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import type { LeafletMapHandle } from "./LeafletMapWeb";

type Props = {
  latitude: number;
  longitude: number;
  accuracy: number;
  onRegionChange?: (region: { latitude: number; longitude: number }) => void;
};

const LeafletMapNative = forwardRef<LeafletMapHandle, Props>(({ latitude, longitude, accuracy, onRegionChange }, ref) => {
  const webRef = useRef<WebView>(null);

  const html = useMemo(() => {
    const lat = Number.isFinite(latitude) ? latitude : 0;
    const lng = Number.isFinite(longitude) ? longitude : 0;
    const acc = Math.max(accuracy || 10, 5);
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <style>
      html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script>
      var map = L.map('map', { zoomControl: false }).setView([${lat}, ${lng}], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      var accuracyCircle = L.circle([${lat}, ${lng}], { radius: ${acc}, color: '#5E81AC', fillColor: '#5E81AC', fillOpacity: 0.2 }).addTo(map);
      var marker = L.circleMarker([${lat}, ${lng}], { radius: 7, color: '#2563EB', fillColor: '#2563EB', fillOpacity: 1 }).addTo(map);

      function notifyCenter() {
        var c = map.getCenter();
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'moveend', latitude: c.lat, longitude: c.lng }));
        }
      }
      map.on('moveend', notifyCenter);

      function centerTo(lat, lng) {
        map.setView([lat, lng], map.getZoom(), { animate: true });
        accuracyCircle.setLatLng([lat, lng]);
        marker.setLatLng([lat, lng]);
      }
      function zoomIn() { map.zoomIn(); }
      function zoomOut() { map.zoomOut(); }

      function handleMessage(event) {
        try {
          var data = JSON.parse(event.data);
          if (data && data.type === 'centerTo') centerTo(data.lat, data.lng);
          if (data && data.type === 'zoomIn') zoomIn();
          if (data && data.type === 'zoomOut') zoomOut();
        } catch (e) {}
      }
      document.addEventListener('message', handleMessage); // Android
      window.addEventListener('message', handleMessage); // iOS
    </script>
  </body>
</html>`;
  }, [latitude, longitude, accuracy]);

  useImperativeHandle(ref, () => ({
    centerTo: (lat, lng) => webRef.current?.postMessage(JSON.stringify({ type: 'centerTo', lat, lng })),
    zoomIn: () => webRef.current?.postMessage(JSON.stringify({ type: 'zoomIn' })),
    zoomOut: () => webRef.current?.postMessage(JSON.stringify({ type: 'zoomOut' })),
  }));

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html }}
        onMessage={(e) => {
          try {
            const data = JSON.parse(e.nativeEvent.data);
            if (data?.type === 'moveend') {
              onRegionChange?.({ latitude: data.latitude, longitude: data.longitude });
            }
          } catch {}
        }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
});

export default LeafletMapNative;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
