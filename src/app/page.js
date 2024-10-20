'use client'

import { useState } from 'react'
import { Bus, Train, Bike, Car, Ship, MessageSquare, DollarSign, Eye, Leaf, Clock, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from 'next/link'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';



export default function PreferencesPage() {
  const [selectedModes, setSelectedModes] = useState([])
 

  const toggleMode = (mode) => {
    setSelectedModes(prev => 
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-xl font-bold mb-4">Set Your Travel Preferences</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Preferred Transport Modes</CardTitle>
          <CardDescription>Select all that apply</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
        <Button 
            variant={selectedModes.includes('bus') ? "default" : "outline"}
            onClick={() => toggleMode('bus')}
            className={`w-full ${selectedModes.includes('bus') ? 'bg-yellow-400' : 'bg-yellow-100'} hover:bg-yellow-300 text-black`}
          >
            <Bus className="mr-2 h-4 w-4" /> Bus
          </Button>
          <Button 
            variant={selectedModes.includes('train') ? "default" : "outline"}
            onClick={() => toggleMode('train')}
            className={`w-full ${selectedModes.includes('train') ? 'bg-blue-500' : 'bg-blue-100'} hover:bg-blue-400 text-black`}
          >
            <Train className="mr-2 h-4 w-4" /> Train
          </Button>
          <Button 
            variant={selectedModes.includes('bike') ? "default" : "outline"}
            onClick={() => toggleMode('bike')}
            className={`w-full ${selectedModes.includes('bike') ? 'bg-green-500' : 'bg-green-100'} hover:bg-green-400 text-black`}
          >
            <Bike className="mr-2 h-4 w-4" /> Bike
          </Button>
          <Button 
            variant={selectedModes.includes('ferry') ? "default" : "outline"}
            onClick={() => toggleMode('ferry')}
            className={`w-full ${selectedModes.includes('ferry') ? 'bg-red-500' : 'bg-red-100'} hover:bg-red-400 text-black`}
          >
            <Ship className="mr-2 h-4 w-4" /> Ferry
          </Button>
        </CardContent>
      </Card>

      <RoutePreferenceCard/>

      <CardFooter className="flex flex-col space-y-2">
        <Link href="/route" className="w-full">
          <Button className="w-full">Start Journey</Button>
        </Link>
        <Link href="/ai-assistant" className="w-full">
          <Button variant="outline" className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            Talk to AI Assistant
          </Button>
        </Link>
      </CardFooter>

    </div>
  )
}

function RoutePreferenceCard() {
  const [routePreferences, setRoutePreferences] = useState([
    { id: "1", value: 'fastest', label: 'Fastest Route', icon: <Clock className="mr-2 h-4 w-4" />, bgColor: 'bg-yellow-200', textColor: 'text-black' },
    { id: "2", value: 'leastTransfers', label: 'Least Transfers', icon: <ArrowRight className="mr-2 h-4 w-4" />, bgColor: 'bg-blue-200', textColor: 'text-black' },
    { id: "3", value: 'scenic', label: 'Scenic Route', icon: <Eye className="mr-2 h-4 w-4" />, bgColor: 'bg-green-200', textColor: 'text-black' },
    { id: "4", value: 'cheap', label: 'Cheapest Route', icon: <DollarSign className="mr-2 h-4 w-4" />, bgColor: 'bg-red-200', textColor: 'text-black' },
    { id: "5", value: 'eco', label: 'Eco-Friendliest Route', icon: <Leaf className="mr-2 h-4 w-4" />, bgColor: 'bg-teal-200', textColor: 'text-black' },
  ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
  
    const items = Array.from(routePreferences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRoutePreferences(items);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Route Preference</CardTitle>
        <CardDescription>Drag to reorder your route preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="routePreferences">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="droppable">
                {routePreferences.map((item, index) => (
                  <Draggable key={item.value} draggableId={item.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center justify-between mb-2 p-2 rounded shadow hover:bg-gray-200 ${item.bgColor}`}
                      >
                        <div className={`flex items-center ${item.textColor}`}>
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        <span className={`${item.textColor}`}>{index + 1}</span>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
}