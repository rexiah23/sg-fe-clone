import React, { useState, useEffect, useContext } from 'react';
import { Car } from '../types';
import { HowItWorks } from '../components/HowItWorks';
import { HowItWorksPage } from './HowItWorksPage'

import WhyShipgrid from '../components/WhyShipgrid';
import { WhatWeDo } from '../components/WhatWeDo';
import { Partners } from '../components/Partners';
import { ContactSupport } from '../components/ContactSupport';
import { useNavigate } from 'react-router-dom';
import { ConfigContext } from '../contexts/ConfigContext';
import Hero from '../components/Hero';
import GuaranteeSection from '../components/GuaranteeSection';
import CarListSection from '../components/CarListSection';
import PriceComparison from '../components/PriceComparison';
import QualityComparison from '../components/QualityComparison';
import BreakSection from '../components/ViewInventoryBreak';
import { InfoBoxes } from '../components/InfoBoxes';
import WhyImportKorea from '../components/WhyImportKorea';
import GallerySection from '../components/GallerySection';


export function Home() {
  const navigate = useNavigate();
  const config = useContext(ConfigContext);
  const [currentPage, setCurrentPage] = useState(0);
  const carsPerPage = 8;
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const totalPages = Math.ceil(recommendedCars.length / carsPerPage);

  useEffect(() => {
    async function fetchRecommendedCars() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cars/fetchRecommendedCars`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Sort cars: first by showTop (true first), then by price ascending
        const sortedCars = [...data].sort((a, b) => {
          // First priority: showTop (true comes first)
          if (a.showTop && !b.showTop) return -1;
          if (!a.showTop && b.showTop) return 1;
          
          // Second priority: price ascending
          return a.priceCad - b.priceCad;
        });
        
        setRecommendedCars(sortedCars);
      } catch (error) {
        console.error('Error fetching recommended cars:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendedCars();
  }, []);

  return (
    <div className="bg-transparent">
      <Hero />
      
      {/* Trending Vehicles Section */}
      <div>
        <CarListSection
          loading={loading}
          recommendedCars={recommendedCars}
          config={config}
          navigate={navigate}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          carsPerPage={carsPerPage}
          prevPage={() => setCurrentPage(prev => (prev - 1 + totalPages) % totalPages)}
          nextPage={() => setCurrentPage(prev => (prev + 1) % totalPages)}
        />
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/listings')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-12 rounded-lg transition-colors sm:text-lg md:text-xl"
          >
            View Full Inventory
          </button>
        </div>
      </div>

      {/* Why Import Section with Visual Break */}
      <div className="mb-24">
        <WhyImportKorea />
      </div>

      {/* Visual Break */}
      <div className="mb-24">
        <BreakSection />
      </div>

      {/* How It Works Section with Gradient Break */}
      <div className="relative mb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/10 to-transparent pointer-events-none" />
        <HowItWorksPage />
      </div>

      {/* Why Shipgrid Section */}
      <div className="mb-24">
        <WhyShipgrid />
      </div>

      {/* Previous Imports Section */}
      <div className="mb-24">
        <GallerySection />
      </div>


      {/* Partners Section with Border Break */}
      <div className="mb-24 border-t border-b border-gray-800">
        <Partners />
      </div>

      {/* Contact Support Section */}
      <div>
        <ContactSupport />
      </div>
      
    </div>
  );
}