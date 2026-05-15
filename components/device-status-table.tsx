import { ClimateReading } from '@/lib/types';

type DeviceStatusTableProps = {
  readings: ClimateReading[];
};

export function DeviceStatusTable({
  readings,
}: DeviceStatusTableProps) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
      <h3 className="text-2xl font-semibold mb-6">
        Device Status
      </h3>

      <div className="space-y-4">
        {readings.map((reading) => (
          <div
            key={reading.deviceId}
            className="flex items-center justify-between border-b border-slate-800 pb-3"
          >
            <div>
              <p className="font-medium">
                {reading.deviceId}
              </p>

              <p className="text-sm text-slate-400">
                {reading.community}
              </p>
            </div>

            <div className="text-right">
              <p className="text-green-400">
                {reading.dhtHealthy ? 'Healthy' : 'Offline'}
              </p>

              <p className="text-sm text-slate-400">
                Battery: {reading.batteryVoltage?.toFixed(2)}V
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
