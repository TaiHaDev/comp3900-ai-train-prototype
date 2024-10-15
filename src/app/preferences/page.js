'use client'

import { useState } from 'react'
import { Toggle } from "@/components/ui/toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from 'next/link'
export default function AIPreferencesPage() {
  const [preferences, setPreferences] = useState({
    usageData: true,
    location: false,
    interests: true,
    communicationStyle: true,
    personalDetails: false,
    appInteractions: true,
    previousConversations: true,
    calendarIntegration: false,
  })
  
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleResetPreferences = () => {
    setPreferences({
      usageData: false,
      location: false,
      interests: false,
      communicationStyle: false,
      personalDetails: false,
      appInteractions: false,
      previousConversations: false,
      calendarIntegration: false,
    })
    setShowResetDialog(false)
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-xl font-bold mb-4">AI Preferences</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Information Preferences</CardTitle>
          <CardDescription>Choose what information the AI can know about you:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PreferenceToggle
              label="Usage Data"
              description="Data about how you use this app to improve your experience."
              enabled={preferences.usageData}
              onToggle={() => handleToggle('usageData')}
            />
            <PreferenceToggle
              label="Location"
              description="Your location to offer localised content and suggestions."
              enabled={preferences.location}
              onToggle={() => handleToggle('location')}
            />
            <PreferenceToggle
              label="Interests"
              description="Your areas of interest to personalise recommendations."
              enabled={preferences.interests}
              onToggle={() => handleToggle('interests')}
            />
            <PreferenceToggle
              label="Communication Style"
              description="Adjust the tone and formality of responses."
              enabled={preferences.communicationStyle}
              onToggle={() => handleToggle('communicationStyle')}
            />
            <PreferenceToggle
              label="Personal Details"
              description="Details like your name or preferences for a more personalised experience."
              enabled={preferences.personalDetails}
              onToggle={() => handleToggle('personalDetails')}
            />
            <PreferenceToggle
              label="App Interactions"
              description="Track interactions within the app to optimise features."
              enabled={preferences.appInteractions}
              onToggle={() => handleToggle('appInteractions')}
            />
            <PreferenceToggle
              label="Previous Conversations"
              description="Store past conversations to maintain context in future chats."
              enabled={preferences.previousConversations}
              onToggle={() => handleToggle('previousConversations')}
            />
            <PreferenceToggle
              label="Calendar Integration"
              description="Allow the AI to access your calendar for scheduling assistance and reminders."
              enabled={preferences.calendarIntegration}
              onToggle={() => handleToggle('calendarIntegration')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2 mb-16">
        <Button onClick={() => setShowResetDialog(true)} className="w-full">Reset Preferences</Button>
      </div>
      <div className="mb-4">
        <Link href="/route">
            <Button className="w-full bg-gray-300">Back to Route</Button> {/* Back button */}
        </Link>
      </div>

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Preferences</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset all preferences? This will disable all options.
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-4 mt-4">
            <Button onClick={handleResetPreferences} className="bg-red-500 text-white">Reset</Button>
            <Button onClick={() => setShowResetDialog(false)} className="bg-gray-300">Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PreferenceToggle({ label, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-bold">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <Toggle 
        pressed={enabled} 
        onPressedChange={onToggle} 
        className={`ml-4 ${enabled ? 'bg-green-400 text-white' : 'bg-gray-300'}`}
      >
        {enabled ? 'On' : 'Off'}
      </Toggle>
    </div>
  )
}
