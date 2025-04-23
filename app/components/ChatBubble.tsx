"use client";

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function ChatBubble() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupMediaRecorder = async () => {
      try {
        // Request microphone access
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
          }
        });
        
        // Check if stream is available
        if (!stream) {
          throw new Error('No audio stream available');
        }

        // Create media recorder
        const recorder = new MediaRecorder(stream);
        console.log('MediaRecorder created with mimeType:', recorder.mimeType);
        
        // Handle data available event
        recorder.ondataavailable = (event) => {
          try {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
              console.log('Audio chunk received:', event.data.size, 'bytes');
            }
          } catch (error) {
            console.error('Error in ondataavailable:', error);
          }
        };

        // Handle recording stop
        recorder.onstop = async () => {
          try {
            console.log('Recording stopped, processing chunks...');
            console.log('Number of chunks:', audioChunksRef.current.length);

            if (audioChunksRef.current.length === 0) {
              throw new Error('No audio data collected');
            }

            const audioBlob = new Blob(audioChunksRef.current, { 
              type: recorder.mimeType 
            });

            console.log('Audio blob created:', {
              size: audioBlob.size,
              type: audioBlob.type
            });

            if (audioBlob.size === 0) {
              throw new Error('Created audio blob is empty');
            }

            // Test audio playback
            try {
              const url = URL.createObjectURL(audioBlob);
              const audio = new Audio(url);
              audio.onerror = (e) => console.error('Audio playback error:', e);
              await audio.play();
              console.log('Audio playback started');
            } catch (playError) {
              console.error('Audio playback failed:', playError);
            }

            await processAudio(audioBlob);
          } catch (error) {
            console.error('Error in onstop handler:', error);
          } finally {
            audioChunksRef.current = [];
          }
        };

        setMediaRecorder(recorder);
        console.log('MediaRecorder setup completed');
      } catch (error) {
        console.error('Error in setupMediaRecorder:', error);
      }
    };

    setupMediaRecorder();

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      console.log('Starting audio processing:', {
        blobSize: audioBlob.size,
        blobType: audioBlob.type
      });

      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.responseText) {
        const utterance = new SpeechSynthesisUtterance(data.responseText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error in processAudio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBubbleClick = () => {
    if (!mediaRecorder || isProcessing) {
      console.log('Cannot start/stop recording:', {
        mediaRecorderExists: !!mediaRecorder,
        isProcessing
      });
      return;
    }

    try {
      if (isRecording) {
        console.log('Stopping recording...');
        mediaRecorder.stop();
      } else {
        console.log('Starting recording...');
        audioChunksRef.current = [];
        mediaRecorder.start(100);
      }
      setIsRecording(!isRecording);
    } catch (error) {
      console.error('Error in handleBubbleClick:', error);
    }
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
