const fs = require('fs');
const t  = fs.readFileSync('./components/calculators/RentVsBuyCalculator.tsx', 'utf8');
const i1 = t.indexOf('function WealthRaceChart');
const i2 = t.indexOf('function WealthRaceChart', i1 + 1);
const w  = t.indexOf('What-if slider');
console.log('first:', i1, 'second:', i2, 'whatIf:', w, 'len:', t.length);

// Print context around both occurrences
if (i1 >= 0) console.log('\n-- FIRST at', i1, '--\n', JSON.stringify(t.substring(i1, i1 + 60)));
if (i2 >= 0) console.log('\n-- SECOND at', i2, '--\n', JSON.stringify(t.substring(i2, i2 + 60)));
