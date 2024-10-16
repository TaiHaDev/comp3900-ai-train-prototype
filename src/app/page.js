'use client'

import { useState } from 'react'
import { Bus, Train, Bike, Car,Ship, MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from 'next/link'

export default function PreferencesPage() {
  const [selectedModes, setSelectedModes] = useState([])
  const [routePreference, setRoutePreference] = useState('')

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
            className="w-full"
          >
            <Bus className="mr-2 h-4 w-4" /> Bus
          </Button>
          <Button 
            variant={selectedModes.includes('train') ? "default" : "outline"}
            onClick={() => toggleMode('train')}
            className="w-full"
          >
            <Train className="mr-2 h-4 w-4" /> Train
          </Button>
          <Button 
            variant={selectedModes.includes('bike') ? "default" : "outline"}
            onClick={() => toggleMode('bike')}
            className="w-full"
          >
            <Bike className="mr-2 h-4 w-4" /> Bike
          </Button>
          <Button 
            variant={selectedModes.includes('car') ? "default" : "outline"}
            onClick={() => toggleMode('car')}
            className="w-full"
          >
            <Ship className="mr-2 h-4 w-4" /> Ferry
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Route Preference</CardTitle>
          <CardDescription>Choose your preferred route type</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={setRoutePreference} value={routePreference}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="fastest" id="fastest" />
              <Label htmlFor="fastest">Fastest Route</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="leastTransfers" id="leastTransfers" />
              <Label htmlFor="leastTransfers">Least Transfers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="scenic" id="scenic" />
              <Label htmlFor="scenic">Scenic Route</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

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