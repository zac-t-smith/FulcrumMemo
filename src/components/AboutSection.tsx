import { Medal, Target, TrendingUp, Heart } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
              Background
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              About Me
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Story */}
            <div className="space-y-6">
              <p className="text-cream-muted font-body text-lg leading-relaxed">
                After high school, I enlisted in the Army infantry and was selected for security 
                details with high-ranking officials, including a former U.S. President. That 
                experience sparked my love of learning—I'd spend free time at libraries around 
                the city and at University of Colorado.
              </p>

              <p className="text-cream-muted font-body text-lg leading-relaxed">
                When I transitioned out, I started studying finance but family circumstances 
                required us to move to Mobile, Alabama. With one young child and being at a 
                non-target, I leveraged my veteran network to get my foot in the door with 
                investment banking, private equity, and wealth management internships.
              </p>

              <p className="text-cream-muted font-body text-lg leading-relaxed">
                However, in 2020, my junior year, COVID-19 froze the internship and analyst 
                hiring pipelines. With much uncertainty and two small children, I decided to 
                pivot and take a full-time strategic sales role to provide immediate stability 
                for my family.
              </p>

              <p className="text-cream-muted font-body text-lg leading-relaxed">
                I spent four years in tech sales as a business advisor/consultant, then launched 
                my own restoration company in April 2024. I raised $300k in capital and grew from 
                zero to $100k monthly revenue in five months. However, we faced 90-120 day 
                collection cycles with insurance carriers, creating severe cash flow constraints 
                despite our growth.
              </p>

              <p className="text-cream-muted font-body text-lg leading-relaxed">
                After 18 months of managing creditor negotiations, vendor payment terms, and 
                seeking additional capital, we had to liquidate while we could still return most 
                investor capital.
              </p>

              <p className="text-cream-muted font-body text-lg leading-relaxed italic border-l-2 border-primary pl-4">
                That experience gave me firsthand insight into financial distress—managing liquidity 
                crunches, negotiating with creditors, and making tough operational decisions under 
                pressure. This invaluable, hands-on perspective now fuels my drive to pursue what 
                I'm genuinely passionate about: helping companies navigate similar situations from 
                the capital provider side.
              </p>
            </div>

            {/* Values / Differentiators */}
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="p-3 bg-navy-light border border-border h-fit">
                  <Medal size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-semibold text-foreground mb-2">
                    Military Discipline
                  </h4>
                  <p className="text-cream-muted font-body">
                    Four years as an Infantry Specialist instilled attention to detail, 
                    composure under pressure, and the ability to execute in high-stakes 
                    environments. Selected for presidential security details.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="p-3 bg-navy-light border border-border h-fit">
                  <TrendingUp size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-semibold text-foreground mb-2">
                    Operator Experience
                  </h4>
                  <p className="text-cream-muted font-body">
                    Built and scaled a business from zero to $100K monthly revenue. 
                    Managed P&L, led teams, raised $300K capital, and navigated 
                    financial distress firsthand—from creditor negotiations to orderly liquidation.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="p-3 bg-navy-light border border-border h-fit">
                  <Target size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-semibold text-foreground mb-2">
                    Analytical Foundation
                  </h4>
                  <p className="text-cream-muted font-body">
                    Goldman Sachs, private equity, and investment banking experience 
                    providing rigorous training in financial modeling, valuation, and 
                    capital structure analysis.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="p-3 bg-navy-light border border-border h-fit">
                  <Heart size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-semibold text-foreground mb-2">
                    Family-First Resilience
                  </h4>
                  <p className="text-cream-muted font-body">
                    Every career decision has been made with my family in mind. 
                    Raising two children while building a business taught me to 
                    balance ambition with responsibility.
                  </p>
                </div>
              </div>

              {/* Personal Note */}
              <div className="pt-6 border-t border-border">
                <p className="text-cream-muted font-body italic">
                  Outside of finance, I'm a distance runner with a 5:52 mile PR. 
                  I bring the same focus and endurance to every deal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
