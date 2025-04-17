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
        {/* Outer pulsating rings */}
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-200 opacity-20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-200 opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />

        {/* Main button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full p-8 shadow-lg w-24 h-24 flex items-center justify-center"
        >
          <motion.div
            animate={{
              scale: isOpen ? [1, 0.9, 1] : [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0-11V3" />
              </svg>
            )}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
