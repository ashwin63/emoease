"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ChatBubble() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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

        recorder.onstop = async () => {
          console.log('Recording stopped');
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          console.log('Audio blob created:', audioBlob);
          await processAudio(audioBlob);
          setAudioChunks([]);
        };

        setMediaRecorder(recorder);
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    };

    setupMediaRecorder();
  }, []);

  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      console.log('Starting audio processing...');
      
      const formData = new FormData();
      formData.append('audio', audioBlob);

      console.log('Sending audio to API...');
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.responseText) {
        console.log('AI Response:', data.responseText);
        // Use speech synthesis to speak the response
        const utterance = new SpeechSynthesisUtterance(data.responseText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBubbleClick = () => {
    if (!mediaRecorder || isProcessing) return;

    if (isRecording) {
      console.log('Stopping recording...');
      mediaRecorder.stop();
    } else {
      console.log('Starting recording...');
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
          scale: isRecording ? [1, 1.5, 1] : isProcessing ? [1, 1.2, 1] : [1, 1.3, 1],
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
          scale: isRecording ? [1, 1.1, 1] : isProcessing ? [1, 1.03, 1] : [1, 1.05, 1],
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
