import { ReactNode, useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { getJargonById, getRelatedTerms } from '@/data/rxJargon';
import { useJargon } from '@/contexts/JargonContext';
import { BookOpen, Link as LinkIcon } from 'lucide-react';

interface JargonTooltipProps {
  termId: string;
  children?: ReactNode;
  showBadge?: boolean;
}

export const JargonTooltip = ({ termId, children, showBadge = false }: JargonTooltipProps) => {
  const { markTermAsEncountered, encounteredTerms } = useJargon();
  const [isOpen, setIsOpen] = useState(false);
  const term = getJargonById(termId);

  // Mark term as encountered when tooltip is opened
  useEffect(() => {
    if (isOpen && term) {
      markTermAsEncountered(termId);
    }
  }, [isOpen, termId, term, markTermAsEncountered]);

  if (!term) {
    // If term not found, just return children without tooltip
    return <>{children || termId}</>;
  }

  const relatedTerms = getRelatedTerms(termId);
  const isNew = !encounteredTerms.has(termId);

  // Difficulty colors
  const difficultyColor = {
    beginner: 'bg-green-500/10 text-green-600 border-green-500/30',
    intermediate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
    advanced: 'bg-red-500/10 text-red-600 border-red-500/30'
  }[term.difficulty];

  // Category colors
  const categoryColor = {
    liquidity: 'bg-blue-500/10 text-blue-600',
    'capital-structure': 'bg-purple-500/10 text-purple-600',
    process: 'bg-emerald-500/10 text-emerald-600',
    legal: 'bg-amber-500/10 text-amber-600',
    valuation: 'bg-pink-500/10 text-pink-600',
    general: 'bg-gray-500/10 text-gray-600'
  }[term.category];

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <span className="relative inline-flex items-center">
            <span className={`
              cursor-help border-b-2 border-dotted
              ${isNew ? 'border-primary text-primary font-medium' : 'border-muted-foreground/50'}
              hover:border-primary hover:text-primary transition-colors
            `}>
              {children || term.term}
            </span>
            {showBadge && isNew && (
              <Badge variant="outline" className="ml-1 text-xs py-0 px-1 h-4">
                NEW
              </Badge>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-md p-4 space-y-3"
          sideOffset={5}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-semibold text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                {term.term}
              </h4>
            </div>
            <div className="flex gap-1">
              <Badge variant="outline" className={`text-xs ${difficultyColor}`}>
                {term.difficulty}
              </Badge>
            </div>
          </div>

          {/* Category */}
          <Badge variant="secondary" className={`text-xs ${categoryColor}`}>
            {term.category.replace('-', ' ')}
          </Badge>

          {/* Definition */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {term.definition}
          </p>

          {/* Example */}
          {term.example && (
            <div className="p-2 bg-muted/50 rounded text-xs italic border-l-2 border-primary">
              <span className="font-semibold not-italic">Example: </span>
              {term.example}
            </div>
          )}

          {/* Related Terms */}
          {relatedTerms.length > 0 && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <LinkIcon className="h-3 w-3" />
                Related:
              </div>
              <div className="flex flex-wrap gap-1">
                {relatedTerms.map(related => (
                  <Badge
                    key={related.id}
                    variant="outline"
                    className="text-xs cursor-help"
                  >
                    {related.term}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* First time indicator */}
          {isNew && (
            <div className="text-xs text-primary font-medium pt-2 border-t">
              ✨ First time seeing this term! Added to your progress.
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Convenience component for inline jargon
export const J = JargonTooltip;
