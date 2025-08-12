// app/index.tsx
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import styles from "../css/styles";
import { BG_TASK } from "../tasks/locationTask";

const SERVER_URL = "https://c9e6a861a0b3.ngrok-free.app";
const RADIUS_M = 120;
const CO2_PER_KM = 0.17;

function distMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function Home() {
  const [destLat, setDestLat] = useState("");
  const [destLng, setDestLng] = useState("");
  const [tracking, setTracking] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [distanceKm, setDistanceKm] = useState(0);
  const [cur, setCur] = useState<{ lat: number; lng: number } | null>(null);
  const [distToDest, setDistToDest] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const [editingDest, setEditingDest] = useState(true); // 도착지 입력창 상태

  const lastRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    })();
  }, []);

  const requestLocationPermission = async () => {
    const f = await Location.requestForegroundPermissionsAsync();
    if (f.status !== "granted") {
      Alert.alert("권한 필요", "위치 권한을 허용해주세요.");
      return;
    }

    try {
      await Location.requestBackgroundPermissionsAsync();
    } catch (e) {
      console.log("Expo Go에서는 백그라운드 권한 제한");
    }

    setPermissionGranted(true);
    const pos = await Location.getCurrentPositionAsync({});
    setCur({ lat: pos.coords.latitude, lng: pos.coords.longitude });
  };

  const onLocation = (pos: Location.LocationObject) => {
    const now = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    setCur(now);
    if (lastRef.current) {
      const d = distMeters(lastRef.current, now);
      if (d > 1) setDistanceKm((prev) => prev + d / 1000);
    }
    lastRef.current = now;

    const latN = parseFloat(destLat);
    const lngN = parseFloat(destLng);
    if (!isNaN(latN) && !isNaN(lngN)) {
      const dToDest = distMeters(now, { lat: latN, lng: lngN });
      setDistToDest(dToDest);
      if (dToDest <= RADIUS_M) handleArrive();
    }
  };

  const handleArrive = async () => {
    setArrived(true);
    setTracking(false);
    const co2 = distanceKm * CO2_PER_KM;

    if (sessionId) {
      await fetch(`${SERVER_URL}/api/sessions/${sessionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distanceKm,
          co2SavedKg: co2,
          pathGeoJson: null,
        }),
      });
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "도착!",
        body: `도보 ${distanceKm.toFixed(2)} km, 탄소 ${co2.toFixed(
          2
        )} kg 절감`,
      },
      trigger: null,
    });
  };

  const start = async () => {
    if (!permissionGranted || !cur) {
      Alert.alert("권한 필요", "먼저 위치 권한을 허용하세요.");
      return;
    }
    if (!destLat || !destLng) {
      Alert.alert("도착지 필요", "도착지 위도/경도를 입력하세요.");
      return;
    }

    setTracking(true);
    setArrived(false);
    setDistanceKm(0);
    lastRef.current = null;
    setEditingDest(false); // 입력창 닫기

    try {
      const res = await fetch(`${SERVER_URL}/api/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startLat: cur.lat,
          startLng: cur.lng,
          destLat: parseFloat(destLat),
          destLng: parseFloat(destLng),
        }),
      });
      const data = await res.json();
      setSessionId(data.id);
    } catch (err) {
      console.error("세션 생성 실패", err);
    }

    await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 5 },
      onLocation
    );
    await Location.startLocationUpdatesAsync(BG_TASK, {
      accuracy: Location.Accuracy.High,
      distanceInterval: 5,
      showsBackgroundLocationIndicator: true,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Walk Saver (Expo)</Text>
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* 권한 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>현재 위치 권한</Text>
            <Pressable
              style={styles.button}
              onPress={requestLocationPermission}
            >
              <Text style={styles.buttonText}>
                {permissionGranted ? "권한 허용됨" : "권한 요청"}
              </Text>
            </Pressable>
            {cur && (
              <Text style={styles.kv}>
                현재 위치: {cur.lat.toFixed(6)}, {cur.lng.toFixed(6)}
              </Text>
            )}
          </View>

          {/* 도착지 입력 / 표시 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>도착지 설정</Text>
            {editingDest ? (
              <>
                <TextInput
                  placeholder="위도"
                  value={destLat}
                  onChangeText={setDestLat}
                  keyboardType="decimal-pad"
                  style={styles.input}
                />
                <TextInput
                  placeholder="경도"
                  value={destLng}
                  onChangeText={setDestLng}
                  keyboardType="decimal-pad"
                  style={styles.input}
                />
                <Pressable
                  style={[
                    styles.button,
                    (!permissionGranted || tracking) && styles.buttonDisabled,
                  ]}
                  onPress={start}
                  disabled={!permissionGranted || tracking}
                >
                  <Text style={styles.buttonText}>
                    {tracking ? "추적 중..." : "출발"}
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.kv}>
                  위도: {parseFloat(destLat).toFixed(6)}, 경도:{" "}
                  {parseFloat(destLng).toFixed(6)}
                </Text>
                <Pressable
                  style={styles.button}
                  onPress={() => setEditingDest(true)}
                >
                  <Text style={styles.buttonText}>도착지 다시 설정</Text>
                </Pressable>
              </>
            )}
          </View>

          {/* 거리 표시 */}
          {distToDest !== null && !arrived && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                도착지까지 {distToDest.toFixed(1)} m
              </Text>
            </View>
          )}

          {/* 도착 완료 */}
          {arrived && (
            <View
              style={[
                styles.card,
                { backgroundColor: "#d4edda", borderColor: "#28a745" },
              ]}
            >
              <Text style={[styles.cardTitle, { color: "#155724" }]}>
                ✅ 도착 완료!
              </Text>
              <Text style={styles.kv}>
                총 이동 거리: {distanceKm.toFixed(2)} km
              </Text>
              <Text style={styles.kv}>
                절감한 탄소: {(distanceKm * CO2_PER_KM).toFixed(2)} kg
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
