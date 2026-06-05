import { permanentRedirect } from "next/navigation";

// "car calculator" is a broad umbrella whose dominant intent is the monthly car
// payment (price, down payment, trade-in, APR, term). To avoid duplicate content,
// this slug 308-redirects to the canonical car-payment flagship, which targets the
// "car calculator" keyword too. (Owner B / Copilot)
export default function CarCalculatorPage() {
  permanentRedirect("/tools/car-payment-calculator");
}
