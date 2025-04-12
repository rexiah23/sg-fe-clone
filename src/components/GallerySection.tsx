import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

// ----- Wildcard globs for each car folder -----
const gallardoFiles = import.meta.glob('/src/assets/sold_cars/gallardo/*.*', {
  eager: true,
  as: 'url'
});
const g63Files = import.meta.glob('/src/assets/sold_cars/G63/*.*', {
  eager: true,
  as: 'url'
});

type MediaType = 'image' | 'video' | 'pdf' | 'unknown';

interface MediaItem {
  type: MediaType;
  url: string;
  id: string;
  fileName: string;
}

// ----- File-type detection -----
const getMediaType = (path: string): MediaType => {
  const lowerPath = path.toLowerCase();
  if (/\.(png|jpe?g|gif|webp|heic)$/.test(lowerPath)) return 'image';
  if (/\.(mp4|mov|webm|ogg)$/.test(lowerPath)) return 'video';
  if (/\.(pdf)$/.test(lowerPath)) return 'pdf';
  return 'unknown';
};

// ----- Shuffle helper -----
const shuffleArray = <T,>(array: T[]): T[] =>
  [...array].sort(() => Math.random() - 0.5);

// ----- Glob-to-array helper -----
function getMediaFrom(
  files: Record<string, string>,
  carName: string
): MediaItem[] {
  const mediaArray: MediaItem[] = [];
  Object.entries(files).forEach(([path, fileUrl]) => {
    const type = getMediaType(path);
    const item: MediaItem = {
      type,
      url: fileUrl,
      id: `${carName}-${path}`,
      fileName: path.split('/').pop() || ''
    };
    mediaArray.push(item);
  });
  return mediaArray;
}

// ----- Process all imported files, limiting to 4 items per folder -----
function processImportedFiles(): MediaItem[] {
  // Get full arrays from each folder
  let gallardoMedia = getMediaFrom(gallardoFiles, 'gallardo');
  let g63Media = getMediaFrom(g63Files, 'g63');

  // Limit each folder to 4 items
  gallardoMedia = gallardoMedia.slice(0, 4);
  g63Media = g63Media.slice(0, 4);

  // Keep Gallardo items in original order, shuffle the others
  const otherMedia = [...g63Media];
  const shuffledOthers = shuffleArray(otherMedia);

  // Final array: gallardo first, then the shuffled others
  const finalMedia = [...gallardoMedia, ...shuffledOthers];

  if (finalMedia.length === 0) {
    console.warn('No media files found. Check your file paths and directory structure.');
  } else {
    console.log(`Found ${finalMedia.length} media items (4 per folder max).`);
  }

  return finalMedia;
}

// ----- Carousel component without auto-rotate -----
function GallerySection() {
  const navigate = useNavigate();
  const [featuredMedia, setFeaturedMedia] = useState<MediaItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load media on mount
  useEffect(() => {
    const allMedia = processImportedFiles();
    setFeaturedMedia(allMedia);
  }, []);

  // Manual arrow clicks
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel Title */}
        {/* <div className="text-center mb-8">
          <h2 className="text-5xl font-bold text-white mb-2">Gallery</h2>
        </div> */}

        {/* Carousel Wrapper */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/30 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pr-8 flex-nowrap"
          >
            {featuredMedia.map((media) => (
              <div
                key={media.id}
                className="min-w-[280px] max-w-[280px] rounded-xl overflow-hidden flex-shrink-0 relative cursor-pointer group"
                onClick={() => navigate('/gallery')}
              >
                {/* Render the media */}
                {media.type === 'image' && (
                  <img
                    src={media.url}
                    alt={media.fileName}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {media.type === 'video' && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <video
                      src={media.url}
                      preload="metadata"
                      muted
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Optional play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-colors">
                      <Play className="w-10 h-10 text-white" fill="white" />
                    </div>
                  </div>
                )}
                {media.type === 'pdf' && (
                  <embed
                    src={media.url}
                    type="application/pdf"
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {media.type === 'unknown' && (
                  <div className="flex flex-col items-center justify-center w-full h-48 bg-zinc-800 text-white">
                    <span className="text-lg font-semibold">Unknown File</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/30 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Button to View Full Gallery */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/gallery')}
            className="inline-flex sm:text-lg md:text-xl items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors"
          >
            View Full Gallery
          </button>
        </div>
      </div>
    </div>
  );
}

export default GallerySection;
