'use client'

import { useState } from 'react'
import { MapPin, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

  const alternativeRoutes = [
    {
      mode: "Bus 42 to Train A",
      arrivalTime: "11:20",
      description: "Take Bus 42 to Central Station, then transfer to Train A. A bit longer, but avoids the current maintenance issue."
    },
    {
      mode: "Bus 35 + Bus 50",
      arrivalTime: "11:10",
      description: "Take Bus 35 for 15 minutes, then transfer to Bus 50. Total travel time is approximately 1 hour."
    },
    {
      mode: "Walk + Train B",
      arrivalTime: "11:30",
      description: "Walk 10 minutes to the nearest station, then take Train B directly to your destination. A healthy but slightly slower option."
    },
    {
      mode: "Bike Share + Bus 60",
      arrivalTime: "11:25",
      description: "Bike for 5 km to the next bus stop, then take Bus 60. Ideal for a mix of exercise and quicker transit."
    },
    {
      mode: "Bus 15 + Walk",
      arrivalTime: "11:05",
      description: "Take Bus 15, then walk the remaining 1.5 km. A good choice if you don't mind a bit of walking."
    },
  ]

  const simulateRouteChange = () => {
    setShowRouteChange(true)
  }

  const selectAlternativeRoute = (route) => {
    // Simulate setting the new route and updating the arrival time
    setShowAlternatives(false)
    setShowRouteChange(false)
    // Here you can update the state with the new selected route, if needed.
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
          <ul className="list-disc pl-5 space-y-2">
            {alternativeRoutes.map((route, index) => (
              <li 
                key={index} 
                onClick={() => selectAlternativeRoute(route)} 
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <span className="font-bold">{route.mode}</span> - Arrives at {route.arrivalTime}
                <p className="text-sm text-gray-600">{route.description}</p>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      <VoiceChat />
    </div>
  )
}
