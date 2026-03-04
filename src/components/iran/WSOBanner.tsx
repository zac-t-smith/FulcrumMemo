import { motion } from 'framer-motion';
import { ExternalLink, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WSOBannerProps {
  threadUrl?: string;
  className?: string;
  variant?: 'top' | 'bottom' | 'inline';
}

export const WSOBanner = ({
  threadUrl = '#', // Placeholder - will be updated with actual WSO thread URL
  className,
  variant = 'inline',
}: WSOBannerProps) => {
  const isPlaceholder = threadUrl === '#';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex items-center justify-center gap-3 p-4 rounded-lg border',
        'bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10',
        'border-emerald-500/30',
        variant === 'top' && 'mb-8',
        variant === 'bottom' && 'mt-12',
        className
      )}
    >
      <MessageSquare size={18} className="text-emerald-400" />
      <p className="font-mono text-sm text-muted-foreground">
        Discussing this analysis on{' '}
        <a
          href={threadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'text-emerald-400 hover:text-emerald-300 transition-colors',
            isPlaceholder && 'pointer-events-none opacity-50'
          )}
        >
          Wall Street Oasis
          <ExternalLink size={12} className="inline ml-1 -mt-0.5" />
        </a>
      </p>
      {isPlaceholder && (
        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-mono uppercase rounded">
          Coming Soon
        </span>
      )}
    </motion.div>
  );
};

export default WSOBanner;
