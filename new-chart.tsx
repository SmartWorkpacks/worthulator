function WealthRaceChart({
  schedule, yearsToStay,
}: {
  schedule: RentVsBuyYearRow[];
  yearsToStay: number;
  winner: "buy" | "rent" | "tie";
}) {
  const data = schedule.filter((r) => r.year <= Math.max(yearsToStay, 10));
  if (data.length < 2) return null;

  const chartData = data.map((d) => ({
    year:  d.year,
    buy:   Math.round(d.equity ?? 0),
    rent:  Math.round(d.rentInvestmentPortfolio ?? 0),
    delta: Math.round(d.netWorthDelta ?? ((d.equity ?? 0) - (d.rentInvestmentPortfolio ?? 0))),
  }));

  let crossoverYear: number | null = null;
  for (let i = 1; i < chartData.length; i++) {
    if ((chartData[i - 1].buy >= chartData[i - 1].rent) !== (chartData[i].buy >= chartData[i].rent)) {
      crossoverYear = chartData[i].year;
      break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AreaTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const buy   = payload.find((p: { dataKey: string }) => p.dataKey === "buy")?.value  ?? 0;
    const rent  = payload.find((p: { dataKey: string }) => p.dataKey === "rent")?.value ?? 0;
    const delta = buy - rent;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-3 py-2.5 text-xs min-w-32 pointer-events-none">
        <p className="font-bold text-gray-700 mb-1.5 text-[11px]">Year {label}</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-gray-400">Buy</span>
          <span className="font-bold text-emerald-700 ml-auto tabular-nums">{safeK(buy)}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
          <span className="text-gray-400">Rent</span>
          <span className="font-bold text-blue-600 ml-auto tabular-nums">{safeK(rent)}</span>
        </div>
        <div className={`flex items-center gap-1.5 pt-1.5 border-t border-gray-100 text-[11px] font-bold ${delta >= 0 ? "text-emerald-700" : "text-blue-600"}`}>
          <span>{delta >= 0 ? "\u25B2" : "\u25BC"}</span>
          <span>{delta >= 0 ? "Buy" : "Rent"} +{safeK(Math.abs(delta))}</span>
        </div>
      </div>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const BarTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const delta = payload[0]?.value ?? 0;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-3 py-2 text-xs pointer-events-none">
        <p className="font-bold text-gray-600 text-[11px] mb-0.5">Year {label}</p>
        <p className={`font-black text-sm ${delta >= 0 ? "text-emerald-600" : "text-blue-600"}`}>
          {delta >= 0 ? "Buy" : "Rent"} +{safeK(Math.abs(delta))}
        </p>
      </div>
    );
  };

  const tickFmt = (v: number) => safeK(v);
  const TT_STYLE = { backgroundColor: "transparent", border: "none", boxShadow: "none", padding: 0 };

  return (
    <motion.div variants={fadeUp} custom={1} className="space-y-3">
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-gray-800">Wealth comparison</p>
        <div className="flex gap-3 text-xs font-medium ml-auto">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" /> Buy
          </span>
          <span className="flex items-center gap-1.5 text-blue-500">
            <span className="h-2 w-2 rounded-full bg-blue-400 shrink-0" /> Rent
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] gap-3">
        {/* Net worth trajectory */}
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Net worth trajectory</p>
          <ResponsiveContainer width="100%" height={188}>
            <AreaChart syncId="wrc" data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id="rcBuy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="rcRent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="year"
                tickFormatter={(v: number) => `yr${v}`}
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={tickFmt}
                tick={{ fontSize: 9, fill: "#d1d5db" }}
                tickLine={false}
                axisLine={false}
                width={38}
              />
              <Tooltip
                content={<AreaTooltipContent />}
                contentStyle={TT_STYLE}
                cursor={{ stroke: "#e2e8f0", strokeWidth: 1.5 }}
              />
              <ReferenceLine
                x={yearsToStay}
                stroke="#6366f1"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                label={{ value: "EXIT", position: "insideTopLeft", fontSize: 8, fill: "#6366f1", fontWeight: 700 }}
              />
              {crossoverYear !== null && (
                <ReferenceLine x={crossoverYear} stroke="#f59e0b" strokeDasharray="2 2" strokeWidth={1} />
              )}
              <Area type="monotone" dataKey="rent" stroke="#60a5fa" strokeWidth={2} fill="url(#rcRent)"
                dot={false} activeDot={{ r: 4, fill: "#60a5fa", stroke: "white", strokeWidth: 2 }}
                isAnimationActive animationDuration={1400} animationEasing="ease-in-out" />
              <Area type="monotone" dataKey="buy" stroke="#10b981" strokeWidth={2.5} fill="url(#rcBuy)"
                dot={false} activeDot={{ r: 4.5, fill: "#10b981", stroke: "white", strokeWidth: 2 }}
                isAnimationActive animationDuration={1400} animationEasing="ease-in-out" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Who's ahead bar chart */}
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Who&apos;s ahead, year by year</p>
          <ResponsiveContainer width="100%" height={168}>
            <BarChart syncId="wrc" data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="year"
                tickFormatter={(v: number) => `yr${v}`}
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={tickFmt}
                tick={{ fontSize: 9, fill: "#d1d5db" }}
                tickLine={false}
                axisLine={false}
                width={38}
              />
              <Tooltip
                content={<BarTooltipContent />}
                contentStyle={TT_STYLE}
                cursor={{ fill: "rgba(148,163,184,0.08)" }}
              />
              <ReferenceLine y={0} stroke="#e5e7eb" strokeWidth={1.5} />
              <Bar dataKey="delta" radius={[2, 2, 0, 0]} isAnimationActive animationDuration={800} animationEasing="ease-out" maxBarSize={28}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.delta >= 0 ? "#34d399" : "#93c5fd"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center text-[10px] font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400 shrink-0" /> Buying ahead
            </span>
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="h-2.5 w-2.5 rounded-sm bg-blue-300 shrink-0" /> Renting ahead
            </span>
          </div>
        </div>
      </div>

      {crossoverYear !== null && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex items-center gap-2.5 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5"
        >
          <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-amber-700 text-[10px] font-bold">~</span>
          Crossover at year {crossoverYear} &mdash; that&apos;s when buying overtakes renting in net worth
        </motion.div>
      )}
    </motion.div>
  );
}
