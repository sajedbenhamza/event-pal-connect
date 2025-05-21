
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Check, X, AlertTriangle, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventsContext';
import { useTickets } from '@/contexts/TicketsContext';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { events, approveEvent, rejectEvent } = useEvents();
  const { tickets } = useTickets();
  const { toast } = useToast();
  
  // If not authenticated or not an admin, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated || (user && user.role !== 'admin')) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null; // Will redirect via useEffect
  }
  
  // Filter pending events
  const pendingEvents = events.filter(event => !event.approved);
  
  const handleApproveEvent = (eventId: string) => {
    approveEvent(eventId);
    toast({
      title: 'Event approved',
      description: 'The event has been approved and is now public.',
    });
  };
  
  const handleRejectEvent = (eventId: string) => {
    rejectEvent(eventId);
    toast({
      title: 'Event rejected',
      description: 'The event has been rejected.',
    });
  };
  
  // Calculate statistics
  const totalEvents = events.length;
  const approvedEvents = events.filter(event => event.approved).length;
  const totalTicketsSold = events.reduce((total, event) => total + event.ticketsSold, 0);
  const totalRevenue = events.reduce((total, event) => 
    total + (event.price * event.ticketsSold), 0);
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">
              Manage events and system performance
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Events
              </CardTitle>
              <div className="text-3xl font-bold">{totalEvents}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved Events
              </CardTitle>
              <div className="text-3xl font-bold">{approvedEvents}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tickets Sold
              </CardTitle>
              <div className="text-3xl font-bold">{totalTicketsSold}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
            </CardHeader>
          </Card>
        </div>
        
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Pending Approvals 
              {pendingEvents.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingEvents.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">
              <Calendar className="h-4 w-4 mr-2" />
              All Events
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            {pendingEvents.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.organizerName}</TableCell>
                        <TableCell>{format(new Date(event.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="hidden md:table-cell">{event.location}</TableCell>
                        <TableCell>${event.price}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproveEvent(event.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectEvent(event.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" /> Reject
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
                  <Check className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="mt-4 text-xl font-semibold">No pending approvals</h2>
                <p className="mt-1 text-muted-foreground">
                  All events have been reviewed.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Tickets</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{event.organizerName}</TableCell>
                      <TableCell>{format(new Date(event.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{event.ticketsSold} / {event.ticketLimit}</TableCell>
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
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
