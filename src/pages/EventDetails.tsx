
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, MapPin, User, AlertCircle } from 'lucide-react';
import { useEvents } from '@/contexts/EventsContext';
import { useTickets } from '@/contexts/TicketsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvent } = useEvents();
  const { isAuthenticated, user } = useAuth();
  const { purchaseTicket } = useTickets();
  const { toast } = useToast();
  
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  const event = getEvent(id as string);
  
  if (!event) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Event not found</h1>
          <p className="mt-2 text-muted-foreground">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Back to events
          </Button>
        </div>
      </Layout>
    );
  }
  
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');
  
  const ticketsRemaining = event.ticketLimit - event.ticketsSold;
  const ticketsPercentage = (event.ticketsSold / event.ticketLimit) * 100;
  const isSoldOut = ticketsRemaining <= 0;
  const isPastEvent = new Date() > eventDate;
  
  const handlePurchaseTicket = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsPurchasing(true);
    
    try {
      await purchaseTicket(event.id);
      setPurchaseSuccess(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to purchase ticket',
        description: (error as Error).message,
      });
    } finally {
      setIsPurchasing(false);
    }
  };
  
  const handleViewTicket = () => {
    navigate('/tickets');
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="rounded-lg overflow-hidden aspect-video bg-muted mb-6">
              {event.image ? (
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
            </div>
            
            {/* Event Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  <span>Organized by {event.organizerName}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <div>{formattedDate}</div>
                    <div className="text-sm text-muted-foreground">{formattedTime}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-2">About this event</h2>
                <p>{event.description}</p>
              </div>
            </div>
          </div>
          
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
                <CardDescription>
                  {isPastEvent 
                    ? 'This event has already taken place' 
                    : `${ticketsRemaining} tickets remaining`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      {event.ticketsSold} / {event.ticketLimit} tickets sold
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round(ticketsPercentage)}%
                    </span>
                  </div>
                  <Progress value={ticketsPercentage} className="h-2" />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Price</span>
                  {event.price === 0 ? (
                    <Badge variant="outline">Free</Badge>
                  ) : (
                    <span className="text-xl font-bold">${event.price.toFixed(2)}</span>
                  )}
                </div>
                
                {isPastEvent && (
                  <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    This event has already taken place.
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handlePurchaseTicket}
                  className="w-full"
                  disabled={isPurchasing || isSoldOut || isPastEvent}
                >
                  {isPurchasing
                    ? 'Processing...'
                    : isSoldOut
                      ? 'Sold Out'
                      : isPastEvent
                        ? 'Event Ended'
                        : `Get Ticket${event.price === 0 ? ' (Free)' : ''}`
                  }
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Purchase Success Dialog */}
      <AlertDialog open={purchaseSuccess} onOpenChange={setPurchaseSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ticket Purchased Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Your ticket for "{event.title}" has been successfully purchased. 
              You can view your ticket in your tickets dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleViewTicket}>
              View My Tickets
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default EventDetails;
