import { ClimateReading, DashboardSummary } from './types';

export const mockSummary: DashboardSummary = {
  activeDevices: 12,
  schoolsConnected: 5,
  averageHeatIndex: 39,
  airQualityStatus: 'Moderate',
};

export const mockReadings: ClimateReading[] = [
  {
    deviceId: 'CS-GH-NR-0001',
    schoolId: 'PILOT-SCHOOL-001',
    community: 'Tamale',
    temperatureC: 34.5,
    humidityPercent: 62,
    heatIndexC: 39.2,
    pm25: 18,
    pm10: 40,
    soilMoisturePercent: 35,
    rainfallMm: 0,
    batteryVoltage: 4.05,
    wifiRssi: -65,
    dhtHealthy: true,
  },
  {
    deviceId: 'CS-GH-NR-0002',
    schoolId: 'PILOT-SCHOOL-002',
    community: 'Kumbungu',
    temperatureC: 36.1,
    humidityPercent: 59,
    heatIndexC: 41.5,
    pm25: 25,
    pm10: 51,
    soilMoisturePercent: 29,
    rainfallMm: 0,
    batteryVoltage: 3.72,
    wifiRssi: -70,
    dhtHealthy: true,
  },
];
