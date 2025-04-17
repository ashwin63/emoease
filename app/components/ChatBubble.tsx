"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from './ChatInterface';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[380px] h-[600px] shadow-2xl rounded-2xl overflow-hidden"
          >
            <ChatInterface onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Multiple pulsating rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full bg-blue-400/20"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut"
            }}
            style={{
              width: '160px',
              height: '160px',
              left: '-20px',
              top: '-20px'
            }}
          />
        ))}

        {/* Main bubble */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-10 bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-full w-32 h-32 flex items-center justify-center shadow-lg shadow-blue-500/50 overflow-hidden"
          style={{
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          
          {/* Inner pulsating circle */}
          <motion.div
            className="absolute inset-4 rounded-full bg-blue-300/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Icon */}
          <motion.div
            animate={{
              scale: isOpen ? [1, 0.9, 1] : [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            )}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
