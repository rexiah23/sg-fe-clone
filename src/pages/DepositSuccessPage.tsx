import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, Phone, Mail, ArrowLeft } from 'lucide-react';

interface Car {
  stockNumber: string;
}

export const DepositSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        // Get carId from URL parameters
        const params = new URLSearchParams(location.search);
        const carId = params.get('carId');

        if (carId) {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/cars/${carId}`);
          if (response.ok) {
            const data = await response.json();
            setCar(data);
          }
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-gray-900 text-center">
                Deposit Payment Successful!
              </h2>
              <p className="mt-2 text-lg text-gray-600 text-center">
                Thank you for your deposit. Your vehicle reservation has been confirmed.
              </p>
              {!loading && car && (
                <p className="mt-2 text-lg font-medium text-gray-900">
                  Stock# {car.stockNumber}
                </p>
              )}
            </div>

            <div className="mt-8 space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Next Steps</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 text-blue-600 mt-1" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Schedule Inspection</p>
                      <p className="text-sm text-gray-500">We'll contact you within 24 hours to schedule your vehicle inspection.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-blue-600 mt-1" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Contact Information</p>
                      <p className="text-sm text-gray-500">Our team will reach out to you at the phone number provided during checkout.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-blue-600 mt-1" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Email Confirmation</p>
                      <p className="text-sm text-gray-500">A detailed confirmation email has been sent to your registered email address.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Return to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 