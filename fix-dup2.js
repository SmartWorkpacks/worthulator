// Fix the duplicate WealthRaceChart by removing the second (old) definition
const fs = require('fs');
const f  = './components/calculators/RentVsBuyCalculator.tsx';
let t    = fs.readFileSync(f, 'utf8');

// First WRC is the NEW Recharts one - keep it
const i1 = t.indexOf('function WealthRaceChart');
const i2 = t.indexOf('function WealthRaceChart', i1 + 1);
if (i2 === -1) { console.log('No duplicate found - already clean'); process.exit(0); }

console.log('First WRC at:', i1, '| Second (old) WRC at:', i2);

// The second WRC runs until the // ─── What-if slider section comment
// Find the section comment right before What-if slider: it starts with "\r\n// "
const whatIfIdx = t.indexOf('What-if slider', i2);
if (whatIfIdx === -1) { console.log('No What-if after second WRC'); process.exit(1); }

// Walk back from whatIfIdx to find start of the comment line: \r\n// 
// The pattern is "\r\n\r\n// ─── What-if..." so find the \r\n\r\n before the comment
let cutEnd = whatIfIdx;
// Walk back to find the \r\n\r\n prefix before the //
while (cutEnd > i2 && t[cutEnd] !== '\n') cutEnd--;
// We're at the \n of the blank line. Walk back one more \r
while (cutEnd > i2 && (t[cutEnd] === '\n' || t[cutEnd] === '\r')) cutEnd--;
// Now cutEnd points to } (closing brace of WealthRaceChart)
cutEnd += 1; // include the }

console.log('Cut range: second WRC start', i2, 'to end', cutEnd);
console.log('Context before cut start:', JSON.stringify(t.substring(i2 - 20, i2 + 30)));
console.log('Context after cut end:', JSON.stringify(t.substring(cutEnd, cutEnd + 50)));

// Remove the duplicate: everything from i2 to cutEnd
t = t.substring(0, i2) + t.substring(cutEnd);

fs.writeFileSync(f, t, 'utf8');

const count = t.split('function WealthRaceChart').length - 1;
console.log('Done. WealthRaceChart definitions now:', count);
