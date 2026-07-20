'use client';

import { ArrowUp, MessageSquare, PhoneCall } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingContact() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
      {/* Floating Support links */}
      <a
        href="https://zalo.me/mock"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
        title="Chat qua Zalo"
      >
        <PhoneCall size={18} />
      </a>
      
      <a
        href="https://m.me/mock"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
        title="Chat qua Messenger"
      >
        <MessageSquare size={18} />
      </a>

      {/* Scroll to Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="p-3 bg-background-card border border-border text-foreground hover:text-accent hover:border-accent rounded-full shadow-premium transition-all flex items-center justify-center cursor-pointer"
            title="Cuộn lên đầu"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
