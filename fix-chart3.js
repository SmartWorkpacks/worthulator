const fs = require("fs");
const f = "./components/calculators/RentVsBuyCalculator.tsx";
let t = fs.readFileSync(f, "utf8");

// Find the return statement start (p-4 card = still old JSX)
const returnStart = t.lastIndexOf("  return (\r\n    <motion.div variants={fadeUp} custom={1}", 21000);
console.log("return start:", returnStart);

// Find function close after the "Wealth race" section
// Look for the pattern: crossIdx check message + motion.div close + function close
const msgAnchor = "Lines cross at year";
const msgIdx = t.indexOf(msgAnchor, returnStart);
console.log("msg at:", msgIdx);

// Find "}\r\n\r\n// " after msgIdx
const funcClose = "}\r\n\r\n// ";
const closeIdx = t.indexOf(funcClose, msgIdx);
console.log("close at:", closeIdx, "ctx:", JSON.stringify(t.substring(closeIdx, closeIdx+12)));

if (returnStart !== -1 && closeIdx !== -1) {
  const newChunk = fs.readFileSync("./chart-new.tsx", "utf8");
  // Convert LF to CRLF for consistency
  const newChunkCrlf = newChunk.replace(/\r?\n/g, "\r\n");
  const endOfOld = closeIdx + "}".length;
  t = t.substring(0, returnStart) + newChunkCrlf + t.substring(endOfOld);
  fs.writeFileSync(f, t, "utf8");
  console.log("Done, new size:", t.length);
} else { console.log("ANCHORS MISSING"); }
