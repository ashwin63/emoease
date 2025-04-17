"use client";

import { motion } from 'framer-motion';

export default function ChatBubble() {
  return (
    <div className="relative">
      {/* Outer glow that pulsates */}
      <motion.div
        className="absolute -inset-4 rounded-full blur-2xl bg-blue-400 opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main bubble with subtle pulse */}
      <motion.div 
        className="w-[200px] h-[200px] rounded-full relative z-10"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle at center, #FFFFFF, #93C5FD)'
        }}
      />
    </div>
  );
}
