import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
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
        <title>Zac Smith | Restructuring & Special Situations</title>
        <meta
          name="description"
          content="Zac Smith - U.S. Army veteran and founder with hands-on restructuring experience. Seeking opportunities in Investment Banking & Consulting focused on Restructuring and Special Situations."
        />
        <meta name="keywords" content="restructuring, investment banking, consulting, special situations, finance, Zac Smith" />
        <link rel="canonical" href="https://zacsmith.com" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection />
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
