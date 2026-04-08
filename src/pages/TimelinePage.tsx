import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ConflictTimeline } from '@/components/iran/charts';
import { EIA_SOURCE_ATTRIBUTION } from '@/data/oilPriceData';

const TimelinePage = () => {
  return (
    <>
      <Helmet>
        <title>The Restructuring of the Middle East — Interactive Timeline | The Fulcrum Memo</title>
        <meta
          name="description"
          content="Interactive timeline tracking the 2026 Iran conflict: strategic positioning, military operations, energy markets, and diplomacy. From Venezuela seizure through Hormuz closure."
        />
        <meta property="og:title" content="The Restructuring of the Middle East — Interactive Timeline" />
        <meta property="og:description" content="Multi-track interactive timeline showing Venezuela/tariffs/Iran sequencing with Brent price overlay." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20 pb-16">
          {/* Header */}
          <div className="container mx-auto px-4 md:px-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <p className="text-primary font-mono text-[10px] tracking-[0.2em] uppercase mb-3">
                The Iran Trap — Asymmetric Restructuring Series
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                The Restructuring of the Middle East
              </h1>
              <p className="text-muted-foreground font-mono text-base md:text-lg leading-relaxed mb-6">
                Interactive timeline: strategic positioning → shock → attrition → negotiation
              </p>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-mono text-xs">
                <span>January – April 2026</span>
                <span className="text-primary">|</span>
                <span>Day 38+ of Conflict</span>
              </div>
            </motion.div>
          </div>

          {/* Full Timeline */}
          <div className="container mx-auto px-4 md:px-6">
            <ConflictTimeline mode="full" />
          </div>

          {/* Context Section */}
          <div className="container mx-auto px-4 md:px-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* How to Read */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                  <h3 className="font-display text-lg font-bold text-foreground mb-4">
                    How to Read This Timeline
                  </h3>
                  <ul className="space-y-3 text-sm font-mono text-zinc-400">
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1D9E75] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-[#1D9E75]">Strategic positioning</strong> (green) — Venezuela seizure, OFAC licenses, tariff escalations
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E24B4A] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-[#E24B4A]">Military operations</strong> (red) — Strikes, casualties, infrastructure destruction
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#BA7517] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-[#BA7517]">Energy & markets</strong> (amber) — Oil prices, Hormuz closure, infrastructure hits
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#378ADD] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-[#378ADD]">Diplomacy</strong> (blue) — Negotiations, ultimatums, mediation attempts
                      </span>
                    </li>
                  </ul>
                </div>

                {/* The Pattern */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                  <h3 className="font-display text-lg font-bold text-foreground mb-4">
                    The Pattern
                  </h3>
                  <p className="text-sm font-mono text-zinc-400 leading-relaxed mb-4">
                    Green events cluster in January (asset acquisition). Amber spans January-February
                    (leverage positioning). Red starts Feb 28 (detonation). The price line is flat
                    during pre-positioning, then explodes at the exact moment all pieces are in place.
                  </p>
                  <p className="text-sm font-mono text-zinc-400 leading-relaxed">
                    Toggle tracks on/off to see how the narrative changes when you hide different
                    dimensions of the conflict.
                  </p>
                </div>
              </div>

              {/* Source Attribution */}
              <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                <p className="font-mono text-[10px] text-zinc-600">
                  {EIA_SOURCE_ATTRIBUTION}. Event data compiled from The Fulcrum Memo field notes.
                </p>
                <p className="font-mono text-[10px] text-zinc-600 mt-1">
                  This timeline is updated as new field notes are published.
                </p>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TimelinePage;
