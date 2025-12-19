import { Button } from './ui/button';
import { Mail, Phone, Linkedin, ExternalLink } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-navy-light">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <div className="mb-12">
            <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
              Let's Connect
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">
              Get in Touch
            </h2>
            <p className="text-cream-muted font-body text-lg max-w-2xl mx-auto">
              I'm actively recruiting for Investment Banking and Consulting roles in 
              Restructuring. I'd welcome the opportunity to connect and learn more about 
              your team.
            </p>
          </div>

          {/* Contact Options */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="gold" size="xl" asChild>
              <a href="mailto:zac.t.smith@outlook.com">
                <Mail size={20} />
                zac.t.smith@outlook.com
              </a>
            </Button>
            <Button variant="gold-outline" size="xl" asChild>
              <a href="tel:+12514829410">
                <Phone size={20} />
                (251) 482-9410
              </a>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://linkedin.com/in/zac-t-smith"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cream-muted hover:text-primary transition-colors font-body"
            >
              <Linkedin size={20} />
              LinkedIn
            </a>
            <span className="text-border">|</span>
            <a
              href="https://zac-t-smith.github.io/The-Fulcrum-Memo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cream-muted hover:text-primary transition-colors font-body"
            >
              <ExternalLink size={20} />
              The Fulcrum Memo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
