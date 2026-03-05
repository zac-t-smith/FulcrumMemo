import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scenarioData } from '@/data/iranConflictData';

export const ScenarioProbabilityMatrix = ({ className }: { className?: string }) => {
  const [expandedScenario, setExpandedScenario] = useState<string | null>('Protracted Attrition');

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
          Scenario Probability Matrix
        </h4>
        <p className="font-mono text-xs text-muted-foreground">
          Click a scenario to expand full analysis
        </p>
      </div>

      {/* Probability Bars */}
      <div className="mb-6">
        <div className="flex h-8 rounded-lg overflow-hidden">
          {scenarioData.map((scenario) => (
            <motion.button
              key={scenario.name}
              onClick={() =>
                setExpandedScenario(expandedScenario === scenario.name ? null : scenario.name)
              }
              className="relative flex items-center justify-center transition-all duration-300"
              style={{
                width: `${scenario.probability}%`,
                backgroundColor: scenario.color,
              }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="font-mono text-[10px] font-bold text-background">
                {scenario.probability}%
              </span>
              {scenario.isBaseCase && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-[8px] font-mono uppercase rounded">
                  Base Case
                </span>
              )}
            </motion.button>
          ))}
        </div>
        <div className="flex mt-2">
          {scenarioData.map((scenario) => (
            <div
              key={scenario.name}
              className="font-mono text-[10px] text-muted-foreground text-center"
              style={{ width: `${scenario.probability}%` }}
            >
              {scenario.name.split(' ')[0]}
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="space-y-3">
        {scenarioData.map((scenario, index) => (
          <motion.div
            key={scenario.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              'border rounded-lg overflow-hidden transition-all duration-300',
              expandedScenario === scenario.name
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30'
            )}
          >
            <button
              onClick={() =>
                setExpandedScenario(expandedScenario === scenario.name ? null : scenario.name)
              }
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: scenario.color }}
                />
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-semibold text-foreground">
                      {scenario.name}
                    </span>
                    <span className="font-mono text-xs text-primary">{scenario.probability}%</span>
                    {scenario.isBaseCase && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-[8px] font-mono uppercase rounded">
                        Base Case
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {expandedScenario === scenario.name ? (
                <ChevronUp size={16} className="text-primary" />
              ) : (
                <ChevronDown size={16} className="text-muted-foreground" />
              )}
            </button>

            <AnimatePresence>
              {expandedScenario === scenario.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4"
                >
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-muted/50 rounded">
                      <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">
                        Oil Price Range
                      </p>
                      <p className="font-mono text-sm font-semibold text-foreground">
                        {scenario.oilPriceRange}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded">
                      <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">
                        GCC Damage Est.
                      </p>
                      <p className="font-mono text-sm font-semibold text-foreground">
                        {scenario.gccDamage}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded">
                      <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">
                        Iran Leverage
                      </p>
                      <p className="font-mono text-sm font-semibold text-foreground">
                        {scenario.iranLeverage}
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                    {scenario.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ScenarioProbabilityMatrix;
