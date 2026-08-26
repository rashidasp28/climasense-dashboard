'use client';

import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { HistoricalClimateResponse } from '@/lib/types';

type Range = 1 | 5 | 10;

function formatDate(value: string | null): string {
  if (!value) return 'Awaiting source data';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export function HistoricalClimateTrends({
  data,
}: {
  data: HistoricalClimateResponse | null;
}) {
  const [range, setRange] = useState<Range>(10);

  const visiblePoints = useMemo(() => {
    if (!data) return [];
    const firstYear = data.period.endYear - range + 1;
    return data.points.filter((point) => point.year >= firstYear);
  }, [data, range]);

  const visibleYears = useMemo(() => {
    if (!data) return [];
    const firstYear = data.period.endYear - range + 1;
    return data.years.filter((year) => year.year >= firstYear);
  }, [data, range]);

  if (!data) {
    return (
      <section className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-6">
        <h2 className="text-2xl font-semibold">Historical climate trends</h2>
        <p className="mt-2 text-amber-100">
          Historical climate estimates are temporarily unavailable.
        </p>
      </section>
    );
  }

  const wettestYear = visibleYears.reduce((best, year) => {
    if (year.annualRainfallMm === null) return best;
    if (!best || best.annualRainfallMm === null) return year;
    return year.annualRainfallMm > best.annualRainfallMm ? year : best;
  }, visibleYears[0]);

  const hottestYear = visibleYears.reduce((best, year) => {
    if (year.averageTemperatureC === null) return best;
    if (!best || best.averageTemperatureC === null) return year;
    return year.averageTemperatureC > best.averageTemperatureC ? year : best;
  }, visibleYears[0]);

  return (
    <section className="rounded-2xl border border-cyan-400/20 bg-slate-900 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
            Automatically refreshed
          </div>
          <h2 className="text-2xl font-semibold">Rainfall and temperature trends</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Up to 10 years of monthly climate context for {data.location.name}.
            The feed requests data through today and displays the latest date
            published by the source.
          </p>
        </div>
        <div className="flex rounded-lg border border-slate-700 bg-slate-950 p-1" aria-label="Historical period">
          {([1, 5, 10] as Range[]).map((years) => (
            <button
              key={years}
              className={`rounded-md px-3 py-2 text-sm transition ${
                range === years
                  ? 'bg-cyan-400 text-slate-950'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              type="button"
              aria-pressed={range === years}
              onClick={() => setRange(years)}
            >
              {years}Y
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
          <p className="text-sm text-slate-400">Latest source data</p>
          <p className="mt-1 text-xl font-semibold">
            {formatDate(data.period.latestAvailableDate)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Checked through {formatDate(data.period.requestedThrough)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-sm text-slate-400">Wettest year in view</p>
          <p className="mt-1 text-xl font-semibold">
            {wettestYear?.annualRainfallMm == null
              ? 'Unavailable'
              : `${wettestYear.year}: ${wettestYear.annualRainfallMm.toLocaleString()} mm`}
          </p>
          {wettestYear?.isPartial && (
            <p className="mt-1 text-xs text-amber-300">Partial year</p>
          )}
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-sm text-slate-400">Warmest year in view</p>
          <p className="mt-1 text-xl font-semibold">
            {hottestYear?.averageTemperatureC == null
              ? 'Unavailable'
              : `${hottestYear.year}: ${hottestYear.averageTemperatureC.toFixed(1)}°C`}
          </p>
          {hottestYear?.isPartial && (
            <p className="mt-1 text-xs text-amber-300">Partial year</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div>
          <h3 className="mb-3 font-semibold">Monthly rainfall total</h3>
          <div className="h-80" role="img" aria-label="Bar chart of monthly rainfall totals">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visiblePoints}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="label" minTickGap={24} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" unit=" mm" width={68} />
                <Tooltip
                  contentStyle={{ background: '#020617', border: '1px solid #334155' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="rainfallMm" name="Rainfall (mm)" fill="#22d3ee" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Monthly temperature</h3>
          <div className="h-80" role="img" aria-label="Line chart of monthly mean, minimum, and maximum temperature">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visiblePoints}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="label" minTickGap={24} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" unit="°C" width={54} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#020617', border: '1px solid #334155' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Line type="monotone" dataKey="temperatureMinC" name="Mean daily min" stroke="#60a5fa" dot={false} />
                <Line type="monotone" dataKey="temperatureMeanC" name="Mean" stroke="#facc15" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="temperatureMaxC" name="Mean daily max" stroke="#fb7185" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="mb-3 text-left font-semibold text-white">Annual summary</caption>
          <thead className="text-slate-400">
            <tr className="border-b border-slate-700">
              <th className="py-2 pr-4">Year</th>
              <th className="py-2 pr-4">Rainfall total</th>
              <th className="py-2">Mean temperature</th>
            </tr>
          </thead>
          <tbody>
            {visibleYears.map((year) => (
              <tr key={year.year} className="border-b border-slate-800">
                <td className="py-2 pr-4">
                  {year.year}
                  {year.isPartial && (
                    <span className="ml-2 text-xs text-amber-300">(partial)</span>
                  )}
                </td>
                <td className="py-2 pr-4">
                  {year.annualRainfallMm === null
                    ? 'Unavailable'
                    : `${year.annualRainfallMm.toLocaleString()} mm`}
                </td>
                <td className="py-2">
                  {year.averageTemperatureC === null
                    ? 'Unavailable'
                    : `${year.averageTemperatureC.toFixed(1)}°C`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-xs leading-5 text-slate-500">
        Source: {data.source.name}, {data.source.dataset}. Daily precipitation is
        summed by month; daily mean, minimum, and maximum temperatures are averaged
        by month. The feed refreshes every six hours, but source publication may lag
        behind today. These are gridded estimates, not live sensor readings or official
        GMet station observations.{' '}
        <a
          className="text-cyan-300 hover:text-cyan-200"
          href={data.source.methodologyUrl}
          target="_blank"
          rel="noreferrer"
        >
          Methodology
        </a>
      </p>
    </section>
  );
}
