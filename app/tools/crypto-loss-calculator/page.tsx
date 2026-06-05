import type { Metadata } from "next";
import CryptoLossWithInsights from "@/components/worthcore/CryptoLossWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Crypto Loss Calculator 2026 – Real P&L vs Index Fund",
  description: "The 'I should have sold' tool. Confront the number, feel the sting, and move on with your life.",
  keywords: ["crypto loss calculator", "crypto profit loss calculator", "cryptocurrency ROI calculator", "bitcoin loss calculator", "crypto vs stock market calculator"],
  alternates: { canonical: "https://worthulator.com/tools/crypto-loss-calculator" },
};

const FAQS = [
  { q: "How do I calculate my true crypto P&L?", a: "True P&L = current portfolio value − total invested (cost basis). Don't forget to include transaction fees, gas costs, and any taxable events along the way — they reduce your real return." },
  { q: "Are crypto losses tax deductible?", a: "In the US, crypto losses can be used to offset capital gains from other investments. Unused losses of up to $3,000 can offset ordinary income per year, with excess carrying forward." },
  { q: "Is the S&P 500 comparison fair?", a: "It's the most common benchmark for opportunity cost. The S&P 500 has averaged about 10% nominally (7% inflation-adjusted) over long periods. It's the right baseline for 'what else could this money have done?'" },
  { q: "What's the most common crypto investing mistake?", a: "Buying high (FOMO) and selling low (panic) — the classic cycle. Most retail crypto investors underperform simply because they trade emotionally at peak euphoria and trough despair." },
  { q: "Should I sell crypto losses before year-end?", a: "Tax-loss harvesting — selling losses to offset gains — can be valuable. Unlike stocks, there's no wash-sale rule for crypto (as of 2024), so you can immediately rebuy the same asset after selling for a loss." },
];

const STATS = [
  { stat: "75%",   color: "text-rose-600",    accent: "bg-rose-500",    label: "of retail crypto investors are estimated to have lost money" },
  { stat: "-$2T",  color: "text-amber-600",   accent: "bg-amber-500",   label: "lost in the 2022 crypto market crash" },
  { stat: "10%",   color: "text-emerald-600", accent: "bg-emerald-500", label: "long-run S&P 500 annual return — the benchmark to beat" },
];

const CONTENT_CARDS = [
  { icon: "🎲", title: "The survivorship bias problem", body: "You hear about the people who got rich on Bitcoin. You don't hear about the millions who lost money. Studies consistently show the majority of retail crypto participants lose money net of fees and timing mistakes." },
  { icon: "📉", title: "Volatility is not return", body: "High volatility doesn't mean high returns — it means high risk. A 10× gain followed by a 90% drawdown nets you 0. The sequence of returns matters enormously in volatile assets." },
  { icon: "📝", title: "Cost basis tracking matters", body: "The IRS requires accurate cost basis reporting for all crypto transactions. Many investors don't track this properly and face tax surprises. Software like Koinly, CoinTracker, or TaxBit can automate this." },
];

const RELATED_CALCS = [
  { icon: "📈", accent: "bg-emerald-500/10", title: "Investment Return Calculator", description: "Compare returns across different assets.",       href: "/tools/investment-return-calculator" },
  { icon: "💸", accent: "bg-rose-500/10",    title: "Missed Investment Cost",       description: "The cost of not being in the market.",           href: "/tools/missed-investment-calculator" },
  { icon: "📊", accent: "bg-blue-500/10",    title: "Compound Interest",            description: "The power of boring, consistent returns.",       href: "/tools/compound-interest-calculator" },
  { icon: "🎰", accent: "bg-amber-500/10",   title: "Lottery vs Investing",         description: "Another perspective on speculative bets.",       href: "/tools/lottery-vs-investing" },
];

export default function CryptoLossCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="🪙"
        eyebrowText="Crypto P&L"
        title="Crypto Loss Calculator"
        description="Enter your total invested and current portfolio value to see your real P&L, your return percentage, and what the same money would have grown to in the S&P 500."
        chips={["Total profit or loss", "Return percentage", "S&P 500 comparison"]}
      >
        <CryptoLossWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text="The question isn't just 'did I make money?' — it's 'did I beat what I could have made with boring index investing?'" />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The honest crypto math" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the crypto P&L is calculated"
        formula={`P&L             = Current Value − Total Invested
Return %        = P&L ÷ Total Invested × 100
S&P Alternative = Invested × (1.07)^Years   (7% inflation-adj. return)`}
        paragraphs={[
          "P&L = current value − total invested. Return % = P&L ÷ invested × 100. S&P 500 alternative = invested × (1.07)^years, using 7% as the inflation-adjusted annual return.",
          "This is a simplified view. Real P&L calculations should include gas fees, exchange fees, staking rewards, and accurate cost basis tracking across all transactions.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
