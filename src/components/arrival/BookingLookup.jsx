
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, Calendar, Clock, Package, Hash, User, Truck, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Company } from "@/api/entities";

export default function BookingLookup({ onBookingFound, isLoading, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('reference');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [foundBooking, setFoundBooking] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin' && currentUser.company_id) {
        setSelectedCompanyId(currentUser.company_id);
    }
  }, [currentUser]);

  const loadCompanies = async () => {
    const data = await Company.filter({ is_active: true });
    setCompanies(data);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchError('Please enter a search term');
      return;
    }

    if (!selectedCompanyId) {
      setSearchError('Please select a company');
      return;
    }

    setSearchError('');
    try {
      const { Booking } = await import('@/api/entities');
      
      let bookings;
      if (searchType === 'reference') {
        bookings = await Booking.filter({ 
          reference_number: searchTerm.trim(),
          company_id: selectedCompanyId
        });
      } else {
        bookings = await Booking.filter({ 
          carrier_name: searchTerm.trim(),
          company_id: selectedCompanyId
        });
      }

      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const todaysBookings = bookings.filter(booking => booking.booking_date === todayStr);

      if (todaysBookings.length === 0) {
        setSearchError(`No bookings found for today with ${searchType === 'reference' ? 'reference number' : 'carrier name'}: ${searchTerm}`);
        setFoundBooking(null);
      } else {
        setFoundBooking(todaysBookings[0]);
        setSearchError('');
      }
    } catch (error) {
      setSearchError('Error searching for booking. Please try again.');
      console.error('Search error:', error);
    }
  };

  const handleSelectBooking = () => {
    if (foundBooking) {
      onBookingFound(foundBooking);
    }
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-slate-900 text-lg">
          <Search className="w-5 h-5 text-blue-600" />
          <span>Find Your Booking</span>
        </CardTitle>
        <p className="text-xs text-slate-600">
          Search for your delivery booking to record arrival
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="company" className="text-xs font-medium text-slate-700">
              Company
            </Label>
            <Select
              value={selectedCompanyId}
              onValueChange={setSelectedCompanyId}
              disabled={currentUser && currentUser.role !== 'admin'}
            >
              <SelectTrigger id="company" className="h-9 text-sm border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select company" />
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

          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={searchType === 'reference' ? 'default' : 'outline'}
              onClick={() => setSearchType('reference')}
              className="flex-1 h-8 text-xs"
            >
              <Hash className="w-3 h-3 mr-1" />
              Reference
            </Button>
            <Button
              type="button"
              size="sm"
              variant={searchType === 'carrier' ? 'default' : 'outline'}
              onClick={() => setSearchType('carrier')}
              className="flex-1 h-8 text-xs"
            >
              <Truck className="w-3 h-3 mr-1" />
              Carrier
            </Button>
          </div>

          <div className="space-y-1">
            <Label htmlFor="search" className="text-xs font-medium text-slate-700">
              {searchType === 'reference' ? 'Reference Number' : 'Carrier Name'}
            </Label>
            <Input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchType === 'reference' ? 'Enter reference number' : 'Enter carrier name'}
              className="h-9 text-sm border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {searchError && (
            <div className="flex items-start space-x-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-red-800">{searchError}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Searching...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Search className="w-3 h-3" />
                <span>Search Booking</span>
              </div>
            )}
          </Button>
        </form>

        {foundBooking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t pt-4"
          >
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-slate-900">Booking Found</h4>
              <Badge variant="outline" className="text-xs mt-1">
                {foundBooking.company_name}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
                <Truck className="w-3 h-3 text-blue-600" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">{foundBooking.carrier_name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
                <Hash className="w-3 h-3 text-blue-600" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-900 font-mono truncate">{foundBooking.reference_number}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
                <User className="w-3 h-3 text-blue-600" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">{foundBooking.sender_name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
                <Clock className="w-3 h-3 text-blue-600" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-900">
                    {formatTime(foundBooking.start_time)}-{formatTime(foundBooking.end_time)}
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleSelectBooking}
              className="w-full h-9 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm"
            >
              Continue with This Booking
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
