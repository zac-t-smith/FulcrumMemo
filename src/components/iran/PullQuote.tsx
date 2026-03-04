import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PullQuoteProps {
  children: React.ReactNode;
  className?: string;
}

export const PullQuote = ({ children, className }: PullQuoteProps) => {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        'my-12 py-8 px-6 md:px-12',
        'border-l-4 border-r-4 border-primary',
        'bg-gradient-to-r from-primary/5 via-transparent to-primary/5',
        className
      )}
    >
      <p className="font-display text-xl md:text-2xl lg:text-3xl text-foreground italic leading-relaxed text-center">
        {children}
      </p>
    </motion.blockquote>
  );
};

export default PullQuote;
