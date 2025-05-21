
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { EventsProvider } from "./contexts/EventsContext";
import { TicketsProvider } from "./contexts/TicketsContext";
import { useMobileDetect } from "./hooks/useMobileDetect";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import MyTickets from "./pages/MyTickets";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import MobileIndex from "./pages/mobile/MobileIndex";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const isMobile = useMobileDetect();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isMobile ? <MobileIndex /> : <Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/tickets" element={<MyTickets />} />
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <EventsProvider>
          <TicketsProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TicketsProvider>
        </EventsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
