
import React, { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function TimeSlotGrid({ 
  selectedDate, 
  selectedTime, 
  onTimeSelect, 
  bookings,
  docks,
  duration,
  movementType,
  onNoSlotsAvailable,
  shouldCheckAvailability = true
}) {
  const timeSlotsWithAvailability = useMemo(() => {
    if (!docks || docks.length === 0) return [];

    const activeDocks = docks.filter(d => 
      d.is_active && 
      (d.movement_type === movementType || d.movement_type === 'Both')
    );
    if (activeDocks.length === 0) return [];
    
    const minStartHour = Math.min(...activeDocks.map(d => d.start_hour));
    const maxEndHour = Math.max(...activeDocks.map(d => d.end_hour));
    const dateBookings = bookings.filter(b => b.booking_date === selectedDate);
    
    const slots = [];
    for (let hour = minStartHour; hour < maxEndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }

    const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');
    const now = new Date();

    return slots.map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      
      const isPast = isToday && (hours * 60 + minutes) < (now.getHours() * 60 + now.getMinutes());

      let isAvailable = false;
      if (duration > 0 && !isPast) {
        const slotStart = hours * 60 + minutes;
        const slotEnd = slotStart + duration;

        const availableDocks = activeDocks.filter(dock => {
          const dockStart = dock.start_hour * 60;
          const dockEnd = dock.end_hour * 60;
          
          // Check if slot is within dock operating hours
          if (slotStart < dockStart || slotEnd > dockEnd) {
            return false;
          }
          
          // Check for conflicts with existing bookings on this dock
          const hasConflict = dateBookings.some(booking => {
            if (booking.dock_id !== dock.id) return false;
            
            const [bookingStartHour, bookingStartMin] = booking.start_time.split(':').map(Number);
            const bookingStart = bookingStartHour * 60 + bookingStartMin;
            const bookingEnd = bookingStart + booking.duration_minutes;
            
            return slotStart < bookingEnd && slotEnd > bookingStart;
          });
          
          return !hasConflict;
        });

        isAvailable = availableDocks.length > 0;
      }
      return { time, available: isAvailable };
    });
  }, [selectedDate, bookings, docks, duration, movementType]);

  useEffect(() => {
    // This check is now more robust. It fires if slots exist but none are available,
    // OR if no slots could be generated at all (e.g. no active docks for the criteria).
    if (duration > 0 && onNoSlotsAvailable && shouldCheckAvailability) {
      const hasAvailableSlots = timeSlotsWithAvailability.some(s => s.available);
      if (!hasAvailableSlots) {
        onNoSlotsAvailable();
      }
    }
  }, [timeSlotsWithAvailability, duration, onNoSlotsAvailable, shouldCheckAvailability]);

  // Show company selection message if no docks are provided (company not selected)
  if (!docks || docks.length === 0) {
    return (
      <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-blue-600" />
        <span className="text-sm text-blue-800">Select a company you wish to book a delivery for.</span>
      </div>
    );
  }

  // Show dock configuration message if company is selected but no active docks
  if (docks.filter(d => d.is_active).length === 0) {
    return (
      <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <span className="text-sm text-red-800">No active docks are configured for the selected company. Please contact an administrator.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Available Time Slots</h3>
        {movementType && duration > 0 && (
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${movementType === 'Inwards' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                {movementType}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{duration} minutes</span>
            </div>
          </div>
        )}
      </div>
      
      {duration === 0 && (
        <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span className="text-sm text-amber-800">Please enter number of pallets to see available slots</span>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {timeSlotsWithAvailability.map(({ time, available }) => {
          const isSelected = selectedTime === time;
          
          return (
            <motion.button
              key={time}
              whileHover={{ scale: available ? 1.02 : 1 }}
              whileTap={{ scale: available ? 0.98 : 1 }}
              onClick={() => available && onTimeSelect(time)}
              disabled={!available || !duration}
              className={`
                relative p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : available && duration
                    ? 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                    : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-xs font-normal">
                  {new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
                {available && duration > 0 && (
                  <span className="text-xs text-slate-500">
                    - {new Date(new Date(`2000-01-01T${time}`).getTime() + duration * 60000).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                  </span>
                )}
              </div>
              
              {isSelected && (
                <div className="absolute inset-0 rounded-xl border-2 border-blue-500 bg-blue-500/10" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
