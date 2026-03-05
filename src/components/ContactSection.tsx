import { Mail, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-primary font-mono text-[10px] tracking-[0.3em] uppercase mb-3">
              Get in Touch
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Contact
            </h2>
            <div className="gold-line w-full max-w-xs mx-auto" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground font-mono text-sm leading-relaxed max-w-2xl mx-auto mb-8"
          >
            I'm actively recruiting for Investment Banking and Consulting roles in Restructuring.
            I'd welcome the opportunity to connect and discuss opportunities.
          </motion.p>

          {/* Contact Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <a
              href="mailto:zac.t.smith@outlook.com"
              className="inline-flex items-center gap-3 px-8 py-3 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider glow-subtle hover:bg-gold-glow transition-all duration-300"
            >
              <Mail size={18} />
              zac.t.smith@outlook.com
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-6"
          >
            <a
              href="https://linkedin.com/in/zac-t-smith"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm"
            >
              <Linkedin size={18} />
              LinkedIn
            </a>
            <span className="text-border">|</span>
            <a
              href="https://twitter.com/TheFulcrumMemo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm"
            >
              <Twitter size={18} />
              @TheFulcrumMemo
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
