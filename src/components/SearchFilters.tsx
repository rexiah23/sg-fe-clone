import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ConfigContext } from '../contexts/ConfigContext';
import { Car } from '../types';

interface SearchFiltersProps {
  isHomepage?: boolean;
  initialFilters?: FilterState;
  onSearch?: (filters: FilterState) => void;
  allCars?: Car[];
}

export interface FilterState {
  minPrice: string | number;
  maxPrice: string | number;
  minYear: string | number;
  maxYear: string | number;
  minMileage: string | number;
  maxMileage: string | number;
  make: string;
  model: string;
  trim: string;
  fuelType: string;
  transmission: string;
  engine: string;
  color: string;
  bodyStyle: string;
  orderBy: string;
}

export const MIN_PRICE = 0;
export const MAX_PRICE = 1000000;
export const MIN_YEAR = 2000;
export const MAX_YEAR = new Date().getFullYear() - 15;
export const MIN_MILEAGE = 0;
export const MAX_MILEAGE = 200000;

const defaultFilterState: FilterState = {
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
  orderBy: 'popularity',
};

export function SearchFilters({
  isHomepage = false,
  initialFilters,
  onSearch,
  allCars = [],
}: SearchFiltersProps) {
  const navigate = useNavigate();
  const config = useContext(ConfigContext);

  // 1. Lazy-initialize state from initialFilters (or use defaults)
  const [filters, setFilters] = useState<FilterState>(() => {
    return { ...defaultFilterState, ...initialFilters };
  });

  // 2. Only update state if initialFilters changes (to avoid infinite loops).
  //    You can do a deep compare here if needed, but a shallow or reference check
  //    may be enough in many cases.
  const prevInitialFilters = useRef<FilterState | undefined>(initialFilters);
  useEffect(() => {
    // Simple shallow check of object reference. If you need a deep compare,
    // import a helper like 'fast-deep-equal' or implement your own.
    if (prevInitialFilters.current !== initialFilters && initialFilters) {
      prevInitialFilters.current = initialFilters;
      setFilters((prev) => ({
        ...defaultFilterState,
        ...initialFilters,
      }));
    }
  }, [initialFilters]);

  // 3. If allCars is large, these computations can be expensive, so we wrap them in useMemo
  const makes = useMemo(() => {
    const uniqueMakes = [...new Set(allCars.map((car) => car.make))];
    return uniqueMakes.sort();
  }, [allCars]);

  const models = useMemo(() => {
    if (!filters.make) return [];
    const filtered = allCars.filter((car) => car.make === filters.make);
    const uniqueModels = [...new Set(filtered.map((car) => car.model))];
    return uniqueModels.sort();
  }, [allCars, filters.make]);

  const trims = useMemo(() => {
    if (!filters.make || !filters.model) return [];
    const filtered = allCars.filter(
      (car) => car.make === filters.make && car.model === filters.model
    );
    const uniqueTrims = [...new Set(filtered.map((car) => car.trim))];
    return uniqueTrims.filter(Boolean).sort();
  }, [allCars, filters.make, filters.model]);

  // 4. Debounce onSearch calls to avoid spamming the parent
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch?.(filters);
    }, 300);

    return () => clearTimeout(handler);
  }, [filters, onSearch]);

  // 5. Check if any filter differs from default
  const hasActiveFilters = useMemo(() => {
    // Convert everything to string for comparison if needed.
    // Or just check each field:
    return (
      filters.make !== '' ||
      filters.model !== '' ||
      filters.trim !== '' ||
      filters.fuelType !== '' ||
      filters.transmission !== '' ||
      filters.engine !== '' ||
      filters.color !== '' ||
      filters.bodyStyle !== '' ||
      filters.minPrice !== MIN_PRICE.toString() ||
      filters.maxPrice !== MAX_PRICE.toString() ||
      filters.minYear !== MIN_YEAR.toString() ||
      filters.maxYear !== MAX_YEAR.toString() ||
      filters.minMileage !== MIN_MILEAGE.toString() ||
      filters.maxMileage !== MAX_MILEAGE.toString()
    );
  }, [filters]);

  // 6. Clear all filters
  const clearFilters = () => {
    setFilters({ ...defaultFilterState });
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Make Dropdown */}
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-300 mb-2">
            Make
          </label>
          <select
            id="make"
            name="make"
            value={filters.make}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                make: e.target.value,
                model: '',
                trim: '',
              }))
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Any Make</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        {/* Model Dropdown */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
            Model
          </label>
          <select
            id="model"
            name="model"
            value={filters.model}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                model: e.target.value,
                trim: '',
              }))
            }
            disabled={!filters.make}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Any Model</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Order By */}
        <div>
          <label htmlFor="orderBy" className="block text-sm font-medium text-gray-300 mb-2">
            Order By
          </label>
          <select
            id="orderBy"
            name="orderBy"
            value={filters.orderBy}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, orderBy: e.target.value }))
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="popularity">Popularity</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="yearAsc">Year: Oldest to Newest</option>
            <option value="yearDesc">Year: Newest to Oldest</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
            Total Price ($CAD)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
              }
              className="w-1/2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
              }
              className="w-1/2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Clear All */}
      <div className="mt-6 flex items-center justify-end gap-4">
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg border border-red-600/20 hover:bg-red-600/30 transition-colors flex items-center gap-2"
          >
            <X size={20} />
            <span>Clear All</span>
          </button>
        )}
      </div>
    </div>
  );
}

// (Optional) If the component's props rarely change, you can wrap it:
// export default React.memo(SearchFilters);
