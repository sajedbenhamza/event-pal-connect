
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import { Event } from '@/contexts/EventsContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const timeFromNow = formatDistanceToNow(dateObj, { addSuffix: true });
  const ticketsRemaining = event.ticketLimit - event.ticketsSold;
  const soldOutPercentage = (event.ticketsSold / event.ticketLimit) * 100;
  
  return (
    <div className="ticket-card group">
      <div className="aspect-[4/3] overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-secondary/20 flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
            <p className="text-sm text-muted-foreground">{event.organizerName}</p>
          </div>
          <Badge variant={event.price === 0 ? "outline" : "secondary"}>
            {event.price === 0 ? 'Free' : `$${event.price}`}
          </Badge>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formattedDate} · {formattedTime}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-secondary/30 rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full" 
              style={{ width: `${soldOutPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">
              {ticketsRemaining} tickets left
            </span>
            <span className="text-xs text-muted-foreground">{timeFromNow}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <Button asChild className="w-full">
            <Link to={`/events/${event.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
      
      <div className="ticket-overlay">
        <Button asChild variant="secondary" size="lg" className="shadow-lg">
          <Link to={`/events/${event.id}`}>View Event</Link>
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
