import { tools, pageTitle } from "@/src/config/tools";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ToolInputs from "./ToolInputs";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";

export function generateStaticParams() {
  return tools
    .filter((t) => (t.status ?? "preview") !== "hidden")
    .map((t) => ({ slug: t.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};

  const status = tool.status ?? "preview";

  if (status === "preview") {
    return {
      title: `${pageTitle(tool)} — Coming Soon | Worthulator`,
      robots: { index: false, follow: true },
    };
  }

  return {
    title: tool.metaTitle ?? `${pageTitle(tool)} | Worthulator`,
    description: tool.description,
    alternates: { canonical: `https://worthulator.com/tools/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) return notFound();

  const status = tool.status ?? "preview";

  if (status === "hidden") return notFound();

  if (status === "preview") {
    return (
      <main className="bg-[#fafaf9]">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">Coming Soon</p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">{pageTitle(tool)}</h1>
          <p className="mt-4 text-gray-500">This tool is being built. Check back soon.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fafaf9]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900">{pageTitle(tool)}</h1>
        <p className="mt-4 text-lg text-gray-600">{tool.description}</p>

        <section className="mt-10">
          {tool.engineId ? (
            <CalculatorEngineLoader slug={tool.engineId!} />
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800">Tool UI</h2>
              <ToolInputs />
            </>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">How it works</h2>
        </section>
      </div>
    </main>
  );
}
