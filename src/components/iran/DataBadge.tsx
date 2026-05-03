import { cn } from '@/lib/utils';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

type BadgeStatus = 'confirmed' | 'tracking' | 'updated';

interface DataBadgeProps {
  status: BadgeStatus;
  date?: string;
  className?: string;
}

const statusConfig: Record<BadgeStatus, { icon: React.ElementType; label: string; color: string }> = {
  confirmed: {
    icon: CheckCircle,
    label: 'Confirmed',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  tracking: {
    icon: Clock,
    label: 'Tracking',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  updated: {
    icon: AlertCircle,
    label: 'Updated',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
};

export const DataBadge = ({ status, date, className }: DataBadgeProps) => {
  const config = statusConfig[status];
  if (!config) {
    console.warn(`DataBadge: Invalid status "${status}". Valid options: ${Object.keys(statusConfig).join(', ')}`);
    return null;
  }
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] uppercase tracking-wider',
        config.color,
        className
      )}
    >
      <Icon size={10} />
      {config.label}
      {date && <span className="opacity-70">({date})</span>}
    </span>
  );
};

export default DataBadge;
