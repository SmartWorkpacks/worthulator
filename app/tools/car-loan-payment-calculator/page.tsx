import { permanentRedirect } from "next/navigation";

// "car loan payment calculator" and "car payment calculator" are the same search
// intent. To avoid duplicate content, this slug 308-redirects to the canonical
// flagship page, which targets both keywords. (Owner B / Copilot)
export default function CarLoanPaymentCalculatorPage() {
  permanentRedirect("/tools/car-payment-calculator");
}
