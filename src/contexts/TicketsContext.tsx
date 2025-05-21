
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  useTicket: (ticketId: string) => void;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export const TicketsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { events, updateEvent } = useEvents();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Load tickets from local storage on component mount
  useEffect(() => {
    const savedTickets = localStorage.getItem('tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);

  // Save tickets to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Generate a QR code (mock implementation)
  const generateQRCode = (ticketId: string): string => {
    // In a real app, this would generate an actual QR code or use a QR code service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
  };

  const purchaseTicket = async (eventId: string): Promise<Ticket> => {
    if (!user) {
      throw new Error('User must be logged in to purchase a ticket');
    }

    const event = events.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.ticketsSold >= event.ticketLimit) {
      throw new Error('Event is sold out');
    }

    // Create a new ticket
    const ticketId = Math.random().toString(36).substring(2, 15);
    const newTicket: Ticket = {
      id: ticketId,
      eventId,
      userId: user.id,
      purchaseDate: new Date().toISOString(),
      qrCode: generateQRCode(ticketId),
      isUsed: false
    };

    // Update tickets state
    setTickets([...tickets, newTicket]);

    // Update event's ticketsSold count
    updateEvent(eventId, {
      ticketsSold: event.ticketsSold + 1
    });

    return newTicket;
  };

  const getUserTickets = (): Ticket[] => {
    if (!user) return [];
    return tickets.filter(ticket => ticket.userId === user.id);
  };

  const getEventTickets = (eventId: string): Ticket[] => {
    return tickets.filter(ticket => ticket.eventId === eventId);
  };

  const useTicket = (ticketId: string): void => {
    setTickets(
      tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, isUsed: true } : ticket
      )
    );
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
