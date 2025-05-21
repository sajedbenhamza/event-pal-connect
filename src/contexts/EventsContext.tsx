
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Event {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizerName: string;
  date: string;
  location: string;
  price: number;
  ticketLimit: number;
  ticketsSold: number;
  image?: string;
  approved: boolean;
}

interface EventsContextType {
  events: Event[];
  getEvent: (id: string) => Event | undefined;
  createEvent: (event: Omit<Event, 'id' | 'approved' | 'ticketsSold'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  approveEvent: (id: string) => void;
  rejectEvent: (id: string) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from local storage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Initialize with mock data if no saved events
      const mockEvents = [
        {
          id: '1',
          title: 'End of Year Party',
          description: 'Celebrate the end of the academic year with music, food, and games!',
          organizerId: '2',
          organizerName: 'Student Union',
          date: '2025-06-15T18:00',
          location: 'Main Hall, Student Center',
          price: 15,
          ticketLimit: 200,
          ticketsSold: 157,
          image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
          approved: true
        },
        {
          id: '2',
          title: 'Tech Conference 2025',
          description: 'Join us for a day of inspiring talks from industry leaders and networking opportunities.',
          organizerId: '2',
          organizerName: 'Computer Science Club',
          date: '2025-04-22T09:00',
          location: 'Engineering Building, Auditorium A',
          price: 5,
          ticketLimit: 150,
          ticketsSold: 89,
          image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
          approved: true
        },
        {
          id: '3',
          title: 'Spring Concert',
          description: 'Annual spring concert featuring the university orchestra and choir.',
          organizerId: '2',
          organizerName: 'Music Society',
          date: '2025-05-10T19:30',
          location: 'University Concert Hall',
          price: 8,
          ticketLimit: 300,
          ticketsSold: 216,
          image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae',
          approved: true
        },
        {
          id: '4',
          title: 'Career Fair',
          description: 'Connect with potential employers from various industries.',
          organizerId: '2',
          organizerName: 'Career Services',
          date: '2025-03-18T10:00',
          location: 'Student Center Ballroom',
          price: 0,
          ticketLimit: 500,
          ticketsSold: 342,
          image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2',
          approved: true
        },
        {
          id: '5',
          title: 'Cultural Festival',
          description: 'Experience diverse cultures through food, performances, and exhibitions.',
          organizerId: '2',
          organizerName: 'International Students Association',
          date: '2025-04-05T12:00',
          location: 'University Square',
          price: 10,
          ticketLimit: 400,
          ticketsSold: 287,
          image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
          approved: true
        }
      ];
      setEvents(mockEvents);
      localStorage.setItem('events', JSON.stringify(mockEvents));
    }
  }, []);

  // Save events to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };

  const createEvent = (eventData: Omit<Event, 'id' | 'approved' | 'ticketsSold'>) => {
    if (!user) return;
    
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substring(2, 9),
      approved: user.role === 'admin' ? true : false, // Auto-approve if admin creates it
      ticketsSold: 0
    };
    
    setEvents([...events, newEvent]);
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, ...eventData } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const approveEvent = (id: string) => {
    updateEvent(id, { approved: true });
  };

  const rejectEvent = (id: string) => {
    updateEvent(id, { approved: false });
  };

  return (
    <EventsContext.Provider value={{ 
      events, 
      getEvent, 
      createEvent, 
      updateEvent, 
      deleteEvent,
      approveEvent,
      rejectEvent
    }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
