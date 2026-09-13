# ClimaSense Dashboard

A climate-health dashboard prototype for schools and community health posts in Northern Ghana.

## Live dashboard

https://climasense-dashboard.vercel.app

## Current data layers

The interface keeps three types of information separate:

1. **GMet forecast for Tamale:** Current-day public weather forecast from the Ghana Meteorological Agency. This is not a real-time station observation.
2. **Historical climate context:** Ten calendar years of NASA POWER daily gridded estimates, aggregated into monthly and annual rainfall and temperature trends. NASA publication can lag behind the current date.
3. **ClimaSense prototype preview:** Simulated school, device, heat-index and air-quality values used to demonstrate the planned sensor-network interface. These values are not measurements from deployed hardware.

The server-side GMet adapter requests the city-specific Tamale page and rejects a response for another city. Forecast responses are cached for approximately 30 minutes. Historical NASA POWER responses are cached for approximately six hours.

## Planned telemetry integration

The dashboard includes a client for the future ClimaSense API endpoint:

```text
GET /api/readings
```

Until electronic sensor nodes and their ingestion service are operational, the dashboard must continue to label prototype readings as simulated.

## Local development

Requirements:

- Node.js 20
- npm

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

Run the production verification used by CI:

```bash
npm run build
```

## Project structure

- `app/`: Next.js pages and server routes
- `components/`: dashboard panels and charts
- `lib/gmet-weather.ts`: Tamale GMet forecast adapter
- `lib/historical-climate.ts`: NASA POWER retrieval and aggregation
- `lib/api.ts`: data-access boundary
- `lib/mock-data.ts`: clearly labelled prototype values

## Data interpretation

- A forecast describes expected conditions and should not be presented as a sensor observation.
- NASA POWER values are gridded estimates for climate context, not measurements from the ClimaSense network.
- Simulated prototype values must remain visibly labelled until field hardware supplies verified telemetry.
- When an upstream source is unavailable, the interface should show that state rather than inventing replacement data.

## Roadmap

The next implementation stages include verified sensor ingestion, live device and battery status, air-quality widgets, alerts, maps, offline support and multi-community reporting.

## Licence

MIT
