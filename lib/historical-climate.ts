import 'server-only';

import {
  HistoricalClimatePoint,
  HistoricalClimateResponse,
  HistoricalClimateYear,
} from './types';

const LOCATION = {
  name: 'Tamale, Ghana',
  latitude: 9.4075,
  longitude: -0.8533,
};

const MISSING_VALUE = -999;
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

type PowerParameter = Record<string, number>;

type PowerResponse = {
  properties?: {
    parameter?: {
      PRECTOTCORR?: PowerParameter;
      T2M?: PowerParameter;
      T2M_MIN?: PowerParameter;
      T2M_MAX?: PowerParameter;
    };
  };
};

type MonthAccumulator = {
  rainfall: number;
  rainfallDays: number;
  meanTemperatures: number[];
  minTemperatures: number[];
  maxTemperatures: number[];
};

function validValue(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value !== MISSING_VALUE;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
}

export async function fetchHistoricalClimate(): Promise<HistoricalClimateResponse> {
  const currentYear = new Date().getUTCFullYear();
  const endYear = currentYear - 1;
  const startYear = endYear - 4;
  const start = `${startYear}0101`;
  const end = `${endYear}1231`;

  const params = new URLSearchParams({
    parameters: 'PRECTOTCORR,T2M,T2M_MIN,T2M_MAX',
    community: 'AG',
    longitude: String(LOCATION.longitude),
    latitude: String(LOCATION.latitude),
    start,
    end,
    format: 'JSON',
  });

  const response = await fetch(
    `https://power.larc.nasa.gov/api/temporal/daily/point?${params.toString()}`,
    { next: { revalidate: 60 * 60 * 24 * 30 } },
  );

  if (!response.ok) {
    throw new Error(`NASA POWER request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as PowerResponse;
  const parameter = payload.properties?.parameter;
  if (!parameter?.PRECTOTCORR || !parameter.T2M || !parameter.T2M_MIN || !parameter.T2M_MAX) {
    throw new Error('NASA POWER response did not include all requested parameters');
  }

  const months = new Map<string, MonthAccumulator>();

  Object.keys(parameter.T2M).sort().forEach((dateKey) => {
    if (!/^\d{8}$/.test(dateKey)) return;

    const year = Number(dateKey.slice(0, 4));
    const month = Number(dateKey.slice(4, 6));
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    const accumulator = months.get(monthKey) ?? {
      rainfall: 0,
      rainfallDays: 0,
      meanTemperatures: [],
      minTemperatures: [],
      maxTemperatures: [],
    };

    const rainfall = parameter.PRECTOTCORR?.[dateKey];
    const meanTemperature = parameter.T2M?.[dateKey];
    const minTemperature = parameter.T2M_MIN?.[dateKey];
    const maxTemperature = parameter.T2M_MAX?.[dateKey];

    if (validValue(rainfall)) {
      accumulator.rainfall += rainfall;
      accumulator.rainfallDays += 1;
    }
    if (validValue(meanTemperature)) accumulator.meanTemperatures.push(meanTemperature);
    if (validValue(minTemperature)) accumulator.minTemperatures.push(minTemperature);
    if (validValue(maxTemperature)) accumulator.maxTemperatures.push(maxTemperature);

    months.set(monthKey, accumulator);
  });

  const points: HistoricalClimatePoint[] = Array.from(months.entries()).map(([key, values]) => {
    const [year, month] = key.split('-').map(Number);
    return {
      year,
      month,
      label: `${MONTH_NAMES[month - 1]} ${String(year).slice(2)}`,
      rainfallMm: values.rainfallDays > 0 ? Number(values.rainfall.toFixed(1)) : null,
      temperatureMeanC: average(values.meanTemperatures),
      temperatureMinC: average(values.minTemperatures),
      temperatureMaxC: average(values.maxTemperatures),
    };
  });

  const years: HistoricalClimateYear[] = Array.from({ length: 5 }, (_, index) => startYear + index).map(
    (year) => {
      const yearPoints = points.filter((point) => point.year === year);
      const rainfallValues = yearPoints
        .map((point) => point.rainfallMm)
        .filter((value): value is number => value !== null);
      const temperatureValues = yearPoints
        .map((point) => point.temperatureMeanC)
        .filter((value): value is number => value !== null);

      return {
        year,
        annualRainfallMm:
          rainfallValues.length > 0
            ? Number(rainfallValues.reduce((sum, value) => sum + value, 0).toFixed(1))
            : null,
        averageTemperatureC: average(temperatureValues),
      };
    },
  );

  return {
    location: LOCATION,
    period: { startYear, endYear },
    source: {
      name: 'NASA POWER',
      dataset: 'Daily meteorology, MERRA-2-based gridded estimates',
      methodologyUrl: 'https://power.larc.nasa.gov/docs/methodology/',
    },
    points,
    years,
    notice:
      'Historical gridded estimates for climate context. These values are separate from official GMet observations and future ClimaSense sensor readings.',
  };
}
