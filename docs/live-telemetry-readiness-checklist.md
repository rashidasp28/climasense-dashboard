# Live telemetry readiness checklist

## Purpose

Use this checklist before replacing the dashboard's simulated ClimaSense preview with readings from `GET /api/readings`. It defines the evidence needed to show that data are retrieved, interpreted, labelled, displayed, and monitored consistently.

This document is a release gate, not an implementation design. Completing it does not validate the sensors, certify health-risk thresholds, or authorize operational alerts.

## Release rule

Keep the simulated preview and its visible label until every required gate below has an owner, evidence, and an explicit pass decision. A partial integration may run in a private test environment, but it must not be presented publicly as verified live telemetry.

Record the API commit, dashboard commit, deployment, database dataset, device firmware version, and verification date together. If any of those changes materially, review the affected gates again.

## Current boundaries

The current platform separates three data classes:

| Data class | Current source | Intended use | Must not be described as |
| --- | --- | --- | --- |
| GMet forecast | GMet public Tamale forecast | Current-day official weather context | A ClimaSense reading or real-time station observation |
| Historical climate context | NASA POWER daily gridded estimates | Multi-year rainfall and temperature context | A local sensor measurement |
| ClimaSense prototype preview | Static simulated records | Interface demonstration | Deployed or verified live telemetry |

Live ClimaSense readings become a fourth data class. They must retain device, place, time, unit, quality, and provenance information and remain visibly distinct from official and historical sources.

## 1. Ownership and test evidence

- [ ] A named integration owner coordinates the API, dashboard, firmware, and deployment evidence.
- [ ] A reviewer who did not implement the integration repeats the critical acceptance checks.
- [ ] The test environment, database, devices, firmware, API commit, dashboard commit, and deployment URL are recorded.
- [ ] Test data are clearly identified and cannot be mistaken for school or community measurements.
- [ ] Raw acceptance results, screenshots, request logs, and defect records have a durable location.
- [ ] Every failed gate has an owner, corrective action, and retest record.

## 2. API contract

The dashboard must verify the deployed API rather than relying only on documentation or TypeScript types.

- [ ] `GET /health` returns the expected service status and server timestamp.
- [ ] `GET /api/readings` returns no more than the documented maximum of 100 records, newest first.
- [ ] Production requests use the required authorization path without exposing credentials to browser code, logs, screenshots, or client bundles.
- [ ] The response content type and error format are documented and tested.
- [ ] The dashboard validates the response shape before rendering it.
- [ ] Unknown extra fields are handled deliberately.
- [ ] Missing optional fields remain missing and are not replaced silently with zero, `false`, or a plausible-looking value.
- [ ] An empty but valid response is distinguished from an unavailable or rejected request.

### Contract fields

| API field | Meaning | Dashboard requirement |
| --- | --- | --- |
| `id` | Stored reading identifier | Use only as a non-secret record identifier |
| `createdAt` | Persistence timestamp | Display or retain for freshness assessment |
| `deviceId` | Device identifier | Required for a displayed device reading |
| `schoolId` | Optional school identifier | Do not invent when absent |
| `community` | Optional community label | Show an explicit unassigned state when absent |
| `temperatureC` | Air temperature in degrees Celsius | Preserve unit and missingness |
| `humidityPercent` | Relative humidity in percent | Preserve unit and missingness |
| `heatIndexC` | Heat index in degrees Celsius | Label as calculated or supplied, not directly measured |
| `pm25` | PM2.5 concentration | Display the API's documented unit |
| `pm10` | PM10 concentration | Display the API's documented unit |
| `soilMoisturePercent` | Soil-moisture value in percent | Preserve method and calibration limitations |
| `rainfallMm` | Rainfall in millimetres | Preserve valid zero values |
| `batteryVoltage` | Device supply or battery voltage | Do not convert into state of charge without a validated model |
| `wifiRssi` | Wi-Fi signal strength | Preserve unit and avoid treating it as data quality |
| `dhtHealthy` | DHT sensor health flag | Distinguish `true`, `false`, and not reported |

If the API contract changes, update this table and the dashboard types in the same reviewed release.

## 3. Device and location identity

- [ ] Every displayed record has a stable device identifier that matches the hardware label and deployment register.
- [ ] Duplicate device identifiers are rejected or escalated.
- [ ] School and community labels come from an approved registry rather than unrestricted device text.
- [ ] A device moved between sites has a dated assignment history.
- [ ] Retired, test, maintenance, and production devices are distinguishable.
- [ ] Public views expose only the location precision needed for their purpose.

## 4. Time and freshness

- [ ] The meaning and timezone of `createdAt` are documented.
- [ ] The system distinguishes measurement time, ingestion time, database time, and dashboard retrieval time where available.
- [ ] Records arriving out of order do not replace newer device status accidentally.
- [ ] A documented freshness threshold controls current, delayed, stale, and unavailable labels.
- [ ] The dashboard displays the relevant timestamp and timezone near live readings.
- [ ] Clock drift, future timestamps, duplicate timestamps, and long ingestion delays are tested.
- [ ] A stale reading never appears as a current condition merely because the dashboard refreshed.

## 5. Units, ranges, and missingness

- [ ] Units agree across firmware, MQTT payloads, API storage, dashboard types, labels, tooltips, and exports.
- [ ] Valid zero values survive ingestion and display.
- [ ] `null`, absent, invalid, and not-yet-received values have defined and distinct handling.
- [ ] Non-finite numbers are rejected before rendering.
- [ ] Implausible but syntactically valid values are flagged for review rather than silently clipped.
- [ ] Range checks use the sensor and calibration documentation, not assumptions from the chart scale.
- [ ] Derived values such as heat index identify their method and input requirements.

## 6. Provenance and quality state

Each live panel or table must let a reviewer determine:

- which device produced the value;
- which site it represented at the time;
- when it was measured or stored;
- which unit and field were used;
- whether the value is current, delayed, stale, missing, test, or excluded; and
- whether calibration or maintenance status limits interpretation.

Do not merge official forecasts, historical gridded estimates, and device measurements into one series without source labels and an explanation of their different meanings.

## 7. Interface states

Verify each state independently:

- [ ] loading before a response is available;
- [ ] live data available;
- [ ] valid empty dataset;
- [ ] partial records with optional fields missing;
- [ ] authorization rejected;
- [ ] API unavailable or timed out;
- [ ] malformed or contract-incompatible response;
- [ ] stale last-known data;
- [ ] test or simulated data; and
- [ ] recovery after the upstream service returns.

Unavailable data must not fall back silently to the simulated preview. If simulated records remain available for demonstrations, require an explicit mode and persistent simulated-data label.

## 8. Display and accessibility

- [ ] Every value has a visible unit or an explicit non-numeric state.
- [ ] Status meaning does not depend on colour alone.
- [ ] Charts have an accessible name and a table or textual summary for essential values.
- [ ] Keyboard users can reach filters, time-range controls, details, and error recovery actions.
- [ ] Focus order and focus indicators remain clear after data refreshes.
- [ ] Screen readers receive meaningful change announcements without repeated noise.
- [ ] Layout remains usable on representative mobile, tablet, and desktop widths.
- [ ] Large values, long place names, and translated labels do not obscure provenance or units.

## 9. Scientific and communication safeguards

- [ ] The interface describes what was measured without claiming a cause.
- [ ] A device reading is not presented as a clinical diagnosis or individual exposure measurement.
- [ ] Health or emergency wording is reviewed against an approved alert protocol before release.
- [ ] Air-quality, heat, rainfall, and soil-moisture thresholds identify their source and scope.
- [ ] A single sensor cannot be mistaken for complete community coverage.
- [ ] Calibration, siting, shielding, maintenance, and representativeness limitations are available to users.
- [ ] Comparisons use compatible devices, units, time windows, and quality states.

## 10. Performance and failure control

- [ ] Timeouts prevent upstream requests from hanging the page indefinitely.
- [ ] Retries use a bounded policy and do not amplify an outage.
- [ ] Caching and refresh intervals are documented and visible where they affect freshness.
- [ ] The page remains usable when one data source fails.
- [ ] Large responses and slow networks are tested.
- [ ] Errors shown to users are useful but do not reproduce credentials, internal URLs, stack traces, or sensitive request details.
- [ ] Server logs contain enough context to diagnose failures without storing unnecessary personal or secret data.

## 11. End-to-end acceptance scenarios

Run the following with controlled, traceable records:

1. A complete valid reading appears with the correct device, place, time, units, and values.
2. A record containing valid zeros displays zeros rather than unavailable states.
3. A record missing every optional measurement remains valid and clearly incomplete.
4. An unhealthy DHT status is distinct from an unreported status.
5. Two devices reporting at the same time remain separate.
6. A delayed record receives the correct freshness state.
7. A future-dated or malformed record is rejected or quarantined visibly.
8. An authorization failure shows a controlled unavailable state.
9. An API timeout does not replace live data with simulated values.
10. Recovery restores data without duplicating or reordering records incorrectly.

For each scenario, retain the input, expected result, observed result, screenshot or output, tester, date, and decision.

## 12. Rollout and rollback

- [ ] The integration can be enabled first in a private or limited pilot view.
- [ ] The release has a named go/no-go approver.
- [ ] Monitoring covers availability, response errors, validation failures, stale devices, and missing fields.
- [ ] A rollback path returns to the previous reviewed dashboard without relabelling simulated data as live.
- [ ] Users know how to report a questionable value.
- [ ] The first post-release review date and owner are recorded.

## Minimum release record

```text
Release record ID:
Dashboard commit:
API commit:
Firmware version:
Deployment URL and environment:
Database or dataset identifier:
Devices and sites included:
Contract evidence location:
Unit and missingness review:
Freshness test result:
End-to-end scenario results:
Accessibility review:
Known limitations:
Open defects and owners:
Monitoring and rollback owner:
Decision: go / limited pilot / no-go
Approver and date:
Next review date:
```

## Stop conditions

Do not release live telemetry when:

- credentials or protected API responses may be exposed to the browser or repository;
- device identity or site assignment is uncertain;
- units, timestamps, source, or missingness cannot be interpreted reliably;
- stale, simulated, official, and live data are not visibly distinguishable;
- invalid values can reach public charts without a controlled state;
- the deployed API and dashboard were not tested together; or
- rollback and monitoring ownership are undefined.
