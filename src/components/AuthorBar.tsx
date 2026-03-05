import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Linkedin, FileText } from 'lucide-react';
import headshot from '../assets/headshot.jpg';

const AuthorBar = () => {
  return (
    <section className="py-12 bg-surface-elevated border-y border-border">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            {/* Headshot */}
            <div className="shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-primary/30 ring-4 ring-primary/10">
                <img
                  src={headshot}
                  alt="Zachary Smith"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-primary font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
                About the Author
              </p>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                Zachary Smith
              </h3>
              <p className="text-muted-foreground font-mono text-sm leading-[1.8] mb-4">
                Army veteran turned finance professional. After serving on presidential security details,
                I built and scaled a business to $100K/month before navigating its orderly liquidation.
                That firsthand distress experience drives my passion for restructuring analysis.
              </p>
              <p className="text-muted-foreground/80 font-mono text-xs mb-4">
                Currently completing my finance degree at University of Mobile (3.71 GPA, Dec 2026)
                while producing independent credit research.
              </p>

              {/* Links */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Link
                  to="/resume"
                  className="inline-flex items-center gap-2 text-primary hover:text-gold-glow font-mono text-xs uppercase tracking-wider transition-colors group"
                >
                  <FileText size={14} />
                  <span>View Resume</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="https://www.linkedin.com/in/zachary-smith"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  <Linkedin size={14} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="mailto:zac.t.smith@outlook.com"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  <span>zac.t.smith@outlook.com</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AuthorBar;
