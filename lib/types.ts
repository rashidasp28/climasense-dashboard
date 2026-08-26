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

export type OfficialObservation = {
  stationId: string;
  stationName: string;
  wigosStationIdentifier: string;
  observedAt: string;
  forecastTime?: string;
  weatherDescription?: string;
  temperatureC: number | null;
  humidityPercent: number | null;
  rainfallMm: number | null;
  pressureHpa: number | null;
  windSpeedMs: number | null;
  windDirectionDegrees: number | null;
  freshness: 'current' | 'delayed' | 'stale';
};

export type OfficialObservationsResponse = {
  source: {
    name: string;
    dataset: string;
    dataPolicy: string;
    climateAtlasUrl: string;
    observationsUrl: string;
  };
  fetchedAt: string;
  observations: OfficialObservation[];
  notice: string;
};

export type HistoricalClimatePoint = {
  year: number;
  month: number;
  label: string;
  rainfallMm: number | null;
  temperatureMeanC: number | null;
  temperatureMinC: number | null;
  temperatureMaxC: number | null;
};

export type HistoricalClimateYear = {
  year: number;
  annualRainfallMm: number | null;
  averageTemperatureC: number | null;
};

export type HistoricalClimateResponse = {
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  period: {
    startYear: number;
    endYear: number;
  };
  source: {
    name: string;
    dataset: string;
    methodologyUrl: string;
  };
  points: HistoricalClimatePoint[];
  years: HistoricalClimateYear[];
  notice: string;
};
