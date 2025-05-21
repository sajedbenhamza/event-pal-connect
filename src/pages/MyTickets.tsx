
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/contexts/TicketsContext';
import { useEvents } from '@/contexts/EventsContext';
import Layout from '@/components/layout/Layout';
import TicketCard from '@/components/tickets/TicketCard';
import { Ticket, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MyTickets = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { getUserTickets } = useTickets();
  const { events } = useEvents();
  
  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }
  
  const tickets = getUserTickets();
  
  const getEventById = (eventId: string) => {
    return events.find(event => event.id === eventId);
  };
  
  // Separate upcoming and past events
  const now = new Date();
  const { upcoming, past } = tickets.reduce(
    (result, ticket) => {
      const event = getEventById(ticket.eventId);
      if (!event) return result;
      
      const eventDate = new Date(event.date);
      if (eventDate >= now) {
        result.upcoming.push({ ticket, event });
      } else {
        result.past.push({ ticket, event });
      }
      
      return result;
    },
    { upcoming: [] as any[], past: [] as any[] }
  );
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Tickets</h1>
            <p className="text-muted-foreground mt-1">
              View all your event tickets
            </p>
          </div>
        </div>
        
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Ticket className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">No tickets yet</h2>
            <p className="mt-1 text-muted-foreground">
              You haven't purchased any tickets yet.
            </p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Browse Events
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Upcoming events section */}
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 mr-2" />
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
              </div>
              
              {upcoming.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {upcoming.map(({ ticket, event }) => (
                    <TicketCard key={ticket.id} ticket={ticket} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">No upcoming events</p>
                </div>
              )}
            </div>
            
            {/* Past events section */}
            {past.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <Ticket className="h-5 w-5 mr-2" />
                  <h2 className="text-xl font-semibold">Past Events</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {past.map(({ ticket, event }) => (
                    <TicketCard key={ticket.id} ticket={ticket} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTickets;
