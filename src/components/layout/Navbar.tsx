
import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, LogOut, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">UniTicket</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          {isAuthenticated && user?.role === 'organizer' && (
            <Link to="/organizer" className="text-sm font-medium hover:text-primary transition-colors">
              Organizer Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              Admin Panel
            </Link>
          )}
        </nav>
        
        {/* User menu or auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {user?.role === 'student' && (
                  <DropdownMenuItem asChild>
                    <Link to="/tickets">My Tickets</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="grid gap-6 py-6">
              <Link to="/" className="flex items-center gap-2">
                <Ticket className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">UniTicket</span>
              </Link>
              <div className="grid gap-3">
                <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                {isAuthenticated && user?.role === 'student' && (
                  <Link to="/tickets" className="text-sm font-medium hover:text-primary transition-colors">
                    My Tickets
                  </Link>
                )}
                {isAuthenticated && user?.role === 'organizer' && (
                  <Link to="/organizer" className="text-sm font-medium hover:text-primary transition-colors">
                    Organizer Dashboard
                  </Link>
                )}
                {isAuthenticated && user?.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                    Admin Panel
                  </Link>
                )}
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                      Profile
                    </Link>
                    <button 
                      onClick={logout}
                      className="flex items-center text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button asChild variant="outline">
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/register">Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
