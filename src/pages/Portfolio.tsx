import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  TrendingDown,
  TrendingUp,
  Download,
  Trash2,
  FileText,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { exportToPDF, exportToPPTX } from '@/services/exportService';
import type { SavedAnalysis } from '@/contexts/PortfolioContext';

const Portfolio = () => {
  const { savedAnalyses, deleteAnalysis, clearAll } = usePortfolio();

  const handleExportPDF = (analysis: SavedAnalysis) => {
    exportToPDF({
      companyName: analysis.companyName,
      ticker: analysis.ticker,
      sections: analysis.sections,
      date: analysis.completedDate,
      analyst: 'Your Name'
    });
  };

  const handleExportPPTX = (analysis: SavedAnalysis) => {
    exportToPPTX({
      companyName: analysis.companyName,
      ticker: analysis.ticker,
      sections: analysis.sections,
      date: analysis.completedDate,
      analyst: 'Your Name'
    });
  };

  return (
    <>
      <Helmet>
        <title>My Portfolio | Zac Smith</title>
        <meta name="description" content="View all your completed RX analyses and export them as PDFs or presentations." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Portfolio
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">My Portfolio</h1>
                    <p className="text-sm text-muted-foreground">Completed RX Analyses</p>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">
                {savedAnalyses.length} {savedAnalyses.length === 1 ? 'Analysis' : 'Analyses'}
              </Badge>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8 space-y-8">
          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Total Analyses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{savedAnalyses.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Most Recent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">
                  {savedAnalyses.length > 0
                    ? new Date(savedAnalyses[savedAnalyses.length - 1].completedDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Companies Analyzed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">
                  {new Set(savedAnalyses.map(a => a.ticker)).size}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          {savedAnalyses.length > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={clearAll} size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          )}

          {/* Empty State */}
          {savedAnalyses.length === 0 && (
            <Alert>
              <FolderOpen className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-4">
                  <p>
                    <strong>No saved analyses yet.</strong> Complete a case study in the Workshop to add your first analysis here.
                  </p>
                  <Link to="/workshop">
                    <Button>
                      Go to Workshop
                    </Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Saved Analyses Grid */}
          {savedAnalyses.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Saved Analyses</h2>
              <div className="grid gap-6">
                {savedAnalyses.slice().reverse().map((analysis) => (
                  <AnalysisCard
                    key={analysis.id}
                    analysis={analysis}
                    onExportPDF={() => handleExportPDF(analysis)}
                    onExportPPTX={() => handleExportPPTX(analysis)}
                    onDelete={() => deleteAnalysis(analysis.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

// Analysis Card Component
interface AnalysisCardProps {
  analysis: SavedAnalysis;
  onExportPDF: () => void;
  onExportPPTX: () => void;
  onDelete: () => void;
}

const AnalysisCard = ({ analysis, onExportPDF, onExportPPTX, onDelete }: AnalysisCardProps) => {
  const solvency = analysis.capitalStructure?.solvency;
  const isSolvent = solvency === 'solvent';
  const runway = analysis.liquidity?.runway || 0;
  const runwayCategory = runway < 13 ? 'urgent' : runway < 26 ? 'manageable' : 'strategic';

  return (
    <Card className="hover:border-primary/50 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl flex items-center gap-2">
              {analysis.companyName}
              <Badge variant="outline">{analysis.ticker}</Badge>
            </CardTitle>
            <CardDescription className="mt-2 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Completed: {new Date(analysis.completedDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {analysis.sections.length} sections
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        {(analysis.liquidity || analysis.capitalStructure) && (
          <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            {analysis.liquidity && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Runway</p>
                <Badge
                  variant={runwayCategory === 'urgent' ? 'destructive' : runwayCategory === 'manageable' ? 'default' : 'secondary'}
                  className="flex items-center gap-1 w-fit"
                >
                  <TrendingDown className="h-3 w-3" />
                  {runway.toFixed(1)} weeks
                </Badge>
              </div>
            )}

            {analysis.capitalStructure && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Solvency</p>
                  <Badge
                    variant={isSolvent ? 'secondary' : 'destructive'}
                    className="flex items-center gap-1 w-fit"
                  >
                    {isSolvent ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                    {isSolvent ? 'Solvent' : 'Insolvent'}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Leverage</p>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    {analysis.capitalStructure.enterpriseValue > 0 ? (
                      <>
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        {(analysis.capitalStructure.totalDebt / analysis.capitalStructure.enterpriseValue).toFixed(2)}x
                      </>
                    ) : 'N/A'}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Recommendation Preview */}
        {analysis.recommendation && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Recommendation</p>
            <p className="text-sm font-medium line-clamp-2">{analysis.recommendation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={onExportPDF} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={onExportPPTX} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PPTX
          </Button>
          <div className="flex-1" />
          <Button onClick={onDelete} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Portfolio;
