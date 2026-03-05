import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Gold line */}
          <div className="gold-line mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left - Logo and tagline */}
            <div className="text-center md:text-left">
              <Link to="/" className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-gold" />
                <span className="font-display text-sm gold-gradient-text tracking-tight">
                  THE FULCRUM MEMO
                </span>
              </Link>
              <p className="text-muted-foreground font-mono text-xs">
                Independent Credit Research
              </p>
            </div>

            {/* Right - Links */}
            <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest">
              <Link
                to="/memos"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Memos
              </Link>
              <span className="text-border">|</span>
              <a
                href="mailto:zac.t.smith@outlook.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-muted-foreground font-mono text-[10px] tracking-wider">
              {new Date().getFullYear()} Zachary Smith. Restructuring & Special Situations.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
