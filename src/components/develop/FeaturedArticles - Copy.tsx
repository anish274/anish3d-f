import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DevelopNote } from '../../lib/developApi';
import { ArticleCard } from './ArticleCard';

interface FeaturedArticlesProps {
  articles: DevelopNote[];
  colorTheme?: string; // <-- Add this line
}

export const FeaturedArticles = ({ articles, colorTheme = "blue" }: FeaturedArticlesProps) => {
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
      className="lg:ml-8 lg:mr-8 md:ml-16 md:mr-16 sm:ml-18 sm:mr-18 mb-12 md:mb-8"
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-100/60 to-blue-200/60 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
        {/* <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-6 md:mb-8">
          Featured Articles
        </h2>
         */}
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl mx-auto"
            >
              <ArticleCard
                article={articles[currentIndex]}
                index={currentIndex}
                isFeatured={true}
                priority={true}
              />
            </motion.div>
          </AnimatePresence>

          {/* If you have a blur/hero effect */}
          <div className="absolute inset-0 blur-2xl bg-blue-400/20 pointer-events-none" />
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 sm:px-4 pointer-events-none">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors pointer-events-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors pointer-events-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </motion.button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div> {/* <-- Add this closing tag */}
    </motion.div>
  );
};