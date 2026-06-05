import { permanentRedirect } from "next/navigation";

// "hour calculator" and "hours calculator" are the same search intent. To avoid
// duplicate content, this slug 308-redirects to the canonical flagship page,
// which targets both keywords. (Owner B / Copilot)
export default function HourCalculatorPage() {
  permanentRedirect("/tools/hours-calculator");
}
