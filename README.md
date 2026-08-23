# ClimaSense Dashboard

A web dashboard for visualizing ClimaSense climate-health telemetry from schools and community health posts in Northern Ghana.

## Purpose

The dashboard helps ISIR Ghana, teachers, health workers, and district officers monitor climate risks affecting children, including heat stress, air quality, rainfall, device health, and school-level environmental conditions.

## Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Recharts
- Leaflet-ready architecture

## Core Views

- School climate status
- Heat index monitoring
- Air quality indicators
- Rainfall and soil moisture trends
- Device and battery health
- Alert overview

## Local Development

### Prerequisites

- Node.js 20
- npm
- A running ClimaSense API for future live-data integration

### Install and build

```bash
npm install
npm run build
```

A successful production build confirms that the Next.js application and TypeScript sources compile.

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If the ClimaSense API is also running locally on port 3000, start the dashboard on another port:

```bash
npm run dev -- -p 3001
```

Then open [http://localhost:3001](http://localhost:3001).

### API connection

The prepared API client reads `NEXT_PUBLIC_API_URL` and defaults to `http://localhost:3000`.

Set the URL for the current shell when starting the dashboard:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000 npm run dev -- -p 3001
```

Before dashboard integration testing, verify that the API is available:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/readings
```

The homepage currently renders the sample records in `lib/mock-data.ts`. The API client in `lib/api.ts` is ready for the planned live-telemetry integration, but it is not yet called by the homepage.

## Data Source

The dashboard is designed to consume readings from the ClimaSense API:

```text
GET /api/readings
```

## Current Status

Initial MVP scaffold for UNICEF Venture Fund prototype development.

Implemented:

- Dashboard homepage
- Summary cards
- Device status table
- Mock telemetry
- API client
- Continuous build check

Planned next:

- Connect the homepage to the API client
- Add loading, empty, and error states
- Replace the chart placeholder with live telemetry visualization
- Add school, battery, air-quality, and mapping views

## License

MIT License.
