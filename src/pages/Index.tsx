import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import InteractiveMesh from '@/components/InteractiveMesh';
import HeroSection from '@/components/HeroSection';
import AuthorBar from '@/components/AuthorBar';
import ExperienceSection from '@/components/ExperienceSection';
import CaseStudySection from '@/components/CaseStudySection';
import ResearchSection from '@/components/ResearchSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>The Fulcrum Memo | Independent Credit Research</title>
        <meta
          name="description"
          content="Deep-dive analysis of distressed debt, restructuring situations, and special situations. Independent credit research by Zachary Smith."
        />
        <meta name="keywords" content="restructuring, distressed debt, credit research, special situations, fulcrum security, investment banking" />
        <link rel="canonical" href="https://zac-t-smith.github.io/FulcrumMemo" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <InteractiveMesh />
        <Navbar />
        <main className="relative z-10">
          <HeroSection />
          <AuthorBar />
          <ExperienceSection />
          <CaseStudySection />
          <ResearchSection />
          <AboutSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
