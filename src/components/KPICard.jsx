function KPICard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2
            className={`text-3xl font-bold mt-2 ${color}`}
          >
            {value}
          </h2>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default KPICard;