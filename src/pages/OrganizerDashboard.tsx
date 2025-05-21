
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Edit, Trash, Calendar, Ticket } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventsContext';
import { useTickets } from '@/contexts/TicketsContext';
import Layout from '@/components/layout/Layout';
import EventForm, { EventFormValues } from '@/components/events/EventForm';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { events, createEvent, updateEvent, deleteEvent } = useEvents();
  const { getEventTickets } = useTickets();
  const { toast } = useToast();
  
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  
  // If not authenticated or not an organizer, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated || (user && user.role !== 'organizer')) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || !user || user.role !== 'organizer') {
    return null; // Will redirect via useEffect
  }
  
  // Filter events for this organizer
  const organizerEvents = events.filter(event => event.organizerId === user.id);
  
  const handleCreateEvent = (data: EventFormValues) => {
    createEvent({
      ...data,
      organizerId: user.id,
      organizerName: user.name,
    });
    
    setIsCreatingEvent(false);
    toast({
      title: 'Event created',
      description: 'Your event has been created and is pending approval.',
    });
  };
  
  const handleEditEvent = (data: EventFormValues) => {
    if (currentEvent) {
      updateEvent(currentEvent.id, data);
      setIsEditingEvent(false);
      toast({
        title: 'Event updated',
        description: 'Your event has been updated successfully.',
      });
    }
  };
  
  const confirmDeleteEvent = (eventId: string) => {
    setEventToDelete(eventId);
  };
  
  const handleDeleteEvent = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);
      setEventToDelete(null);
      toast({
        title: 'Event deleted',
        description: 'Your event has been deleted successfully.',
      });
    }
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your events and track ticket sales
            </p>
          </div>
          <Button onClick={() => setIsCreatingEvent(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Events
              </CardTitle>
              <div className="text-3xl font-bold">{organizerEvents.length}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tickets Sold
              </CardTitle>
              <div className="text-3xl font-bold">
                {organizerEvents.reduce((total, event) => total + event.ticketsSold, 0)}
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue
              </CardTitle>
              <div className="text-3xl font-bold">
                ${organizerEvents
                  .reduce((total, event) => total + event.price * event.ticketsSold, 0)
                  .toFixed(2)}
              </div>
            </CardHeader>
          </Card>
        </div>
        
        <Tabs defaultValue="events">
          <TabsList>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="tickets">
              <Ticket className="h-4 w-4 mr-2" />
              Ticket Sales
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="mt-6">
            {organizerEvents.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Tickets</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizerEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{format(new Date(event.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="hidden md:table-cell">{event.location}</TableCell>
                        <TableCell>{event.ticketsSold} / {event.ticketLimit}</TableCell>
                        <TableCell>${event.price}</TableCell>
                        <TableCell>
                          {event.approved ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentEvent(event);
                              setIsEditingEvent(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDeleteEvent(event.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-md">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="mt-4 text-xl font-semibold">No events created</h2>
                <p className="mt-1 text-muted-foreground">
                  You haven't created any events yet.
                </p>
                <Button onClick={() => setIsCreatingEvent(true)} className="mt-4">
                  Create Your First Event
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tickets" className="mt-6">
            {organizerEvents.length > 0 ? (
              <div className="space-y-8">
                {organizerEvents.map(event => {
                  const tickets = getEventTickets(event.id);
                  return (
                    <Card key={event.id}>
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          {format(new Date(event.date), 'MMMM d, yyyy')} · {event.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {tickets.length > 0 ? (
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Ticket ID</TableHead>
                                  <TableHead>Purchase Date</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tickets.map(ticket => (
                                  <TableRow key={ticket.id}>
                                    <TableCell className="font-mono">{ticket.id.substring(0, 8)}</TableCell>
                                    <TableCell>{format(new Date(ticket.purchaseDate), 'MMM d, yyyy h:mm a')}</TableCell>
                                    <TableCell>
                                      {ticket.isUsed ? (
                                        <Badge variant="outline" className="bg-gray-100 text-gray-700">Used</Badge>
                                      ) : (
                                        <Badge variant="outline" className="bg-green-50 text-green-700">Valid</Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-muted/20 rounded-md">
                            <p className="text-muted-foreground">No tickets sold for this event yet</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-md">
                <p className="text-muted-foreground">Create events to see ticket sales data</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Create Event Dialog */}
      <Dialog open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new event.
            </DialogDescription>
          </DialogHeader>
          <EventForm onSubmit={handleCreateEvent} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Event Dialog */}
      <Dialog open={isEditingEvent} onOpenChange={setIsEditingEvent}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Make changes to your event.
            </DialogDescription>
          </DialogHeader>
          {currentEvent && (
            <EventForm 
              defaultValues={{
                title: currentEvent.title,
                description: currentEvent.description,
                date: new Date(currentEvent.date),
                location: currentEvent.location,
                price: currentEvent.price,
                ticketLimit: currentEvent.ticketLimit,
                image: currentEvent.image,
              }}
              onSubmit={handleEditEvent}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Event Dialog */}
      <AlertDialog 
        open={eventToDelete !== null} 
        onOpenChange={(isOpen) => !isOpen && setEventToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this event and all associated tickets.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEvent}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default OrganizerDashboard;
