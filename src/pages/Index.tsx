import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useEvents } from '@/contexts/EventsContext';
import Layout from '@/components/layout/Layout';
import EventCard from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Index = () => {
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

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
  
  // Sort events based on selected criteria
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'availability': {
        const aRemaining = a.ticketLimit - a.ticketsSold;
        const bRemaining = b.ticketLimit - b.ticketsSold;
        return bRemaining - aRemaining;
      }
      default:
        return 0;
    }
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Discover and attend university events
              </h1>
              <p className="max-w-[600px] text-white/90 md:text-xl">
                Your one-stop platform for finding, booking, and attending the best campus events. From concerts to workshops, find it all here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
                  <a href="#events">Browse Events</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white/20" asChild>
                  <Link to="/register">Create Account</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <img
                  alt="Event tickets"
                  className="mx-auto rounded-xl object-cover w-full aspect-[4/3] shadow-2xl"
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="container py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
            <p className="text-muted-foreground mt-2">
              Find and book your next campus event
            </p>
          </div>
          
          <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-9 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Soonest)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {sortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold">No events found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or check back later for new events
            </p>
          </div>
        )}
      </section>
      
      {/* CTA Section */}
      <section className="bg-muted py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                Organizing an event?
              </h2>
              <p className="text-muted-foreground">
                Create an organizer account and start selling tickets to your events. 
                Our platform makes it easy to manage registrations, track attendance, and more.
              </p>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Event organization"
                className="mx-auto rounded-xl object-cover w-full max-w-md aspect-video"
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
