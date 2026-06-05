import { permanentRedirect } from "next/navigation";

// "mortgage affordability calculator" and "how much house can I afford" are the
// same search intent — the maximum home/mortgage you qualify for from income,
// debts and down payment. To avoid duplicate content, this slug 308-redirects to
// the canonical flagship, which targets both keywords. (Owner B / Copilot)
export default function MortgageAffordabilityCalculatorPage() {
  permanentRedirect("/tools/how-much-house-can-i-afford-calculator");
}
