
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar } from 'lucide-react';
import { useEvents } from '@/contexts/EventsContext';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDistance } from 'date-fns';

const MobileIndex = () => {
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  // Only show approved events
  const approvedEvents = events.filter(event => event.approved);
  
  // Filter events based on search term
  const filteredEvents = approvedEvents.filter(
    event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizerName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const now = new Date();
  
  // Split events by date
  const todayEvents = filteredEvents.filter(
    event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === now.getDate() &&
        eventDate.getMonth() === now.getMonth() &&
        eventDate.getFullYear() === now.getFullYear()
      );
    }
  );
  
  const upcomingEvents = filteredEvents.filter(
    event => {
      const eventDate = new Date(event.date);
      return eventDate > now;
    }
  );
  
  // Sort upcoming events by date (soonest first)
  upcomingEvents.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <MobileLayout>
      {/* Search Section */}
      <div className="bg-gradient-to-r from-primary to-accent p-4">
        <h1 className="text-white text-xl font-bold mb-2">
          Campus Events
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-9 w-full bg-white/90"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === 'upcoming' ? 'border-b-2 border-primary font-medium text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === 'today' ? 'border-b-2 border-primary font-medium text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('today')}
        >
          Today
        </button>
      </div>

      {/* Event Lists */}
      <div className="pb-20">
        {activeTab === 'today' && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Events Today
            </h2>
            
            {todayEvents.length > 0 ? (
              <div className="space-y-4">
                {todayEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No events today</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'upcoming' && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">Upcoming Events</h2>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No upcoming events found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

// Mobile-optimized Event Card
const EventCard = ({ event }: { event: any }) => {
  const eventDate = new Date(event.date);
  const timeUntil = formatDistance(eventDate, new Date(), { addSuffix: true });
  const formattedDate = eventDate.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  
  const formattedTime = eventDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="bg-card rounded-lg overflow-hidden border shadow-sm">
        {event.image && (
          <div className="aspect-[16/9] overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-lg">{event.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {event.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                  {formattedDate} • {formattedTime}
                </span>
                <span className="text-xs text-muted-foreground">
                  {timeUntil}
                </span>
              </div>
            </div>
            <div className="shrink-0 ml-2 text-right">
              <span className="font-medium">
                {event.price > 0 ? `${event.price}€` : 'Gratuit'}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {event.ticketLimit - event.ticketsSold} places
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-muted-foreground">
              {event.location}
            </span>
            <Button size="sm" variant="secondary">
              Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MobileIndex;
