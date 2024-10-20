'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({ time: '', destination: '' });

  // Format date to 'YYYY-MM-DD'
  const formatDateToUTC = (date) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    return utcDate.toISOString().split('T')[0];
  };

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (value) => {
    setDate(value);
    const selectedDate = formatDateToUTC(value);
    const eventsOnSelectedDate = events.filter(
      (event) => event.date === selectedDate
    );
    setFilteredEvents(eventsOnSelectedDate);
    // setShowEventDialog(eventsOnSelectedDate.length > 0);
  };

  const handleAddEvent = async () => {
    const formattedDate = formatDateToUTC(date);
    const eventToAdd = { ...newEvent, date: formattedDate };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventToAdd),
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events); // Update events with the latest list from the server
        setShowAddEventDialog(false);
        setNewEvent({ time: '', destination: '' }); // Reset form
      } else {
        console.error('Failed to add event');
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-primary">Calendar</h1>

      <Calendar
        onChange={setDate}
        value={date}
        onClickDay={handleDateClick}
      />

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Events for {formatDateToUTC(date)}</h2>
        {filteredEvents.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {filteredEvents.map((event, index) => (
              <li key={index} className="p-2 border rounded shadow">
                <p>Time: {event.time}</p>
                <p>Destination: {event.destination}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground mt-2">No events scheduled for this date.</p>
        )}
      </div>

      <Button
        onClick={() => setShowAddEventDialog(true)}
        className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Add Event
      </Button>

      {/* Add Event Dialog */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent className="bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              placeholder="Event Time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Event Destination"
              value={newEvent.destination}
              onChange={(e) => setNewEvent({ ...newEvent, destination: e.target.value })}
              className="p-2 border rounded"
            />
            <Button
              onClick={handleAddEvent}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>
              {filteredEvents.length > 0 ? `Events on ${formatDateToUTC(date)}` : "No Event"}
            </DialogTitle>
            <div>
              {filteredEvents.map((event, index) => (
                <div key={index}>
                  <p>Time: {event.time}</p>
                  <p>Destination: {event.destination}</p>
                </div>
              ))}
            </div>
          </DialogHeader>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => setShowEventDialog(false)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
