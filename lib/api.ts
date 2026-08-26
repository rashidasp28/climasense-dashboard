import {
  ClimateReading,
  HistoricalClimateResponse,
  OfficialObservationsResponse,
} from './types';
import { fetchGMetWeather } from './gmet-weather';
import { fetchHistoricalClimate as fetchHistoricalClimateData } from './historical-climate';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchClimateReadings(): Promise<ClimateReading[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/readings`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch telemetry');
    }

    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchOfficialObservations(): Promise<OfficialObservationsResponse | null> {
  try {
    return await fetchGMetWeather();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchHistoricalClimate(): Promise<HistoricalClimateResponse | null> {
  try {
    return await fetchHistoricalClimateData();
  } catch (error) {
    console.error(error);
    return null;
  }
}
