import HeroSection from "@/components/public/HeroSection";
import DealsBanner from "@/components/public/DealsBanner";
import TrustBar from "@/components/public/TrustBar";
import ProductCatalog from "@/components/public/ProductCatalog";
import VideoReels from '@/components/public/VideoReels';
import CallToActionBanner from "@/components/public/CallToActionBanner";
import AboutSection from "@/components/public/AboutSection";
import TrustAndStatsSection from "@/components/public/TrustAndStatsSection";
import ReviewsSection from "@/components/public/ReviewsSection";
import FaqSection from "@/components/public/FaqSection";
import BusinessOpportunity from "@/components/public/BusinessOpportunity";


export default function MainPage() {
  return (
    <>
      <HeroSection />
      <DealsBanner />
      <TrustBar />
      <ProductCatalog />
      <BusinessOpportunity />
      <VideoReels />
      <CallToActionBanner />
      <AboutSection/>
      <TrustAndStatsSection />
      <ReviewsSection />
      <FaqSection />
      
    </>
  );
}
