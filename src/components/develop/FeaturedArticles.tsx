import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DevelopNote } from '../../lib/developApi';
import { ArticleCard } from './ArticleCard';

interface FeaturedArticlesProps {
  articles: DevelopNote[];
  colorTheme?: string;
  featuredBadgeColor?: string; // <-- Add this line
}

export const FeaturedArticles = ({
  articles,
  colorTheme,
  featuredBadgeColor, // <-- Add this line
}: FeaturedArticlesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-12 md:mb-8"
    >
      <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/70 shadow-none p-0 md:p-0">
        {/* ^^^ removed overflow-hidden */}
        <div className="relative w-full flex flex-col md:flex-row items-center gap-0 md:gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full ml:mr-16 md:mb-8"
            >
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0">
                  {/* You can add an image or icon here if needed */}
                </div>
                <div className="flex-1">
                  <ArticleCard
                    article={articles[currentIndex]}
                    index={currentIndex}
                    isFeatured={true}
                    priority={true}
                    featuredBadgeColor={featuredBadgeColor}
                    colorTheme={colorTheme} // <-- Pass colorTheme here
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Navigation Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          <button
            onClick={handlePrevious}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center shadow-sm border border-zinc-200 dark:border-zinc-700"
            aria-label="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center shadow-sm border border-zinc-200 dark:border-zinc-700"
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors border border-zinc-300 dark:border-zinc-600 ${
                index === currentIndex ? 'bg-zinc-800 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-700'
              }`}
              aria-label={`Go to featured article ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};