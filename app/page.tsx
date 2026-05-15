export default function HomePage() {
  const stats = [
    {
      title: 'Active Devices',
      value: '12',
    },
    {
      title: 'Schools Connected',
      value: '5',
    },
    {
      title: 'Average Heat Index',
      value: '39°C',
    },
    {
      title: 'Air Quality Status',
      value: 'Moderate',
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
            <div
              key={stat.title}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-6"
            >
              <p className="text-slate-400 mb-2">{stat.title}</p>

              <h2 className="text-4xl font-bold">
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 min-h-[300px]">
            <h3 className="text-2xl font-semibold mb-4">
              Heat and Climate Trends
            </h3>

            <div className="h-56 flex items-center justify-center text-slate-500">
              Chart placeholder
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 min-h-[300px]">
            <h3 className="text-2xl font-semibold mb-4">
              Device Health
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>CS-GH-NR-0001</span>
                <span className="text-green-400">Online</span>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>CS-GH-NR-0002</span>
                <span className="text-yellow-400">Low Battery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
