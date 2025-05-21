
import React from 'react';
import { format } from 'date-fns';
import { Ticket } from '@/contexts/TicketsContext';
import { Event } from '@/contexts/EventsContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  event: Event;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, event }) => {
  const formattedDate = format(new Date(event.date), 'EEE, MMM d, yyyy');
  const formattedTime = format(new Date(event.date), 'h:mm a');

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-secondary/20 flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h3 className="font-bold text-xl drop-shadow-md">{event.title}</h3>
          <p className="text-sm opacity-90">{event.organizerName}</p>
        </div>
        {ticket.isUsed && (
          <div className="absolute top-0 right-0 m-3">
            <Badge variant="destructive">Used</Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Ticket #{ticket.id.substring(0, 8)}</span>
          {event.price === 0 ? (
            <Badge variant="outline">Free</Badge>
          ) : (
            <Badge>${event.price}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2 pb-2">
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{formattedDate} at {formattedTime}</span>
        </div>
        <div className="flex items-center text-sm">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{event.location}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t">
        <div className="w-full">
          <p className="text-xs text-muted-foreground mb-2">QR Code</p>
          <div className="bg-white p-2 rounded-lg inline-block">
            <img 
              src={ticket.qrCode} 
              alt="Ticket QR Code"
              className="w-32 h-32 mx-auto"
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
