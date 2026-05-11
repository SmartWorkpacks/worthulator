const fs = require('fs');
const f  = './components/calculators/RentVsBuyCalculator.tsx';
let t    = fs.readFileSync(f, 'utf8');

// Start: the function declaration (unique, no special chars)
const startAnchor = 'function WealthRaceChart({\n  schedule, yearsToStay,\n}:';
// Also try CRLF
const startAnchorCR = 'function WealthRaceChart({\r\n  schedule, yearsToStay,\r\n}:';

// End: right before the What-if slider comment — find the closing } + blank line before it
// The end of WealthRaceChart is the closing } before "\r\n// ─── What-if slider"
// We find the first occurrence of "What-if slider" and walk backwards past \r\n}\r\n\r\n
const whatIfIdx = t.indexOf('What-if slider');
if (whatIfIdx === -1) { console.log('What-if not found'); process.exit(1); }

// Walk back to find \r\n}\r\n\r\n or \n}\n\n
let funcEnd = whatIfIdx;
// Go back past the comment line (e.g. "// ─── What-if slider ───...")
// The comment starts right after a \n or \r\n
// Let's go back past \r\n\r\n// → find the \r\n}\r\n preceding the blank line
// Pattern: }\r\n\r\n//  OR }\n\n//
const pat1 = '}\r\n\r\n//';
const pat2 = '}\n\n//';
const p1   = t.lastIndexOf(pat1, whatIfIdx);
const p2   = t.lastIndexOf(pat2, whatIfIdx);
const closeOfWRC = Math.max(p1, p2); // position of } that closes WealthRaceChart
if (closeOfWRC === -1) { console.log('Close not found'); process.exit(1); }
const endByte = closeOfWRC + 1; // include the }
console.log('WRC closes at byte:', closeOfWRC);

// Find the start of WealthRaceChart function
let si = t.indexOf(startAnchor);
if (si === -1) si = t.indexOf(startAnchorCR);
if (si === -1) { console.log('Start not found'); process.exit(1); }
// Walk back to include the comment line above it: find \n before "function WealthRaceChart"
// We want to keep the comment header intact — actually let's skip it, just replace the function body
// The comment is: // ─── Wealth race chart ─────...
// Let's just replace from "function WealthRaceChart" to closing }
console.log('WRC starts at byte:', si);

// Read new function
const newFn = fs.readFileSync('./new-chart.tsx', 'utf8').replace(/\r?\n/g, '\r\n');

t = t.substring(0, si) + newFn + t.substring(endByte);
fs.writeFileSync(f, t, 'utf8');
console.log('Done, new size:', t.length);

// Verify: count occurrences of function WealthRaceChart
const count = t.split('function WealthRaceChart').length - 1;
console.log('WealthRaceChart definitions:', count);
