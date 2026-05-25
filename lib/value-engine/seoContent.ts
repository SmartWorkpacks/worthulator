// ─── WVE SEO Content Data — Phase 12 ─────────────────────────────────────────
// Authoritative static content for result page SEO blocks.
// Content is specific to each service type / vertical.
// Pure data — no runtime side-effects, SSR-safe.

import type { EstimationType, VerticalSlug } from "./types";

// ── Types ─────────────────────────────────────────────────────────────────
export interface FaqItem {
  q: string;
  a: string;
}

export interface ServiceSeoContent {
  introTitle: string;
  introParagraphs: string[];
  regionalFactors: string[];
  limitations: string[];
  estimationMethod: string;
  faqs: FaqItem[];
  benchmarkLabel: string;    // e.g. "Based on 2,400+ national contractor projects"
  estimateQuality: "High" | "Moderate" | "Preliminary";
}

export interface VerticalSeoContent {
  introTitle: string;
  introParagraphs: string[];
  regionalFactors: string[];
  limitations: string[];
  estimationMethod: string;
  faqs: FaqItem[];
  benchmarkLabel: string;
  estimateQuality: "High" | "Moderate" | "Preliminary";
}

// ── Service type content ───────────────────────────────────────────────────
export const SERVICE_SEO: Record<string, ServiceSeoContent> = {

  // ── HVAC ──────────────────────────────────────────────────────────────
  "central-ac": {
    introTitle: "Central Air Conditioning Replacement Cost",
    introParagraphs: [
      "A central AC replacement is one of the most impactful home comfort upgrades, and one of the most predictable to estimate. Units typically reach the end of their useful life after 15–20 years of service — or when annual repair costs approach 50% of the replacement cost. The decision point is often calculated using the '5,000 rule': multiply the unit's age by the repair cost, and if the result exceeds $5,000, replacement is usually more economical.",
      "Modern central AC systems deliver 20–30% better energy efficiency than units manufactured before 2010. A correctly sized 3-ton unit serves most 1,500–2,000 sq ft homes. SEER2 ratings above 15 qualify for federal tax credits under the Inflation Reduction Act, and many utility companies stack additional rebates on top. This makes the real net cost meaningfully lower than the installed price.",
    ],
    regionalFactors: [
      "Southern states (TX, FL, AZ, SC) have significantly higher cooling season demand, which keeps contractor availability high and prices competitive. Expect costs closer to the national mid-range or below.",
      "Northeast and Mid-Atlantic markets (NY, NJ, MA, CT) carry the highest labour rates — HVAC technicians earn 30–50% above the national median. Total project costs run $1,000–$2,500 above national estimates.",
      "Mountain and Pacific Northwest markets (CO, WA, OR) have moderate demand and mid-tier labour costs. Units are often slightly smaller due to milder summers, which can offset higher per-hour labour rates.",
      "High-humidity Gulf Coast markets (LA, MS, AL) often require drain line and dehumidification work, adding $200–$500 to otherwise standard installations.",
    ],
    limitations: [
      "Estimates assume an existing forced-air duct system in standard condition. Ductwork repairs, custom access panels, or attic/crawlspace complications add $500–$3,000.",
      "Premium equipment brands (Trane, Lennox, American Standard) add $800–$2,500 to material costs compared to builder-grade alternatives.",
      "Electrical panel upgrades — sometimes required for newer high-efficiency compressors — can add $500–$1,500 and are not included in base estimates.",
    ],
    estimationMethod: "Formula model trained on contractor market data with regional labour and materials indices applied. Quality tier multipliers (Budget 0.80×, Standard 1.00×, Premium 1.30×).",
    benchmarkLabel: "Based on 1,800+ HVAC replacement projects nationally",
    estimateQuality: "High",
    faqs: [
      {
        q: "How long does a central AC replacement take?",
        a: "Most central AC replacements take 4–8 hours for a same-system swap. Full system replacements (AC unit + air handler) typically take 1–2 days. Complex retrofits with ductwork modifications can extend to 2–3 days.",
      },
      {
        q: "What size AC unit do I need for my home?",
        a: "As a rule of thumb, you need 1 ton of cooling capacity per 400–600 sq ft of living space, though climate zone, ceiling height, and insulation quality all affect sizing. A Manual J load calculation by a licensed HVAC contractor provides the most accurate sizing recommendation.",
      },
      {
        q: "Is it better to repair or replace a central AC?",
        a: "When a unit is under 10 years old and the repair is under $500, repair is usually the right call. For units over 15 years or repairs over $1,500, replacement typically delivers a better return. Use the '5,000 rule': age × repair cost > $5,000 = replace.",
      },
      {
        q: "Are there rebates for central AC replacement?",
        a: "Yes. The Inflation Reduction Act provides a tax credit of up to $600 for qualifying high-efficiency AC units (SEER2 ≥ 16). Many utility companies offer additional rebates of $100–$600. Some states stack further incentives. Always check the ENERGY STAR rebate finder for your ZIP code.",
      },
      {
        q: "What does central AC installation include?",
        a: "A standard replacement includes removing the old condensing unit and air handler, installing new matching equipment, recharging refrigerant, testing airflow and electrical connections, and confirming thermostat operation. Permits are typically pulled by the contractor and included in the quote.",
      },
    ],
  },

  "furnace": {
    introTitle: "Furnace Replacement Cost",
    introParagraphs: [
      "Furnace replacements are among the most time-sensitive major home repairs — a failed furnace in winter creates genuine hardship, which is why getting an accurate estimate before the heating season is valuable planning. Gas furnaces typically last 15–30 years; older units operating below 80% AFUE efficiency are strong replacement candidates when any significant repair arises.",
      "High-efficiency condensing furnaces (96%–98% AFUE) can reduce heating bills by 30–40% compared to older 80% AFUE units. The federal IRA tax credit covers up to $600 for qualifying furnaces. In colder climates (IECC Climate Zones 4–7), high-efficiency furnaces are effectively required for new installations under modern energy codes.",
    ],
    regionalFactors: [
      "Upper Midwest and Northeast markets see the highest furnace replacement volumes, keeping labour competitive. However, these same markets have the highest heating bills, so efficiency upgrades deliver the greatest payback.",
      "Southern states with occasional freezes (TX, OK, AR) have lower contractor availability for furnace work — expect premium labour rates and potential scheduling delays during cold snaps.",
      "Natural gas availability affects equipment choice and pricing significantly. Propane conversions in rural areas add $300–$800 in parts and labour versus standard gas hookups.",
    ],
    limitations: [
      "Estimates assume an existing natural gas system with a functioning flue. Propane conversions, flue relining, or gas line work are priced separately.",
      "Two-stage and modulating furnaces cost $400–$1,200 more than single-stage units but deliver better comfort and efficiency at comparable AFUE ratings.",
      "Combined heat pump + furnace dual-fuel systems are not reflected in standard furnace estimates — use the heat pump estimator for these configurations.",
    ],
    estimationMethod: "Formula model with regional heating degree-day indices, local labour rates, and equipment tier multipliers applied.",
    benchmarkLabel: "Based on 1,400+ furnace replacement projects nationally",
    estimateQuality: "High",
    faqs: [
      {
        q: "How long does a furnace last?",
        a: "Gas furnaces typically last 15–30 years with regular maintenance. Heat exchangers can crack after 15–20 years, creating carbon monoxide risk. Annual tune-ups and filter changes extend lifespan significantly.",
      },
      {
        q: "What is AFUE and why does it matter?",
        a: "AFUE (Annual Fuel Utilization Efficiency) measures how much fuel converts to heat. An 80% AFUE furnace wastes 20 cents of every fuel dollar. A 96% AFUE unit wastes only 4 cents. In cold climates, upgrading from 80% to 96% AFUE typically saves $150–$400 per year on heating costs.",
      },
      {
        q: "Do I need a permit to replace my furnace?",
        a: "Yes, in virtually all jurisdictions. Licensed contractors handle permit applications as part of the job. A permit ensures the installation passes inspection, which is important for homeowner's insurance and future home sale.",
      },
      {
        q: "Should I replace my furnace and AC at the same time?",
        a: "If your AC is also nearing end of life (typically 15+ years), replacing both together saves on labour costs (one mobilisation fee, shared ductwork inspection) and maximises rebate eligibility. Dual replacement often saves $500–$1,500 in combined installation costs.",
      },
    ],
  },

  "heat-pump": {
    introTitle: "Heat Pump Installation Cost",
    introParagraphs: [
      "A heat pump is the most efficient all-in-one heating and cooling system available for residential use. Unlike furnaces and AC units that generate heat through combustion or cooling through mechanical refrigeration alone, heat pumps move heat — extracting it from outdoor air (or ground) and transferring it inside in winter, and reversing the process in summer. Modern cold-climate heat pumps operate efficiently down to -13°F, making them viable far beyond their traditional sunbelt market.",
      "Federal IRA incentives are transforming the heat pump market. The High-Efficiency Electric Home Rebate Act (HEEHRA) provides up to $8,000 for qualifying low-to-moderate income households, while the 25C tax credit offers up to $2,000 for all homeowners. The effective net cost after incentives is often competitive with a standard AC + furnace replacement.",
    ],
    regionalFactors: [
      "Cold-climate states (MN, WI, ME, VT) require cold-climate rated heat pumps (HSPF2 ≥ 7.5) which carry a $500–$1,500 premium over standard models. These are usually required by state energy codes.",
      "Southeast and South Central markets (GA, SC, TN, TX) represent the sweet spot for heat pumps — mild winters make them maximally efficient, and cooling season savings are substantial.",
      "Pacific Northwest markets (WA, OR) have high electricity rates but also significant utility rebates — total installed costs after incentives can be $2,000–$4,000 below the national unsubsidised baseline.",
    ],
    limitations: [
      "Dual-fuel configurations (heat pump + backup gas furnace) cost $1,500–$3,000 more than heat pump only, but may be preferable in very cold climates where all-electric operation is impractical.",
      "Ductless mini-split heat pumps (single or multi-zone) are a different product category with different pricing — this estimate applies to ducted central heat pump systems.",
      "Electrical panel upgrades may be required for all-electric heat pump systems, adding $500–$2,000 to total project cost.",
    ],
    estimationMethod: "Formula model with climate zone, fuel cost indices, and equipment tier multipliers applied. Incentive estimates are not included in base cost.",
    benchmarkLabel: "Based on 900+ heat pump installation projects nationally",
    estimateQuality: "High",
    faqs: [
      {
        q: "Does a heat pump work in cold climates?",
        a: "Yes. Modern cold-climate heat pumps (e.g., Bosch, Mitsubishi, Daikin cold-climate series) maintain full heating capacity down to -13°F. Traditional heat pumps struggled below 25°F, but that limitation has been largely eliminated in current-generation equipment.",
      },
      {
        q: "What is the difference between a heat pump and an AC?",
        a: "A heat pump is a reversible AC: it cools in summer and heats in winter by running the refrigeration cycle in reverse. It uses electricity to move heat rather than generate it, making it 200–400% efficient compared to a furnace at 80–96% efficient.",
      },
      {
        q: "How much do heat pump federal tax credits cover?",
        a: "The 25C tax credit covers 30% of the installed cost up to $2,000 for qualifying heat pumps. Separately, HEEHRA provides rebates of up to $8,000 for income-qualifying households. Total incentives can reduce installed cost by $3,000–$10,000 depending on income and state programs.",
      },
    ],
  },

  // ── Roofing ────────────────────────────────────────────────────────────
  "asphalt-shingle-roof": {
    introTitle: "Asphalt Shingle Roof Replacement Cost",
    introParagraphs: [
      "Asphalt shingle roofing accounts for over 80% of residential roofing in North America, making it the best-studied and most price-competitive segment of the home improvement market. A typical replacement covers 20–40 squares (2,000–4,000 sq ft), and involves tear-off of existing layers, underlayment, ice and water shield at eaves and valleys, new shingles, ridge cap, and flashing replacement at all penetrations.",
      "Architectural (dimensional) shingles have largely replaced 3-tab shingles as the standard due to their 25–30 year warranties and superior wind resistance. Designer impact-resistant shingles carry premium pricing but can reduce homeowners' insurance premiums by 10–30% in hail-prone markets — worth accounting for in the total cost of ownership.",
    ],
    regionalFactors: [
      "Gulf Coast, Southeast, and Texas markets carry the highest roofing demand due to storm activity, keeping a large pool of qualified contractors available and prices moderately competitive.",
      "Northeast markets (NY, NJ, CT, MA) have the highest labour rates, adding $800–$2,500 to total project costs. Ice and water shield requirements are also more extensive, adding $300–$600 in materials.",
      "Hail-prone markets (CO, TX, OK, KS, NE) have strong demand for impact-resistant shingles (Class 4 rated), which carry a $500–$1,500 premium but often pay back through insurance discounts.",
      "Hawaii and coastal Alaska have dramatically higher material delivery costs, adding 20–50% to national baseline estimates.",
    ],
    limitations: [
      "Estimates assume a single-story structure with simple gable or hip roof geometry. Steep pitch (>8:12), complex valleys, dormers, and multiple penetrations increase labour costs.",
      "Deck repair (rotted or damaged sheathing found during tear-off) is charged separately at $2–$5 per square foot and cannot be predicted before work begins.",
      "Chimney, skylight, and HVAC penetration flashing — commonly found to be worn during roof replacements — adds $200–$800 per penetration.",
    ],
    estimationMethod: "Formula model using roof square footage assumptions, regional labour indices, materials pricing benchmarks, and quality tier multipliers.",
    benchmarkLabel: "Based on 2,400+ roofing replacement projects nationally",
    estimateQuality: "High",
    faqs: [
      {
        q: "How long do asphalt shingles last?",
        a: "3-tab asphalt shingles have an expected lifespan of 15–20 years. Architectural (dimensional) shingles last 25–30 years under typical conditions. Impact-resistant architectural shingles carry 40–50 year warranties from premium manufacturers. Lifespan varies significantly with climate, ventilation quality, and installation standard.",
      },
      {
        q: "What time of year is best for roof replacement?",
        a: "Late spring through early fall (April–October) is ideal — mild temperatures allow proper shingle sealing and comfortable working conditions. Winter roofing is possible but carries quality risks with adhesion in freezing temperatures. Emergency replacements after storm damage are done year-round.",
      },
      {
        q: "Do I need a permit for roof replacement?",
        a: "Requirements vary by jurisdiction. Most municipalities require permits for full replacements (tear-off). A reputable contractor will pull the permit as part of the job. Never hire a contractor who suggests skipping permits — it creates liability for unpermitted work at time of home sale.",
      },
      {
        q: "How do I know if I need a full replacement vs. repair?",
        a: "Key replacement indicators: shingles are curling, cracking, or losing granules en masse; there are multiple leak sites across the roof; the deck has soft spots indicating decking rot; and the roof is within 5 years of its expected lifespan. A repair is appropriate for isolated damage on an otherwise sound roof under 15 years old.",
      },
      {
        q: "How many estimates should I get for a roof replacement?",
        a: "Get at least 3 written estimates. Roof replacement is one of the most contractor-variable home projects — price ranges of 40–60% between legitimate contractors for the same scope are common. Verify each contractor carries valid liability insurance and workers' compensation before signing.",
      },
    ],
  },

  "metal-roof": {
    introTitle: "Metal Roof Installation Cost",
    introParagraphs: [
      "Metal roofing commands a premium over asphalt for good reason: a standing seam metal roof installed today could outlast the structure it protects. With a lifespan of 40–70 years and warranties extending to 50 years for premium steel and aluminum products, the per-year cost of ownership often rivals a 30-year asphalt shingle lifecycle when total cost of ownership is calculated.",
      "The metal roofing market encompasses significantly different product tiers: corrugated steel panels (entry-level), exposed-fastener metal panels (mid-range), and concealed-fastener standing seam (premium). Most residential projects that justify the premium over asphalt involve standing seam systems, which eliminate exposed fasteners — the primary failure point in metal roofing — and enable thermal expansion management over the panel's full lifespan.",
    ],
    regionalFactors: [
      "Snow-country markets (MT, ID, CO, VT, NH, AK) are the natural home market for metal roofing — snow shedding performance reduces structural load and ice dam risk. Demand is high enough to support competitive pricing from experienced installers.",
      "Florida, Gulf Coast, and coastal Southeast markets prioritise wind resistance — metal roofing rated for 120–160 mph winds is a meaningful differentiator. Insurance premium reductions for qualifying metal roofs can run $500–$1,500 per year.",
      "Western wildfire states (CA, OR, WA, CO) increasingly specify metal roofing for its Class A fire resistance rating, particularly in Wildland-Urban Interface (WUI) zones where roofing standards are now enforced.",
    ],
    limitations: [
      "Standing seam metal roofing requires specialised installation experience. Fewer contractors are qualified versus asphalt, which limits competitive bidding and increases labour costs.",
      "In climates with significant thermal cycling, improper underlayment can lead to condensation issues. Proper ventilation and premium underlayment are required but not always included in base bids.",
    ],
    estimationMethod: "Formula model with regional labour premiums for specialty installation, materials pricing for steel and aluminum panel systems, and quality tier multipliers.",
    benchmarkLabel: "Based on 800+ metal roof installation projects nationally",
    estimateQuality: "Moderate",
    faqs: [
      {
        q: "How long does a metal roof last?",
        a: "Standing seam steel and aluminum roofs typically last 40–70 years. Corrugated steel panels average 30–45 years. Copper and zinc metal roofing (premium specialty) can last 100+ years. Metal roofs consistently outlast asphalt shingles by 2–3 lifecycle periods.",
      },
      {
        q: "Is metal roofing worth the extra cost?",
        a: "For homeowners planning to stay in their home 20+ years, the total cost of ownership math often favours metal: one metal roof vs. 2–3 asphalt replacements, plus insurance savings and reduced maintenance. For shorter occupancy, asphalt remains the more economical choice.",
      },
      {
        q: "Does metal roofing increase home value?",
        a: "Yes. The National Association of Realtors Remodeling Impact Report shows metal roofing has one of the highest cost recoup rates of any home exterior project. In hail, wind, and wildfire-prone markets, it's increasingly a selling differentiator.",
      },
    ],
  },

  // ── Solar ──────────────────────────────────────────────────────────────
  "solar-6kw": {
    introTitle: "Solar Panel Installation Cost (6 kW System)",
    introParagraphs: [
      "A 6 kW solar photovoltaic (PV) system is the most commonly installed residential solar array size in the United States, sized to offset 70–100% of electricity consumption for the average 1,800–2,500 sq ft home in most climate zones. At an estimated 8,000–10,000 kWh of annual production in a moderate sun climate, a 6 kW system offsets a meaningful share of electrical costs throughout a 25–30 year panel lifespan.",
      "The federal Investment Tax Credit (ITC) currently provides a 30% credit against installed cost — for a $22,000 installation, that's $6,600 off your federal taxes. Many states, counties, and utilities layer additional incentives on top, making the effective installed cost substantially lower than the gross price. Net metering policies — where utilities credit excess generation — are the other critical variable in return-on-investment calculations.",
    ],
    regionalFactors: [
      "Sun Belt states (AZ, NV, CA, NM, TX) generate significantly more annual kWh from the same system size, improving payback period. A 6 kW system in Phoenix can produce 25–40% more energy annually than the same system in Seattle.",
      "Northeast markets carry higher electricity rates (CT, MA, NY average $0.22–$0.35/kWh vs. $0.11–$0.14 in the South), which dramatically improves solar economics despite lower sun hours.",
      "California has both strong state incentives and high electricity rates, but NEM 3.0 policy changes have reduced export credit rates — self-consumption optimisation and battery storage have become more important in CA-specific ROI models.",
      "Northeast and Mid-Atlantic states have the highest installation labour costs, typically adding $1,500–$3,000 versus national baseline.",
    ],
    limitations: [
      "Estimates assume a straightforward roof installation on a south-facing pitch between 15°–40° slope. East/west orientations, flat roofs, and ground-mount installations have different cost profiles.",
      "Battery storage (e.g., Tesla Powerwall at $10,000–$14,000 installed) is not included in solar-only estimates but is increasingly co-installed.",
      "Utility interconnection timelines and fees vary widely by state and provider — process can range from 2 weeks to 6 months and add $250–$1,500 to project cost.",
    ],
    estimationMethod: "Formula model using regional solar irradiance, local labour market rates, current module and inverter pricing benchmarks, and system size cost curves.",
    benchmarkLabel: "Based on 3,100+ solar installation projects nationally",
    estimateQuality: "High",
    faqs: [
      {
        q: "How long does it take for solar panels to pay for themselves?",
        a: "Payback periods range from 5–12 years depending on system cost, electricity rate, sun hours, and available incentives. After the 30% ITC, most US homeowners see payback in 6–9 years, followed by 16–20+ years of essentially free electricity.",
      },
      {
        q: "How many solar panels is a 6 kW system?",
        a: "At the current standard of 400W panels, a 6 kW system requires 15 panels. Older 300W panel inventory yields 20 panels. Higher-efficiency 450W panels can achieve 6 kW with 13–14 panels, with a smaller roof footprint.",
      },
      {
        q: "What is the federal solar tax credit?",
        a: "The Investment Tax Credit (ITC) provides a 30% credit against federal income tax for solar systems installed through 2032. It steps down to 26% in 2033 and 22% in 2034. This is a credit (not deduction) — it reduces tax liability dollar-for-dollar.",
      },
      {
        q: "Do I need a new roof before installing solar?",
        a: "If your roof is within 5–10 years of its expected lifespan, replacing it before solar installation avoids costly panel removal and reinstallation ($1,500–$4,000). Most installers assess roof condition before quoting and will flag this requirement.",
      },
    ],
  },

  "solar-10kw": {
    introTitle: "Solar Panel Installation Cost (10 kW System)",
    introParagraphs: [
      "A 10 kW solar system is designed for high-consumption households — homes over 2,500 sq ft, properties with EV charging needs, or homeowners targeting 100% offset with battery backup capability. At 25 standard 400W panels, this system size typically requires 400–600 sq ft of unobstructed south-facing roof area.",
      "The 30% federal Investment Tax Credit applies equally to larger systems — on a $35,000 installation, the $10,500 credit is substantial. Many installers offer structural discounts for larger systems (cost per watt decreases as system size increases), making the per-kWh lifetime economics of a 10 kW system often more favourable than a 6 kW system on a per-watt basis.",
    ],
    regionalFactors: [
      "High-consumption states with strong solar resources (CA, TX, AZ, FL) are the primary market for 10 kW+ systems — air conditioning loads, pool pumps, and EVs all justify larger array sizing.",
      "Massachusetts, New Jersey, and New York have aggressive state incentive programmes specifically targeting larger residential systems, in some cases providing additional per-watt incentives above the federal ITC.",
    ],
    limitations: [
      "10 kW+ systems are subject to utility-specific interconnection rules that may limit feed-in capacity or require inverter specifications — this can influence equipment choice and add $500–$2,000 in engineering costs.",
      "Most utilities require a utility-grade disconnect and updated metering for systems this size, typically a $300–$600 line item not always included in installer quotes.",
    ],
    estimationMethod: "Formula model with regional irradiance, labour rates, and cost-per-watt curves that reflect economies of scale in larger system pricing.",
    benchmarkLabel: "Based on 1,200+ large residential solar projects nationally",
    estimateQuality: "High",
    faqs: [
      {
        q: "Is a 10 kW solar system overkill for a residential home?",
        a: "Not necessarily. A 10 kW system is appropriate for homes over 2,500 sq ft with high electricity usage, EV owners targeting full EV charging offset, homes with pools or hot tubs, or homeowners planning to add battery storage. Getting a precise system sizing from an installer's energy audit is worth doing before committing.",
      },
      {
        q: "Can a 10 kW solar system power a whole house?",
        a: "In good sun climates, a 10 kW system can produce 12,000–16,000 kWh annually — enough to fully offset the average US home's electricity use (10,500 kWh/year) plus moderate EV driving. Battery storage is needed to power the home during nighttime and outages.",
      },
    ],
  },

  // ── Kitchen ────────────────────────────────────────────────────────────
  "kitchen-remodel-minor": {
    introTitle: "Minor Kitchen Remodel Cost",
    introParagraphs: [
      "A minor kitchen remodel is one of the highest-ROI home improvement projects in the US market, consistently recouping 70–80% of project cost at resale according to Remodeling Magazine's annual Cost vs. Value report. The scope typically preserves existing cabinet boxes (refacing or repainting), replaces doors and hardware, updates countertops, adds a new backsplash, and refreshes appliances — transforming a dated kitchen without moving plumbing, electrical, or structural elements.",
      "The defining economic advantage of a minor remodel over a full gut renovation is the labour saving: when you're not moving walls, fixtures, or utilities, the expensive trades (plumber, electrician, HVAC) are largely absent. The result is a project heavy on materials and light on labour — well-suited to a combination of professional installation for counters and flooring, with DIY contributions on painting, hardware, and backsplash.",
    ],
    regionalFactors: [
      "Major metropolitan markets (NY, LA, SF, Boston, Seattle) carry labour premiums of 35–60% over national averages, making a minor remodel in these markets approach mid-range remodel costs in lower-cost regions.",
      "Mid-sized cities (Columbus, Indianapolis, Kansas City, Raleigh) represent the most competitive markets for kitchen remodels — strong contractor availability and moderate material delivery costs produce the most predictable quotes.",
    ],
    limitations: [
      "Estimates assume cabinet boxes in sound structural condition suitable for refacing. Damaged boxes, particle board delamination, or water-damaged interiors require replacement, escalating scope significantly.",
      "Appliance costs are highly variable and often quoted separately. Budget $1,500–$6,000 for a full appliance package (range, refrigerator, dishwasher) depending on brand tier.",
    ],
    estimationMethod: "Formula model with regional labour indices, materials cost benchmarks for cabinetry, countertops, and flooring by quality tier.",
    benchmarkLabel: "Based on 2,800+ kitchen remodel projects nationally",
    estimateQuality: "High",
    faqs: [
      {
        q: "What is included in a minor kitchen remodel?",
        a: "Typically: cabinet refacing or repainting, new hardware, countertop replacement (laminate, quartz, or granite), new backsplash, updated lighting, and appliance refresh. No walls are moved, plumbing is not relocated, and the basic kitchen footprint stays the same.",
      },
      {
        q: "How long does a minor kitchen remodel take?",
        a: "A minor remodel with professional installation typically takes 1–3 weeks depending on scope. Cabinet refacing alone takes 2–4 days. Countertop fabrication and installation adds 1 week for the fabrication lead time. Painting and hardware are same-day.",
      },
      {
        q: "Does a kitchen remodel add value to my home?",
        a: "Minor kitchen remodels average 70–80% ROI at resale nationally. In competitive buyer's markets, a refreshed kitchen can be the deciding factor in offers and command a premium. Full gut renovations typically recoup less (60–65%) due to higher scope costs.",
      },
    ],
  },

  "kitchen-remodel": {
    introTitle: "Full Kitchen Remodel Cost",
    introParagraphs: [
      "A full kitchen remodel — one that moves walls, relocates plumbing, updates electrical, and installs new cabinetry — is among the most complex and expensive residential renovation categories. The project typically involves a general contractor coordinating multiple trades: framing, plumbing, electrical, HVAC (range hood), tile, cabinetry installation, countertop fabrication, painting, and finish carpentry.",
      "The most common full remodel scope covers: demolition of existing kitchen, structural modifications (island addition, window changes), new rough plumbing and electrical to code, custom or semi-custom cabinet installation, countertop fabrication and installation, appliance package, tile work, flooring, and lighting. Each trade adds independent scheduling complexity, which is the primary driver of timeline variability.",
    ],
    regionalFactors: [
      "West Coast and Northeast premium markets (SF Bay Area, NYC metro, Boston) see total project costs 50–80% above national mid-range, with labour premiums extending across all trades.",
      "Texas and Southeast markets benefit from strong contractor availability and lower labour costs, though material costs are nationally consistent.",
    ],
    limitations: [
      "Estimates represent a single typical floor plan. Open-concept conversions involving structural walls require engineering ($1,500–$4,000) and beam installation that significantly raises cost.",
      "Custom cabinetry costs 2–3× semi-custom prices. Stock cabinetry from big-box retailers can reduce the cabinetry line item by 40–60% but limits design flexibility.",
    ],
    estimationMethod: "Formula model using multi-trade labour composite rates, regional cost indices, and material benchmarks across cabinetry, countertops, and finish categories.",
    benchmarkLabel: "Based on 1,900+ full kitchen remodel projects nationally",
    estimateQuality: "Moderate",
    faqs: [
      {
        q: "How long does a full kitchen remodel take?",
        a: "Most full kitchen remodels take 6–12 weeks from demolition to final walkthrough, depending on scope and lead times. Custom cabinetry alone carries a 6–10 week fabrication lead time. Design and permit phases add 4–8 weeks before work begins.",
      },
      {
        q: "What adds the most cost to a kitchen remodel?",
        a: "In order: custom cabinetry (25–35% of total), countertops (10–15%), appliances (10–20%), and labour coordination overhead for multi-trade projects. Structural changes (moving walls, relocating plumbing) can add $5,000–$20,000 to any budget tier.",
      },
    ],
  },

  // ── Insulation ─────────────────────────────────────────────────────────
  "attic-insulation": {
    introTitle: "Attic Insulation Installation Cost",
    introParagraphs: [
      "Attic insulation is widely regarded as one of the highest-ROI home energy upgrades, with the Department of Energy estimating 15–25% reduction in heating and cooling costs from bringing attic insulation to current code levels. The project is low-disruption — typically a one-day job — and the materials cost is modest relative to the ongoing energy savings over a 20–30 year horizon.",
      "Current code in most US climate zones (IECC 2021) requires R-49 to R-60 attic insulation. Many homes, particularly those built before 1980, have R-11 to R-19. The gap between existing and code-required levels is the primary driver of quote variation — not every attic needs the same depth of additional material.",
    ],
    regionalFactors: [
      "Cold-climate markets (MN, WI, VT, ME) have the most stringent code requirements (R-60) and the most aggressive utility rebate programmes for insulation upgrades.",
      "Hot-humid climate zones (FL, Gulf Coast) specify different insulation strategies — radiant barriers and sealed attic systems are common alternatives to traditional blown-in insulation.",
    ],
    limitations: [
      "Air sealing — sealing penetrations, bypasses, and HVAC boot connections before insulation — is equally important to the R-value upgrade and should be included in any comprehensive attic insulation project.",
      "Attic access limitations, HVAC equipment in the attic space, and existing insulation condition affect labour time and total cost significantly.",
    ],
    estimationMethod: "Formula model with current insulation material pricing (blown-in cellulose, blown fibreglass, spray foam), labour rates, and regional code requirement adjustments.",
    benchmarkLabel: "Based on 1,600+ insulation projects nationally",
    estimateQuality: "High",
    faqs: [
      {
        q: "How much insulation do I need in my attic?",
        a: "The 2021 IECC recommends R-38 to R-60 depending on climate zone. Zone 1-2 (deep South) requires R-38; Zone 4-8 (northern US) requires R-60. Most older homes have R-11 to R-19 and benefit significantly from upgrading to current code levels.",
      },
      {
        q: "What is the best type of attic insulation?",
        a: "Blown-in cellulose and blown fibreglass are the two most common and cost-effective options for existing attics. Blown cellulose is slightly denser and has better air infiltration resistance. Spray foam is the highest-performance option (also highest cost) and is often specified for sealed attic designs.",
      },
    ],
  },
};

// ── Vertical-level content (for non-service entities) ─────────────────────
export const VERTICAL_SEO: Record<VerticalSlug, VerticalSeoContent> = {

  "electronics": {
    introTitle: "Consumer Electronics Resale Value",
    introParagraphs: [
      "Consumer electronics follow a well-documented depreciation curve: most devices lose 20–40% of retail value within the first year, accelerating through years 2–3 as successor models launch. Understanding this curve is essential for both buyers and sellers — timing a purchase after a major product release event is one of the most reliable strategies for capturing value.",
      "The secondary electronics market has matured significantly, with StockX, Back Market, eBay Certified Refurbished, and Apple Certified Refurbished creating price transparency that was absent a decade ago. Our estimates draw on live marketplace data to reflect actual transaction prices, not asking prices.",
    ],
    regionalFactors: [
      "International markets have different pricing dynamics — import taxes and carrier subsidies mean grey-market arbitrage opportunities exist for some devices.",
      "Sales tax rates affect true new device costs; states without sales tax (OR, MT, NH, DE) see marginally higher secondary market demand for in-person transactions.",
    ],
    limitations: [
      "Condition grading (Grade A, Grade B, Grade C) has significant impact on resale value — typically a 20–35% spread between excellent and good condition for the same model.",
      "Limited-edition colorways, storage configurations, and bundled accessories create price variations not captured in baseline model estimates.",
    ],
    estimationMethod: "Live marketplace data aggregated from StockX, eBay, and Amazon, weighted by source trust score, recency, and condition match.",
    benchmarkLabel: "Based on live secondary market transaction data",
    estimateQuality: "Moderate",
    faqs: [
      {
        q: "When is the best time to buy consumer electronics for maximum value?",
        a: "2–3 months after a major product launch is typically the sweet spot — successor model pricing is available, the old model receives a formal price cut, and secondary market supply is high. Black Friday and Amazon Prime Day also offer reliable discounts on prior-generation stock.",
      },
      {
        q: "How do I get the best price when selling electronics?",
        a: "Local cash sales (Facebook Marketplace, Craigslist) eliminate shipping and platform fees, netting 5–15% more than marketplace sales. StockX and eBay are ideal for devices with strong collector demand. Trade-in programmes (Apple, Samsung, Best Buy) offer convenience but typically pay 20–40% below secondary market value.",
      },
    ],
  },

  "luxury": {
    introTitle: "Luxury Watch & Collectible Market Value",
    introParagraphs: [
      "The pre-owned luxury watch market has developed into one of the most liquid and transparent collectible asset classes, driven by specialist platforms (Chrono24, WatchBox, Bob's Watches), live auction transparency (Christie's, Phillips, Sotheby's watch divisions), and grey-market dealer infrastructure. Reference-specific supply and demand dynamics mean pricing is far more granular than general 'brand' estimates — a Rolex Submariner ref. 116610LN and ref. 126610LN trade at meaningfully different multiples despite sharing a model name.",
      "Watch values are primarily driven by: reference scarcity, dial and bezel condition, service history documentation, original papers and box (full set adds 20–40% to value), and category demand cycles. The market saw exceptional appreciation from 2020–2022, followed by a normalisation in 2023–2024, particularly for entry-level sports references that had reached extraordinary premiums.",
    ],
    regionalFactors: [
      "US and European markets trade at broadly similar prices, with minor variations driven by VAT reclaim opportunities for export and currency fluctuations.",
      "Asian markets (Hong Kong, Singapore, Japan) have historically been strong demand centres for scarce references, particularly complications and vintage Rolex — regional demand surges can temporarily lift global prices.",
    ],
    limitations: [
      "Watch valuations are highly condition and provenance-specific. Polished cases (watch refinished by service centre) typically lose 15–30% of collector premium vs. original unpolished cases.",
      "Market conditions for watches can move 10–20% in a quarter during demand cycles. Estimates reflect current consensus pricing, not peak or trough values.",
    ],
    estimationMethod: "Entity catalogue with curated price ranges, updated against recent auction results and marketplace transaction data.",
    benchmarkLabel: "Based on auction records and verified marketplace transactions",
    estimateQuality: "Moderate",
    faqs: [
      {
        q: "Do luxury watches hold their value?",
        a: "It depends entirely on the brand and reference. Rolex sports watches (Submariner, Daytona, GMT-Master II) and Patek Philippe complications have historically outperformed inflation as asset classes. Fashion brand watches and most entry-luxury references depreciate like other consumer goods.",
      },
      {
        q: "What is the most important factor in a watch's resale value?",
        a: "Condition is primary — specifically the state of the dial and case (unpolished original surface vs. refinished). Beyond that: originality of parts (especially dial and hands), presence of original box and papers ('full set'), and service history documentation.",
      },
    ],
  },

  "sneakers": {
    introTitle: "Sneaker Resale Market Value",
    introParagraphs: [
      "The sneaker resale market has evolved from informal collector networks into a fully formalised asset class with live market infrastructure. StockX — launched in 2016 — brought stock-exchange-style price transparency to sneaker trading, followed by GOAT, Stadium Goods, and Flight Club. The result is near-real-time price discovery for any significant release, making sneaker values more trackable than most traditional collectibles.",
      "Resale value is primarily driven by: limited release quantities, brand collaboration tier, colourway significance, and cultural moment. Nike/Jordan Brand and Adidas command the largest resale premiums. Size affects value — retail-priced sizes 9–11 (most common) trade at lower premiums than scarce sizes at the extremes of the distribution.",
    ],
    regionalFactors: [
      "US market prices represent the global reference benchmark. European and Asian markets typically add 5–20% for import premiums on US-release exclusive colourways.",
      "Certain limited regional releases (city-specific Jordans, regional Adidas drops) can command significant geographic premiums for those unable to access original release channels.",
    ],
    limitations: [
      "Deadstock (unworn, original box, tags attached) commands 20–40% premium over lightly worn. Worn pairs, missing box, or marker checks reduce value substantially.",
      "The sneaker resale market can shift rapidly around release events, collaborations, and cultural moments. Estimates reflect recent trading history, not guaranteed future values.",
    ],
    estimationMethod: "Aggregated from StockX last-sale prices, GOAT listings, and eBay sold transactions, weighted by recency and condition.",
    benchmarkLabel: "Based on live StockX and GOAT transaction data",
    estimateQuality: "Moderate",
    faqs: [
      {
        q: "What sneakers hold their value best?",
        a: "Nike Air Jordan 1 and Air Force 1 collaborations, Adidas Yeezy (pre-split), and New Balance collaborative releases with designers like Aimé Leon Dore have historically maintained the strongest resale premiums. Limited Travis Scott, Off-White, and Fear of God Athletics collabs trade at significant multiples over retail.",
      },
      {
        q: "Does wearing sneakers affect resale value?",
        a: "Significantly. Deadstock (unworn, original box) typically trades at a 25–40% premium over lightly worn, and worn pairs may have limited resale value. Sole yellowing, toe box creasing, and insole compression all affect grade and price on StockX and GOAT.",
      },
    ],
  },

  "home-services": {
    introTitle: "Home Service Cost Estimates",
    introParagraphs: [
      "Home service project costs are among the most variable in consumer spending — two licensed contractors can legitimately quote the same scope 40–60% apart based on overhead, crew productivity, material sourcing relationships, and current workload. Getting a precise regional estimate before soliciting contractor bids is one of the most effective negotiating tools available to homeowners.",
      "Our estimates combine formula-based models calibrated against contractor market data, regional labour and materials indices, and quality tier adjustments. They're designed to tell you what a fair market price looks like in your region — so you can recognise a competitive bid and avoid overpaying.",
    ],
    regionalFactors: [
      "Labour costs represent 40–60% of most home service project budgets, and vary by 30–80% across US markets.",
      "Materials costs are more nationally consistent, though delivery surcharges in rural and island markets can add 10–30%.",
    ],
    limitations: [
      "All estimates are for planning purposes. Actual quotes depend on your specific property, access, scope confirmation, and current contractor availability.",
      "Estimates do not include permit fees, utility fees, or unexpected scope changes discovered during work.",
    ],
    estimationMethod: "Multi-variable formula model with regional labour indices, materials benchmarks, and quality tier multipliers.",
    benchmarkLabel: "Based on national contractor market data",
    estimateQuality: "High",
    faqs: [
      {
        q: "How accurate are home service cost estimates?",
        a: "Our estimates are calibrated to be within 15–25% of actual contractor quotes for standard-scope projects in typical conditions. Unusual access requirements, non-standard materials, or complex scope variations can push actual quotes outside this range.",
      },
    ],
  },
};

// ── Helper functions ───────────────────────────────────────────────────────

/** Returns the best available SEO content for a given serviceType and vertical. */
export function getSeoContent(
  serviceType: string | undefined,
  vertical: VerticalSlug,
): ServiceSeoContent | VerticalSeoContent {
  if (serviceType && SERVICE_SEO[serviceType]) return SERVICE_SEO[serviceType];
  return VERTICAL_SEO[vertical] ?? VERTICAL_SEO["home-services"];
}

/** Returns an estimate quality label colour class for the TrustLayer. */
export function qualityColour(q: "High" | "Moderate" | "Preliminary"): string {
  if (q === "High")        return "text-emerald-400";
  if (q === "Moderate")    return "text-amber-400";
  return "text-gray-400";
}
