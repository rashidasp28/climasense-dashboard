import { OfficialObservationsResponse } from '@/lib/types';

type Props = {
  data: OfficialObservationsResponse | null;
};

const freshnessStyle = {
  current: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
  delayed: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
  stale: 'bg-rose-400/10 text-rose-300 border-rose-400/30',
};

function formatValue(value: number | null, unit: string) {
  return value === null ? 'Not reported' : `${value.toFixed(1)} ${unit}`;
}

export function OfficialObservations({ data }: Props) {
  if (!data || data.observations.length === 0) {
    return (
      <section className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-300">
          Official GMet forecast unavailable
        </p>
        <p className="mt-2 text-slate-300">
          GMet could not provide its current public weather forecast. No
          placeholder reading is being presented as official data.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-cyan-400/20 bg-slate-900 p-6">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Official GMet weather
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Current forecast</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">{data.notice}</p>
        </div>
        <div className="flex gap-4 text-sm">
          <a
            className="text-cyan-300 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            href={data.source.observationsUrl}
            target="_blank"
            rel="noreferrer"
          >
            GMet forecast
          </a>
          <a
            className="text-cyan-300 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            href={data.source.climateAtlasUrl}
            target="_blank"
            rel="noreferrer"
          >
            Climate Atlas
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.observations.map((observation) => (
          <article
            key={observation.stationId}
            className="rounded-xl border border-slate-700 bg-slate-950/70 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">{observation.stationName}</h3>
                <p className="text-xs text-slate-500">
                  {observation.weatherDescription ?? 'Weather forecast'}
                </p>
              </div>
              <span
                className={`rounded-full border px-2 py-1 text-xs font-semibold capitalize ${freshnessStyle[observation.freshness]}`}
              >
                {observation.freshness}
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Temperature</dt>
                <dd className="mt-1 font-medium">{formatValue(observation.temperatureC, '°C')}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Humidity</dt>
                <dd className="mt-1 font-medium">{formatValue(observation.humidityPercent, '%')}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Rainfall</dt>
                <dd className="mt-1 font-medium">{formatValue(observation.rainfallMm, 'mm')}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Wind</dt>
                <dd className="mt-1 font-medium">{formatValue(observation.windSpeedMs, 'm/s')}</dd>
              </div>
            </dl>

            <p className="mt-5 border-t border-slate-800 pt-3 text-xs text-slate-500">
              Forecast for {observation.forecastTime ?? 'the current period'} GMT. Retrieved{' '}
              {new Date(observation.observedAt).toLocaleString('en-GB', {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: 'Africa/Accra',
              })} GMT
            </p>
          </article>
        ))}
      </div>

      <p className="mt-5 text-xs text-slate-500">
        Source: {data.source.name}. Dataset: {data.source.dataset}. Data policy: {data.source.dataPolicy}.
      </p>
    </section>
  );
}
