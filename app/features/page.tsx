import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

const FEATURE_1_GIF = "https://motionsites.ai/assets/hero-grow-ai-preview-BlQ8tAQ-.gif";
const FEATURE_2_GIF = "https://motionsites.ai/assets/hero-glassmorphism-agency-preview-CGqeRoqP.gif";

export const metadata: Metadata = {
  title: "Liquid Glass Features",
  description: "Pro features. Zero complexity.",
};

export default function FeaturesChess() {
  return (
    <main className="features-page">
      <section className="features-chess">
        <div className="features-header">
          <span className="liquid-glass features-badge">Capabilities</span>
          <h1>Pro features. Zero complexity.</h1>
        </div>

        <div className="feature-row feature-row-first">
          <div className="feature-copy">
            <h2>Designed to convert. Built to perform.</h2>
            <p>
              Every pixel is intentional. Our AI studies what works across thousands of top sites—then builds yours to outperform them all.
            </p>
            <button className="liquid-glass-strong feature-cta" type="button">
              Learn more
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
            </button>
          </div>
          <div className="feature-media liquid-glass">
            <img src={FEATURE_1_GIF} alt="AI-designed website preview" />
          </div>
        </div>

        <div className="feature-row feature-row-reverse">
          <div className="feature-copy">
            <h2>It gets smarter. Automatically.</h2>
            <p>
              Your site evolves on its own. AI monitors every click, scroll, and conversion—then optimizes in real time. No manual updates. Ever.
            </p>
            <button className="liquid-glass-strong feature-cta" type="button">
              See how it works
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
            </button>
          </div>
          <div className="feature-media liquid-glass">
            <img src={FEATURE_2_GIF} alt="Adaptive AI system" />
          </div>
        </div>
      </section>
    </main>
  );
}
