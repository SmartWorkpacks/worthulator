import { permanentRedirect } from "next/navigation";

// "1rm calculator" and "1 rep max calculator" are the same search intent. To avoid
// duplicate content, this slug 308-redirects to the canonical flagship page, which
// targets both keywords. (Owner B / Copilot)
export default function OneRmCalculatorPage() {
  permanentRedirect("/tools/1-rep-max-calculator");
}
