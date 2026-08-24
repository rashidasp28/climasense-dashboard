import 'server-only';

import { OfficialObservationsResponse } from './types';

const GMET_CITY = 'Tamale';
const GMET_WEATHER_URL = 'https://www.meteo.gov.gh/weather/daily-table/tamale/';

function decodeText(value: string) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function numberFrom(value: string) {
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export async function fetchGMetWeather(): Promise<OfficialObservationsResponse | null> {
  const response = await fetch(GMET_WEATHER_URL, {
    headers: {
      'User-Agent': 'ClimaSense/0.1 (+https://climasense-dashboard.vercel.app)',
    },
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  const location = decodeText(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '');

  if (location.toLocaleLowerCase() !== GMET_CITY.toLocaleLowerCase()) {
    console.error(`GMet returned ${location || 'an unknown city'} instead of ${GMET_CITY}`);
    return null;
  }

  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];

  for (const row of rows) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    if (cells.length < 6) continue;

    const forecastTime = decodeText(cells[0][1]);
    if (!/^\d{1,2}:\d{2}$/.test(forecastTime)) continue;

    const weatherCell = cells[1][1];
    const weatherDescription =
      weatherCell.match(/alt=["']([^"']+)["']/i)?.[1] ?? decodeText(weatherCell);
    const fetchedAt = new Date().toISOString();

    return {
      source: {
        name: 'Ghana Meteorological Agency (GMet)',
        dataset: 'Public weather forecast',
        dataPolicy: 'Public presentation with source attribution',
        climateAtlasUrl: 'https://www.meteo.gov.gh/climate-atlas/',
        observationsUrl: GMET_WEATHER_URL,
      },
      fetchedAt,
      observations: [
        {
          stationId: 'gmet-public-forecast-tamale',
          stationName: GMET_CITY,
          wigosStationIdentifier: 'Not provided',
          observedAt: fetchedAt,
          forecastTime,
          weatherDescription: decodeText(weatherDescription),
          temperatureC: numberFrom(decodeText(cells[2][1])),
          humidityPercent: numberFrom(decodeText(cells[3][1])),
          rainfallMm: numberFrom(decodeText(cells[4][1])),
          pressureHpa: null,
          windSpeedMs: numberFrom(decodeText(cells[5][1])),
          windDirectionDegrees: null,
          freshness: 'current',
        },
      ],
      notice:
        'Current-day forecast for Tamale published by GMet. This is not a ClimaSense sensor reading or a real-time station observation.',
    };
  }

  return null;
}
