import { Button } from './ui/button';
import { ExternalLink, FileText, Download } from 'lucide-react';

const creditMemos = [
  {
    company: "Kirkland's",
    ticker: 'KIRK',
    description: 'Credit analysis of the home décor retailer navigating restructuring and liquidity challenges.',
    file: '/memos/Kirklands_Credit_Analysis.pdf',
  },
  {
    company: 'The LYCRA Company',
    ticker: 'LYCRA',
    description: 'Deep dive into the specialty fiber manufacturer facing capital structure pressures.',
    file: '/memos/LYCRA_Credit_Analysis.pdf',
  },
  {
    company: 'Party City',
    ticker: 'PRTY',
    description: 'Analysis of the party goods retailer through Chapter 11 proceedings.',
    file: '/memos/Party_City_Credit_Analysis.pdf',
  },
];

const ResearchSection = () => {
  return (
    <section id="research" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
              Publications
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Research & Writing
            </h2>
          </div>

          {/* Featured Publication */}
          <div className="group relative mb-12">
            <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-navy-light border border-border p-8 md:p-12">
              <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <span className="text-primary font-body text-sm tracking-wide uppercase">
                      Credit Research
                    </span>
                  </div>

                  <h3 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                    The Fulcrum Memo
                  </h3>

                  <p className="text-cream-muted font-body text-lg leading-relaxed max-w-2xl">
                    Independent credit research and analysis covering distressed debt, 
                    restructuring situations, and special situations investing. 
                    Published insights on capital structure dynamics and recovery analysis.
                  </p>

                  <Button variant="gold" size="lg" asChild>
                    <a
                      href="https://zac-t-smith.github.io/The-Fulcrum-Memo"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={18} />
                      Read The Fulcrum Memo
                    </a>
                  </Button>
                </div>

                {/* Decorative Element */}
                <div className="hidden md:block">
                  <div className="w-48 h-64 border border-border relative">
                    <div className="absolute inset-4 border border-primary/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-6xl text-primary/20">TFM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Memos */}
          <div className="mb-16">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
              Credit Memos
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {creditMemos.map((memo, index) => (
                <div
                  key={index}
                  className="group bg-navy-light border border-border p-6 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={16} className="text-primary" />
                    <span className="text-cream-muted text-xs font-body uppercase tracking-wider">
                      {memo.ticker}
                    </span>
                  </div>
                  <h4 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {memo.company}
                  </h4>
                  <p className="text-cream-muted font-body text-sm leading-relaxed mb-4">
                    {memo.description}
                  </p>
                  <Button variant="gold-outline" size="sm" asChild className="w-full">
                    <a href={memo.file} download>
                      <Download size={14} />
                      Download Analysis
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Technical */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="font-display text-xl font-semibold text-foreground">
                Technical Expertise
              </h4>
              <div className="flex flex-wrap gap-3">
                {[
                  'Financial Modeling',
                  'DCF Analysis',
                  'LBO Modeling',
                  '13-Week Cash Flow',
                  'Restructuring Valuation',
                  'Bloomberg Terminal',
                  'Capital IQ',
                  'Credit Analysis',
                  'Recovery Analysis',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-navy-light border border-border text-cream-muted font-body text-sm hover:border-primary hover:text-foreground transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-display text-xl font-semibold text-foreground">
                Education
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-foreground font-body font-medium">University of Mobile</p>
                  <p className="text-cream-muted font-body">B.S. Finance</p>
                  <p className="text-cream-muted font-body text-sm">Expected December 2026 • GPA: 3.71</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
