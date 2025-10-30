
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { Booking } from "@/api/entities";
import { Dock } from "@/api/entities";
import { Company } from "@/api/entities";
import { Arrival } from "@/api/entities";
import { Warehouse } from "@/api/entities"; // Import Warehouse entity
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Package, Truck, Filter, Hash, User as UserIcon, Fence, ArrowRight, ArrowLeft, BarChart3, List, Loader2, Pencil, Building, Printer, Search, X, Warehouse as WarehouseIcon } from "lucide-react"; // Added WarehouseIcon
import { format, isToday, isTomorrow, parseISO, startOfDay } from "date-fns";
import { createPageUrl } from "@/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import TimelineView from "../components/schedule/TimelineView";
import PrintableScheduleView from "../components/schedule/PrintableScheduleView";
import SearchResultsView from "../components/schedule/SearchResultsView";

export default function SchedulePage() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [docks, setDocks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedCustomDate, setSelectedCustomDate] = useState(null);
  const [viewMode, setViewMode] = useState('timeline');
  const [isLoading, setIsLoading] = useState(true);
  const [searchReference, setSearchReference] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        setIsAuthorized(true);
        
        loadData(user).then(companyData => { 
            let companyToSelect = '';
            if (user.role !== 'admin' && user.company_id) {
                companyToSelect = user.company_id;
            } else {
                companyToSelect = localStorage.getItem('selectedCompanyId') || '';
            }

            if (companyToSelect) {
                const preselectedCompany = companyData.find(c => c.id === companyToSelect);
                if (preselectedCompany) {
                    setSelectedCompanyId(companyToSelect);
                    setSelectedCompany(preselectedCompany);
                    loadWarehousesForCompany(companyToSelect, user);
                } else if (user.role !== 'admin' && user.company_id) {
                    setSelectedCompanyId('');
                    setSelectedCompany(null);
                }
            } else if (companyData.length > 0 && user.role === 'admin') {
                // If no companyToSelect and admin, default to the first company if available
                // Or keep it empty for admin to choose
            }
        });
      } catch (error) {
        navigate(createPageUrl("Booking"));
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  useEffect(() => {
    // This effect is only for date/company filtering, not for search results
    if (searchResults === null) {
      filterBookings();
    }
  }, [bookings, selectedDate, selectedCompanyId, selectedWarehouseId, selectedCustomDate, searchResults]);

  const loadData = async (user) => { 
    setIsLoading(true);
    
    let companyFilter = { is_active: true };
    if (user && user.company_id && user.role !== 'admin') {
      companyFilter.id = user.company_id;
    }
    
    const [bookingData, dockData, companyData, arrivalData] = await Promise.all([
      Booking.list('-booking_date'),
      Dock.list(),
      Company.filter(companyFilter),
      Arrival.list()
    ]);
    setBookings(bookingData);
    setDocks(dockData);
    setCompanies(companyData);
    setArrivals(arrivalData);
    setIsLoading(false);
    return companyData; 
  };
    
  const loadWarehousesForCompany = async (companyId, user) => {
    if (!companyId) {
      setWarehouses([]);
      setSelectedWarehouseId('');
      return;
    }
    setIsLoadingWarehouses(true);
    let warehouseFilter = { company_id: companyId, is_active: true };

    if (user && user.warehouse_ids && user.warehouse_ids.length > 0 && user.role !== 'admin') {
      const allWarehouses = await Warehouse.filter(warehouseFilter);
      const allowedWarehouses = allWarehouses.filter(w => user.warehouse_ids.includes(w.id));
      setWarehouses(allowedWarehouses);
      if (allowedWarehouses.length > 0) {
        // If current selected warehouse is not in allowed, or no selection, default to first allowed.
        if (!selectedWarehouseId || !allowedWarehouses.find(w => w.id === selectedWarehouseId)) {
          setSelectedWarehouseId(allowedWarehouses[0].id);
        }
      } else {
        setSelectedWarehouseId('');
      }
    } else {
      const data = await Warehouse.filter(warehouseFilter);
      setWarehouses(data);
      if (data.length > 0) {
        // If current selected warehouse is not in data, or no selection, do not auto-select for admins/unrestricted users.
        if (!selectedWarehouseId || !data.find(w => w.id === selectedWarehouseId)) {
          // Keep current selection if valid, otherwise don't default. User needs to pick.
          setSelectedWarehouseId(''); 
        }
      } else {
        setSelectedWarehouseId('');
      }
    }
    
    setIsLoadingWarehouses(false);
  };

  const handleCompanyChange = (companyId) => {
    localStorage.setItem('selectedCompanyId', companyId); 
    const company = companies.find(c => c.id === companyId);
    setSelectedCompanyId(companyId);
    setSelectedCompany(company);
    setSelectedWarehouseId(''); // Reset warehouse selection when company changes
    loadWarehousesForCompany(companyId, currentUser);
  };

  const filterBookings = () => {
    let filtered = [...bookings];
    
    // Filter by company if selected
    if (selectedCompanyId) {
      filtered = filtered.filter(booking => booking.company_id === selectedCompanyId);
    }
    
    // Filter by warehouse if selected
    if (selectedWarehouseId) {
      filtered = filtered.filter(booking => booking.warehouse_id === selectedWarehouseId);
    }
    
    // Filter by date
    if (selectedDate === 'today') {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      filtered = filtered.filter(booking => booking.booking_date === todayStr);
    } else if (selectedDate === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = format(tomorrow, 'yyyy-MM-dd');
      filtered = filtered.filter(booking => booking.booking_date === tomorrowStr);
    } else if (selectedDate === 'upcoming') {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      filtered = filtered.filter(booking => booking.booking_date >= todayStr);
    } else if (selectedDate === 'custom' && selectedCustomDate) {
      const customDateStr = format(selectedCustomDate, 'yyyy-MM-dd');
      filtered = filtered.filter(booking => booking.booking_date === customDateStr);
    } else if (selectedDate === 'all') {
      // No date filter for 'all'
    }
    
    setFilteredBookings(filtered);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchReference.trim()) {
        setSearchResults([]);
        return;
    }
    // Perform search only on bookings belonging to the selected company, if a company is selected
    // And also by selected warehouse if selected.
    let bookingsToSearch = bookings;
    if (selectedCompanyId) {
      bookingsToSearch = bookingsToSearch.filter(b => b.company_id === selectedCompanyId);
    }
    if (selectedWarehouseId) {
      bookingsToSearch = bookingsToSearch.filter(b => b.warehouse_id === selectedWarehouseId);
    }

    const filtered = bookingsToSearch.filter(b => 
        (b.reference_number || '').toLowerCase() === searchReference.trim().toLowerCase()
    );
    const sorted = filtered.sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime());
    
    const augmentedResults = augmentBookingsWithArrivals(sorted); 
    setSearchResults(augmentedResults);
  };

  const handleClearSearch = () => {
      setSearchReference('');
      setSearchResults(null);
      filterBookings();
  };

  const handleEdit = (bookingId) => {
    navigate(createPageUrl(`Booking?edit=${bookingId}`));
  };

  const getCurrentDateString = () => {
    if (selectedDate === 'today') {
      return format(new Date(), 'yyyy-MM-dd');
    } else if (selectedDate === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return format(tomorrow, 'yyyy-MM-dd');
    } else if (selectedDate === 'custom' && selectedCustomDate) {
      return format(selectedCustomDate, 'yyyy-MM-dd');
    }
    return null;
  };

  const getDateLabel = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getMovementTypeStyle = (movementType) => {
    return movementType === 'Inwards'
      ? { icon: <ArrowRight className="w-6 h-6 text-white" />, color: "from-blue-600 to-indigo-600" }
      : { icon: <ArrowLeft className="w-6 h-6 text-white" />, color: "from-orange-500 to-amber-500" };
  };
  
  const handleDateSelect = (date) => {
    setSelectedCustomDate(date);
    setSelectedDate('custom');
  };

  const augmentBookingsWithArrivals = (bookingsToAugment) => {
    return bookingsToAugment.map(booking => {
      const arrival = arrivals.find(arr => arr.booking_id === booking.id);
      if (arrival) {
        return {
          ...booking,
          arrival_status: 'Arrived',
          driver_name: arrival.driver_name,
          vehicle_registration: arrival.vehicle_registration,
          arrival_time: arrival.arrival_time,
        };
      }
      return booking;
    });
  };

  const groupBookingsByDate = () => {
    const groups = {};
    filteredBookings.forEach(booking => {
      const date = booking.booking_date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(booking);
    });
    // Sort dates in ascending order
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const sortedGroups = {};
    sortedDates.forEach(date => {
      sortedGroups[date] = groups[date];
    });
    return sortedGroups;
  };

  const groupedBookings = searchResults === null ? groupBookingsByDate() : {};
  const currentDateStr = getCurrentDateString();
  const showTimelineView = searchResults === null && viewMode === 'timeline' && currentDateStr && (selectedDate === 'today' || selectedDate === 'tomorrow' || (selectedDate === 'custom' && selectedCustomDate)) && selectedCompanyId && selectedWarehouseId;

  // Filter docks by selected company & warehouse for timeline view
  const filteredDocks = selectedCompanyId && selectedWarehouseId
    ? docks.filter(dock => dock.company_id === selectedCompanyId && dock.warehouse_id === selectedWarehouseId)
    : [];
    
  const printableBookings = augmentBookingsWithArrivals(filteredBookings);
  const selectedWarehouse = warehouses.find(w => w.id === selectedWarehouseId);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        .print-only { display: none; }
        @media print {
          .screen-only {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
      <div className="min-h-screen py-8 px-4 screen-only">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Delivery Schedule
            </h1>
            <p className="text-lg text-slate-600">
              View and manage your booked delivery slots
            </p>
          </motion.div>

          {/* Combined Company Selection and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Company & Warehouse Selection */}
                <div className="flex items-center space-x-4 lg:flex-1">
                  <Building className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 flex flex-col md:flex-row gap-4">
                    <div>
                      <Label htmlFor="company-select" className="text-sm font-medium text-slate-700 mb-2 block">
                        {currentUser && currentUser.role !== 'admin' && currentUser.company_id ? 'Your Company' : 'Select Company'}
                      </Label>
                      <Select 
                        value={selectedCompanyId} 
                        onValueChange={handleCompanyChange}
                        disabled={(currentUser && currentUser.company_id && currentUser.role !== 'admin') || searchResults !== null}
                      >
                        <SelectTrigger id="company-select" className="w-full md:w-[250px]">
                          <SelectValue placeholder="Choose a company..." />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map(company => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name} ({company.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                       <Label htmlFor="warehouse-select" className="text-sm font-medium text-slate-700 mb-2 block">
                        Warehouse
                      </Label>
                      <Select
                        value={selectedWarehouseId}
                        onValueChange={setSelectedWarehouseId}
                        disabled={!selectedCompanyId || isLoadingWarehouses || searchResults !== null}
                      >
                        <SelectTrigger id="warehouse-select" className="w-full md:w-[250px]">
                          <SelectValue placeholder={
                            !selectedCompanyId ? "Select company first" :
                            isLoadingWarehouses ? "Loading..." : "Select a warehouse..."
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses.map(warehouse => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name} ({warehouse.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Search by Reference */}
                <div className="lg:flex-1">
                  <form onSubmit={handleSearchSubmit}>
                    <Label htmlFor="search-reference" className="text-sm font-medium text-slate-700 mb-2 block">
                      Search by Reference Number
                    </Label>
                    <div className="flex gap-2">
                      <Input 
                        id="search-reference"
                        value={searchReference}
                        onChange={(e) => setSearchReference(e.target.value)}
                        placeholder="Enter full reference number..."
                        className="flex-1"
                      />
                      <Button type="submit" size="default">
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                      {searchResults !== null && (
                        <Button variant="outline" onClick={handleClearSearch} size="default">
                          <X className="w-4 h-4 mr-2" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>

          {!selectedCompanyId ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <Building className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a Company</h3>
              <p className="text-slate-600">
                Choose a company from the dropdown above to view its delivery schedule
              </p>
            </motion.div>
          ) : !selectedWarehouseId && searchResults === null ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <WarehouseIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a Warehouse</h3>
              <p className="text-slate-600">
                Choose a warehouse from the dropdown above to view its schedule.
              </p>
            </motion.div>
          ) : (
            <>
              {searchResults !== null ? (
                 <SearchResultsView 
                    results={searchResults}
                    onEdit={handleEdit}
                    searchTerm={searchReference}
                    formatTime={formatTime}
                    getDateLabel={getDateLabel}
                    getStatusColor={getStatusColor}
                    getMovementTypeStyle={getMovementTypeStyle}
                />
              ) : (
                <>
                  {/* Filter and View Mode Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
                  >
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant={selectedDate === 'today' ? 'default' : 'outline'}
                        onClick={() => { setSelectedDate('today'); setSelectedCustomDate(null); }}
                      >
                        Today
                      </Button>
                      <Button
                        variant={selectedDate === 'tomorrow' ? 'default' : 'outline'}
                        onClick={() => { setSelectedDate('tomorrow'); setSelectedCustomDate(null); }}
                      >
                        Tomorrow
                      </Button>
                      <Button
                        variant={selectedDate === 'upcoming' ? 'default' : 'outline'}
                        onClick={() => { setSelectedDate('upcoming'); setSelectedCustomDate(null); }}
                      >
                        Upcoming
                      </Button>
                       <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={selectedDate === 'custom' ? 'default' : 'outline'}
                          >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {selectedCustomDate ? format(selectedCustomDate, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedCustomDate}
                            onSelect={handleDateSelect}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Button
                        variant={selectedDate === 'all' ? 'default' : 'outline'}
                        onClick={() => { setSelectedDate('all'); setSelectedCustomDate(null); }}
                        className="flex items-center space-x-2"
                      >
                        <Filter className="w-4 h-4" />
                        <span>All Bookings</span>
                      </Button>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      {(selectedDate === 'today' || selectedDate === 'tomorrow' || selectedDate === 'custom') && selectedWarehouseId && (
                        <div className="flex gap-2">
                          <Button
                            variant={viewMode === 'timeline' ? 'default' : 'outline'}
                            onClick={() => setViewMode('timeline')}
                            size="sm"
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Timeline
                          </Button>
                          <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            onClick={() => setViewMode('list')}
                            size="sm"
                          >
                            <List className="w-4 h-4 mr-2" />
                            List
                          </Button>
                        </div>
                      )}
                      {(selectedDate === 'today' || selectedDate === 'tomorrow' || selectedDate === 'custom') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.print()}
                        >
                          <Printer className="w-4 h-4 mr-2" />
                          Print
                        </Button>
                      )}
                    </div>
                  </motion.div>

                  {/* Content */}
                  {isLoading ? (
                    <div className="grid gap-4">
                      {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-full" />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : showTimelineView ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <TimelineView
                        bookings={filteredBookings}
                        docks={filteredDocks}
                        selectedDate={currentDateStr}
                      />
                    </motion.div>
                  ) : Object.keys(groupedBookings).length > 0 ? (
                    <div className="space-y-8">
                      {Object.entries(groupedBookings).map(([date, dayBookings]) => (
                        <motion.div
                          key={date}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center space-x-3">
                            <CalendarIcon className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-slate-900">
                              {getDateLabel(date)}
                            </h2>
                            <Badge variant="secondary" className="ml-2">
                              {dayBookings.length} booking{dayBookings.length > 1 ? 's' : ''}
                            </Badge>
                          </div>
                          
                          <div className="grid gap-4">
                            {dayBookings.map((booking) => {
                              const { icon, color } = getMovementTypeStyle(booking.movement_type);
                              return (
                                <Card key={booking.id} className="shadow-md border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-200 flex flex-col">
                                  <CardContent className="p-6 flex-grow">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start space-x-4">
                                        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
                                          {icon}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-3 mb-3">
                                            <h3 className="font-semibold text-slate-900">{booking.carrier_name}</h3>
                                            <Badge className={getStatusColor(booking.status)}>
                                              {booking.status}
                                            </Badge>
                                          </div>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                                              <Fence className="w-4 h-4" />
                                              <span>Dock: <span className="font-semibold">{booking.dock_name}</span></span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                                              <Hash className="w-4 h-4" />
                                              <span className="font-mono">{booking.reference_number}</span>
                                            </div>
                                          </div>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
                                            <div className="flex items-center space-x-2">
                                              <UserIcon className="w-4 h-4" />
                                              <span>{booking.sender_name}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Clock className="w-4 h-4" />
                                              <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Package className="w-4 h-4" />
                                              <span>{booking.pallet_count} pallet{booking.pallet_count > 1 ? 's' : ''}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                  <CardFooter className="p-4 pt-0 bg-slate-50/50 border-t">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(booking.id)}>
                                      <Pencil className="w-3 h-3 mr-2" />
                                      Edit Booking
                                    </Button>
                                  </CardFooter>
                                </Card>
                              );
                            })}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarIcon className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">No bookings found</h3>
                      <p className="text-slate-600 mb-6">
                        {selectedDate === 'all' 
                          ? "No bookings found for this company." 
                          : `No bookings for ${selectedDate === 'today' ? 'today' : selectedDate === 'tomorrow' ? 'tomorrow' : 'the selected period'}.`
                        }
                      </p>
                      <Button
                        onClick={() => window.location.href = createPageUrl("Booking")}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      >
                        Book a New Slot
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="print-only">
        <PrintableScheduleView 
            bookings={printableBookings}
            companyName={selectedCompany?.name}
            warehouseName={selectedWarehouse?.name}
            scheduleDate={currentDateStr}
            isHistorical={selectedDate === 'custom' && selectedCustomDate && startOfDay(selectedCustomDate) < startOfDay(new Date())}
        />
      </div>
    </>
  );
}
