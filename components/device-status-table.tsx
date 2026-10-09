import { ClimateReading } from '@/lib/types';

type DeviceStatusTableProps = {
  readings: ClimateReading[];
};

export function DeviceStatusTable({
  readings,
}: DeviceStatusTableProps) {
  return (
    <section
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
      aria-labelledby="device-status-heading"
    >
      <h2 id="device-status-heading" className="mb-6 text-2xl font-semibold">
        Device status
      </h2>

      <ul className="space-y-4">
        {readings.map((reading) => {
          const health = reading.dhtHealthy ? 'Healthy' : 'Offline';
          const healthStyle = reading.dhtHealthy ? 'text-green-400' : 'text-rose-300';

          return (
            <li
              key={reading.deviceId}
              className="flex items-center justify-between border-b border-slate-800 pb-3"
            >
              <div>
                <p className="font-medium">
                  {reading.deviceId}
                </p>

                <p className="text-sm text-slate-400">
                  {reading.community ?? 'Community not assigned'}
                </p>
              </div>

              <div className="text-right">
                <p className={healthStyle}>
                  <span className="sr-only">Device health: </span>
                  {health}
                </p>

                <p className="text-sm text-slate-400">
                  Battery:{' '}
                  {reading.batteryVoltage == null
                    ? 'Not reported'
                    : `${reading.batteryVoltage.toFixed(2)} V`}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
