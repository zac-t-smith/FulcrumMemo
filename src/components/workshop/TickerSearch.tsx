import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search,
  TrendingDown,
  TrendingUp,
  Building2,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Info,
  RefreshCw,
  Zap
} from 'lucide-react';
import {
  searchCompanies,
  getDistressedCompanies,
  getSuggestedCaseStudies,
  calculateMetrics,
  type CompanyData
} from '@/services/financialDataService';
import { fetchLiveCompanyDataCached, type LiveCompanyData } from '@/services/liveCompanyData';

interface TickerSearchProps {
  onSelectCompany?: (company: CompanyData) => void;
  showSuggestions?: boolean;
}

export const TickerSearch = ({ onSelectCompany, showSuggestions = true }: TickerSearchProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CompanyData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [liveDataError, setLiveDataError] = useState<string | null>(null);

  // Search on query change with debounce
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchCompanies(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectCompany = (company: CompanyData) => {
    setSelectedCompany(company);
    onSelectCompany?.(company);
  };

  const handleFetchLiveData = async () => {
    if (!query.trim()) return;

    setIsLoadingLive(true);
    setLiveDataError(null);

    try {
      const liveData = await fetchLiveCompanyDataCached(query.trim());

      if (liveData) {
        setSelectedCompany(liveData);
        onSelectCompany?.(liveData);
        setLiveDataError(null);
      } else {
        setLiveDataError(`No live data found for ${query.toUpperCase()}. Try searching demo companies instead.`);
      }
    } catch (error) {
      console.error('Live data fetch error:', error);
      setLiveDataError('Failed to fetch live data. Using demo data instead.');
    } finally {
      setIsLoadingLive(false);
    }
  };

  const suggestedCompanies = showSuggestions ? getSuggestedCaseStudies() : [];

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Company Ticker Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ticker or company name (e.g., KIRK, Party City)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleFetchLiveData}
              disabled={!query.trim() || isLoadingLive}
              variant="default"
              className="flex-1"
            >
              {isLoadingLive ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Fetching Live Data...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Fetch Live Financial Data
                </>
              )}
            </Button>
          </div>

          {liveDataError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {liveDataError}
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Try Live Data:</strong> Enter any ticker (e.g., TSLA, AAPL, GME) and click "Fetch Live Data" for real-time financials.
              <br />
              <strong>Or use Demo:</strong> Pre-loaded distressed companies: KIRK, PTCY, EXPR, BBBY, TUEM, RGS, WMT, AAPL.
            </AlertDescription>
          </Alert>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              </p>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {searchResults.map((company) => (
                  <CompanyCard
                    key={company.ticker}
                    company={company}
                    onSelect={() => handleSelectCompany(company)}
                    isSelected={selectedCompany?.ticker === company.ticker}
                  />
                ))}
              </div>
            </div>
          )}

          {query && !isSearching && searchResults.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No companies found matching "{query}". Try: KIRK, PTCY, EXPR, BBBY, TUEM, or RGS.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Suggested Distressed Companies */}
      {showSuggestions && !query && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-amber-500" />
              Suggested Case Studies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Pre-loaded distressed companies perfect for RX analysis practice
            </p>
            <div className="grid gap-3">
              {suggestedCompanies.map((company) => (
                <CompanyCard
                  key={company.ticker}
                  company={company}
                  onSelect={() => handleSelectCompany(company)}
                  isSelected={selectedCompany?.ticker === company.ticker}
                  compact
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Company Details */}
      {selectedCompany && (
        <SelectedCompanyDetails
          company={selectedCompany}
          onStartAnalysis={() => {
            // Navigate to workshop with custom case study
            navigate('/workshop', { state: { customCompany: selectedCompany } });
          }}
        />
      )}
    </div>
  );
};

// Company Card Component
interface CompanyCardProps {
  company: CompanyData;
  onSelect: () => void;
  isSelected?: boolean;
  compact?: boolean;
}

const CompanyCard = ({ company, onSelect, isSelected, compact }: CompanyCardProps) => {
  const metrics = calculateMetrics(company);

  const distressColor = company.isDistressed ? 'text-red-500' : 'text-green-500';
  const distressIcon = company.isDistressed ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />;

  return (
    <div
      onClick={onSelect}
      className={`
        p-4 border rounded-lg cursor-pointer transition-all hover:border-primary hover:shadow-md
        ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-border'}
        ${compact ? 'p-3' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <h3 className="font-semibold text-sm truncate">{company.name}</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {company.ticker}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {company.exchange}
            </Badge>
            <Badge variant={company.isDistressed ? 'destructive' : 'secondary'} className="text-xs flex items-center gap-1">
              {distressIcon}
              {metrics.distressLevel}
            </Badge>
          </div>

          {!compact && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Market Cap:</span>{' '}
                <span className="font-medium">${(company.marketCap / 1000).toFixed(1)}M</span>
              </div>
              <div>
                <span className="text-muted-foreground">EV:</span>{' '}
                <span className="font-medium">${(company.enterpriseValue / 1000).toFixed(1)}M</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Debt:</span>{' '}
                <span className="font-medium">${(company.totalDebt / 1000).toFixed(1)}M</span>
              </div>
              <div>
                <span className="text-muted-foreground">Leverage:</span>{' '}
                <span className={`font-medium ${metrics.leverageRatio > 1 ? 'text-red-500' : 'text-green-500'}`}>
                  {metrics.leverageRatio.toFixed(2)}x
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Solvency:</span>{' '}
                <span className={`font-medium ${metrics.isSolvent ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.isSolvent ? 'Solvent' : 'Insolvent'}
                </span>
              </div>
            </div>
          )}
        </div>

        {isSelected && (
          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
        )}
      </div>
    </div>
  );
};

// Selected Company Details
interface SelectedCompanyDetailsProps {
  company: CompanyData;
  onStartAnalysis: () => void;
}

const SelectedCompanyDetails = ({ company, onStartAnalysis }: SelectedCompanyDetailsProps) => {
  const metrics = calculateMetrics(company);
  const liveCompany = company as LiveCompanyData;
  const dataSource = liveCompany.dataSource;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{company.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">{company.ticker} • {company.industry}</p>
              {dataSource && (
                <Badge
                  variant={dataSource === 'live' ? 'default' : dataSource === 'hybrid' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {dataSource === 'live' && <Zap className="h-3 w-3 mr-1" />}
                  {dataSource.toUpperCase()} DATA
                </Badge>
              )}
            </div>
          </div>
          <Badge variant={company.isDistressed ? 'destructive' : 'secondary'} className="text-sm">
            {metrics.distressLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        {company.description && (
          <p className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3">
            {company.description}
          </p>
        )}

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <MetricCard
            label="Market Cap"
            value={`$${(company.marketCap / 1000).toFixed(1)}M`}
            icon={<DollarSign className="h-4 w-4" />}
          />
          <MetricCard
            label="Enterprise Value"
            value={`$${(company.enterpriseValue / 1000).toFixed(1)}M`}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <MetricCard
            label="Total Debt"
            value={`$${(company.totalDebt / 1000).toFixed(1)}M`}
            icon={<TrendingDown className="h-4 w-4" />}
          />
          <MetricCard
            label="Cash"
            value={`$${(company.cash / 1000).toFixed(1)}M`}
            icon={<DollarSign className="h-4 w-4" />}
          />
          <MetricCard
            label="Revenue (TTM)"
            value={`$${(company.revenue / 1000).toFixed(1)}M`}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <MetricCard
            label="EBITDA"
            value={`$${(company.ebitda / 1000).toFixed(1)}M`}
            icon={company.ebitda > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            valueColor={company.ebitda > 0 ? 'text-green-600' : 'text-red-600'}
          />
        </div>

        {/* Calculated Metrics */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-2">
          <h4 className="text-sm font-semibold mb-3">Calculated RX Metrics</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Debt / EV:</span>
              <span className={`font-medium ${metrics.leverageRatio > 1 ? 'text-red-600' : 'text-green-600'}`}>
                {metrics.leverageRatio.toFixed(2)}x
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Debt / EBITDA:</span>
              <span className={`font-medium ${metrics.debtToEBITDA > 6 ? 'text-red-600' : 'text-green-600'}`}>
                {isFinite(metrics.debtToEBITDA) ? `${metrics.debtToEBITDA.toFixed(1)}x` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Solvency:</span>
              <span className={`font-medium ${metrics.isSolvent ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.isSolvent ? 'Solvent' : 'Insolvent'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Runway:</span>
              <span className="font-medium">{metrics.estimatedRunway}</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span className="text-muted-foreground">Distress Score:</span>
              <span className={`font-medium ${(company.distressScore || 0) > 75 ? 'text-red-600' : (company.distressScore || 0) > 50 ? 'text-amber-600' : 'text-green-600'}`}>
                {company.distressScore || 0}/100
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button onClick={onStartAnalysis} className="w-full" size="lg">
          Start RX Analysis
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Last updated: {company.lastUpdated || 'N/A'}
        </p>
      </CardContent>
    </Card>
  );
};

// Metric Card Component
interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  valueColor?: string;
}

const MetricCard = ({ label, value, icon, valueColor = 'text-foreground' }: MetricCardProps) => (
  <div className="p-3 bg-background rounded border">
    <div className="flex items-center gap-2 text-muted-foreground mb-1">
      {icon}
      <span className="text-xs">{label}</span>
    </div>
    <p className={`text-lg font-semibold ${valueColor}`}>{value}</p>
  </div>
);
