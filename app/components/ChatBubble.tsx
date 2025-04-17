"use client";

import { motion } from 'framer-motion';

export default function ChatBubble() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Largest outer glow */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-blue-400/10 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.2, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Medium glow */}
      <motion.div
        className="absolute w-56 h-56 rounded-full bg-blue-400/20 blur-lg"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main bubble */}
      <motion.div
        className="relative w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, white, rgb(147, 197, 253), rgb(59, 130, 246))'
        }}
        animate={{
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Shine overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/50 via-transparent to-transparent" />
      </motion.div>
    </div>
  );
}
