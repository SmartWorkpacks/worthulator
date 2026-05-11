const fs = require('fs');
const f = './components/calculators/RentVsBuyCalculator.tsx';
let t = fs.readFileSync(f, 'utf8');

// Find end of new WealthRaceChart (first "Lines cross at year" → next \r\n}\r\n\r\n)
const linesIdx = t.indexOf('Lines cross at year');
console.log('First "Lines cross at year" at:', linesIdx);

const closePat = '\r\n}\r\n\r\n';
const closeIdx = t.indexOf(closePat, linesIdx);
console.log('WRC function close at:', closeIdx);

// Keep up through the closing }
const keepEnd = closeIdx + 3; // includes "\r\n}"
console.log('Keep content up to byte:', keepEnd, '|', JSON.stringify(t.substring(keepEnd - 5, keepEnd + 5)));

// Find start of What-if slider section (search backwards from its comment)
const whatIfStr = 'What-if slider';
const whatIfIdx = t.indexOf(whatIfStr); // unique occurrence at 47111
// Walk back to find \r\n\r\n// which starts the comment block
let sliceStart = whatIfIdx - 1;
while (sliceStart > keepEnd && t[sliceStart] !== '\n') sliceStart--;
sliceStart--; // back over \n
if (t[sliceStart] === '\r') sliceStart--; // back over \r
sliceStart--; // back over second \n
if (t[sliceStart] === '\r') sliceStart--; // back over second \r
sliceStart++; // now pointing at first \r of \r\n\r\n

console.log('What-if section starts at:', sliceStart);
console.log('ctx:', JSON.stringify(t.substring(sliceStart, sliceStart + 60)));

if (closeIdx === -1 || whatIfIdx === -1) {
  console.log('ANCHORS NOT FOUND');
  process.exit(1);
}

// Stitch: [0..keepEnd] + [sliceStart..end]
t = t.substring(0, keepEnd) + t.substring(sliceStart);
fs.writeFileSync(f, t, 'utf8');
console.log('Done, new size:', t.length);
