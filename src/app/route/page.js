'use client'

import { useState } from "react"
import { MapPin, AlertTriangle, Clock, MapPinned } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VoiceChat from "@/components/VoiceChat"

export default function RoutePage() {
  const [currentStop, setCurrentStop] = useState(0)
  const [showRouteChange, setShowRouteChange] = useState(false)
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [startLocation, setStartLocation] = useState("")
  const [destination, setDestination] = useState("")
  const [timePreference, setTimePreference] = useState("departure")
  const [time, setTime] = useState("")
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [route, setRoute] = useState([
    { name: "Start", time: "10:00" },
    { name: "Stop 1", time: "10:15" },
    { name: "Stop 2", time: "10:30" },
    { name: "Destination", time: "10:45" },
  ])

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
      description: "Take Bus 15, then walk the remaining 1.5 km. A good choice if you don&apost mind a bit of walking."
    },
  ]

  const simulateRouteChange = () => {
    // Simulate a change in the route due to maintenance or other issues
    const updatedRoute = [
      { name: startLocation || "Start", time: route[0].time },
      { name: "Detour Stop 1", time: addMinutes(route[0].time, 20) }, // Adds 20 minutes for detour
      { name: "Detour Stop 2", time: addMinutes(route[0].time, 40) }, // Adds more time for detour
      { name: destination || "Destination", time: addMinutes(route[0].time, 60) }, // Final time at the destination
    ];
  
    setRoute(updatedRoute);
    setShowRouteChange(true);
  };

  const selectAlternativeRoute = (route) => {
    setShowAlternatives(false)
    setShowRouteChange(false)
  }

  const planRoute = () => {
    // Define time estimation for stops (e.g., 15 minutes per stop as a placeholder)
    const timeGap = 15; // 15 minutes between stops for simplicity
  
    // Calculate the time for each stop based on the departure time or ASAP
    let currentTime = time === "asap" ? "10:00" : time; // Default to 10:00 for "ASAP"
    const newRoute = [
      { name: startLocation, time: currentTime },
      { name: "Transfer Stop 1", time: addMinutes(currentTime, timeGap) },
      { name: "Transfer Stop 2", time: addMinutes(currentTime, timeGap * 2) },
      { name: destination, time: addMinutes(currentTime, timeGap * 3) },
    ];
  
    setRoute(newRoute);
    setShowPlanModal(false);
  };
  
  // Helper function to add minutes to a time string (HH:mm format)
  const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(":").map(Number);
    const newMinutes = mins + minutes;
    const newHours = hours + Math.floor(newMinutes / 60);
    const remainingMinutes = newMinutes % 60;
    return `${String(newHours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-xl font-bold mb-4">Your Journey</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Current Route</CardTitle>
          <CardDescription>
            {startLocation ? `From ${startLocation} to ${destination}` : "Plan your route"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {route.map((stop, index) => (
            <div
              key={index}
              className={`flex items-center mb-2 ${
                index === currentStop ? "text-primary font-bold" : ""
              }`}
            >
              <MapPin className="mr-2 h-4 w-4" />
              <span>
                {stop.name} - {stop.time}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogTrigger asChild>
          <Button className="w-full mb-2">
            <MapPinned className="mr-2 h-4 w-4" />
            Plan Your Route
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plan Your Route</DialogTitle>
            <DialogDescription>
              Enter your start and destination locations, and preferred time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Start Location"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full"
            />
            <div className="flex items-center space-x-4">
              <Select
                value={timePreference}
                onValueChange={(value) => setTimePreference(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="departure">Leave At</SelectItem>
                  <SelectItem value="arrival">Arrive By</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="time"
                value={time === "asap" ? "" : time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="As Soon As Possible"
                className="flex-1"
                disabled={time === "asap"}
              />
              <Button
                onClick={() => time === "asap" ? setTime("") : setTime("asap")}
                variant={time === "asap" ? "default" : "outline"}
              >
                ASAP
              </Button>
            </div>
            <Button onClick={planRoute} className="w-full">
              Plan Route
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-2 mb-16">
        <Button onClick={simulateRouteChange} className="w-full">
          <Clock className="mr-2 h-4 w-4" />
          Simulate Route Change
        </Button>
        <Button onClick={() => setShowAlternatives(true)} className="w-full">
          Show Alternatives
        </Button>
      </div>

      <Dialog open={showRouteChange} onOpenChange={setShowRouteChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Route Change</DialogTitle>
            <DialogDescription>
              Your route has been updated due to emergency maintenance. A tree
              has fallen on the tracks.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Route Updated</AlertTitle>
            <AlertDescription>
              We&aposve rerouted you to avoid delays. Your new estimated arrival
              time is 11:00.
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
                <span className="font-bold">{route.mode}</span> - Arrives at{" "}
                {route.arrivalTime}
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