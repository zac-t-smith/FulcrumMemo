import { Medal, Target, TrendingUp, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
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
              Background
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
              About Me
            </h2>
            <div className="gold-line-left w-24" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Story */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-5"
            >
              <p className="text-muted-foreground font-mono text-sm leading-[1.8]">
                After high school, I enlisted in the Army infantry and was selected for security
                details with high-ranking officials, including a former U.S. President. That
                experience sparked my love of learning—I'd spend free time at libraries around
                the city and at University of Colorado.
              </p>

              <p className="text-muted-foreground font-mono text-sm leading-[1.8]">
                When I transitioned out, I started studying finance but family circumstances
                required us to move to Mobile, Alabama. With one young child and being at a
                non-target, I leveraged my veteran network to get my foot in the door with
                investment banking, private equity, and wealth management internships.
              </p>

              <p className="text-muted-foreground font-mono text-sm leading-[1.8]">
                However, in 2020, my junior year, COVID-19 froze the internship and analyst
                hiring pipelines. With much uncertainty and two small children, I decided to
                pivot and take a full-time strategic sales role to provide immediate stability
                for my family.
              </p>

              <p className="text-muted-foreground font-mono text-sm leading-[1.8]">
                I spent four years in tech sales as a business advisor/consultant, then launched
                my own restoration company in April 2024. I raised $300K in capital and grew from
                zero to $100K monthly revenue in five months. However, we faced 90-120 day
                collection cycles with insurance carriers, creating severe cash flow constraints
                despite our growth.
              </p>

              <p className="text-muted-foreground font-mono text-sm leading-[1.8]">
                After 18 months of managing creditor negotiations, vendor payment terms, and
                seeking additional capital, we had to liquidate while we could still return most
                investor capital.
              </p>

              <div className="surface-elevated border-l-2 border-primary p-5 mt-6">
                <p className="text-foreground font-mono text-sm leading-[1.8] italic">
                  That experience gave me firsthand insight into financial distress—managing liquidity
                  crunches, negotiating with creditors, and making tough operational decisions under
                  pressure. This invaluable, hands-on perspective now fuels my drive to pursue what
                  I'm genuinely passionate about: helping companies navigate similar situations from
                  the capital provider side.
                </p>
              </div>
            </motion.div>

            {/* Values / Differentiators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex gap-4">
                <div className="p-3 surface-elevated border border-border h-fit">
                  <Medal size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-base font-semibold text-foreground mb-2">
                    Military Discipline
                  </h4>
                  <p className="text-muted-foreground font-mono text-xs leading-relaxed">
                    Four years as an Infantry Specialist instilled attention to detail,
                    composure under pressure, and the ability to execute in high-stakes
                    environments. Selected for presidential security details.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 surface-elevated border border-border h-fit">
                  <TrendingUp size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-base font-semibold text-foreground mb-2">
                    Operator Experience
                  </h4>
                  <p className="text-muted-foreground font-mono text-xs leading-relaxed">
                    Built and scaled a business from zero to $100K monthly revenue.
                    Managed P&L, led teams, raised $300K capital, and navigated
                    financial distress firsthand—from creditor negotiations to orderly liquidation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 surface-elevated border border-border h-fit">
                  <Target size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-base font-semibold text-foreground mb-2">
                    Analytical Foundation
                  </h4>
                  <p className="text-muted-foreground font-mono text-xs leading-relaxed">
                    Goldman Sachs, private equity, and investment banking experience
                    providing rigorous training in financial modeling, valuation, and
                    capital structure analysis.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 surface-elevated border border-border h-fit">
                  <Heart size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-base font-semibold text-foreground mb-2">
                    Family-First Resilience
                  </h4>
                  <p className="text-muted-foreground font-mono text-xs leading-relaxed">
                    Every career decision has been made with my family in mind.
                    Raising two children while building a business taught me to
                    balance ambition with responsibility.
                  </p>
                </div>
              </div>

              {/* Personal Note */}
              <div className="pt-6 border-t border-border">
                <p className="text-muted-foreground font-mono text-sm italic">
                  Outside of finance, I'm a distance runner with a 5:52 mile PR.
                  I bring the same focus and endurance to every deal.
                </p>
              </div>

              {/* Current Focus */}
              <div className="surface-elevated border border-primary/30 p-5">
                <p className="text-primary font-mono text-[10px] uppercase tracking-wider mb-3">
                  Current Focus
                </p>
                <p className="text-foreground font-mono text-sm leading-[1.8]">
                  Currently finishing my finance degree at University of Mobile (3.71 GPA,
                  graduating December 2026), targeting restructuring analyst positions at
                  firms like Evercore, Alvarez & Marsal, and Lazard.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="surface-elevated p-6 md:p-8 mt-12 text-center border border-border"
          >
            <h3 className="font-display text-xl font-semibold text-foreground mb-3">
              Let's Connect
            </h3>
            <p className="text-muted-foreground font-mono text-sm mb-4">
              I'm always interested in discussing restructuring, credit analysis, and special situations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-mono">
              <a
                href="mailto:zac.t.smith@outlook.com"
                className="text-primary hover:text-gold-glow transition-colors"
              >
                zac.t.smith@outlook.com
              </a>
              <span className="text-border">|</span>
              <a
                href="https://twitter.com/TheFulcrumMemo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                @TheFulcrumMemo
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
