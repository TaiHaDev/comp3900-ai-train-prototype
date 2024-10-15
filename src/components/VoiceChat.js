'use client'

import { useState } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function VoiceChat() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')

  const toggleListening = () => {
    if (isListening) {
      // Stop listening logic here
      setIsListening(false)
      // Simulate AI response
      setTimeout(() => {
        setResponse("I understand you're asking about the next stop. The next stop is Central Station, arriving in 5 minutes.")
      }, 1000)
    } else {
      // Start listening logic here
      setIsListening(true)
      setTranscript('')
      setResponse('')
    }
  }

  return (
    <Card className="fixed bottom-4 left-4 w-64">
      <CardContent className="p-4">
        <Button onClick={toggleListening} className="mb-2">
          {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Button>
        {transcript && <p className="text-sm mb-2">You said: {transcript}</p>}
        {response && <p className="text-sm font-medium">AI: {response}</p>}
      </CardContent>
    </Card>
  )
}
