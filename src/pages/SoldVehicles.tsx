import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Calendar, MapPin } from 'lucide-react';

interface Testimonial {
  customerName: string;
  location: string;
  date: string;
  vehicle: string;
  review: string;
  imageUrl: string;
}

const testimonials: Testimonial[] = [
  {
    customerName: "Michael Chen",
    location: "Vancouver, BC",
    date: "January 2024",
    vehicle: "2019 Lamborghini Gallardo LP560-4",
    review: "SG Supercars made importing my dream Gallardo from Korea an absolute breeze. Their attention to detail and transparent communication throughout the process was exceptional.",
    imageUrl: "/src/assets/sold_cars/gallardo/IMG_6355.JPG"
  },
  {
    customerName: "Sarah Thompson",
    location: "Toronto, ON",
    date: "December 2023",
    vehicle: "2020 Mercedes-Benz G63 AMG",
    review: "I was initially hesitant about importing a vehicle from overseas, but SG Supercars' expertise and professionalism put all my concerns to rest. My G63 arrived in perfect condition.",
    imageUrl: "/src/assets/sold_cars/G63/2053A.jpg"
  }
];

export function SoldVehicles() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Success Stories</h1>
          <p className="text-xl text-gray-300">
            Real experiences from our valued customers who trusted us with their dream cars
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-green-500/30 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={testimonial.imageUrl}
                  alt={testimonial.vehicle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{testimonial.vehicle}</h3>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Verified Purchase</span>
                </div>

                <p className="text-gray-300 mb-6">"{testimonial.review}"</p>

                <div className="border-t border-zinc-800 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{testimonial.customerName}</p>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{testimonial.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-green-600/20 text-green-400 px-6 py-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">All vehicles imported with our 3-day return guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}