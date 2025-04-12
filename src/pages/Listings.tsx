import React, { useState, useEffect, useContext, useMemo, useCallback, memo } from 'react';
import { Car } from '../types';
import { SearchFilters, FilterState, MIN_PRICE, MAX_PRICE, MIN_YEAR, MAX_YEAR, MIN_MILEAGE, MAX_MILEAGE } from '../components/SearchFilters';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ConfigContext } from '../contexts/ConfigContext';
import { Gauge, Fuel, ZoomIn } from 'lucide-react';
import { calculateFinalPrice } from '../utils/calculate';

// Define the correct types for our province charges, which appears to be an array in the API response
interface ProvinceChargeItem {
  label: string;
  value: number | string;
}

type ProvinceCharges = ProvinceChargeItem[];

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

// Memoized car card component to prevent unnecessary re-renders
const CarCard = memo(({ 
  car, 
  finalPrice,
}: { 
  car: Car; 
  finalPrice: number;
}) => {
  return (
    <div
      className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700 hover:border-green-500/30 transition-all duration-300 transform hover:scale-[1.01]"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 lg:w-2/5">
          <Link to={`/listings/${car.carId}`} className="relative pt-[75%] md:pt-0 md:h-full block">
            <img
              src={
                car.carPhotos[0]?.photoUrl ||
                'https://via.placeholder.com/800x600?text=No+Image'
              }
              alt={`${car.year} ${car.make} ${car.model}`}
              className={`absolute inset-0 w-full h-full object-cover ${car.reservedAt ? 'filter grayscale' : ''}`}
              loading="lazy"
            />
            {car.reservedAt && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="bg-yellow-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg transform rotate-3 flex flex-col items-center">
                  <span>RESERVED</span>
                  <span className="text-sm mt-1 font-normal">
                    {formatReservationDate(car.reservedAt)}
                  </span>
                </div>
              </div>
            )}
            {!car.reservedAt && (
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-black/70 rounded-full p-3 text-white flex items-center gap-2">
                  <ZoomIn size={20} />
                  <span>View Details</span>
                </div>
              </div>
            )}
          </Link>
        </div>

        <div className="p-6 md:w-2/3 lg:w-3/5">
          <div className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {car.year} {car.make} {car.model}
                </h2>
                <p className="text-green-400 font-medium">{car.trim}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">
                  Delivered, Cleared, & After Duties + GST:
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-sm">🇨🇦</span>
                  <span className="text-2xl font-bold text-white">
                    ${finalPrice.toLocaleString()}
                    <span className="text-sm ml-1">CAD</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <div>
              <p className="text-gray-300">Stock</p>
              <p className="text-white font-medium">#{car.carId}</p>
            </div>
            <div>
              <p className="text-gray-300">Mileage</p>
              <p className="text-white font-medium">
                {car.mileage.toLocaleString()} km
              </p>
            </div>
            <div>
              <p className="text-gray-300">Fuel Type</p>
              <p className="text-white font-medium">{car.fuelType}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link 
              to={`/listings/${car.carId}`}
              className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-lg transition-colors text-center"
            >
              View Details
            </Link>
            {!car.reservedAt && (
              <a 
                href={`https://wa.me/4374638189?text=Hi,%20I'm%20interested%20in%20the%20${car.year}%20${car.make}%20${car.model}%20(Stock%20%23${car.carId})`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-zinc-700 text-center"
              >
                Inquire
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

CarCard.displayName = 'CarCard';

// Loading skeleton component for better UX
const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div 
        key={`skeleton-${i}`} 
        className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700 animate-pulse"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 lg:w-2/5 bg-zinc-800 h-64"></div>
          <div className="p-6 md:w-2/3 lg:w-3/5">
            <div className="h-8 bg-zinc-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[1, 2, 3, 4].map((j) => (
                <div key={`skeleton-item-${j}`}>
                  <div className="h-3 bg-zinc-800 rounded w-1/2 mb-2"></div>
                  <div className="h-5 bg-zinc-800 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-zinc-800 rounded"></div>
              <div className="h-12 bg-zinc-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export function Listings() {
  const navigate = useNavigate();
  const location = useLocation();
  const config = useContext(ConfigContext);

  // Add scroll to top effect
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    minPrice: MIN_PRICE.toString(),
    maxPrice: MAX_PRICE.toString(),
    minYear: MIN_YEAR.toString(),
    maxYear: MAX_YEAR.toString(),
    minMileage: MIN_MILEAGE.toString(),
    maxMileage: MAX_MILEAGE.toString(),
    make: '',
    model: '',
    trim: '',
    fuelType: '',
    transmission: '',
    engine: '',
    color: '',
    bodyStyle: '',
    orderBy: 'popularity', // Default to popularity
  });
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Parse URL search params to set filters on mount and URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters: Partial<FilterState> = {};

    Object.keys(filters).forEach(key => {
      const value = params.get(key);
      if (value) {
        newFilters[key as keyof FilterState] = value;
      }
    });

    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, [location.search]);

  // Fetch cars data
  useEffect(() => {
    let isMounted = true;
    
    async function fetchAllCars() {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cars`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (isMounted) {
          setAllCars(data);
        }
      } catch (error) {
        console.error('Error fetching all cars:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchAllCars();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Get the province charges array with proper typing
  const provinceChargesArray = useMemo(() => {
    if (!config?.chargesByProvince['British Columbia']) {
      return [] as ProvinceChargeItem[];
    }
    
    // The API actually returns an array of charge items
    return config.chargesByProvince['British Columbia'] as unknown as ProvinceChargeItem[];
  }, [config]);

  // Memoize filter function to avoid recreating on every render
  const filterCar = useCallback((car: Car) => {
    // Make filter
    if (filters.make && !car.make.toLowerCase().includes(filters.make.toLowerCase())) {
      return false;
    }

    // Model filter
    if (filters.model && !car.model.toLowerCase().includes(filters.model.toLowerCase())) {
      return false;
    }

    // Trim filter
    if (filters.trim && !car.trim.toLowerCase().includes(filters.trim.toLowerCase())) {
      return false;
    }

    // Fuel type filter
    if (filters.fuelType && car.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) {
      return false;
    }

    // Price filter - use calculateFinalPrice
    const basePrice = car.priceCad || Number(car.price);
    const finalPrice = config && provinceChargesArray.length > 0
      ? calculateFinalPrice(basePrice, provinceChargesArray)
      : basePrice;
      
    if (filters.minPrice && finalPrice < Number(filters.minPrice)) return false;
    if (filters.maxPrice && finalPrice > Number(filters.maxPrice)) return false;

    // Year filter
    const carYear = Number(car.year);
    if (filters.minYear && carYear < Number(filters.minYear)) return false;
    if (filters.maxYear && carYear > Number(filters.maxYear)) return false;

    // Mileage filter
    if (filters.minMileage && car.mileage < Number(filters.minMileage)) return false;
    if (filters.maxMileage && car.mileage > Number(filters.maxMileage)) return false;

    return true;
  }, [filters, config, provinceChargesArray]);

  // Memoize comparison function for sorting
  const compareCars = useCallback((a: Car, b: Car) => {
    const aBasePrice = a.priceCad || Number(a.price);
    const bBasePrice = b.priceCad || Number(b.price);
    
    const aFinalPrice = config && provinceChargesArray.length > 0
      ? calculateFinalPrice(aBasePrice, provinceChargesArray)
      : aBasePrice;
      
    const bFinalPrice = config && provinceChargesArray.length > 0
      ? calculateFinalPrice(bBasePrice, provinceChargesArray)
      : bBasePrice;
    
    switch (filters.orderBy) {
      case 'popularity':
        // For popularity, show reserved cars at the top, then showTop, then by price
        if (a.reservedAt && !b.reservedAt) return -1;
        if (!a.reservedAt && b.reservedAt) return 1;
        if (a.showTop && !b.showTop) return -1;
        if (!a.showTop && b.showTop) return 1;
        return aFinalPrice - bFinalPrice;
      case 'priceAsc':
        return aFinalPrice - bFinalPrice;
      case 'priceDesc':
        return bFinalPrice - aFinalPrice;
      case 'yearAsc':
        return Number(a.year) - Number(b.year);
      case 'yearDesc':
        return Number(b.year) - Number(a.year);
      default:
        return aFinalPrice - bFinalPrice;
    }
  }, [filters.orderBy, config, provinceChargesArray]);

  // Memoize filtered and sorted cars
  const filteredCars = useMemo(() => {
    return allCars
      .filter(filterCar)
      .sort(compareCars);
  }, [allCars, filterCar, compareCars]);

  // Memoize car prices calculation - this is where the issue was
  const carPrices = useMemo(() => {
    if (!config || provinceChargesArray.length === 0) {
      console.log('Missing config or province charges for calculating final prices');
    }
    
    return filteredCars.map(car => {
      const basePrice = car.priceCad || Number(car.price);
      const finalPrice = config && provinceChargesArray.length > 0
        ? calculateFinalPrice(basePrice, provinceChargesArray)
        : basePrice;
      
      // Log a sample calculation to verify
      if (car.carId === filteredCars[0]?.carId) {
        console.log(`Car: ${car.make} ${car.model}, Base Price: ${basePrice}, Final Price: ${finalPrice}`);
      }
      
      return {
        carId: car.carId,
        finalPrice
      };
    });
  }, [filteredCars, config, provinceChargesArray]);

  // Memoized handler for search
  const handleSearch = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold text-white">Available Cars</h1>
          <p className="text-xl text-green-400 font-semibold">
            {filteredCars.length}{' '}
            {filteredCars.length === 1 ? 'Vehicle' : 'Vehicles'} Ready To Be Imported
          </p>
        </div>

        <div className="mb-8">
          <SearchFilters 
            initialFilters={filters} 
            onSearch={handleSearch} 
            allCars={allCars} 
          />
        </div>

        <div className="space-y-6">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredCars.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-white text-xl">No cars match your search criteria</div>
            </div>
          ) : (
            filteredCars.map((car) => {
              const priceInfo = carPrices.find(p => p.carId === car.carId);
              
              if (!priceInfo) {
                console.error(`Could not find price info for car ${car.carId}`);
              }
              
              return (
                <CarCard 
                  key={car.carId}
                  car={car}
                  finalPrice={priceInfo?.finalPrice || 0}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}