import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RXLearningIndex from '@/components/rx-learning/index';

const RXLearning = () => {
  return (
    <>
      <Helmet>
        <title>RX Learning Center | Zac Smith</title>
        <meta
          name="description"
          content="Comprehensive restructuring and special situations learning center. Master all RX techniques from Chapter 11 to LBOs with interactive decision trees and real-world examples."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Back Navigation */}
        <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <Link to="/#research" className="inline-flex items-center gap-2 text-cream-muted hover:text-primary transition-colors">
              <ArrowLeft size={18} />
              <span className="font-body text-sm">Back to Portfolio</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <RXLearningIndex />
      </div>
    </>
  );
};

export default RXLearning;
