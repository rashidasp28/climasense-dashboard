# ClimaSense Dashboard

A web dashboard for visualizing ClimaSense climate-health telemetry from schools and community health posts in Northern Ghana.

## Purpose

The dashboard helps ISIR Ghana, teachers, health workers, and district officers monitor climate risks affecting children, including heat stress, air quality, rainfall, device health, and school-level environmental conditions.

## Stack

- Next.js
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

## Data Source

The dashboard consumes readings from the ClimaSense API:

```text
GET /api/readings
```

## Status

Initial MVP scaffold for UNICEF Venture Fund prototype development.
