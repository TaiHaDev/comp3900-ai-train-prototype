'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { useCompletion } from 'ai/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mic, StopCircle, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedSpeechIndicator = ({ isActive }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto">
    <g transform="rotate(-90 50 50)">
      {[0, 1, 2, 3].map((i) => (
        <motion.path
          key={i}
          d={`M50 50 v-${30 + i * 10}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: isActive ? 1 : 0,
            opacity: isActive ? 1 : 0.3,
          }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: "easeInOut",
            repeat: isActive ? Infinity : 0,
            repeatType: "reverse",
          }}
          style={{ transform: `rotate(${i * 30}deg)` }}
        />
      ))}
    </g>
  </svg>
);

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const { complete, completion } = useCompletion();

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const playbackTime = useRef(0);
  const isLastChunkReceived = useRef(false);
  const lastSourceNodeRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      playbackTime.current = audioContextRef.current.currentTime;
    }

    const ws = new WebSocket("ws://localhost:3001/");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'response.audio.delta') {
        console.log("Received audio delta");
        const audioBuffer = base64ToArrayBuffer(data.delta);

        // Process and play the audio chunk immediately
        playAudioChunk(audioBuffer);
      } else if (data.type === 'response.done') {
        console.log("Response done");
        isLastChunkReceived.current = true;

        // Set onended for the last source node to update isSpeaking state
        if (lastSourceNodeRef.current) {
          lastSourceNodeRef.current.onended = () => {
            setIsSpeaking(false);
          };
        }
      }

      console.log("Message from backend:", event.data);
    };

    ws.onclose = () => console.log("Frontend WebSocket closed.");
    wsRef.current = ws;

    // Cleanup on unmount
    // return () => ws.close();
  }, []);

  const base64ToArrayBuffer = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const playAudioChunk = (audioChunkArrayBuffer) => {
    const audioContext = audioContextRef.current;

    // Convert the PCM data to Float32Array
    const pcmData = new DataView(audioChunkArrayBuffer);
    const numSamples = pcmData.byteLength / 2; // Assuming 16-bit PCM
    const float32Data = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      const sample = pcmData.getInt16(i * 2, true); // Little endian
      float32Data[i] = sample / 32768; // Convert to range [-1, 1]
    }

    const sampleRate = 24000; // Adjust sample rate if needed
    const numChannels = 1; // Adjust channels if needed

    // Create an AudioBuffer
    const audioBuffer = audioContext.createBuffer(
      numChannels,
      numSamples,
      sampleRate
    );

    // Set the buffer data
    audioBuffer.copyToChannel(float32Data, 0, 0);

    // Create a buffer source
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    // Ensure playbackTime is not in the past
    playbackTime.current = Math.max(playbackTime.current, audioContext.currentTime);

    // Schedule playback
    source.start(playbackTime.current);

    // Update playbackTime
    const bufferDuration = audioBuffer.duration;
    playbackTime.current += bufferDuration;

    // Keep reference to last source node
    lastSourceNodeRef.current = source;

    // Set isSpeaking to true when playback starts
    setIsSpeaking(true);
  };

  const startListening = useCallback(() => {
    if (typeof window !== 'undefined') {
      setIsListening(true);
      setTranscript('');
      setError(null);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        setIsListening(false);
        handleSpeechInput(speechResult);
        wsRef.current.send(JSON.stringify({ text: speechResult }));
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setError('Failed to recognize speech. Please try again.');
      };

      recognition.start();
    }
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (typeof window !== 'undefined') {
      window.speechRecognition?.abort();
    }
  }, []);

  const handleSpeechInput = useCallback(async (input) => {
    try {
      const response = await complete(input);
      if (response && !isMuted) {
        wsRef.current.send(JSON.stringify({ text: response }));
      }
    } catch (err) {
      console.error('Error getting AI response:', err);
      setError('Failed to get AI response. Please try again.');
    }
  }, [complete, isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  return (
    <div className="container mx-auto p-4 max-w-2xl h-screen flex flex-col">
      <Card className="flex-grow flex flex-col shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <Button variant="ghost" size="icon" aria-label="Go back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle>AI Voice Assistant</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center space-y-6">
          <AnimatedSpeechIndicator isActive={isSpeaking} />
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-red-100 text-red-700 rounded-lg max-w-[80%] text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          {transcript && (
            <div className="mb-4 p-4 bg-muted rounded-lg max-w-[80%]">
              <p className="font-semibold">You said:</p>
              <p>{transcript}</p>
            </div>
          )}
          {completion && (
            <div className="mb-4 p-4 bg-primary text-primary-foreground rounded-lg max-w-[80%]">
              <p className="font-semibold">AI response:</p>
              <p>{completion}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            size="lg"
            className={`rounded-full p-8 transition-all duration-300 ${
              isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
            }`}
            onClick={isListening ? stopListening : startListening}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? <StopCircle className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
