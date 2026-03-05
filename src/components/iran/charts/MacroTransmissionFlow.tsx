import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { macroTransmissionChain } from '@/data/iranConflictData';

export const MacroTransmissionFlow = ({ className }: { className?: string }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const selectedData = macroTransmissionChain.find((node) => node.id === selectedNode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('my-8 p-6 surface-card border border-border rounded-lg', className)}
    >
      <div className="mb-6">
        <h4 className="font-display text-lg font-semibold text-foreground mb-1">
          Macro Transmission Chain
        </h4>
        <p className="font-mono text-xs text-muted-foreground">
          Click each stage to see detailed metrics
        </p>
      </div>

      {/* Flow Diagram */}
      <div className="relative">
        {/* Desktop Flow - Horizontal */}
        <div className="hidden md:flex items-center justify-between gap-2 overflow-x-auto pb-4">
          {macroTransmissionChain.map((node, index) => (
            <div key={node.id} className="flex items-center">
              <motion.button
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                className={cn(
                  'relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300 min-w-[120px]',
                  selectedNode === node.id
                    ? 'border-primary bg-primary/10 scale-105'
                    : 'border-border hover:border-primary/50 bg-muted/30'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="w-10 h-10 rounded-full mb-2 flex items-center justify-center"
                  style={{ backgroundColor: node.color }}
                >
                  <span className="font-display text-lg font-bold text-background">
                    {index + 1}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-foreground text-center leading-tight">
                  {node.label}
                </span>
              </motion.button>
              {index < macroTransmissionChain.length - 1 && (
                <ArrowRight size={20} className="text-primary mx-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile Flow - Vertical */}
        <div className="md:hidden space-y-4">
          {macroTransmissionChain.map((node, index) => (
            <div key={node.id} className="flex flex-col items-center">
              <motion.button
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-300',
                  selectedNode === node.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 bg-muted/30'
                )}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: node.color }}
                >
                  <span className="font-display text-lg font-bold text-background">
                    {index + 1}
                  </span>
                </div>
                <span className="font-mono text-sm text-foreground">{node.label}</span>
              </motion.button>
              {index < macroTransmissionChain.length - 1 && (
                <div className="h-6 w-0.5 bg-primary/30 my-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-6 rounded-lg border"
            style={{
              borderColor: selectedData.color,
              backgroundColor: `${selectedData.color}10`,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h5
                  className="font-display text-lg font-semibold"
                  style={{ color: selectedData.color }}
                >
                  {selectedData.label}
                </h5>
                <p className="font-mono text-sm text-muted-foreground mt-1">
                  {selectedData.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedData.metrics.map((metric, index) => (
                <motion.div
                  key={metric}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="p-3 bg-background/50 rounded border border-border"
                >
                  <p className="font-mono text-xs text-foreground">{metric}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MacroTransmissionFlow;
