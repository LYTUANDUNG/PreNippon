'use client';

import { Banner } from '../types/common';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Countdown from './Countdown';

interface BannerSliderProps {
  banners: Banner[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [current, setCurrent] = useState(0);

  const activeBanners = banners.filter((b) => b.isActive);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeBanners.length);
    }, 6000); // Auto-slide every 6 seconds
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const slide = activeBanners[current];

  return (
    <div className="relative w-full h-[65vh] min-h-[400px] overflow-hidden bg-black border-b border-border group">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
          
          {/* Banner background image */}
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
          />

          {/* Banner Text Contents */}
          <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-xl md:max-w-2xl text-left pointer-events-none">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-4"
            >
              {slide.badgeText && (
                <span className="inline-block bg-accent px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white rounded-sm">
                  {slide.badgeText}
                </span>
              )}
              
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight">
                {slide.title}
              </h1>

              {slide.type === 'COUNTDOWN' && slide.countdownTarget && (
                <div className="flex items-center gap-2 border border-accent/30 bg-accent-muted/10 p-3 rounded-custom max-w-sm pointer-events-auto">
                  <Countdown targetDate={slide.countdownTarget} showLabels />
                </div>
              )}

              <div className="pt-4 pointer-events-auto">
                <Link
                  href={slide.linkUrl}
                  className="inline-flex items-center justify-center bg-white hover:bg-accent text-black hover:text-white px-6 py-3 rounded-custom font-extrabold text-xs uppercase tracking-wider transition-all duration-200"
                >
                  {slide.buttonText || 'Mua Ngay'}
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-zinc-950/70 border border-border text-foreground hover:text-accent hover:border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-zinc-950/70 border border-border text-foreground hover:text-accent hover:border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Slider dots indicators */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                current === idx ? 'bg-accent w-6' : 'bg-foreground-muted/30 hover:bg-foreground-muted'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
