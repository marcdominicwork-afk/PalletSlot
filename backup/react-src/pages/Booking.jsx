
import React, { useState, useEffect } from "react";
import { Booking } from "@/api/entities";
import { Dock } from "@/api/entities";
import { User } from "@/api/entities";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, addDays, parseISO } from "date-fns";
import { Fence } from "lucide-react";
import { Warehouse } from "@/api/entities"; // Import Warehouse

import BookingForm from "../components/booking/BookingForm";
import TimeSlotGrid from "../components/booking/TimeSlotGrid";
import BookingConfirmation from "../components/booking/BookingConfirmation";
import NoSlotsDialog from "../components/booking/NoSlotsDialog";

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [docks, setDocks] = useState([]);
  const [warehouses, setWarehouses] = useState([]); // New state for warehouses
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false); // New state for loading warehouses
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [movementType, setMovementType] = useState('Inwards');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [formData, setFormData] = useState(null);
  const [availableDock, setAvailableDock] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showNoSlotsDialog, setShowNoSlotsDialog] = useState(false);
  const [shouldCheckSlotAvailability, setShouldCheckSlotAvailability] = useState(true);

  const [editingBookingId, setEditingBookingId] = useState(null);
  const [pageTitle, setPageTitle] = useState("Book Your Delivery Slot");
  const [confirmationDetails, setConfirmationDetails] = useState({
    title: "Booking Confirmed!",
    message: "Your slot has been successfully reserved."
  });

  // New function to handle company selection and persist in localStorage
  const handleCompanySelection = (companyId) => {
    localStorage.setItem('selectedCompanyId', companyId);
    setSelectedCompanyId(companyId);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const bookingIdToEdit = urlParams.get('edit');

    const loadInitialData = async () => {
      const user = await User.me().catch(() => null);
      setCurrentUser(user);
      
      if (bookingIdToEdit) {
        setEditingBookingId(bookingIdToEdit);
        setPageTitle("Edit Your Delivery Slot");
        await loadBookingForEdit(bookingIdToEdit);
      } else {
        setEditingBookingId(null);
        setPageTitle("Book Your Delivery Slot");
        
        let initialCompanyId = '';
        if (user && user.role !== 'admin' && user.company_id) {
            initialCompanyId = user.company_id;
        } else {
            initialCompanyId = localStorage.getItem('selectedCompanyId') || '';
        }
        
        if (initialCompanyId) {
             handleCompanySelection(initialCompanyId);
             loadWarehouses(initialCompanyId); // Load warehouses for initial company
        }
       
        // Reset form data and selections only when not editing
        setFormData({
            company_id: initialCompanyId,
            warehouse_id: '', // Added warehouse_id
            carrier_id: '', // Added carrier_id
            carrier_name: '',
            sender_name: '',
            reference_number: '',
            pallet_count: '',
            vehicle_type_id: '',
            booking_date: format(new Date(), 'yyyy-MM-dd'),
            movement_type: 'Inwards'
        });

        setSelectedTime(null);
        setDuration(0);
        setAvailableDock(null);
      }
    }

    loadInitialData();
    loadBookings();
    loadDocks();
  }, [location.search]);

  const loadBookingForEdit = async (bookingId) => {
    setIsLoading(true);
    try {
      const bookingToEdit = await Booking.get(bookingId);
      // Fetch the specific warehouse for the booking being edited
      const bookingWarehouse = await Warehouse.get(bookingToEdit.warehouse_id);
      setWarehouses([bookingWarehouse]); // Set warehouses state with the single warehouse

      const initialFormData = {
        company_id: bookingToEdit.company_id,
        company_name: bookingToEdit.company_name,
        warehouse_id: bookingToEdit.warehouse_id, // Added warehouse
        warehouse_name: bookingToEdit.warehouse_name, // Added warehouse
        carrier_id: bookingToEdit.carrier_id || '', // Ensure carrier_id is loaded
        carrier_name: bookingToEdit.carrier_name,
        sender_name: bookingToEdit.sender_name,
        reference_number: bookingToEdit.reference_number,
        pallet_count: String(bookingToEdit.pallet_count), // Ensure it's a string for form field
        vehicle_type_id: bookingToEdit.vehicle_type_id,
        vehicle_type_name: bookingToEdit.vehicle_type_name,
        booking_date: bookingToEdit.booking_date,
        movement_type: bookingToEdit.movement_type,
      };
      setFormData(initialFormData);
      setDuration(bookingToEdit.duration_minutes);
      setMovementType(bookingToEdit.movement_type);
      handleCompanySelection(bookingToEdit.company_id); // Use the new handler
      setSelectedTime(bookingToEdit.start_time);
      
      // Set the dock from the existing booking data
      setAvailableDock({
        id: bookingToEdit.dock_id,
        name: bookingToEdit.dock_name,
        image_url: bookingToEdit.dock_image_url || '',
        additional_info: bookingToEdit.dock_additional_info || ''
      });
      
    } catch (error) {
      console.error("Failed to load booking for editing:", error);
      alert("Could not load the booking to edit. It may have been deleted.");
      navigate(createPageUrl("Schedule"));
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookings = async () => {
    const data = await Booking.list();
    setBookings(data);
  };

  const loadDocks = async () => {
    const data = await Dock.list();
    setDocks(data);
  };

  const loadWarehouses = async (companyId) => {
    if (!companyId) {
      setWarehouses([]);
      return;
    }
    setIsLoadingWarehouses(true);
    try {
      const data = await Warehouse.filter({ company_id: companyId, is_active: true });
      setWarehouses(data);
    } catch (error) {
      console.error('Error loading warehouses:', error);
      setWarehouses([]);
    } finally {
      setIsLoadingWarehouses(false);
    }
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
    setSelectedTime(null); // Always clear selected time when form data changes
    setAvailableDock(null); // Clear available dock when form data changes
    setShouldCheckSlotAvailability(true); // Re-enable availability check when form data changes
  };

  const handleFormChange = (field, value) => {
    // When company changes, clear warehouse and vehicle type
    if (field === 'company_id') {
      loadWarehouses(value); // Load new warehouses for the selected company
      setFormData(prev => ({ ...(prev || {}), [field]: value, warehouse_id: '', vehicle_type_id: '' }));
    } 
    // When warehouse changes, clear vehicle type
    else if (field === 'warehouse_id') {
      setFormData(prev => ({ ...(prev || {}), [field]: value, vehicle_type_id: '' }));
    }
    else {
      setFormData(prev => ({ ...(prev || {}), [field]: value }));
    }
  };
  
  const findAvailableDock = (timeToBook) => { // Modified to accept time as argument
    if (!formData || !timeToBook || !bookings || !docks) {
      return null;
    }

    // Filter out the current booking if editing, so it doesn't conflict with itself
    const relevantBookings = bookings.filter(b => 
      b.booking_date === formData.booking_date && b.id !== editingBookingId
    );

    const activeDocks = docks.filter(d => 
      d.is_active &&
      d.company_id === formData.company_id &&
      d.warehouse_id === formData.warehouse_id && // Filter by warehouse
      (d.movement_type === formData.movement_type || d.movement_type === 'Both')
    );

    const [hours, minutes] = timeToBook.split(':').map(Number);
    const slotStart = hours * 60 + minutes;
    const slotEnd = slotStart + duration;

    for (const dock of activeDocks) {
      const dockStart = dock.start_hour * 60;
      const dockEnd = dock.end_hour * 60;
      
      if (slotStart < dockStart || slotEnd > dockEnd) {
        continue;
      }

      const hasConflict = relevantBookings.some(booking => {
        if (booking.dock_id !== dock.id) {
          return false;
        }
        
        const [bookingStartHour, bookingStartMin] = booking.start_time.split(':').map(Number);
        const bookingStart = bookingStartHour * 60 + bookingStartMin;
        const bookingEnd = bookingStart + booking.duration_minutes;
        
        return slotStart < bookingEnd && slotEnd > bookingStart;
      });

      if (!hasConflict) {
        return dock;
      }
    }
    return null;
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (time) {
      const dock = findAvailableDock(time);
      setAvailableDock(dock);
    } else {
      setAvailableDock(null);
    }
  };

  const handleBookingConfirm = async () => {
    if (!formData || !selectedTime) return;
    
    setIsLoading(true);
    
    // Re-check available dock just before confirming to ensure it's still free
    const recheckedDock = findAvailableDock(selectedTime);
    if (!recheckedDock) {
      alert("Sorry, this time slot is no longer available or no suitable dock is free. Please select another time.");
      setIsLoading(false);
      setSelectedTime(null); // Clear selection if no longer available
      setAvailableDock(null); // Clear dock if no longer available
      return;
    }
    
    try {
      const startTime = selectedTime;
      const [hours, minutes] = startTime.split(':').map(Number);
      const endTimeMinutes = hours * 60 + minutes + duration;
      const endHours = Math.floor(endTimeMinutes / 60);
      const endMins = endTimeMinutes % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
      
      const bookingData = {
        ...formData,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: duration,
        pallet_count: parseInt(formData.pallet_count),
        dock_id: recheckedDock.id, // Use recheckedDock
        dock_name: recheckedDock.name, // Use recheckedDock
        dock_image_url: recheckedDock.image_url || '',
        dock_additional_info: recheckedDock.additional_info || '' // Added new field
      };
      
      if (editingBookingId) {
        const updatedBooking = await Booking.update(editingBookingId, bookingData);
        setConfirmationDetails({
          title: "Booking Updated!",
          message: "Your slot has been successfully updated."
        });
        setConfirmedBooking(updatedBooking);
      } else {
        const newBooking = await Booking.create(bookingData);
        setConfirmationDetails({
          title: "Booking Confirmed!",
          message: "Your slot has been successfully reserved."
        });
        setConfirmedBooking(newBooking);
      }
      await loadBookings(); // Reload bookings to reflect the new/updated booking
    } catch (error) {
      console.error('Error processing booking:', error);
      alert('Failed to process booking. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleNewBooking = () => {
    setConfirmedBooking(null);
    // Navigate to the base booking page to clear any edit parameters
    navigate(createPageUrl("Booking"));
  };

  const handleViewSchedule = () => {
    navigate(createPageUrl("Schedule"));
  };

  const handleCheckNextDay = () => {
    if (formData?.booking_date) {
      const currentDate = parseISO(formData.booking_date);
      const nextDay = addDays(currentDate, 1);
      const nextDayStr = format(nextDay, 'yyyy-MM-dd');
      handleFormChange('booking_date', nextDayStr);
    }
    setShowNoSlotsDialog(false);
    setShouldCheckSlotAvailability(true); // Re-enable checking for the new date
  };

  const handleCheckSpecificDate = (date) => {
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      handleFormChange('booking_date', dateStr);
    }
    setShouldCheckSlotAvailability(true); // Re-enable checking for the new date
    // No need to close dialog here as it is handled within the component
  };

  const handleNoSlotsDialogClose = () => {
    setShowNoSlotsDialog(false);
    setShouldCheckSlotAvailability(false); // Disable checking to prevent loop
  };

  // Filter docks by selected company AND warehouse
  const filteredDocks = selectedCompanyId && formData?.warehouse_id
    ? docks.filter(dock => dock.company_id === selectedCompanyId && dock.warehouse_id === formData.warehouse_id)
    : [];

  const isValidImageUrl = (url) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  if (confirmedBooking) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <BookingConfirmation
          booking={confirmedBooking}
          onNewBooking={handleNewBooking}
          onViewSchedule={handleViewSchedule}
          title={confirmationDetails.title}
          message={confirmationDetails.message}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <NoSlotsDialog
        isOpen={showNoSlotsDialog}
        onClose={handleNoSlotsDialogClose}
        onCheckNextDay={handleCheckNextDay}
        onCheckSpecificDate={handleCheckSpecificDate}
      />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {pageTitle}
          </h1>
          <p className="text-lg text-slate-600">
            {editingBookingId ? "Modify details and select a new time slot if needed" : "Complete your delivery details first, then select an available time slot"}
          </p>
        </motion.div>

        {/* Booking Form at Top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <BookingForm
            formData={formData}
            onFormChange={handleFormChange}
            currentUser={currentUser}
            onSubmit={handleFormSubmit}
            onPalletCountChange={setDuration}
            onMovementTypeChange={setMovementType}
            onCompanyChange={handleCompanySelection}
            isLoading={isLoading}
            warehouses={warehouses} // Pass warehouses
            isLoadingWarehouses={isLoadingWarehouses} // Pass loading state
          />
        </motion.div>

        {/* Time Slot Selection - Only show when form is complete */}
        {formData && formData.company_id && formData.warehouse_id && formData.carrier_id && formData.sender_name && formData.reference_number && formData.pallet_count && formData.vehicle_type_id && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8"
          >
            <TimeSlotGrid
              selectedDate={formData?.booking_date || format(new Date(), 'yyyy-MM-dd')}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
              bookings={bookings.filter(b => b.id !== editingBookingId)}
              docks={filteredDocks}
              duration={duration}
              movementType={movementType}
              shouldCheckAvailability={shouldCheckSlotAvailability}
              onNoSlotsAvailable={() => {
                // Prevent dialog from showing repeatedly while loading or already open
                if (!isLoading && !showNoSlotsDialog && shouldCheckSlotAvailability) {
                  setShowNoSlotsDialog(true);
                }
              }}
            />
          </motion.div>
        )}

        {/* Booking Confirmation Section */}
        <AnimatePresence>
          {formData && selectedTime && availableDock && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Ready to confirm?</p>
                    <p className="text-sm text-slate-600">
                      {formData.company_name} • {formData.warehouse_name} • {formData.carrier_name} • {formData.sender_name} • {formData.reference_number} • {formData.pallet_count} pallet{formData.pallet_count > 1 ? 's' : ''} • {formData.movement_type} • {selectedTime}
                    </p>
                    {availableDock && (
                      <div className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mt-2">
                        <Fence className="w-4 h-4 text-blue-600" />
                        <span>Allocated Dock: {availableDock.name}</span>
                      </div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBookingConfirm}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (editingBookingId ? 'Updating...' : 'Confirming...') : (editingBookingId ? 'Update Booking' : 'Confirm Booking')}
                  </motion.button>
                </div>

                {availableDock && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-slate-900 mb-2">Assigned Dock: {availableDock.name}</p>
                    {availableDock.additional_info && (
                      <p className="text-xs text-slate-500 mb-2">{availableDock.additional_info}</p>
                    )}
                    {availableDock.image_url && isValidImageUrl(availableDock.image_url) ? (
                      <div className="flex justify-center">
                        <img 
                          src={availableDock.image_url} 
                          alt={`Image of ${availableDock.name}`} 
                          className="h-32 w-full max-w-md object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="hidden h-32 w-full max-w-md bg-slate-100 rounded-lg shadow-md items-center justify-center"
                        >
                          <div className="text-center">
                            <Fence className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <span className="text-slate-500 text-sm">Dock image not available</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <div className="h-32 w-full max-w-md bg-slate-100 rounded-lg shadow-md flex items-center justify-center">
                          <div className="text-center">
                            <Fence className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <span className="text-slate-500 text-sm">Dock image not available</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
