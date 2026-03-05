import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, TrendingUp, AlertTriangle, ChevronRight, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { fieldNotes, getLatestScenario, getAvailableFieldNoteDays } from '@/data/iranConflictData';

const FieldNotesIndex = () => {
  const availableDays = getAvailableFieldNoteDays();
  const latestScenario = getLatestScenario();

  return (
    <>
      <Helmet>
        <title>Field Notes | Iran Conflict Analysis | The Fulcrum Memo</title>
        <meta
          name="description"
          content="Real-time analysis updates on the U.S.-Iran conflict. Tracking thesis validation, scenario probabilities, and market implications."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back Link */}
          <Link
            to="/memos/iran"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-xs mb-8"
          >
            <ArrowLeft size={14} />
            Back to Part I Memo
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-red-400">
                Live Analysis
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Field Notes
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Real-time updates tracking the U.S.-Iran conflict as it develops. Each entry
              includes thesis validation, scenario probability revisions, and trading implications.
            </p>
          </motion.div>

          {/* Current Scenario Probabilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12 p-6 surface-card border border-border rounded-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary" />
              <h2 className="font-mono text-[10px] uppercase tracking-wider text-primary">
                Current Scenario Probabilities
              </h2>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                Updated: {latestScenario.date}
              </span>
            </div>

            {/* Probability Bar */}
            <div className="flex h-8 rounded-lg overflow-hidden mb-4">
              {latestScenario.probabilities.map((p, index) => {
                const colors = ['#22c55e', '#eab308', '#ef4444'];
                return (
                  <div
                    key={p.scenario}
                    className="flex items-center justify-center"
                    style={{
                      width: `${p.probability}%`,
                      backgroundColor: colors[index],
                    }}
                  >
                    <span className="font-mono text-[10px] font-bold text-background">
                      {p.probability}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between">
              {latestScenario.probabilities.map((p, index) => {
                const colors = ['text-emerald-400', 'text-amber-400', 'text-red-400'];
                return (
                  <div key={p.scenario} className="text-center">
                    <p className={`font-mono text-xs ${colors[index]}`}>{p.scenario}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Field Notes List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
              Daily Updates
            </h2>

            <div className="space-y-4">
              {availableDays
                .sort((a, b) => b - a)
                .map((day) => {
                  const note = fieldNotes[day];
                  if (!note) return null;

                  return (
                    <Link
                      key={day}
                      to={`/field-notes/day-${day}`}
                      className="block group"
                    >
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="p-6 surface-card border border-border rounded-lg hover:border-primary/40 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 border border-primary/30 rounded text-primary font-mono text-[10px] uppercase">
                                <Calendar size={12} />
                                Day {day}
                              </span>
                              <span className="font-mono text-xs text-muted-foreground">
                                {note.date}
                              </span>
                            </div>
                            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                              {note.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {note.summary}
                            </p>

                            {/* Market Snapshot */}
                            <div className="flex flex-wrap gap-4 mt-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  Brent:
                                </span>
                                <span className="font-mono text-xs text-amber-400">
                                  ${note.marketSnapshot.brentCrude}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  HY Spread:
                                </span>
                                <span className="font-mono text-xs text-red-400">
                                  {note.marketSnapshot.hySpread}bps
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  VIX:
                                </span>
                                <span className="font-mono text-xs text-red-400">
                                  {note.marketSnapshot.vix}
                                </span>
                              </div>
                            </div>
                          </div>

                          <ChevronRight
                            size={20}
                            className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1"
                          />
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
            </div>
          </motion.div>

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 p-6 border border-dashed border-border rounded-lg text-center"
          >
            <AlertTriangle size={24} className="text-amber-400 mx-auto mb-3" />
            <p className="font-mono text-sm text-muted-foreground">
              Field notes are published as the conflict develops.
              <br />
              Check back for daily updates on thesis validation and market implications.
            </p>
          </motion.div>

          {/* Memo Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid md:grid-cols-2 gap-4"
          >
            <Link
              to="/memos/iran"
              className="p-6 surface-card border border-border rounded-lg hover:border-primary/40 transition-all duration-300 group"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 mb-2">
                Part I
              </p>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                Insurance-Driven Leverage
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                The strategic framework behind Iran's asymmetric response
              </p>
            </Link>
            <Link
              to="/memos/iran-part-ii"
              className="p-6 surface-card border border-border rounded-lg hover:border-primary/40 transition-all duration-300 group"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-amber-400 mb-2">
                Part II
              </p>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                Credit Market Transmission
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                From energy shock to restructuring cycle
              </p>
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default FieldNotesIndex;
