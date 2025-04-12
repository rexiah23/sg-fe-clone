import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// If you want to use the Hero.module.css, import it here:
// import styles from './Hero.module.css';

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
}

// Memoize FeatureItem to prevent unnecessary re-renders
const FeatureItem = memo(({ icon, text }: FeatureItemProps) => (
  <li className="flex items-center">
    {typeof icon === 'string' ? (
      <span className="mr-2 sm:mr-5 text-xl sm:text-2xl md:text-3xl">{icon}</span>
    ) : (
      React.cloneElement(icon as React.ReactElement, {
        className: 'mr-2 sm:mr-5 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10',
      })
    )}
    <span className="text-base sm:text-lg md:text-xl">{text}</span>
  </li>
));

FeatureItem.displayName = 'FeatureItem';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  
  // Add background color to show before video loads
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // Memoize navigation function to prevent unnecessary re-renders
  const handleNavigateToInventory = useCallback(() => {
    navigate('/listings');
  }, [navigate]);

  const handleNavigateToReturnPolicy = useCallback(() => {
    navigate('/return-policy');
  }, [navigate]);

  // Simplified video loading approach that prioritizes playback
  useEffect(() => {
    let isMounted = true;
    
    // Set a timeout to hide the placeholder even if video takes too long
    const videoTimeout = window.setTimeout(() => {
      if (isMounted) {
        setShowPlaceholder(false);
      }
    }, 2000);
    
    // Function to attempt playing the video with retry logic
    const attemptVideoPlay = () => {
      if (videoRef.current && isMounted) {
        // Ensure video is muted for autoplay compatibility
        videoRef.current.muted = true;
        
        // Attempt to play the video
        videoRef.current.play()
          .then(() => {
            if (isMounted) {
              console.log('Video playback started successfully');
            }
          })
          .catch((error) => {
            console.error('Video autoplay prevented:', error);
            
            if (isMounted) {
              // If autoplay fails, we'll try one more time after user interaction
              const handleUserInteraction = () => {
                if (videoRef.current) {
                  videoRef.current.play()
                    .catch(e => console.error('Video play failed after user interaction:', e));
                }
                // Remove the event listeners after attempting to play
                document.removeEventListener('click', handleUserInteraction);
                document.removeEventListener('touchstart', handleUserInteraction);
              };
              
              // Add event listeners for user interaction
              document.addEventListener('click', handleUserInteraction, { once: true });
              document.addEventListener('touchstart', handleUserInteraction, { once: true });
              
              // Show error state only if completely fails
              if (error.name === 'NotSupportedError') {
                setIsVideoError(true);
                setShowPlaceholder(false);
              }
            }
          });
      }
    };
    
    // Start attempting to play as soon as possible
    if (videoRef.current) {
      if (videoRef.current.readyState >= 2) {
        // If video data is already loaded, play immediately
        attemptVideoPlay();
      } else {
        // If not loaded, set up the loadeddata event to play when ready
        videoRef.current.addEventListener('loadeddata', attemptVideoPlay);
      }
    }
    
    return () => {
      isMounted = false;
      clearTimeout(videoTimeout);
      
      // Clean up event listener
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', attemptVideoPlay);
      }
    };
  }, []);

  // Predefine animation variants to reduce JS processing time during animation
  const contentAnimationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Create a memoized list of features to prevent re-renders
  const featuresList = React.useMemo(() => [
    { icon: <CheckCircle color="#10B981" />, text: "Inspected" },
    { icon: <CheckCircle color="#10B981" />, text: "Custom Cleared" },
    { icon: <CheckCircle color="#10B981" />, text: "Safety Ready" },
    { icon: <CheckCircle color="#10B981" />, text: "Delivered To Your Door" }
  ], []);

  return (
    <div
      /* If using Hero.module.css, do: className={styles.hero} */
      className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center text-white overflow-hidden"
    >
      {/* Background Placeholder (shown while video loads) */}
      {showPlaceholder && (
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
      )}
      
      {/* Background Video */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${isVideoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => {
          setIsVideoLoaded(true);
          setTimeout(() => setShowPlaceholder(false), 100);
        }}
        onError={() => {
          setIsVideoError(true);
          setShowPlaceholder(false);
        }}
      >
        {/* IMPORTANT: Just use /hero.mp4 in Vite if the file is in public/hero.mp4 */}
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay (or use styles.overlay from Hero.module.css) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

      {/* Content */}
      <motion.div
        /* If using Hero.module.css, do: className={styles.content} */
        variants={contentAnimationVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 w-full max-w-7xl mx-auto mt-4 sm:mt-8 mb-4 sm:mb-8"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-extrabold uppercase leading-tight mb-2 sm:mb-4 md:mb-7 break-words whitespace-normal">
          Quality Supercars
          <span className="block text-yellow-400">Delivered to YOur Doorstep</span>
        </h1>

        <p className="text-base sm:text-lg md:text-2xl font-semibold mt-2 sm:mt-4 mb-2 sm:mb-4">
          Imported from 🇰🇷 South Korea &rarr; 🇨🇦 Canada.
        </p>

        <div className="w-full max-w-xl mb-2 sm:mb-4 md:mb-8">
          <ul className="flex flex-col items-start gap-2 sm:gap-4 text-sm sm:text-base md:text-xl text-white">
            {featuresList.map((feature, index) => (
              <FeatureItem key={index} icon={feature.icon} text={feature.text} />
            ))}
          </ul>
        </div>

        <p className="text-base sm:text-lg md:text-2xl text-yellow-300 font-bold mt-2 sm:mt-4 mb-2 sm:mb-4">
          3-Day Return Policy.{' '}
          <span 
            className="underline cursor-pointer" 
            onClick={handleNavigateToReturnPolicy}
          >
            Learn more
          </span>
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-2 sm:mt-4 md:mt-8 px-4 sm:px-6 md:px-10 py-2 sm:py-3 bg-yellow-400 text-black text-base sm:text-lg md:text-2xl font-bold rounded-full flex items-center transition-colors hover:bg-yellow-300"
          onClick={handleNavigateToInventory}
        >
          View Inventory
          <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </motion.button>
      </motion.div>
    </div>
  );
};

// Export as memoized component to prevent unnecessary re-renders
export default memo(Hero);
