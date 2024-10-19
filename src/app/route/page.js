'use client'

import { useState } from "react"
import { MapPin, AlertTriangle, Clock, MapPinned, Leaf, Footprints, ArrowLeftRight, Utensils, Bus, User, Flag } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
      description: "Take Bus 42 to Central Station, then transfer to Train A. A bit longer, but avoids the current maintenance issue.",
      preference: "eco",
      icon: <Leaf className="h-4 w-4 text-green-500" />,
    },
    {
      mode: "Bus 35 + Bus 50",
      arrivalTime: "11:10",
      description: "Take Bus 35 for 15 minutes, then transfer to Bus 50. Total travel time is approximately 1 hour.",
      preference: "fast",
      icon: <Clock className="h-4 w-4 text-blue-500" />,
    },
    {
      mode: "Walk + Train B",
      arrivalTime: "11:30",
      description: "Walk 10 minutes to the nearest station, then take Train B directly to your destination. A healthy but slightly slower option.",
      preference: "walking",
      icon: <Footprints className="h-4 w-4 text-purple-500" />,
    },
    {
      mode: "Bike Share + Bus 60",
      arrivalTime: "11:25",
      description: "Bike for 5 km to the next bus stop, then take Bus 60. Ideal for a mix of exercise and quicker transit.",
      preference: "eco",
      icon: <Leaf className="h-4 w-4 text-green-500" />,
    },
    {
      mode: "Bus 15 + Walk + Food Stop",
      arrivalTime: "11:05",
      description: "Take Bus 15, then walk the remaining 1.5 km. Includes a stop at a highly-rated restaurant on the way.",
      preference: "food",
      icon: <Utensils className="h-4 w-4 text-orange-500" />,
    },
  ]

  const simulateRouteChange = () => {
    const updatedRoute = [
      { name: startLocation || "Start", time: route[0].time },
      { name: "Detour Stop 1", time: addMinutes(route[0].time, 20) },
      { name: "Detour Stop 2", time: addMinutes(route[0].time, 40) },
      { name: destination || "Destination", time: addMinutes(route[0].time, 60) },
    ];
  
    setRoute(updatedRoute);
    setShowRouteChange(true);
  };

  const selectAlternativeRoute = (route) => {
    setShowAlternatives(false)
    setShowRouteChange(false)
  }

  const planRoute = () => {
    const timeGap = 15;
    let currentTime = time === "asap" ? "10:00" : time;
    const newRoute = [
      { name: startLocation, time: currentTime },
      { name: "Transfer Stop 1", time: addMinutes(currentTime, timeGap) },
      { name: "Transfer Stop 2", time: addMinutes(currentTime, timeGap * 2) },
      { name: destination, time: addMinutes(currentTime, timeGap * 3) },
    ];
  
    setRoute(newRoute);
    setShowPlanModal(false);
  };
  
  const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(":").map(Number);
    const newMinutes = mins + minutes;
    const newHours = hours + Math.floor(newMinutes / 60);
    const remainingMinutes = newMinutes % 60;
    return `${String(newHours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-primary">Your Journey</h1>

      <Card className="mb-4 bg-card text-card-foreground">
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
          <Button className="w-full mb-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <MapPinned className="mr-2 h-4 w-4" />
            Plan Your Route
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-background text-foreground">
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
            <Button onClick={planRoute} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Plan Route
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-2 mb-4">
        <Button onClick={simulateRouteChange} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Clock className="mr-2 h-4 w-4" />
          Simulate Route Change
        </Button>
        <Button onClick={() => setShowAlternatives(true)} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          Show Alternatives
        </Button>
      </div>

      <Card className="mb-4 bg-card text-card-foreground">
  <CardHeader>
    <CardTitle className="text-lg">Route Map</CardTitle>
    <CardDescription>
      Estimated bus arrival: 5 minutes
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Simplified road network */}
        <path d="M10,50 H90" stroke="#CBD5E0" strokeWidth="2" />
        <path d="M50,10 V90" stroke="#CBD5E0" strokeWidth="2" />
        
        {/* Bus marker */}
        <g transform="translate(20,50)">
          <circle cx="0" cy="0" r="3" fill="#3182CE" />
          <Bus size={16} className="text-blue-500" />
          <text x="0" y="20" fontSize="4" fill="#4A5568" textAnchor="middle">Bus (5 min away)</text> {/* Centered label */}
        </g>
        
        {/* User marker */}
        <g transform="translate(50,50)">
          <circle cx="0" cy="0" r="3" fill="#48BB78" />
          <User size={16} className="text-green-500" />
          <text x="0" y="20" fontSize="4" fill="#4A5568" textAnchor="middle">You are here</text> {/* Centered label */}
        </g>
        
        {/* Destination marker */}
        <g transform="translate(80,50)">
          <circle cx="0" cy="0" r="3" fill="#ED8936" />
          <Flag size={16} className="text-orange-500" />
          <text x="0" y="20" fontSize="4" fill="#4A5568" textAnchor="middle">Destination</text> {/* Centered label */}
        </g>
      </svg>
    </div>
  </CardContent>
</Card>


      <Dialog open={showRouteChange} onOpenChange={setShowRouteChange}>
        <DialogContent className="bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Route Change</DialogTitle>
            <DialogDescription>
              Your route has been updated due to emergency maintenance. A tree
              has fallen on the tracks.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Route Updated</AlertTitle>
            <AlertDescription>
              We've rerouted you to avoid delays. Your new estimated arrival
              time is 11:00.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>

      <Dialog open={showAlternatives} onOpenChange={setShowAlternatives}>
        <DialogContent className="bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Alternative Routes</DialogTitle>
            <DialogDescription>
              Here are some alternative routes you can take:
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2">
            {alternativeRoutes.map((route, index) => (
              <li
                key={index}
                onClick={() => selectAlternativeRoute(route)}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 rounded"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{route.mode}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="ml-2">
                          {route.icon}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getPreferenceDescription(route.preference)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p>Arrives at {route.arrivalTime}</p>
                <p className="text-sm text-muted-foreground">{route.description}</p>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

    </div>
  )
}

function getPreferenceDescription(preference) {
  switch (preference) {
    case 'eco':
      return 'Eco-friendly option'
    case 'fast':
      return 'Fastest route'
    case 'walking':
      return 'Includes more walking'
    case 'food':
      return 'Includes a food stop'
    default:
      return 'Route option'
  }
}