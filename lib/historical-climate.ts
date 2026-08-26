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

function formatPowerDate(date: Date): string {
  return date.toISOString().slice(0, 10).replaceAll('-', '');
}

function toIsoDate(dateKey: string): string {
  return `${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6, 8)}`;
}

export async function fetchHistoricalClimate(): Promise<HistoricalClimateResponse> {
  const today = new Date();
  const currentYear = today.getUTCFullYear();
  const startYear = currentYear - 9;
  const requestedThrough = today.toISOString().slice(0, 10);

  const params = new URLSearchParams({
    parameters: 'PRECTOTCORR,T2M,T2M_MIN,T2M_MAX',
    community: 'AG',
    longitude: String(LOCATION.longitude),
    latitude: String(LOCATION.latitude),
    start: `${startYear}0101`,
    end: formatPowerDate(today),
    format: 'JSON',
  });

  const response = await fetch(
    `https://power.larc.nasa.gov/api/temporal/daily/point?${params.toString()}`,
    { next: { revalidate: 60 * 60 * 6 } },
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
  const completeDateKeys = Object.keys(parameter.T2M)
    .sort()
    .filter((dateKey) => {
      if (!/^\\d{8}$/.test(dateKey)) return false;
      return (
        validValue(parameter.PRECTOTCORR[dateKey]) &&
        validValue(parameter.T2M[dateKey]) &&
        validValue(parameter.T2M_MIN[dateKey]) &&
        validValue(parameter.T2M_MAX[dateKey])
      );
    });
  const latestDateKey: string | undefined = completeDateKeys.at(-1);
  const latestAvailableDate: string | null = latestDateKey
    ? toIsoDate(latestDateKey)
    : null;

  completeDateKeys.forEach((dateKey) => {
    const rainfall = parameter.PRECTOTCORR[dateKey];
    const meanTemperature = parameter.T2M[dateKey];
    const minTemperature = parameter.T2M_MIN[dateKey];
    const maxTemperature = parameter.T2M_MAX[dateKey];
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

    accumulator.rainfall += rainfall;
    accumulator.rainfallDays += 1;
    accumulator.meanTemperatures.push(meanTemperature);
    accumulator.minTemperatures.push(minTemperature);
    accumulator.maxTemperatures.push(maxTemperature);
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

  const latestAvailableYear = latestAvailableDate
    ? Number(latestAvailableDate.slice(0, 4))
    : currentYear;

  const years: HistoricalClimateYear[] = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index,
  ).map((year) => {
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
      isPartial: year === latestAvailableYear && latestAvailableDate?.slice(5) !== '12-31',
    };
  });

  return {
    location: LOCATION,
    period: {
      startYear,
      endYear: currentYear,
      requestedThrough,
      latestAvailableDate,
    },
    source: {
      name: 'NASA POWER',
      dataset: 'Daily meteorology, MERRA-2-based gridded estimates',
      methodologyUrl: 'https://power.larc.nasa.gov/docs/methodology/',
    },
    points,
    years,
    notice:
      'Automatically refreshed historical gridded estimates for climate context. Source publication can lag behind today. These values are separate from official GMet observations and ClimaSense sensor readings.',
  };
}
