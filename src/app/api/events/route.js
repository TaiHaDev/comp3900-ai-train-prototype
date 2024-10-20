import { NextResponse } from 'next/server';
var events = [
    {
      "date": "2024-10-21",
      "time": "10:00 AM",
      "destination": "Location A"
    },
    {
      "date": "2024-10-22",
      "time": "2:00 PM",
      "destination": "Location B"
    },
    {
      "date": "2024-10-20",
      "time": "2:00 PM",
      "destination": "Location C"
    },
  ]
  
export async function GET() {
      return NextResponse.json(events);
}

// Handle POST requests (adding new events)
export async function POST(request) {
    try {
      const newEvent = await request.json();
      if (newEvent.date && newEvent.time && newEvent.destination) {
        events.push(newEvent);
        return NextResponse.json({ message: 'Event added successfully!', events }, { status: 201 });
      } else {
        return NextResponse.json({ message: 'Invalid event data' }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ message: 'Error adding event', error: error.message }, { status: 500 });
    }
  }