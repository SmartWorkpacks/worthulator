import { permanentRedirect } from "next/navigation";

// "timesheet calculator" and "timecard calculator" are the same search intent —
// a weekly grid of clock-in/out times totalling hours, overtime and pay. To avoid
// duplicate content, this slug 308-redirects to the canonical flagship, which
// targets both keywords. (Owner B / Copilot)
export default function TimesheetCalculatorPage() {
  permanentRedirect("/tools/timecard-calculator");
}
