
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, Truck, User, Hash, ArrowRight, ArrowLeft, Calendar, Building, Pencil } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function TimelineView({ bookings, docks, selectedDate }) {
  const navigate = useNavigate();
  const [hoveredBooking, setHoveredBooking] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const isPastDate = new Date(`${selectedDate}T00:00:00`).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getMovementTypeStyle = (movementType) => {
    return movementType === 'Inwards'
      ? { icon: <ArrowRight className="w-3 h-3" />, color: "from-blue-500 to-blue-600", bg: "bg-blue-50" }
      : { icon: <ArrowLeft className="w-3 h-3" />, color: "from-orange-500 to-amber-500", bg: "bg-orange-50" };
  };

  const handleMouseEnter = (booking) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (booking) {
      setHoveredBooking(booking);
    }
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredBooking(null);
    }, 200); // 200ms delay to allow moving to tooltip
  };

  // Filter bookings for selected date
  const dateBookings = bookings.filter(booking => booking.booking_date === selectedDate);

  // Generate time slots (30-minute intervals from 6 AM to 8 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 20 && minute > 0) break; // Stop at 8 PM
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get bookings for a specific dock and time slot
  const getBookingForSlot = (dockId, timeSlot) => {
    return dateBookings.find(booking => {
      if (booking.dock_id !== dockId) return false;
      
      const [slotHour, slotMin] = timeSlot.split(':').map(Number);
      const slotTime = slotHour * 60 + slotMin;
      
      const [startHour, startMin] = booking.start_time.split(':').map(Number);
      const [endHour, endMin] = booking.end_time.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      
      return slotTime >= startTime && slotTime < endTime;
    });
  };

  // Check if dock is open at this time
  const isDockOpen = (dock, timeSlot) => {
    const [hour] = timeSlot.split(':').map(Number);
    return hour >= dock.start_hour && hour < dock.end_hour;
  };

  // Format date for display
  const formatSelectedDate = (dateStr) => {
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (docks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">No docks configured. Please add docks first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center justify-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Timeline View - {formatSelectedDate(selectedDate)}</span>
        </h3>
        <p className="text-sm text-slate-600 mt-1">Hover over booked slots to see booking details</p>
      </div>

      {docks.filter(dock => dock.is_active).map((dock) => (
        <motion.div
          key={dock.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                  <span className="text-lg font-semibold text-slate-900">{dock.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {dock.movement_type}
                  </Badge>
                </div>
                <div className="text-sm text-slate-600">
                  {`${dock.start_hour.toString().padStart(2, '0')}:00 - ${dock.end_hour.toString().padStart(2, '0')}:00`}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Time axis */}
                <div className="flex mb-2 text-xs text-slate-500">
                  {timeSlots.filter((_, index) => index % 2 === 0).map((timeSlot) => (
                    <div key={timeSlot} className="flex-1 text-center">
                      {formatTime(timeSlot)}
                    </div>
                  ))}
                </div>
                
                {/* Timeline slots */}
                <div 
                  className="flex border border-slate-200 rounded-lg overflow-hidden"
                  onMouseLeave={handleMouseLeave}
                >
                  {timeSlots.map((timeSlot) => {
                    const booking = getBookingForSlot(dock.id, timeSlot);
                    const isOpen = isDockOpen(dock, timeSlot);
                    
                    const isHovered = hoveredBooking && booking && hoveredBooking.id === booking.id;
                    
                    const { icon, color, bg } = booking ? getMovementTypeStyle(booking.movement_type) : { icon: null, color: '', bg: '' };
                    
                    return (
                      <div
                        key={`${dock.id}-${timeSlot}`}
                        className={`flex-1 h-16 border-r border-slate-200 last:border-r-0 relative transition-all duration-200 ${
                          isHovered
                            ? 'bg-green-100 border-l-4 border-l-green-500'
                            : booking 
                              ? `${bg} border-l-4 border-l-blue-500` 
                              : isOpen 
                                ? 'bg-slate-50' 
                                : 'bg-slate-100'
                        }`}
                        onMouseEnter={() => handleMouseEnter(booking)}
                      >
                        {booking && (
                          <>
                            <div className="p-1 h-full flex flex-col justify-center">
                              <div className={`w-full h-full bg-gradient-to-r ${isHovered ? 'from-green-500 to-green-600' : color} rounded flex items-center justify-center text-white transition-all duration-200`}>
                                {icon}
                              </div>
                            </div>
                            
                            {/* The enhanced tooltip is now rendered outside this map loop for better positioning control */}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Enhanced Tooltip - rendered once per dock for the hovered booking */}
                {hoveredBooking && hoveredBooking.dock_id === dock.id && (
                  (() => {
                    const booking = hoveredBooking;
                    // Find the start time slot index to position the tooltip
                    let startIndex = timeSlots.indexOf(booking.start_time);

                    // If the exact start_time is not a 30-min slot, find the closest preceding slot
                    if (startIndex === -1) {
                      const [bookingStartHour, bookingStartMin] = booking.start_time.split(':').map(Number);
                      const bookingStartTimeMinutes = bookingStartHour * 60 + bookingStartMin;
                      
                      let closestSlotIndex = -1;
                      let minDiff = Infinity;

                      timeSlots.forEach((slot, index) => {
                        const [slotHour, slotMin] = slot.split(':').map(Number);
                        const slotTimeMinutes = slotHour * 60 + slotMin;
                        if (slotTimeMinutes <= bookingStartTimeMinutes) {
                          const diff = bookingStartTimeMinutes - slotTimeMinutes;
                          if (diff < minDiff) {
                            minDiff = diff;
                            closestSlotIndex = index;
                          }
                        }
                      });
                      startIndex = closestSlotIndex;
                    }

                    if (startIndex === -1) return null; // Fallback if no suitable start time slot found

                    // Calculate the left position for the tooltip based on the start time slot's position
                    const slotWidthPercentage = 100 / timeSlots.length;
                    const leftPosition = `${startIndex * slotWidthPercentage}%`;

                    return (
                      <div 
                        className="absolute bottom-full mb-2 opacity-100 transition-opacity z-50" // Removed pointer-events-none
                        style={{ left: leftPosition }} // Position the tooltip dynamically
                        onMouseEnter={() => handleMouseEnter(hoveredBooking)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="bg-slate-900 text-white text-xs rounded-xl p-4 shadow-2xl min-w-64 max-w-80 pointer-events-auto">
                          {/* Header */}
                          <div className="border-b border-slate-700 pb-2">
                            <div className="flex items-center space-x-2 font-semibold">
                              <Truck className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400">{booking.carrier_name}</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Hash className="w-3 h-3 text-slate-400" />
                              <span className="font-mono text-slate-300">{booking.reference_number}</span>
                            </div>
                          </div>
                          
                          {/* Details */}
                          <div className="grid grid-cols-2 gap-3 pt-3">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <User className="w-3 h-3 text-slate-400" />
                                <div>
                                  <div className="text-slate-400">Sender:</div>
                                  <div className="text-white font-medium">{booking.sender_name}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <div>
                                  <div className="text-slate-400">Time:</div>
                                  <div className="text-white font-medium">
                                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Package className="w-3 h-3 text-slate-400" />
                                <div>
                                  <div className="text-slate-400">Pallets:</div>
                                  <div className="text-white font-medium">
                                    {booking.pallet_count} pallet{booking.pallet_count > 1 ? 's' : ''}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Building className="w-3 h-3 text-slate-400" />
                                <div>
                                  <div className="text-slate-400">Company:</div>
                                  <div className="text-white font-medium">{booking.company_name}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Movement Type Badge */}
                          <div className="pt-2 mt-2 border-t border-slate-700">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {booking.movement_type === 'Inwards' 
                                  ? <ArrowRight className="w-3 h-3 text-blue-400" /> 
                                  : <ArrowLeft className="w-3 h-3 text-orange-400" />
                                }
                                <span className={`text-xs font-medium ${
                                  booking.movement_type === 'Inwards' ? 'text-blue-400' : 'text-orange-400'
                                }`}>
                                  {booking.movement_type}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400">
                                {booking.duration_minutes} min
                              </div>
                            </div>
                          </div>

                          {!isPastDate && (
                            <div className="pt-2 mt-2 border-t border-slate-700">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="w-full justify-center text-white hover:bg-slate-700 hover:text-white py-2 h-auto"
                                onClick={() => navigate(createPageUrl(`Booking?edit=${booking.id}`))}
                              >
                                <Pencil className="w-3 h-3 mr-2" />
                                Edit Booking
                              </Button>
                            </div>
                          )}
                          
                          {/* Tooltip Arrow */}
                          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
