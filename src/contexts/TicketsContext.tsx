import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useEvents, Event } from './EventsContext';

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  purchaseDate: string;
  qrCode: string;
  isUsed: boolean;
}

interface TicketsContextType {
  tickets: Ticket[];
  purchaseTicket: (eventId: string) => Promise<Ticket>;
  getUserTickets: () => Ticket[];
  getEventTickets: (eventId: string) => Ticket[];
  useTicket: (ticketId: string) => Promise<void>;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export const TicketsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { events, updateEvent } = useEvents();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Load tickets from backend API on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`/api/tickets/user/${user.id}`);
        setTickets(res.data);
      } catch (err) {
        setTickets([]);
      }
    };
    fetchTickets();
  }, [user]);

  // Generate a QR code (mock implementation)
  const generateQRCode = (ticketId: string): string => {
    // In a real app, this would generate an actual QR code or use a QR code service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
  };

  const purchaseTicket = async (eventId: string): Promise<Ticket> => {
    if (!user) throw new Error('User must be logged in to purchase a ticket');
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');
    if (event.ticketsSold >= event.ticketLimit) throw new Error('Event is sold out');
    const ticketData = {
      eventId,
      userId: user.id,
      purchaseDate: new Date().toISOString(),
      qrCode: generateQRCode(eventId + user.id + Date.now()),
      isUsed: false
    };
    try {
      const res = await axios.post('/api/tickets', ticketData);
      setTickets([...tickets, res.data]);
      await updateEvent(eventId, { ticketsSold: event.ticketsSold + 1 });
      return res.data;
    } catch (err) {
      throw new Error('Ticket purchase failed');
    }
  };

  const getUserTickets = (): Ticket[] => {
    if (!user) return [];
    return tickets.filter(ticket => ticket.userId === user.id);
  };

  const getEventTickets = (eventId: string): Ticket[] => {
    return tickets.filter(ticket => ticket.eventId === eventId);
  };

  const useTicket = async (ticketId: string): Promise<void> => {
    try {
      const res = await axios.put(`/api/tickets/${ticketId}/use`);
      setTickets(tickets.map(ticket => ticket.id === ticketId ? res.data : ticket));
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <TicketsContext.Provider value={{ 
      tickets, 
      purchaseTicket, 
      getUserTickets, 
      getEventTickets,
      useTicket 
    }}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketsProvider');
  }
  return context;
};
