import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-background relative overflow-hidden flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--gold) / 0.4) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--gold) / 0.4) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Label */}
            <p className="text-primary font-mono text-[10px] tracking-[0.3em] uppercase mb-3">
              Independent Research & Analysis
            </p>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] text-foreground">
              The{' '}
              <span className="gold-gradient-text">Fulcrum</span>{' '}
              Memo
            </h1>

            {/* Decorative line */}
            <div className="gold-line w-32 mx-auto" />

            {/* Description */}
            <p className="text-muted-foreground font-mono text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Deep-dive analysis of distressed debt, restructuring situations, and special situations.
              Applying restructuring frameworks to complex credit situations.
            </p>
            <p className="text-muted-foreground/70 font-mono text-xs leading-relaxed max-w-xl mx-auto">
              Written by Zachary Smith — Army veteran, operator, and restructuring analyst candidate.
            </p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/memos"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider glow-subtle hover:bg-gold-glow transition-all duration-300 group"
              >
                <span>Read the Memos</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono text-sm uppercase tracking-wider transition-all duration-300"
              >
                About
              </a>
            </motion.div>
          </motion.div>

          {/* Pull quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 pt-12"
          >
            <div className="gold-line mb-8" />
            <blockquote className="font-display text-lg md:text-xl lg:text-2xl italic text-foreground/90 max-w-3xl mx-auto leading-relaxed">
              "The fulcrum security is where the value breaks in a capital structure
              — the pivot point where risk meets opportunity."
            </blockquote>
            <div className="gold-line mt-8" />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <a
              href="#research"
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="text-[10px] tracking-widest uppercase font-mono">Latest</span>
              <ArrowDown size={16} className="animate-bounce" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
