import { Target, ArrowRight, CheckCircle2, XCircle, Layers, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TechniqueCardProps {
  description: string;
  when: string[];
  pros: string[];
  cons: string[];
  microstages: string[];
  example?: {
    scenario: string;
    outcome: string;
  };
  keyMetrics?: string[];
}

export const TechniqueCard = ({ 
  description, 
  when, 
  pros, 
  cons, 
  microstages,
  example,
  keyMetrics
}: TechniqueCardProps) => (
  <div className="space-y-4 pt-2">
    <p className="text-muted-foreground">{description}</p>
    
    {example && (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          Real-World Example
        </h4>
        <p className="text-sm text-muted-foreground mb-2"><strong>Scenario:</strong> {example.scenario}</p>
        <p className="text-sm text-muted-foreground"><strong>Outcome:</strong> {example.outcome}</p>
      </div>
    )}
    
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          When to Use
        </h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {when.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <ArrowRight className="h-3 w-3 mt-1 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Advantages
          </h4>
          <div className="flex flex-wrap gap-1">
            {pros.map((pro, i) => (
              <Badge key={i} variant="outline" className="text-xs border-emerald-500/30 text-emerald-600">{pro}</Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            Disadvantages
          </h4>
          <div className="flex flex-wrap gap-1">
            {cons.map((con, i) => (
              <Badge key={i} variant="outline" className="text-xs border-red-500/30 text-red-600">{con}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>

    {keyMetrics && keyMetrics.length > 0 && (
      <div className="bg-muted/50 rounded-lg p-3">
        <h4 className="font-semibold text-sm mb-2">Key Metrics</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-muted-foreground">
          {keyMetrics.map((metric, i) => (
            <li key={i}>• {metric}</li>
          ))}
        </ul>
      </div>
    )}
    
    <div className="pt-2 border-t border-border">
      <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
        <Layers className="h-4 w-4 text-blue-500" />
        Microstages
      </h4>
      <div className="flex flex-wrap items-center gap-1">
        {microstages.map((stage, i) => (
          <div key={i} className="flex items-center">
            <Badge variant="secondary" className="text-xs">{stage}</Badge>
            {i < microstages.length - 1 && <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground" />}
          </div>
        ))}
      </div>
    </div>
  </div>
);
