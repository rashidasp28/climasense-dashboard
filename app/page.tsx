import { DeviceStatusTable } from '@/components/device-status-table';
import { StatCard } from '@/components/stat-card';
import { mockReadings, mockSummary } from '@/lib/mock-data';

export default function HomePage() {
  const stats = [
    {
      title: 'Active Devices',
      value: mockSummary.activeDevices,
    },
    {
      title: 'Schools Connected',
      value: mockSummary.schoolsConnected,
    },
    {
      title: 'Average Heat Index',
      value: `${mockSummary.averageHeatIndex}°C`,
    },
    {
      title: 'Air Quality Status',
      value: mockSummary.airQualityStatus,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-4">
            ClimaSense Dashboard
          </h1>

          <p className="text-slate-300 text-lg max-w-3xl">
            Climate-health monitoring platform for schools and communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 min-h-[300px]">
            <h3 className="text-2xl font-semibold mb-4">
              Heat and Climate Trends
            </h3>

            <div className="h-56 flex items-center justify-center text-slate-500">
              Recharts visualization placeholder
            </div>
          </div>

          <DeviceStatusTable readings={mockReadings} />
        </div>
      </div>
    </main>
  );
}
