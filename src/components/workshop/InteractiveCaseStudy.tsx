import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { JargonTracker } from './JargonTracker';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  FileText,
  TrendingDown,
  DollarSign,
  Scale,
  Shield,
  Users,
  Lightbulb,
  Eye
} from 'lucide-react';

export interface CaseStudyStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  component: React.ComponentType<StepProps>;
}

export interface StepProps {
  data: any;
  onUpdate: (data: any) => void;
  expertData?: any;
  showExpert?: boolean;
}

interface InteractiveCaseStudyProps {
  companyName: string;
  ticker: string;
  steps: CaseStudyStep[];
  expertMemoUrl?: string;
  onComplete?: () => void;
}

export const InteractiveCaseStudy = ({
  companyName,
  ticker,
  steps,
  expertMemoUrl,
  onComplete
}: InteractiveCaseStudyProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showExpert, setShowExpert] = useState(false);

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleStepUpdate = (data: any) => {
    setStepData(prev => ({
      ...prev,
      [currentStep.id]: data
    }));
  };

  const handleNext = () => {
    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep.id]));

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setShowExpert(false);
    } else {
      // All steps completed
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setShowExpert(false);
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    setShowExpert(false);
  };

  const CurrentStepComponent = currentStep.component;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{companyName}</h1>
              <p className="text-muted-foreground">
                Interactive Case Study Analysis • {ticker}
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Step {currentStepIndex + 1} of {steps.length}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}% Complete</span>
              <span>{completedSteps.size} / {steps.length} steps completed</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Step Navigator Sidebar */}
          <aside className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground mb-4">Analysis Steps</h3>
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = index === currentStepIndex;
              const isAccessible = index <= currentStepIndex || isCompleted;

              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && handleJumpToStep(index)}
                  disabled={!isAccessible}
                  className={`
                    w-full text-left p-3 rounded-lg border transition-all
                    ${isCurrent ? 'border-primary bg-primary/5' : 'border-border'}
                    ${isAccessible && !isCurrent ? 'hover:border-primary/50 hover:bg-muted/30' : ''}
                    ${!isAccessible ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{step.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Jargon Tracker */}
            <div className="mt-6">
              <JargonTracker />
            </div>

            {/* Expert Memo Link */}
            {expertMemoUrl && (
              <Card className="mt-6 border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Expert Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Compare your work to the full credit memo
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(expertMemoUrl, '_blank')}
                  >
                    View Full Memo
                  </Button>
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Main Content Area */}
          <main className="space-y-6">
            {/* Current Step Card */}
            <Card className="border-primary/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {currentStep.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
                      <p className="text-muted-foreground mt-1">{currentStep.subtitle}</p>
                    </div>
                  </div>

                  {currentStepIndex > 0 && (
                    <Button
                      variant={showExpert ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setShowExpert(!showExpert)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {showExpert ? 'Hide' : 'Show'} Expert Answer
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CurrentStepComponent
                  data={stepData[currentStep.id]}
                  onUpdate={handleStepUpdate}
                  showExpert={showExpert}
                />
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                className="min-w-[120px]"
              >
                {currentStepIndex === steps.length - 1 ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Complete
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Helper function to create default step icons
export const stepIcons = {
  background: <FileText className="h-4 w-4" />,
  liquidity: <DollarSign className="h-4 w-4" />,
  capitalStructure: <TrendingDown className="h-4 w-4" />,
  solvency: <Scale className="h-4 w-4" />,
  covenants: <Shield className="h-4 w-4" />,
  stakeholders: <Users className="h-4 w-4" />,
  solutions: <Lightbulb className="h-4 w-4" />,
  review: <CheckCircle2 className="h-4 w-4" />
};
