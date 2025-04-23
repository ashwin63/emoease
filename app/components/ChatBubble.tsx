"use client";

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function ChatBubble() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const setupMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
          }
        });
        
        const recorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm'
        });
        
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
            console.log('Chunk added:', e.data.size);
          }
        };

        recorder.onstop = async () => {
          console.log('Recording stopped');
          console.log('Number of chunks:', audioChunksRef.current.length);
          
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log('Final blob size:', audioBlob.size);
          
          // Test playback
          const url = URL.createObjectURL(audioBlob);
          const audio = new Audio(url);
          audio.onloadedmetadata = () => {
            console.log('Audio duration:', audio.duration);
          };
          audio.play();

          await processAudio(audioBlob);
          audioChunksRef.current = [];
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
      console.log('Processing audio blob:', audioBlob.size, audioBlob.type);
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error('API request failed');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.responseText) {
        console.log('AI Response:', data.responseText);
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
      audioChunksRef.current = [];
      mediaRecorder.start(100); // Collect data every 100ms
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
          background: isRecording 
            ? 'radial-gradient(circle at center, #FFF, #EF4444)' 
            : 'radial-gradient(circle at center, #FFFFFF, #93C5FD)'
        }}
      />

      {/* Status text */}
      <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 text-white text-sm">
        {isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Click to start'}
      </div>
    </div>
  );
}
