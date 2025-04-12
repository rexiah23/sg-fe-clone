import React from 'react';

function AboutUs() {
  return (
    <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
        </div>

        <div className="space-y-8 text-gray-300">
          <p className="text-lg leading-relaxed">
            At SG Supercars Supercars, we're driven by one powerful mission: making the dream of supercar ownership a reality for Canadians.
          </p>

          <p className="text-lg leading-relaxed">
            We're Brian and Lewis, two brothers who grew up in Toronto with an insatiable passion for supercars—a passion ignited the moment we first laid eyes on a Lamborghini Diablo parked at our local plaza. It was a life-changing moment, instantly fueling our dreams of owning a supercar someday.
          </p>

          {/* Single photo placeholder */}
          {/* <div className="my-10 bg-zinc-800 rounded-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-white font-medium">Photo will be inserted here</p>
                <p className="text-sm text-gray-400 mt-2">Childhood photo with cars</p>
              </div>
            </div>
          </div> */}

          <p className="text-lg leading-relaxed">
            Countless late nights were spent binge-watching episodes of Top Gear, eagerly following Clarkson, Hammond, and May as they embarked on incredible journeys in the world's most iconic cars. We promised ourselves we'd own these dream machines someday.
          </p>

          <p className="text-lg leading-relaxed">
            However, like many fellow Canadian car enthusiasts, we found it challenging to justify investing significant resources into a single dream car.
          </p>

          <p className="text-lg leading-relaxed">
            Realizing we weren't alone, we founded SG Supercars Supercars to bridge this gap. By importing classic supercars directly from South Korea to Canada, we're committed to making supercar ownership affordable and accessible, helping fellow Canadians fulfill the dreams they've cherished since childhood.
          </p>

          <p className="text-lg leading-relaxed">
            Our journey is backed by a rich family history in the automotive trade. Our family-run business, TONG YEONG TRADING COMPANY, was founded by our uncle, Lee Yongwoo, in 1987. Initially an electronics exporter, TONG YEONG shifted its focus in 2014 to specialize in exotic car exports. Since then, we have successfully exported over 200 luxury vehicles to clients in more than five countries, solidifying our commitment to quality and excellence in the automotive trade out of S.Korea.
          </p>

          {/* Four photos in a row placeholder */}
          {/* <div className="my-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="bg-zinc-800 rounded-lg overflow-hidden">
                  <div className="aspect-square flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="text-white font-medium">Photo {num}</p>
                      <p className="text-sm text-gray-400 mt-2">Car export photo</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

        </div>
      </div>
    </div>
  );
}

export default AboutUs;
