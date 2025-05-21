import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
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

  // Helper to normalize event objects
  type RawEvent = Record<string, unknown>;
  const mapEvent = (event: RawEvent): Event => ({
    id: (event._id as string) || (event.id as string),
    title: event.title as string,
    description: event.description as string,
    organizerId: event.organizerId as string,
    organizerName: event.organizerName as string,
    date: event.date as string,
    location: event.location as string,
    price: event.price as number,
    ticketLimit: event.ticketLimit as number,
    ticketsSold: event.ticketsSold as number,
    image: event.image as string | undefined,
    approved: Boolean(event.approved),
  });

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events');
      setEvents(res.data.map(mapEvent));
    } catch (err) {
      // Optionally handle error
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'approved' | 'ticketsSold'>) => {
    try {
      const res = await axios.post('/api/events', eventData);
      setEvents([...events, mapEvent(res.data)]);
    } catch (err) {
      // Optionally handle error
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      await axios.put(`/api/events/${id}`, eventData);
      await fetchEvents(); // fetch latest events after update
    } catch (err) {
      // Optionally handle error
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      // Find the event by id in the local state to get the real MongoDB _id
      const eventToDelete = events.find(event => event.id === id);
      // Use the normalized id (which is always the MongoDB _id)
      const realId = eventToDelete ? eventToDelete.id : id;
      await axios.delete(`/api/events/${realId}`);
      setEvents(events.filter(event => event.id !== realId));
    } catch (err) {
      // Optionally handle error
    }
  };

  const approveEvent = async (id: string) => {
    await updateEvent(id, { approved: true });
    await fetchEvents();
  };

  const rejectEvent = async (id: string) => {
    await updateEvent(id, { approved: false });
    await fetchEvents();
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
