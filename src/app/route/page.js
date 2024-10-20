'use client';

import { useState, useEffect } from "react";
import { MapPin, AlertTriangle, Clock, MapPinned, Leaf, Footprints, ArrowLeftRight, Utensils, Bus, User, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { initialRoute, alternativeRoutes } from "./routeData"; // Importing from the data file
const formatDateToUTC = (date) => {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return utcDate.toISOString().split('T')[0];
};
export default function RoutePage() {
  const [currentStop, setCurrentStop] = useState(0);
  const [showRouteChange, setShowRouteChange] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [timePreference, setTimePreference] = useState("departure");
  const [time, setTime] = useState("");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [route, setRoute] = useState(initialRoute);

  // State for all events and filtered events
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventMode, setIsEventMode] = useState(true);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events'); // Adjust this to your API endpoint
        const allEvents = await response.json();

        // Set the events in the state
        setEvents(allEvents);
        console.log(allEvents)

        // Get today's date in UTC format and filter events
        const today = formatDateToUTC(new Date());
        const todaysEvents = allEvents.filter(event => {
          const eventDate = formatDateToUTC(new Date(event.date)); // Ensure event.date is a valid date
          return eventDate === today;
        });
        console.log(todaysEvents)
        setFilteredEvents(todaysEvents); // Set filtered events
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Update the route based on selected event
  const updateRouteFromEvent = () => {
    if (selectedEvent) {
      const newRoute = [
        { name: "Start", time: "10:00" }, // Adjust based on your logic
        { name: selectedEvent.name, time: "10:30" }, // Set the event name and time as needed
        { name: "Destination", time: "11:00" }, // Adjust the destination
      ];

      setRoute(newRoute);
      setShowPlanModal(false); // Close the modal after updating the route
    }
  };

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

  const handleEventChange = (value) => {
    console.log(value)
    const event = filteredEvents.find(e => e.id === value);
    setSelectedEvent(event);
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
              className={`flex items-center mb-2 ${index === currentStop ? "text-primary font-bold" : ""
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
            Open Route Options
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Route Options</DialogTitle>
            <DialogDescription>
              Choose an option to proceed with your route.
            </DialogDescription>
          </DialogHeader>

          {/* Option Selector */}
          <div className="flex justify-between mb-4">
            <Button onClick={() => setIsEventMode(true)} className={`flex-1 ${isEventMode ? "bg-primary text-primary-foreground" : "bg-secondary text-primary-background"}`}>
              Select Event
            </Button>
            <Button onClick={() => setIsEventMode(false)} className={`flex-1 ${!isEventMode ? "bg-primary text-primary-foreground" : "bg-secondary text-primary-background"}`}>
              Plan New Route
            </Button>
          </div>

          {isEventMode ? (
            <div>
              {/* Event Selection */}
              <Select value={selectedEvent?.id || ""} onValueChange={handleEventChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.destination} - {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No events available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              {/* Custom Route Planning */}
              <Input
                placeholder="Start Location"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="w-full mb-2"
              />
              <Input
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full mb-2"
              />
              <div className="flex items-center space-x-4 mb-2">
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
            </div>
          )}

          {/* Common button to confirm selection */}
          <Button onClick={isEventMode ? () => console.log("Event selected:", selectedEvent) : planRoute} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {isEventMode ? "Select Event" : "Plan Route"}
          </Button>
        </DialogContent>
      </Dialog>

      <div className="space-y-2 mb-4">
        <Button onClick={simulateRouteChange} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Clock className="mr-2 h-4 w-4" />
          Simulate Route Change
        </Button>
        <Button onClick={() => setShowAlternatives(true)} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          View Alternative Routes
        </Button>
      </div>
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
              We&apos;ve rerouted you to avoid delays. Your new estimated arrival
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

    </div>
  );
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