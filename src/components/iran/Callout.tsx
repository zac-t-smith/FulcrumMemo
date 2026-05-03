import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, Lightbulb, TrendingUp, Shield, Zap } from 'lucide-react';

type CalloutVariant = 'info' | 'warning' | 'insight' | 'thesis' | 'defense' | 'critical';

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<CalloutVariant, { icon: React.ElementType; borderColor: string; iconColor: string; bgColor: string }> = {
  info: {
    icon: Info,
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-500/5',
  },
  warning: {
    icon: AlertTriangle,
    borderColor: 'border-amber-500',
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-500/5',
  },
  insight: {
    icon: Lightbulb,
    borderColor: 'border-primary',
    iconColor: 'text-primary',
    bgColor: 'bg-primary/5',
  },
  thesis: {
    icon: TrendingUp,
    borderColor: 'border-emerald-500',
    iconColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/5',
  },
  defense: {
    icon: Shield,
    borderColor: 'border-purple-500',
    iconColor: 'text-purple-400',
    bgColor: 'bg-purple-500/5',
  },
  critical: {
    icon: Zap,
    borderColor: 'border-red-500',
    iconColor: 'text-red-400',
    bgColor: 'bg-red-500/5',
  },
};

export const Callout = ({ variant = 'insight', title, children, className }: CalloutProps) => {
  const config = variantConfig[variant];
  if (!config) {
    console.warn(`Callout: Invalid variant "${variant}". Valid options: ${Object.keys(variantConfig).join(', ')}`);
    return <div className={className}>{children}</div>;
  }
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'memo-callout border-l-2 rounded-r-lg',
        config.borderColor,
        config.bgColor,
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <Icon size={16} className={config.iconColor} />
          <h4 className={cn('text-[10px] uppercase tracking-wider', config.iconColor)}>
            {title}
          </h4>
        </div>
      )}
      <div className="text-muted-foreground text-sm leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
};

export default Callout;
