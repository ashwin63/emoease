"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ChatBubble() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    // Request microphone permission when component mounts
    const setupMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setAudioChunks(chunks => [...chunks, e.data]);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          // Here you can send the audioBlob to your API
          console.log('Recording stopped, blob created:', audioBlob);
          setAudioChunks([]);
        };

        setMediaRecorder(recorder);
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    };

    setupMediaRecorder();
  }, []);

  const handleBubbleClick = () => {
    if (!mediaRecorder) return;

    if (isRecording) {
      mediaRecorder.stop();
    } else {
      setAudioChunks([]);
      mediaRecorder.start();
    }
    setIsRecording(!isRecording);
  };

  return (
    // Center container
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative cursor-pointer" onClick={handleBubbleClick}>
        {/* Outer glow that pulsates */}
        <motion.div
          className="absolute -inset-4 rounded-full blur-2xl bg-blue-400 opacity-20"
          animate={{
            scale: isRecording ? [1, 1.5, 1] : [1, 1.2, 1],
            opacity: isRecording ? [0.3, 0.1, 0.3] : [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: isRecording ? 1.5 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Main bubble with subtle pulse */}
        <motion.div 
          className="w-[200px] h-[200px] rounded-full relative z-10 flex items-center justify-center"
          animate={{
            scale: isRecording ? [1, 1.1, 1] : [1, 1.05, 1],
          }}
          transition={{
            duration: isRecording ? 1.5 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'radial-gradient(circle at center, #FFFFFF, #93C5FD)'
          }}
        >
          {/* Microphone icon */}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            animate={{
              scale: isRecording ? [1, 1.2, 1] : 1,
              opacity: isRecording ? [1, 0.5, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: isRecording ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0-11V3"
            />
          </motion.svg>
        </motion.div>

        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="text-white flex items-center gap-2">
              <span className="animate-pulse relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span>Recording...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
