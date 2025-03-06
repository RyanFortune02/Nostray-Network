import React from 'react';
import Navbar from '../components/Public/Navbar';
import Hero from '../components/Public/Hero';
import InfoSection from '../components/Public/InfoSection';
import ContactSection from '../components/Public/ContactSection';
import TeamSection from '../components/Public/TeamSection';
import Footer from '../components/Public/Footer';
import SupportOrgs from '../components/Public/SupportOrgs';

const PublicPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TeamSection />
      <InfoSection />
      <SupportOrgs />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default PublicPage;