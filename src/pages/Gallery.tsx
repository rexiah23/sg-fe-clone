import React, { useState, useEffect } from 'react';
import { Shield, Clock, FileCheck, X, Play, ChevronLeft, ChevronRight } from 'lucide-react';

// Wildcard globs for each folder:
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

// Identify file types by extension
const getMediaType = (path: string): MediaType => {
  const lowerPath = path.toLowerCase();
  if (/\.(png|jpe?g|gif|webp|heic)$/.test(lowerPath)) return 'image';
  if (/\.(mp4|mov|webm|ogg)$/.test(lowerPath)) return 'video';
  if (/\.(pdf)$/.test(lowerPath)) return 'pdf';
  return 'unknown';
};

const shuffleArray = <T,>(array: T[]): T[] =>
  [...array].sort(() => Math.random() - 0.5);

const processImportedFiles = (): MediaItem[] => {
  const gallardoMedia: MediaItem[] = [];
  const otherMedia: MediaItem[] = [];

  const processCarFiles = (files: Record<string, string>, carName: string, isGallardo = false) => {
    Object.entries(files).forEach(([path, fileUrl]) => {
      const type = getMediaType(path);
      const item: MediaItem = {
        type,
        url: fileUrl,
        id: `${carName}-${path}`,
        fileName: path.split('/').pop() || ''
      };
      if (isGallardo) {
        gallardoMedia.push(item);
      } else {
        otherMedia.push(item);
      }
    });
  };

  // Process each folder; Gallardo is kept separate to display first
  processCarFiles(gallardoFiles, 'gallardo', true);
  processCarFiles(g63Files, 'g63');

  // Shuffle only the non-Gallardo items
  const shuffledOthers = shuffleArray(otherMedia);

  // Combine Gallardo first, then others
  const finalMedia = [...gallardoMedia, ...shuffledOthers];

  if (finalMedia.length === 0) {
    console.warn('No media files found. Check your file paths and directory structure.');
  } else {
    console.log(`Found ${finalMedia.length} media items`);
  }

  return finalMedia;
};

export function Gallery() {
  // Instead of storing a single MediaItem, store the numeric index of the active item
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setAllMedia(processImportedFiles());
  }, []);

  // Prevent background scrolling when a media item is selected
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeIndex]);

  // Helper to navigate left/right within the lightbox
  const showPrev = (e: React.MouseEvent) => {
    // Prevent lightbox close if the user clicks the arrow
    e.stopPropagation();
    if (!allMedia.length || activeIndex === null) return;
    // Wrap around using modulo
    setActiveIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + allMedia.length) % allMedia.length;
    });
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!allMedia.length || activeIndex === null) return;
    setActiveIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % allMedia.length;
    });
  };

  // The currently selected item
  const selectedMedia =
    activeIndex !== null && allMedia[activeIndex] ? allMedia[activeIndex] : null;

  return (
    <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Added Gallery title */}
        {/* <h1 className="text-4xl font-bold text-white text-center mb-8">Gallery</h1> */}

        {/* Unordered Gallery */}
        {allMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allMedia.map((media, index) => (
              <div key={media.id} className="flex flex-col">
                {/* Thumbnail container */}
                <div
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => setActiveIndex(index)}
                >
                  {media.type === 'image' && (
                    <img
                      src={media.url}
                      alt={media.fileName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {media.type === 'video' && (
                    <div className="relative w-full h-full overflow-hidden">
                      <video
                        src={media.url}
                        preload="metadata"
                        muted
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-colors">
                        <Play className="w-12 h-12 text-white" fill="white" />
                      </div>
                    </div>
                  )}

                  {media.type === 'pdf' && (
                    <embed
                      src={media.url}
                      type="application/pdf"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {media.type === 'unknown' && (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-zinc-800 text-white">
                      <span className="text-lg font-semibold">Unknown File</span>
                      <p>{media.fileName}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No images found. Please check the file paths and directory structure.
            </p>
          </div>
        )}

        {/* Lightbox for selected media */}
        {selectedMedia && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setActiveIndex(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(null);
              }}
            >
              <X size={24} />
            </button>

            {/* Left arrow */}
            <button
              onClick={showPrev}
              className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50"
            >
              <ChevronLeft size={40} />
            </button>

            {/* Right arrow */}
            <button
              onClick={showNext}
              className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50"
            >
              <ChevronRight size={40} />
            </button>

            {/* Lightbox content container */}
            <div
              className="relative w-full max-w-5xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              {selectedMedia.type === 'image' && (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.fileName}
                  className="block max-w-full h-auto mx-auto"
                />
              )}

              {selectedMedia.type === 'video' && (
                <video controls autoPlay className="w-full max-h-[90vh]">
                  <source src={selectedMedia.url} />
                  Your browser does not support the video tag.
                </video>
              )}

              {selectedMedia.type === 'pdf' && (
                <embed
                  src={selectedMedia.url}
                  type="application/pdf"
                  className="w-full h-full"
                />
              )}

              {selectedMedia.type === 'unknown' && (
                <div className="w-full h-full bg-black text-white flex flex-col items-center justify-center">
                  <p>Cannot preview this file type in the lightbox.</p>
                  <a
                    href={selectedMedia.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline mt-4"
                  >
                    Open in new tab
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
