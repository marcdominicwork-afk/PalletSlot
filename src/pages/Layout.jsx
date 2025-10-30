

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Calendar,
  Clock,
  Book,
  LogIn,
  LogOut,
  Loader2,
  Settings,
  Building,
  Users,
  Truck,
  ChevronDown,
  ClipboardList,
  Code, // Added Code icon
} from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [location.pathname]);

  // Standalone page logic
  if (currentPageName === 'DriverKiosk') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
    navigate(createPageUrl("Booking"));
  };

  const publicLinks = [
    { name: "Book Slot", page: "Booking", icon: Calendar },
    { name: "My Schedule", page: "Schedule", icon: Clock },
    { name: "User Guide", page: "UserGuide", icon: Book, newTab: true },
  ];

  const privateLinks = [];

  const adminMenuItems = [
    { name: "Companies", page: "Companies", icon: Building },
    { name: "Warehouses", page: "Warehouses", icon: Building },
    { name: "Carriers", page: "Carriers", icon: ClipboardList },
    { name: "Dock Config", page: "Docks", icon: Settings },
    { name: "Vehicle Types", page: "VehicleTypes", icon: Truck },
    { name: "Users", page: "Users", icon: Users },
    { name: "Booking API", page: "API", icon: Code }, // Added Booking API
  ];

  const NavLink = ({ to, isActive, children, newTab = false }) => (
    <Link
      to={to}
      target={newTab ? "_blank" : "_self"}
      rel={newTab ? "noopener noreferrer" : ""}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive && !newTab
          ? "bg-blue-600 text-white"
          : "text-slate-200 hover:bg-blue-800 hover:text-white"
      }`}
      onClick={() => !newTab && setIsMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

  const AdminMenu = () => {
    // Filter admin menu items based on user role
    const filteredAdminMenuItems = user?.role === 'company_admin'
      ? adminMenuItems.filter(item => item.page === 'Users')
      : adminMenuItems; // Admin sees all

    if (filteredAdminMenuItems.length === 0) {
      return null; // Don't render admin menu if there are no items
    }

    return (
      <div className="relative">
        <button
          onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isAdminMenuOpen || filteredAdminMenuItems.some(item => item.page === currentPageName)
              ? "bg-blue-600 text-white"
              : "text-slate-200 hover:bg-blue-800 hover:text-white"
          }`}
        >
          <span>Admin</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        {isAdminMenuOpen && (
          <div 
            className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            onMouseLeave={() => setIsAdminMenuOpen(false)}
          >
            {filteredAdminMenuItems.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setIsAdminMenuOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const renderNavLinks = (isMobile = false) => (
    <nav className={`flex ${isMobile ? 'flex-col space-y-2' : 'flex-row items-center space-x-4'}`}>
      {[...publicLinks, ...privateLinks].map((link) => (
        <NavLink
          key={link.page}
          to={createPageUrl(link.page)}
          isActive={currentPageName === link.page}
          newTab={link.newTab}
        >
          <link.icon className="w-4 h-4" />
          <span>{link.name}</span>
        </NavLink>
      ))}
      {user && (user.role === 'admin' || user.role === 'company_admin') && <AdminMenu />}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to={createPageUrl("Booking")} className="flex items-center space-x-2 text-white">
                <Truck className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold">PalletSlot</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              {renderNavLinks()}
            </div>

            <div className="flex items-center">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <span className="hidden sm:inline text-sm text-slate-300">Welcome, {user.full_name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-slate-300 hover:bg-blue-800 hover:text-white"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Link to={createPageUrl("Login")}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <LogIn className="w-5 h-5 mr-2" />
                    Login
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden ml-4">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-blue-800">
                      <Menu className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="bg-slate-900 text-white border-r-slate-700">
                    <div className="p-4">
                      <div className="flex items-center space-x-2 text-white mb-8">
                        <Truck className="w-8 h-8 text-blue-500" />
                        <span className="text-xl font-bold">PalletSlot</span>
                      </div>
                      {renderNavLinks(true)}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

