import { GraduationCap } from 'lucide-react';
import BORLogo from '../assets/logos/BOR.png';
import GSLogo from '../assets/logos/GS.png';
import BFGLogo from '../assets/logos/BFG.png';
import PCLogo from '../assets/logos/PC.jpg';
import ArmyLogo from '../assets/logos/Army.webp';
import CitiLogo from '../assets/logos/Citi.png';
import MSLogo from '../assets/logos/MS.jpg';

const experiences = [
  {
    company: 'Gulf Coast Restoration Group',
    role: 'Founder & CEO',
    location: 'Mobile, AL & Pensacola, FL',
    period: '2024 – 2025',
    logo: BORLogo,
    highlight: true,
    description: 'Founded and scaled property restoration company to $1.2M annual revenue. Navigated $400K+ in liabilities through structured wind-down.',
    bullets: [
      'Raised $300K institutional capital via scenario-based growth modeling and valuation analysis',
      'Managed P&L, operations, and 8-person field team across two markets',
      'Built 13-week cash flow models navigating 90-120 day collection cycles',
      'Executed controlled wind-down following going-concern vs. liquidation analysis',
    ],
  },
  {
    company: 'Goldman Sachs',
    role: 'Summer Insight Program — Sales & Trading',
    location: 'New York, NY',
    period: 'Summer 2019',
    logo: GSLogo,
    highlight: false,
    description: 'Selected from 2,800+ applicants for competitive program in fixed income and equities divisions.',
    bullets: [],
  },
  {
    company: 'BlockCrowd Financial Group',
    role: 'Investment Banking Winter Analyst',
    location: 'New York, NY',
    period: 'Winter 2019',
    logo: BFGLogo,
    highlight: false,
    description: 'Built pitch materials, financial models (DCF, LBO, comps), and valuation analyses for M&A and capital raises.',
    bullets: [],
  },
  {
    company: 'Pivoton Capital',
    role: 'Private Equity Spring Analyst',
    location: 'Stamford, CT',
    period: 'Spring 2019',
    logo: PCLogo,
    highlight: false,
    description: 'Built LBO and DCF models for Voxco acquisition ($34M EV). Prepared IC materials supporting 2024 portfolio exit.',
    bullets: [],
  },
  {
    company: 'U.S. Army — 4th Infantry Division',
    role: 'Specialist — Infantry & Security',
    location: 'Ft. Carson, CO',
    period: '2013 – 2017',
    logo: ArmyLogo,
    highlight: false,
    description: 'Provided security coordination during visits by senior government officials including a former U.S. President.',
    bullets: [],
  },
];

const earlyPrograms = [
  {
    company: 'Citi',
    role: 'Investment Banking Early ID Program',
    period: 'Jan – Mar 2019',
    logo: CitiLogo,
    description: 'Selected for competitive early identification program providing mentorship and insight into investment banking divisions. Participated in technical training covering financial modeling, valuation methodologies, and deal processes.',
  },
  {
    company: 'Morgan Stanley',
    role: 'Wealth Management Winter Analyst',
    period: 'Dec 2018 – Mar 2019',
    logo: MSLogo,
    description: 'Supported financial advisors in portfolio construction, asset allocation strategies, and client relationship management for high-net-worth individuals.',
  },
  {
    company: 'Morgan Stanley',
    role: 'Investment Banking Military Early Insight Program',
    period: 'Nov 2018',
    logo: MSLogo,
    description: 'Participated in veteran-focused program providing exposure to M&A advisory, capital markets, and industry coverage teams.',
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
              Career
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Experience
            </h2>
          </div>

          {/* Experience Timeline */}
          <div className="space-y-12 mb-16">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`group relative grid md:grid-cols-[200px_1fr] gap-6 md:gap-12 ${
                  exp.highlight ? 'py-8 px-6 -mx-6 bg-navy-light border border-border' : ''
                }`}
              >
                {/* Left - Meta */}
                <div className="space-y-2">
                  <p className="text-cream-muted font-body text-sm">{exp.period}</p>
                  <p className="text-cream-muted font-body text-sm">{exp.location}</p>
                </div>

                {/* Right - Content */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded flex items-center justify-center ${
                        exp.highlight
                          ? 'bg-white'
                          : 'bg-white'
                      }`}
                    >
                      <img src={exp.logo} alt={`${exp.company} logo`} className="w-12 h-12 object-contain" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {exp.company}
                      </h3>
                      <p className="text-cream-muted font-body">{exp.role}</p>
                    </div>
                  </div>

                  <p className="text-cream-muted font-body leading-relaxed pl-0 md:pl-16">
                    {exp.description}
                  </p>

                  {exp.bullets.length > 0 && (
                    <ul className="space-y-2 pl-0 md:pl-16">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3 text-cream-muted font-body text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.highlight && (
                    <div className="flex gap-6 pt-4 pl-0 md:pl-16">
                      <div>
                        <p className="text-2xl font-display font-semibold text-primary">$1.2M</p>
                        <p className="text-cream-muted text-xs font-body">Revenue</p>
                      </div>
                      <div>
                        <p className="text-2xl font-display font-semibold text-foreground">$400K+</p>
                        <p className="text-cream-muted text-xs font-body">Liabilities Managed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-display font-semibold text-foreground">8</p>
                        <p className="text-cream-muted text-xs font-body">Team Size</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Early Programs */}
          <div className="border-t border-border pt-12">
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap size={20} className="text-primary" />
              <h3 className="font-display text-xl font-semibold text-foreground">
                Early Insight Programs
              </h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {earlyPrograms.map((program, index) => (
                <div
                  key={index}
                  className="group bg-navy-light border border-border p-6 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded bg-white flex items-center justify-center">
                      <img src={program.logo} alt={`${program.company} logo`} className="w-8 h-8 object-contain" />
                    </div>
                    <h4 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {program.company}
                    </h4>
                  </div>
                  <p className="text-cream-muted text-xs font-body mb-2">{program.period}</p>
                  <p className="text-primary font-body text-sm mb-3">{program.role}</p>
                  <p className="text-cream-muted font-body text-sm leading-relaxed">
                    {program.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
