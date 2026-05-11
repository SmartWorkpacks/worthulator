const fs = require('fs');
const f = 'c:/Freelancer/clients/Worthulator-main/components/calculators/RentVsBuyCalculator.tsx';
let t = fs.readFileSync(f, 'utf8');

// Arrow in file is 3 chars: U+00E2, U+2020, U+2019
const brokenArrow = '\u00e2\u2020\u2019';
console.log('Arrow occurrences:', t.split(brokenArrow).length - 1);

const oldSpan = `<span className="transition-transform group-hover:translate-x-0.5">${brokenArrow}</span>`;
const newSvg = `<svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>`;

const oldClass = 'className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition group"';
const newClass = 'className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-all group"';

if (!t.includes(oldSpan)) {
  console.log('Span not found');
  process.exit(1);
}

t = t.replace(oldSpan, newSvg);
t = t.replace(oldClass, newClass);
fs.writeFileSync(f, t, 'utf8');
console.log('Done');
