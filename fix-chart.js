const fs = require('fs');
const f = 'c:/Freelancer/clients/Worthulator-main/components/calculators/RentVsBuyCalculator.tsx';
let t = fs.readFileSync(f, 'utf8');

// Match a unique anchor in old JSX and replace the whole block
const oldStart = `  return (
    <motion.div variants={fadeUp} custom={1} className="rounded-xl border border-gray-200 bg-white p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">Wealth race</p>`;

const oldEnd = `    </motion.div>
  );
}

// `;

const oldIdx = t.indexOf(oldStart);
if (oldIdx === -1) { console.log('START NOT FOUND'); process.exit(1); }

const endSearchFrom = oldIdx + oldStart.length;
const oldEndIdx = t.indexOf(oldEnd, endSearchFrom);
if (oldEndIdx === -1) { console.log('END NOT FOUND'); process.exit(1); }

// The full old JSX including the closing }
const fullOldEnd = oldEnd; // "    </motion.div>\n  );\n}\n\n// "
const fullOld = t.substring(oldIdx, oldEndIdx + fullOldEnd.length);
console.log('Found block, length:', fullOld.length);

const newJsx = `  const xLabels = data.filter((_, i) => {
    const step = Math.ceil(data.length / 5);
    return i === 0 || i === data.length - 1 || i % step === 0;
  });

  return (
    <motion.div variants={fadeUp} custom={1} className="rounded-xl border border-gray-200 bg-white p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">Net worth over time</p>
          <p className="text-xs text-gray-400 mt-0.5">Buying equity vs renting + investing</p>
        </div>
        <div className="flex gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" /> Buy
          </span>
          <span className="flex items-center gap-1.5 text-blue-500">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400 inline-block" /> Rent
          </span>
        </div>
      </div>

      <svg viewBox={\`0 0 \${W} \${H}\`} className="w-full" style={{ height: 210 }}>
        <defs>
          <linearGradient id="rvbBuyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="rvbRentFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {yLabels.map(({ y, label }) => (
          <g key={label}>
            <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="#f3f4f6" strokeWidth={1} />
            <text x={PL - 6} y={y + 4} fontSize={9} fill="#d1d5db" textAnchor="end">{label}</text>
          </g>
        ))}

        <line x1={PL} x2={W - PR} y1={bottomY} y2={bottomY} stroke="#e5e7eb" strokeWidth={1} />

        <path d={buyArea}  fill="url(#rvbBuyFill)" />
        <path d={rentArea} fill="url(#rvbRentFill)" />

        <line x1={stayX} x2={stayX} y1={PT} y2={H - PB + 4} stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.75} />
        <rect x={stayX - 14} y={PT - 15} width={28} height={13} rx={4} fill="#6366f1" />
        <text x={stayX} y={PT - 5} textAnchor="middle" fontSize={8} fill="white" fontWeight="bold">EXIT</text>

        {crossIdx !== null && (
          <motion.circle
            cx={xOf(crossIdx)}
            cy={(yOf(data[crossIdx].equity ?? 0) + yOf(data[crossIdx].rentInvestmentPortfolio ?? 0)) / 2}
            r={7} fill="white" stroke="#f59e0b" strokeWidth={2.5}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 1.6, duration: 0.4, ease: "backOut" }}
          />
        )}

        <motion.path d={rentLine} fill="none" stroke="#60a5fa" strokeWidth={2} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
        />

        <motion.path d={buyLine} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.1 }}
        />

        <motion.circle cx={xOf(data.length - 1)} cy={yOf(data[data.length - 1].equity ?? 0)}
          r={4.5} fill="#10b981" stroke="white" strokeWidth={1.5}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 400 }}
        />
        <motion.circle cx={xOf(data.length - 1)} cy={yOf(data[data.length - 1].rentInvestmentPortfolio ?? 0)}
          r={4.5} fill="#60a5fa" stroke="white" strokeWidth={1.5}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 1.6, type: "spring", stiffness: 400 }}
        />

        {xLabels.map((d) => {
          const i = data.indexOf(d);
          return (
            <text key={d.year} x={xOf(i)} y={H - 8} textAnchor="middle" fontSize={9} fill="#9ca3af">
              yr{d.year}
            </text>
          );
        })}
      </svg>

      {crossIdx !== null && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-3 flex items-center gap-2.5 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5"
        >
          <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-amber-700 text-[10px] font-bold">=</span>
          Lines cross at year {data[crossIdx].year} &mdash; that&apos;s when buying overtakes renting
        </motion.div>
      )}
    </motion.div>
  );
}

// `;

// We need to find exactly where the old return starts (after the yLabels def that we already replaced)
// The part we need to replace now is just the return statement + closing }
// Old start = where "  return (" appears right before the motion.div with p-4

// Actually let's do a clean replacement of the whole section
// We have the old block identified, now replace it
const newBlock = newJsx;
t = t.substring(0, oldIdx) + newBlock + t.substring(oldEndIdx + fullOldEnd.length);
fs.writeFileSync(f, t, 'utf8');
console.log('Done');
