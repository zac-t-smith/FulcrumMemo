import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

export const TableOfContents = ({ items, className }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (isMobile) setMobileOpen(false);
    }
  };

  // Mobile TOC
  if (isMobile) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-16 right-0 w-72 max-h-[60vh] overflow-y-auto surface-card border border-border rounded-lg shadow-xl p-4"
            >
              <p className="text-primary font-mono text-[10px] uppercase tracking-wider mb-3">
                Table of Contents
              </p>
              <nav className="space-y-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      'block w-full text-left py-1.5 font-mono text-xs transition-colors',
                      item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-3' : 'pl-6',
                      activeId === item.id
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg glow-subtle"
        >
          <List size={20} />
        </button>
      </div>
    );
  }

  // Desktop TOC - uses sticky positioning within grid
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={cn(
        'sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto',
        'hidden lg:block',
        className
      )}
    >
      <div className="surface-card border border-border rounded-lg p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-between w-full mb-3"
        >
          <p className="text-primary font-mono text-[10px] uppercase tracking-wider">
            Contents
          </p>
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'block w-full text-left py-1.5 font-mono text-[11px] transition-all duration-200 border-l-2',
                    item.level === 1 ? 'pl-2' : item.level === 2 ? 'pl-4' : 'pl-6',
                    activeId === item.id
                      ? 'text-primary border-primary'
                      : 'text-muted-foreground hover:text-foreground border-transparent hover:border-border'
                  )}
                >
                  {item.title}
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default TableOfContents;
