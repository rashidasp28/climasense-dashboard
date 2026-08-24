import {
  ClimateReading,
  OfficialObservationsResponse,
} from './types';

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
    const response = await fetch(`${API_BASE_URL}/api/official-observations`, {
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch official observations');
    }

    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
