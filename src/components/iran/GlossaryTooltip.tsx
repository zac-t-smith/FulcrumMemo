import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { glossaryTerms } from '@/data/iranConflictData';

interface GlossaryTooltipProps {
  term: keyof typeof glossaryTerms | string;
  children: React.ReactNode;
  className?: string;
}

const categoryColors: Record<string, string> = {
  shipping: 'bg-blue-500/20 text-blue-400',
  insurance: 'bg-amber-500/20 text-amber-400',
  credit: 'bg-emerald-500/20 text-emerald-400',
  restructuring: 'bg-purple-500/20 text-purple-400',
  infrastructure: 'bg-cyan-500/20 text-cyan-400',
  military: 'bg-red-500/20 text-red-400',
  macro: 'bg-primary/20 text-primary',
};

export const GlossaryTooltip = ({ term, children, className }: GlossaryTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const termData = glossaryTerms[term.toLowerCase()];

  if (!termData) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'border-b border-dashed border-primary/50 hover:border-primary cursor-help transition-colors',
          className
        )}
      >
        {children}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 surface-card border border-border rounded-lg shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-semibold text-foreground">
                {termData.term}
              </span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider',
                  categoryColors[termData.category] || 'bg-muted text-muted-foreground'
                )}
              >
                {termData.category}
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              {termData.definition}
            </p>
            {/* Arrow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 surface-card border-r border-b border-border" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export default GlossaryTooltip;
