// tasks/locationTask.ts
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const BG_TASK = 'bg-location-task';

// ✅ 앱 시작 시 한 번만 define 되도록 모듈 레벨에서 정의
TaskManager.defineTask(BG_TASK, async ({ data, error }) => {
  if (error || !data) return;

  // data 타입을 any로 처리 (expo-location 최신 버전에는 LocationUpdateResult 타입 없음)
  const { locations } = data as { locations: Location.LocationObject[] };

  if (locations && locations.length > 0) {
    console.log('📍 BG locations:', locations.map(loc => ({
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
      time: new Date(loc.timestamp).toISOString()
    })));
  }
});
