import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const memos = [
  {
    id: 'iran-part-1',
    title: 'The Asymmetric Restructuring of the Middle East',
    subtitle: "How Iran's infrastructure-targeting strategy exploits asymmetric cost dynamics to achieve leverage no conventional military campaign could deliver",
    date: 'March 2026',
    tags: ['Sovereign Distress', 'Geopolitical Strategy'],
    series: { name: 'Asymmetric Restructuring', part: 1, total: 2 },
    path: '/memos/iran',
    pdfPath: '/memos/Iran_Sovereign_Distress_Analysis_Series_1.pdf',
  },
  {
    id: 'iran-part-2',
    title: 'Second-Order Effects: The Political Timeline',
    subtitle: 'How the Iran conflict cascades from sovereign crisis to domestic political constraint to sector-level credit stress',
    date: 'March 2026',
    tags: ['Political Economy', 'Credit Cycle'],
    series: { name: 'Asymmetric Restructuring', part: 2, total: 2 },
    path: '/memos/iran-part-ii',
    pdfPath: '/memos/Iran_Sovereign_Distress_Analysis_Series_2.pdf',
  },
  {
    id: 'kirklands',
    title: "When Your White Knight Is Actually a Vulture",
    subtitle: "The Beyond Inc. takeover of Kirkland's demonstrates how creditor-friendly financing can achieve effective control",
    date: 'October 2025',
    tags: ['Corporate RX', 'Retail'],
    ticker: 'KIRK',
    path: '/memos/kirklands',
    pdfPath: '/memos/Kirklands_Credit_Analysis.pdf',
  },
];

const ResearchSection = () => {
  return (
    <section id="research" className="py-20 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-primary font-mono text-[10px] tracking-[0.3em] uppercase mb-3">
              Latest Analysis
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Recent Publications
            </h2>
            <div className="gold-line-left w-24" />
          </motion.div>

          {/* Featured Series - Asymmetric Restructuring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <h3 className="font-display text-xl font-semibold text-foreground">
                The Asymmetric Restructuring Series
              </h3>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-wider border border-primary/30">
                2-Part Series
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Part I */}
              <Link
                to="/memos/iran"
                className="memo-card group relative"
              >
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-3 py-1 text-[10px] font-mono uppercase tracking-wider">
                  Part I
                </div>
                <div className="pt-8">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={14} className="text-primary" />
                    <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
                      March 2026
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    The Asymmetric Restructuring of the Middle East
                  </h4>
                  <p className="text-muted-foreground font-mono text-xs leading-relaxed mb-4">
                    How Iran's infrastructure-targeting strategy exploits asymmetric cost dynamics.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="tag-pill">Sovereign Distress</span>
                    <span className="tag-pill">Game Theory</span>
                  </div>
                </div>
              </Link>

              {/* Part II */}
              <Link
                to="/memos/iran-part-ii"
                className="memo-card group relative"
              >
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-3 py-1 text-[10px] font-mono uppercase tracking-wider">
                  Part II
                </div>
                <div className="pt-8">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={14} className="text-primary" />
                    <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
                      March 2026
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Second-Order Effects
                  </h4>
                  <p className="text-muted-foreground font-mono text-xs leading-relaxed mb-4">
                    The political timeline, sector repricing, and the coming restructuring cycle.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="tag-pill">Political Economy</span>
                    <span className="tag-pill">Credit Cycle</span>
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Corporate Credit Memos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">
              Corporate Credit Analysis
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  company: "Kirkland's",
                  ticker: 'KIRK',
                  description: 'Credit analysis of the home decor retailer navigating restructuring.',
                  path: '/memos/kirklands',
                },
                {
                  company: 'The LYCRA Company',
                  ticker: 'LYCRA',
                  description: 'Specialty fiber manufacturer facing capital structure pressures.',
                  path: '/memos/lycra',
                },
                {
                  company: 'Party City',
                  ticker: 'PRTY',
                  description: 'Party goods retailer through Chapter 11 proceedings.',
                  path: '/memos/party-city',
                },
              ].map((memo, index) => (
                <Link
                  key={index}
                  to={memo.path}
                  className="memo-card group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={14} className="text-primary" />
                    <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
                      {memo.ticker}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {memo.company}
                  </h4>
                  <p className="text-muted-foreground font-mono text-xs leading-relaxed">
                    {memo.description}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* View All CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <Link
              to="/memos"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider glow-subtle hover:bg-gold-glow transition-all duration-300 group"
            >
              <span>View All Memos</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
