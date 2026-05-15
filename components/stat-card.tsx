type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
};

export function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
      <p className="text-slate-400 mb-2">{title}</p>

      <h2 className="text-4xl font-bold mb-2">
        {value}
      </h2>

      {description ? (
        <p className="text-sm text-slate-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}
