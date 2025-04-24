import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface PageLayoutProps {
  title: string;
  intro: string;
  heroImage?: string;
  heroImageClassName?: string; // already added
  children: React.ReactNode;
}

export function PageLayout({
  title,
  intro,
  heroImage = "/images/hero-bg.jpg", // <-- Fixed: use leading slash
  heroImageClassName,
  children,
}: PageLayoutProps) {
  // Add these hooks for parallax effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.7]); // Example: fade out on scroll
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div>
      {/* Hero Section with Background Image */}
      <div className="mt-4 relative h-[500px] w-full overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{ y }}
        >
          {heroImage && (
            <Image
              src={heroImage}
              alt="Hero background"
              fill
              priority
              className={["object-cover brightness-50 scale-105", heroImageClassName].filter(Boolean).join(" ")}
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
        </motion.div>
        
        {/* Content with Fade In Animation */}
        <motion.div 
          className="relative h-full flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto"
          style={{ opacity }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h1>
          <motion.p 
            className="text-xl text-white/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {intro}
          </motion.p>
          
          {/* Scroll Indicator */}
          {mounted && (
            <motion.div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <motion.div 
                  className="w-1 h-3 bg-white/80 rounded-full mt-2"
                  animate={{ 
                    y: [0, 12, 0],
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        {children}
      </div>
    </div>
  );
}
