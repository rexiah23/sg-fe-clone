import React, { useState, useContext } from 'react';
import { Province } from '../types';
import { calculatePriceBreakdown } from '../utils/priceCalculator';
import { ChevronDown, Info } from 'lucide-react';
import { ConfigContext } from '../contexts/ConfigContext';
import { provinces } from '../constants/provinces';

interface PriceBreakdownProps {
  basePrice: number;
  selectedProvince: Province;
  onProvinceChange: (province: Province) => void;
}

interface ProvinceOption {
  value: Province;
  label: string;
}

export function PriceBreakdown({ 
  basePrice,
  selectedProvince,
  onProvinceChange
}: PriceBreakdownProps) {
  const config = useContext(ConfigContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showServiceDetails, setShowServiceDetails] = useState(false);

  const selectedProvinceData = provinces.find(p => p.value === selectedProvince)!;

  if (!config) return null;

  const provinceCharges = config.chargesByProvince[selectedProvinceData.label];

  return (
    <div className="bg-zinc-900 p-6 rounded-xl shadow-md border border-zinc-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">I'm located in:</h3>
        <div className="relative w-48">
          <select
            value={selectedProvince}
            onChange={(e) => onProvinceChange(e.target.value as Province)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {provinces.map(province => (
              <option key={province.value} value={province.value}>
                {province.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Car Price:</span>
          <span className="text-white font-medium">${basePrice.toLocaleString()}</span>
        </div>

        {provinceCharges.map((charge, index) => {
  let value = charge.value;

  // Convert percentages (<1) to an absolute numeric value
  if (typeof value === 'number' && value < 1) {
    value = Math.round(basePrice * value);
  }

  // Decide how to display this value
  let displayValue;
  if (typeof value === 'number') {
    if (value === 0) {
      displayValue = <span className="text-green-400">FREE</span>;
    } else {
      displayValue = `$${value.toLocaleString()}`;
    }
  } else {
    // Value is not a number, so just display the text
    displayValue = <span className="whitespace-nowrap">{value}</span>;
  }

  // Special handling for SG Supercars Service
  const isShipgridService = charge.label === "SG Supercars Service";

  return (
    <div key={index} className="flex flex-col">
      <div className="flex justify-between items-center">
        <span className="text-gray-300">{charge.label}:</span>
        <div className="text-white font-medium text-right min-w-[140px]">{displayValue}</div>
      </div>
      
      {isShipgridService && (
        <div className="mt-1">
          {/* <button 
            onClick={() => setShowServiceDetails(!showServiceDetails)}
            className="text-sm text-green-400 hover:text-green-300 border-b border-green-400 inline-flex items-center"
          >
            Understand our fee structure
            <ChevronDown 
              size={16} 
              className={`ml-1 transition-transform ${showServiceDetails ? 'transform rotate-180' : ''}`}
            />
          </button> */}
          
          {showServiceDetails && (
            <div className="mt-3 bg-zinc-800 p-4 rounded-lg text-sm text-gray-300 border border-zinc-700 space-y-3">
              <p className="font-medium text-white">Our service fee covers various costs we incur to successfully import your vehicle, including:</p>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Costs we have to pay our professional mechanic to complete a detailed on-site inspection of your vehicle in Korea, thoroughly evaluating all mechanical and cosmetic aspects to ensure it is "SG Supercars Approved" and eligible for our 3-day return policy.</li>
                <li>Costs associated with performing all necessary modifications so your vehicle is road legal in Canada.</li>
                <li>Costs with securely transporting your vehicle in an enclosed truck to the Busan port within Korea.</li>
                <li>Professional management of vehicle de-registration, export declarations, and other essential export processes within South Korea, ensuring your vehicle is legally cleared by the S.Korean government for export.</li>
                <li>Cost for our professional customs clearance team to guarantee clearance of your vehicle into Canada.</li>
                <li>Costs involved with transporting the vehicle from the Vancouver port directly to your designated pickup location.</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
})}

          <div className="pt-4 border-t border-zinc-700">
            <div className="flex justify-between items-center">
              <p className="text-white font-semibold">
                Delivered, Cleared, & After Duties + GST:
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg">🇨🇦</span>
                <p className="text-white font-bold">
                  $
                  {Math.round(
                    basePrice +
                      provinceCharges.reduce((total, charge) => {
                        // Only add if it's a number
                        if (typeof charge.value !== 'number') {
                          return total;
                        }

                        // If it's below 1, assume it's a percentage
                        const numericValue =
                          charge.value < 1
                            ? basePrice * charge.value
                            : charge.value;

                        return total + numericValue;
                      }, 0)
                  ).toLocaleString()}
                  {' '}CAD
                </p>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}