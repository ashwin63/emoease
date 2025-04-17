"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ChatBubble() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
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
    <div className="relative cursor-pointer" onClick={handleBubbleClick}>
      {/* Outer glow that pulsates */}
      <motion.div
        className="absolute -inset-8 rounded-full blur-3xl bg-blue-400 opacity-20"
        animate={{
          scale: isRecording ? [1, 1.5, 1] : [1, 1.3, 1],
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
        className="w-[200px] h-[200px] rounded-full relative z-10"
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
      />
    </div>
  );
}
