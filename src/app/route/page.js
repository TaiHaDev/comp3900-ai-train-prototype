'use client'

import { useState } from 'react'
import { MapPin, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import VoiceChat from '@/components/VoiceChat'

export default function RoutePage() {
  const [currentStop, setCurrentStop] = useState(0)
  const [showRouteChange, setShowRouteChange] = useState(false)
  const [showAlternatives, setShowAlternatives] = useState(false)

  const route = [
    { name: "Start", time: "10:00" },
    { name: "Stop 1", time: "10:15" },
    { name: "Stop 2", time: "10:30" },
    { name: "Destination", time: "10:45" },
  ]

  const simulateRouteChange = () => {
    setShowRouteChange(true)
    // Here you would typically update the route
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-xl font-bold mb-4">Your Journey</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Current Route</CardTitle>
          <CardDescription>Estimated arrival: {route[route.length - 1].time}</CardDescription>
        </CardHeader>
        <CardContent>
          {route.map((stop, index) => (
            <div key={index} className={`flex items-center mb-2 ${index === currentStop ? 'text-primary font-bold' : ''}`}>
              <MapPin className="mr-2 h-4 w-4" />
              <span>{stop.name} - {stop.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-2 mb-16">
        <Button onClick={simulateRouteChange} className="w-full">Simulate Route Change</Button>
        <Button onClick={() => setShowAlternatives(true)} className="w-full">Show Alternatives</Button>
      </div>

      <Dialog open={showRouteChange} onOpenChange={setShowRouteChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Route Change</DialogTitle>
            <DialogDescription>
              Your route has been updated due to emergency maintenance. A tree has fallen on the tracks.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Route Updated</AlertTitle>
            <AlertDescription>
              We've rerouted you to avoid delays. Your new estimated arrival time is 11:00.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>

      <Dialog open={showAlternatives} onOpenChange={setShowAlternatives}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alternative Routes</DialogTitle>
            <DialogDescription>
              Here are some alternative routes you can take:
            </DialogDescription>
          </DialogHeader>
          <ul className="list-disc pl-5">
            <li>Bus 42 - Arrives at 11:15</li>
            <li>Train A - Arrives at 11:30</li>
            <li>Walk - Arrives at 12:00</li>
          </ul>
        </DialogContent>
      </Dialog>

      <VoiceChat />
    </div>
  )
}