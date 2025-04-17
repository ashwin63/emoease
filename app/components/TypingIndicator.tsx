"use client";

import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-lg p-3 flex space-x-1">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{
              y: ["0%", "-50%", "0%"],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: dot * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}
