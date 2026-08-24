import { DeviceStatusTable } from '@/components/device-status-table';
import { OfficialObservations } from '@/components/official-observations';
import { StatCard } from '@/components/stat-card';
import { fetchOfficialObservations } from '@/lib/api';
import { mockReadings, mockSummary } from '@/lib/mock-data';

export default async function HomePage() {
  const officialObservations = await fetchOfficialObservations();

  const stats = [
    {
      title: 'Prototype Nodes',
      value: mockSummary.activeDevices,
      description: 'Planned demonstration inventory',
    },
    {
      title: 'Pilot Schools',
      value: mockSummary.schoolsConnected,
      description: 'Planned programme coverage',
    },
    {
      title: 'Preview Heat Index',
      value: `${mockSummary.averageHeatIndex}°C`,
      description: 'Simulated interface value',
    },
    {
      title: 'Preview Air Quality',
      value: mockSummary.airQualityStatus,
      description: 'Simulated interface value',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
            Pre-prototype demonstration
          </div>
          <h1 className="mb-4 text-5xl font-bold">ClimaSense Dashboard</h1>
          <p className="max-w-3xl text-lg text-slate-300">
            Climate-health monitoring for schools and communities, combining
            clearly labelled official GMet forecast information with a preview of
            the future ClimaSense sensor network.
          </p>
        </div>

        <div className="mb-10">
          <OfficialObservations data={officialObservations} />
        </div>

        <div className="mb-5">
          <h2 className="text-2xl font-semibold">ClimaSense prototype preview</h2>
          <p className="mt-2 text-slate-400">
            The values below are simulated interface data. They are not current
            readings from deployed electronic sensor nodes.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="min-h-[300px] rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-4 text-2xl font-semibold">Climate context</h3>
            <p className="text-slate-400">
              The Ghana Climate Atlas provides long-term historical and
              projected temperature and rainfall context. A comparative chart
              can be added after dataset reuse and attribution requirements are
              confirmed with GMet.
            </p>
            <a
              className="mt-6 inline-flex text-cyan-300 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              href="https://www.meteo.gov.gh/climate-atlas/climate-change/"
              target="_blank"
              rel="noreferrer"
            >
              Explore the Ghana Climate Atlas
            </a>
          </div>

          <div>
            <div className="mb-3 rounded-lg border border-violet-400/20 bg-violet-400/5 px-4 py-3 text-sm text-violet-200">
              Simulated prototype data
            </div>
            <DeviceStatusTable readings={mockReadings} />
          </div>
        </div>
      </div>
    </main>
  );
}
