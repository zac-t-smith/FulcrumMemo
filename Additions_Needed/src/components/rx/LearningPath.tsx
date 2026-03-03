import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Briefcase, 
  MessageSquare,
  ChevronRight,
  Clock,
  Star
} from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  topics: string[];
}

const learningModules: LearningModule[] = [
  {
    id: "foundations",
    title: "Foundations of Restructuring",
    description: "Understand the core concepts of corporate restructuring - why companies fail, what distress looks like, and the key stakeholders involved.",
    icon: <BookOpen className="h-5 w-5" />,
    duration: "2 hours",
    level: "Beginner",
    topics: [
      "What is restructuring?",
      "Causes of corporate distress",
      "Key stakeholders (secured, unsecured, equity)",
      "Absolute priority rule",
      "Going concern vs. liquidation value"
    ]
  },
  {
    id: "diagnostics",
    title: "Diagnostic Framework",
    description: "Learn the A&M / Evercore approach to diagnosing distressed situations. Build the analytical toolkit to assess any company.",
    icon: <Target className="h-5 w-5" />,
    duration: "3 hours",
    level: "Beginner",
    topics: [
      "13-week cash flow modeling",
      "Solvency analysis & waterfall",
      "Finding the fulcrum security",
      "Stakeholder incentive mapping",
      "Triage: urgent vs. strategic"
    ]
  },
  {
    id: "out-of-court",
    title: "Out-of-Court Techniques",
    description: "Master consensual restructuring methods - the preferred path when possible. Faster, cheaper, and less disruptive than bankruptcy.",
    icon: <TrendingUp className="h-5 w-5" />,
    duration: "4 hours",
    level: "Intermediate",
    topics: [
      "Amend & Extend (A&E)",
      "Covenant waivers and resets",
      "Debt-for-Equity swaps",
      "Distressed exchanges",
      "Liability Management Exercises (LME)"
    ]
  },
  {
    id: "in-court",
    title: "In-Court Restructuring",
    description: "Deep dive into Chapter 11, pre-packaged bankruptcy, 363 sales, and other court-supervised processes. When consensus fails.",
    icon: <Briefcase className="h-5 w-5" />,
    duration: "5 hours",
    level: "Intermediate",
    topics: [
      "Chapter 11 process flow",
      "First day motions",
      "DIP financing",
      "Plan of reorganization",
      "Cramdown mechanics",
      "363 sale process"
    ]
  },
  {
    id: "advanced",
    title: "Advanced Strategies",
    description: "Complex transactions, creditor-on-creditor violence, and sophisticated capital structure plays. For experienced practitioners.",
    icon: <Star className="h-5 w-5" />,
    duration: "6 hours",
    level: "Advanced",
    topics: [
      "Uptier exchanges (post-Serta)",
      "Drop-down transactions",
      "Double-dip structures",
      "Make-whole analysis",
      "Credit bidding strategies",
      "Intercreditor agreement exploitation"
    ]
  },
  {
    id: "native-language",
    title: "Native Language Mastery",
    description: "Learn to speak like an experienced RXer. The terminology, shorthand, and deal language that professionals use daily.",
    icon: <MessageSquare className="h-5 w-5" />,
    duration: "2 hours",
    level: "Intermediate",
    topics: [
      "Common RX terminology",
      "FA vs. Consultant language",
      "Deal shorthand (DIP, D4E, LME)",
      "Negotiation language",
      "Reading between the lines"
    ]
  }
];

interface LearningPathProps {
  onNavigate: (tab: string) => void;
}

export const LearningPath = ({ onNavigate }: LearningPathProps) => {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Your Path to Becoming an RX Professional
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            Whether you're targeting Evercore RX, PJT, A&M, or FTI, this learning center will give you the knowledge 
            to walk into any restructuring situation with confidence. We cover everything from basic concepts to 
            the most sophisticated liability management techniques.
          </p>
          <p>
            <strong className="text-foreground">Pro tip:</strong> Don't just read - use the interactive Decision Tree 
            to practice analyzing companies. That's how you build the intuition that separates analysts from experts.
          </p>
        </CardContent>
      </Card>

      {/* Learning Modules Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {learningModules.map((module) => (
          <Card key={module.id} className="group hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {module.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={
                        module.level === "Beginner" ? "border-emerald-500/30 text-emerald-400" :
                        module.level === "Intermediate" ? "border-amber-500/30 text-amber-400" :
                        "border-red-500/30 text-red-400"
                      }>
                        {module.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {module.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{module.description}</p>
              <div>
                <h4 className="text-sm font-semibold mb-2">Topics Covered:</h4>
                <ul className="space-y-1">
                  {module.topics.map((topic, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 mt-0.5 text-primary" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Start Actions */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col items-start text-left hover:border-primary/50"
              onClick={() => onNavigate("decision-tree")}
            >
              <Target className="h-5 w-5 mb-2 text-primary" />
              <span className="font-semibold">Interactive Decision Tree</span>
              <span className="text-xs text-muted-foreground">Practice analyzing companies step-by-step</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col items-start text-left hover:border-primary/50"
              onClick={() => onNavigate("diagnostic")}
            >
              <Briefcase className="h-5 w-5 mb-2 text-primary" />
              <span className="font-semibold">Diagnostic Framework</span>
              <span className="text-xs text-muted-foreground">The A&M interview answer</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col items-start text-left hover:border-primary/50"
              onClick={() => onNavigate("language")}
            >
              <MessageSquare className="h-5 w-5 mb-2 text-primary" />
              <span className="font-semibold">Native Language</span>
              <span className="text-xs text-muted-foreground">How RXers actually talk</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
