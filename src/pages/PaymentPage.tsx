import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign, ArrowLeft, User, Mail, Phone } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with the correct publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentPageProps {
  carId?: string;
}

// Customer Information Form Component
function CustomerInfoForm({ onSubmit }: { onSubmit: (data: { name: string; email: string; phone: string }) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: { name?: string; email?: string; phone?: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[\d\s-()]{10,}$/.test(phone)) newErrors.phone = 'Please enter a valid phone number';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({ name, email, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2 border rounded-md bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.name ? 'border-red-500' : ''}`}
              placeholder="John Doe"
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2 border rounded-md bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.email ? 'border-red-500' : ''}`}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={18} className="text-gray-400" />
            </div>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2 border rounded-md bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="+1 (123) 456-7890"
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
      >
        Continue to Payment
      </button>
    </form>
  );
}

// Payment Form Component
function CheckoutForm({ carId, customerInfo }: { carId: string; customerInfo: { name: string; email: string; phone: string } }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/deposit-success`,
          payment_method_data: {
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              phone: customerInfo.phone,
            },
          },
        },
      });

      if (submitError) {
        setError(submitError.message || 'An error occurred during payment');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white mb-2">Customer Information</h3>
          <div className="flex items-center gap-2 text-gray-300">
            <User size={16} />
            <span>{customerInfo.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Mail size={16} />
            <span>{customerInfo.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Phone size={16} />
            <span>{customerInfo.phone}</span>
          </div>
        </div>
        
        <div className="border-t border-zinc-700 pt-4">
          <h3 className="text-lg font-medium text-white mb-4">Payment Details</h3>
          <PaymentElement />
        </div>
      </div>
      
      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-md border border-red-800">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <DollarSign size={20} />
        <span>{loading ? 'Processing...' : 'Pay Deposit'}</span>
      </button>
      
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
        <span>Secured by</span>
        <svg width="40" height="16" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
          <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.94 10.94 0 0 1-4.56 1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.57zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.02-13.17 4.02-.86v3.54h3.14V9.1h-3.14v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z" fill="#635BFF" fillRule="evenodd"/>
        </svg>
      </div>
    </form>
  );
}

export function PaymentPage({ carId: propCarId }: PaymentPageProps) {
  const { carId: urlCarId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [car, setCar] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeOptions, setStripeOptions] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
  
  // Use either the prop or URL param for carId
  const carId = propCarId || urlCarId;

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

  const createPaymentIntent = async (customerInfo: { name: string; email: string; phone: string }) => {
    if (!car) return;
    
    try {
      setPaymentLoading(true);
      const lineItemDescription = 
        `Fully refundable deposit for the ${car.year} ${car.make} ${car.model} (Stock #${car.carId}).\n\n` +
        `Once paid, we will send you a confirmation email and begin the professional mechanic inspection starting the following day.\n\n` +
        `If you have any questions, email admin@sgsupercars.ca or call/whatsapp Brian at (437)-463-8189.`;

      const lineItemName = `Deposit (Refundable) - ${car.year} ${car.make} ${car.model} (Stock #${car.carId})`;
      const depositAmount = 1000;
      
      const lineItems = [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: lineItemName,
              description: lineItemDescription,
            },
            unit_amount: depositAmount * 100,
          },
          quantity: 1,
        },
      ];

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/stripe/create-payment-intent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            lineItems,
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            metadata: {
              car_id: carId || '',
              order_type: 'deposit'
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      console.log('Payment intent data:', data);
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStripeOptions({
          clientSecret: data.clientSecret,
          appearance: {
            theme: 'night',
            variables: {
              colorPrimary: '#25D366',
              colorBackground: '#18181B',
              colorText: '#FFFFFF',
              colorDanger: '#EF4444',
              fontFamily: 'Inter, system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px',
            },
          },
        });
      } else {
        throw new Error('No client secret returned from server');
      }
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError('Failed to initialize payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCustomerInfoSubmit = (info: { name: string; email: string; phone: string }) => {
    setCustomerInfo(info);
    createPaymentIntent(info);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading payment details...</div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">{error || 'Car not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/listings/${carId}`)}
          className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Car Details</span>
        </button>

        <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-700">
          <h1 className="text-2xl font-bold text-white mb-6">Complete Your Reservation</h1>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {car.year} {car.make} {car.model}
                </h2>
                <p className="text-green-400">Stock #{car.carId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Deposit Amount</p>
                <p className="text-xl font-bold text-white">$1,000 CAD</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">What's Included:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-400" />
                  <span>Fully refundable deposit</span>
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-400" />
                  <span>Professional mechanic inspection</span>
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-400" />
                  <span>Detailed inspection report</span>
                </li>
                <li className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-400" />
                  <span>24-hour inspection completion</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-zinc-700">
              {!customerInfo ? (
                <CustomerInfoForm onSubmit={handleCustomerInfoSubmit} />
              ) : clientSecret && stripeOptions ? (
                <Elements stripe={stripePromise} options={stripeOptions}>
                  <CheckoutForm carId={carId || ''} customerInfo={customerInfo} />
                </Elements>
              ) : (
                <div className="space-y-6">
                  <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white mb-2">Customer Information</h3>
                      <div className="flex items-center gap-2 text-gray-300">
                        <User size={16} />
                        <span>{customerInfo.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail size={16} />
                        <span>{customerInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone size={16} />
                        <span>{customerInfo.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400 mb-4"></div>
                    <p className="text-gray-300">Loading payment form...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 