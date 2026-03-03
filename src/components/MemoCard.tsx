import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface MemoCardProps {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  tags: string[];
  path: string;
  pdfPath?: string;
  series?: {
    name: string;
    part: number;
    total: number;
  };
  ticker?: string;
  index?: number;
}

const MemoCard = ({
  title,
  subtitle,
  date,
  tags,
  path,
  pdfPath,
  series,
  ticker,
  index = 0,
}: MemoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="memo-card group"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          {/* Series badge */}
          {series && (
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-wider">
                Part {series.part} of {series.total}
              </span>
              <span className="text-primary font-mono text-[10px] uppercase tracking-wider">
                {series.name} Series
              </span>
            </div>
          )}

          {/* Ticker badge */}
          {ticker && !series && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary font-mono text-[10px] uppercase tracking-wider">
                {ticker}
              </span>
            </div>
          )}

          {/* Title */}
          <Link to={path}>
            <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>

          {/* Subtitle */}
          <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-3 line-clamp-3">
            {subtitle}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground font-mono text-xs mb-4">
            <span>{date}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 md:w-40 shrink-0">
          <Link
            to={path}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs uppercase tracking-wider transition-all duration-300 group/btn"
          >
            <span>Read</span>
            <ArrowRight
              size={14}
              className="transition-transform group-hover/btn:translate-x-0.5"
            />
          </Link>
          {pdfPath && (
            <a
              href={pdfPath}
              download
              className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground font-mono text-xs uppercase tracking-wider transition-all duration-300"
            >
              <Download size={14} />
              <span>PDF</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MemoCard;
