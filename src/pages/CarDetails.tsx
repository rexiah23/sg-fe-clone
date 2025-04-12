import React, { useState, useEffect, useContext } from 'react';
import { Car } from '../types';
import { ImageCarousel } from '../components/ImageCarousel';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { DollarSign, Fuel, Gauge, ExternalLink, MessageCircle, Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { ConfigContext } from '../contexts/ConfigContext';
import { Province } from '../types';
import { provinces } from '../constants/provinces';
import { getWhatsAppUrl } from '../utils/getUrls';

// Format date to human readable string
const formatReservationDate = (dateString: string | null): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export function CarDetails() {
  const { carId } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const config = useContext(ConfigContext);
  const [selectedProvince, setSelectedProvince] = useState<Province>('BC');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    async function fetchCarDetails() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cars/${carId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    }
    
    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-white text-xl font-semibold">Loading car details...</div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-red-400 text-xl font-semibold">Error: {error || 'Car not found'}</div>
      </div>
    );
  }

  // URLs for actions
  const whatsappMessage = `Hi, I'm interested in the ${car.year} ${car.make} ${car.model} ${car.trim} (Stock #${car.carId})`;
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);
  const calendlyUrl = 'https://calendly.com/admin-sgsupercars/15min';

  // Function to calculate final price with taxes/fees
  const calculateFinalPrice = () => {
    if (!config) return car.priceCad;
    const provinceData = provinces.find(p => p.value === selectedProvince)!;
    const charges = config.chargesByProvince[provinceData.label];

    return Math.round(
      car.priceCad +
        charges.reduce((total, charge) => {
          // Skip if it's not a number
          if (typeof charge.value !== 'number') {
            return total;
          }
          // If it's below 1, assume it's a percentage
          const numericValue = charge.value < 1
            ? car.priceCad * charge.value
            : charge.value;

          return total + numericValue;
        }, 0)
    );
  };

  const finalPrice = calculateFinalPrice();

  // 1) Handle deposit click
  //    Here we assume you have an endpoint like '/create-checkout-session' 
  //    that creates a Stripe Checkout session and returns the session URL.
  //    Adjust the code to match your actual backend route and params.
  const handleDepositClick = () => {
    navigate(`/payment/${car.carId}`);
  };
  

  return (
    <div className="bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 rounded-xl shadow-md overflow-hidden border border-zinc-700">
              <ImageCarousel photos={car.carPhotos} />
              
              <div className="p-6 sm:p-8">
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        {car.year} {car.make} {car.model}
                      </h1>
                      <p className="mt-1 text-lg sm:text-xl text-green-400 font-semibold">{car.trim}</p>
                      {car.reservedAt && (
                        <div className="mt-2 inline-flex items-center gap-2 bg-yellow-500/90 backdrop-blur-sm text-black px-4 py-1 rounded-full font-medium text-sm shadow-lg">
                          <span>Reserved</span>
                          <span className="text-xs opacity-80">
                            {formatReservationDate(car.reservedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-300">Delivered, Cleared, &amp; After Duties + GST:</p>
                      <div className="flex flex-col items-start sm:items-end gap-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">🇨🇦</span>
                          <span className="text-2xl sm:text-3xl font-bold text-white">
                            ${finalPrice.toLocaleString()}
                            <span className="text-sm ml-1">CAD</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                      <Gauge className="text-green-400" size={24} />
                      <div>
                        <p className="text-sm text-gray-300">Mileage</p>
                        <p className="font-semibold text-white">
                          {car.mileage.toLocaleString()} km
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Fuel className="text-green-400" size={24} />
                      <div>
                        <p className="text-sm text-gray-300">Fuel Type</p>
                        <p className="font-semibold text-white">{car.fuelType}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 space-y-6 border-t border-zinc-700 pt-8">
                  <h2 className="text-xl font-semibold text-white">Additional Information</h2>
                  <div className="space-y-4">
                    <a
                      href={car.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                    >
                      <ExternalLink size={20} />
                      <span>View Original Listing On Encar.com</span>
                    </a>
                    {car.historyPhotos?.[0] && car.historyPhotos[0].photoUrl && (
                      <a
                        href={car.historyPhotos[0].photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <ExternalLink size={20} />
                        <span>Korean CarFax</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <PriceBreakdown 
              basePrice={car.priceCad}
              selectedProvince={selectedProvince}
              onProvinceChange={setSelectedProvince}
            />
            
            {!car.reservedAt && (
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-700 space-y-4">
                {/* Request Inspection button with Stripe indicator */}
                <div className="relative">
                  <button
                    onClick={handleDepositClick}
                    className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
                  >
                    <DollarSign size={20} />
                    <span>RESERVE NOW</span>
                  </button>
                  <div className="absolute -bottom-3 right-4 bg-white py-1 px-3 rounded-full shadow-md flex items-center">
                    <span className="text-xs font-medium mr-1">Secured by</span>
                    <svg width="40" height="16" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                      <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.94 10.94 0 0 1-4.56 1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.57zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.02-13.17 4.02-.86v3.54h3.14V9.1h-3.14v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z" fill="#635BFF" fillRule="evenodd"/>
                    </svg>
                  </div>
                </div>

                {/* Existing "WhatsApp Now" button - now green */}
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp Now</span>
                </a>

                {/* <a 
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar size={20} />
                  <span>Book A Call</span>
                </a> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
