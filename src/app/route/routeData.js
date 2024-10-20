// routeData.js
import { MapPin, AlertTriangle, Clock, MapPinned, Leaf, Footprints, ArrowLeftRight, Utensils, Bus, User, Flag } from "lucide-react";
export const initialRoute = [
    { name: "Start", time: "10:00" },
    { name: "Stop 1", time: "10:15" },
    { name: "Stop 2", time: "10:30" },
    { name: "Destination", time: "10:45" },
  ];
  
  export const alternativeRoutes = [
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
  ];
  