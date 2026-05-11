const fs = require("fs");
const f = "c:/Freelancer/clients/Worthulator-main/components/calculators/RentVsBuyCalculator.tsx";
let t = fs.readFileSync(f, "utf8");

const returnAnchor = `  return (\n    <motion.div variants={fadeUp} custom={1} className="rounded-xl border border-gray-200 bg-white p-4 overflow-hidden">`;
const returnIdx = t.indexOf(returnAnchor);
console.log("Return idx:", returnIdx);

const closeAnchor = "\n  );\n}\n\n// ";
const closeIdx = t.indexOf(closeAnchor, returnIdx);
console.log("Close idx:", closeIdx);

if (returnIdx !== -1 && closeIdx !== -1) {
  const newBlock = fs.readFileSync("c:/Freelancer/clients/Worthulator-main/chart-new.tsx", "utf8");
  const oldEnd = returnIdx + (closeIdx + "\n  );\n}".length - returnIdx);
  t = t.substring(0, returnIdx) + newBlock + t.substring(oldEnd);
  fs.writeFileSync(f, t, "utf8");
  console.log("Done");
}
