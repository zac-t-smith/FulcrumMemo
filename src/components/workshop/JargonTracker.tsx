import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useJargon } from '@/contexts/JargonContext';
import { rxJargon, getJargonByCategory } from '@/data/rxJargon';
import { BookOpen, Award, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export const JargonTracker = () => {
  const { encounteredTerms, resetProgress } = useJargon();
  const [isExpanded, setIsExpanded] = useState(false);

  const totalTerms = rxJargon.length;
  const encounteredCount = encounteredTerms.size;
  const progress = (encounteredCount / totalTerms) * 100;

  // Get category breakdown
  const categories = ['liquidity', 'capital-structure', 'process', 'legal', 'valuation', 'general'] as const;
  const categoryStats = categories.map(cat => {
    const termsInCategory = getJargonByCategory(cat);
    const encounteredInCategory = termsInCategory.filter(t => encounteredTerms.has(t.id)).length;
    return {
      category: cat,
      total: termsInCategory.length,
      encountered: encounteredInCategory,
      percentage: (encounteredInCategory / termsInCategory.length) * 100
    };
  });

  // Get difficulty breakdown
  const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
  const difficultyStats = difficulties.map(diff => {
    const termsWithDifficulty = rxJargon.filter(t => t.difficulty === diff);
    const encounteredWithDifficulty = termsWithDifficulty.filter(t => encounteredTerms.has(t.id)).length;
    return {
      difficulty: diff,
      total: termsWithDifficulty.length,
      encountered: encounteredWithDifficulty
    };
  });

  // Achievement levels
  const getAchievementLevel = () => {
    if (progress >= 90) return { level: 'RX Expert', icon: '🏆', color: 'text-yellow-500' };
    if (progress >= 70) return { level: 'Senior Analyst', icon: '⭐', color: 'text-blue-500' };
    if (progress >= 50) return { level: 'Analyst', icon: '📊', color: 'text-green-500' };
    if (progress >= 25) return { level: 'Associate', icon: '📈', color: 'text-purple-500' };
    return { level: 'Trainee', icon: '🌱', color: 'text-gray-500' };
  };

  const achievement = getAchievementLevel();

  const categoryColors = {
    liquidity: 'bg-blue-500',
    'capital-structure': 'bg-purple-500',
    process: 'bg-emerald-500',
    legal: 'bg-amber-500',
    valuation: 'bg-pink-500',
    general: 'bg-gray-500'
  };

  return (
    <Card className="border-primary/30">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            RX Jargon Tracker
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={achievement.color}>
              {achievement.icon} {achievement.level}
            </Badge>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">
              {encounteredCount} / {totalTerms} terms
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {progress < 25 && "Keep going! Hover over underlined terms to learn definitions."}
            {progress >= 25 && progress < 50 && "Great start! You're building RX fluency."}
            {progress >= 50 && progress < 70 && "Excellent progress! You know over half the core terms."}
            {progress >= 70 && progress < 90 && "Almost there! You're becoming an RX expert."}
            {progress >= 90 && "Outstanding! You've mastered RX terminology."}
          </p>
        </div>

        {isExpanded && (
          <>
            {/* Category Breakdown */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Progress by Category
              </h4>
              <div className="space-y-2">
                {categoryStats.map(stat => (
                  <div key={stat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${categoryColors[stat.category]}`} />
                        <span className="capitalize">{stat.category.replace('-', ' ')}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {stat.encountered}/{stat.total}
                      </span>
                    </div>
                    <Progress value={stat.percentage} className="h-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="space-y-2 pt-4 border-t">
              <h4 className="text-sm font-semibold">Progress by Difficulty</h4>
              <div className="grid grid-cols-3 gap-2">
                {difficultyStats.map(stat => (
                  <div key={stat.difficulty} className="text-center p-2 bg-muted/30 rounded">
                    <div className="text-xs text-muted-foreground capitalize mb-1">
                      {stat.difficulty}
                    </div>
                    <div className="text-sm font-semibold">
                      {stat.encountered}/{stat.total}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Terms */}
            {encounteredCount > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <h4 className="text-sm font-semibold">Recently Encountered</h4>
                <div className="flex flex-wrap gap-1">
                  {Array.from(encounteredTerms).slice(-8).reverse().map(termId => {
                    const term = rxJargon.find(t => t.id === termId);
                    return term ? (
                      <Badge key={termId} variant="secondary" className="text-xs">
                        {term.term}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Reset Button */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={resetProgress}
                className="w-full text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-2" />
                Reset Progress
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
