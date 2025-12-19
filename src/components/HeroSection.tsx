import { Button } from './ui/button';
import { ArrowDown, Mail, Linkedin, Download } from 'lucide-react';
import headshot from '@/assets/headshot.jpg';

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--gold) / 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--gold) / 0.3) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="animate-fade-up">
              <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
                Restructuring & Special Situations
              </p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] text-foreground">
                Zac Smith
              </h1>
            </div>

            <div className="animate-fade-up animate-delay-200">
              <p className="text-xl md:text-2xl text-cream-muted font-body font-light leading-relaxed max-w-lg">
                U.S. Army veteran and founder with hands-on restructuring experience. 
                Seeking opportunities in Investment Banking & Consulting.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 animate-fade-up animate-delay-300">
              <Button variant="gold" size="lg" asChild>
                <a href="mailto:zac.t.smith@outlook.com">
                  <Mail size={18} />
                  Connect
                </a>
              </Button>
              <Button variant="gold-outline" size="lg" asChild>
                <a href="https://linkedin.com/in/zac-t-smith" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={18} />
                  LinkedIn
                </a>
              </Button>
              <Button variant="minimal" size="lg" asChild>
                <a href="/Smith_Zachary_Resume.pdf" download>
                  <Download size={18} />
                  Resume
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 animate-fade-up animate-delay-400">
              <div className="border-l-2 border-primary pl-4">
                <p className="text-3xl font-display font-semibold text-foreground">$1.2M</p>
                <p className="text-cream-muted text-sm font-body">Revenue Scaled</p>
              </div>
              <div className="border-l-2 border-border pl-4">
                <p className="text-3xl font-display font-semibold text-foreground">$300K</p>
                <p className="text-cream-muted text-sm font-body">Capital Raised</p>
              </div>
              <div className="border-l-2 border-border pl-4">
                <p className="text-3xl font-display font-semibold text-foreground">3.71</p>
                <p className="text-cream-muted text-sm font-body">GPA</p>
              </div>
            </div>
          </div>

          {/* Right - Photo */}
          <div className="relative flex justify-center lg:justify-end animate-fade-up animate-delay-200">
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-primary/30 -z-10" />
              <div className="absolute -inset-8 border border-primary/10 -z-20" />
              
              <img
                src={headshot}
                alt="Zac Smith"
                className="w-72 md:w-80 lg:w-96 aspect-[3/4] object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
              />
              
              {/* Gold accent corner */}
              <div className="absolute -bottom-2 -right-2 w-24 h-24 border-b-2 border-r-2 border-primary" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animate-delay-500">
          <a
            href="#experience"
            className="flex flex-col items-center gap-2 text-cream-muted hover:text-primary transition-colors"
          >
            <span className="text-xs tracking-widest uppercase font-body">Scroll</span>
            <ArrowDown size={20} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
