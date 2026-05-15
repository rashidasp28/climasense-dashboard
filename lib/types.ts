export type ClimateReading = {
  id?: string;
  createdAt?: string;
  deviceId: string;
  schoolId?: string | null;
  community?: string | null;
  temperatureC?: number | null;
  humidityPercent?: number | null;
  heatIndexC?: number | null;
  pm25?: number | null;
  pm10?: number | null;
  soilMoisturePercent?: number | null;
  rainfallMm?: number | null;
  batteryVoltage?: number | null;
  wifiRssi?: number | null;
  dhtHealthy?: boolean | null;
};

export type DashboardSummary = {
  activeDevices: number;
  schoolsConnected: number;
  averageHeatIndex: number;
  airQualityStatus: 'Good' | 'Moderate' | 'Unhealthy' | 'Unknown';
};
