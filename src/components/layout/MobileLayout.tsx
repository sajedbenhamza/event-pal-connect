
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Ticket, User, Calendar, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">EventPal</Link>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="py-6 flex flex-col h-full">
              <div className="flex-grow space-y-4">
                <h2 className="text-lg font-semibold mb-6">Menu</h2>
                {isAuthenticated && user ? (
                  <>
                    <div className="bg-muted p-4 rounded-lg mb-6">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs mt-1 capitalize bg-primary/10 text-primary inline-block px-2 py-0.5 rounded">
                        {user.role}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Link to="/" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                        <Home className="h-5 w-5" /> Home
                      </Link>
                      
                      <Link to="/tickets" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                        <Ticket className="h-5 w-5" /> My Tickets
                      </Link>
                      
                      {user.role === 'organizer' && (
                        <Link to="/organizer" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                          <Calendar className="h-5 w-5" /> Manage Events
                        </Link>
                      )}
                      
                      {user.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                          <User className="h-5 w-5" /> Admin Panel
                        </Link>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => {
                        logout();
                        window.location.href = '/';
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link to="/" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                      <Home className="h-5 w-5" /> Home
                    </Link>
                    <Link to="/login" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                      <User className="h-5 w-5" /> Sign In
                    </Link>
                    <Link to="/register" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                      <User className="h-5 w-5" /> Register
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-center text-muted-foreground mt-auto pt-6">
                &copy; {new Date().getFullYear()} EventPal Connect
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <nav className="bg-background border-t fixed bottom-0 left-0 right-0 z-10">
          <div className="flex justify-around py-2">
            <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            
            <Link to="/tickets" className={`flex flex-col items-center p-2 ${isActive('/tickets') ? 'text-primary' : 'text-muted-foreground'}`}>
              <Ticket className="h-5 w-5" />
              <span className="text-xs mt-1">Tickets</span>
            </Link>
            
            {user?.role === 'organizer' && (
              <Link to="/organizer" className={`flex flex-col items-center p-2 ${isActive('/organizer') ? 'text-primary' : 'text-muted-foreground'}`}>
                <Calendar className="h-5 w-5" />
                <span className="text-xs mt-1">Events</span>
              </Link>
            )}
            
            {user?.role === 'admin' && (
              <Link to="/admin" className={`flex flex-col items-center p-2 ${isActive('/admin') ? 'text-primary' : 'text-muted-foreground'}`}>
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">Admin</span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
};

export default MobileLayout;
