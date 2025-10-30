
import React, { useState, useEffect } from "react";
import { Arrival } from "@/api/entities";
import { User } from "@/api/entities";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Fence } from "lucide-react"; // Assuming Fence icon is from lucide-react

import BookingLookup from "../components/arrival/BookingLookup";
import DriverForm from "../components/arrival/DriverForm";
import ArrivalConfirmation from "../components/arrival/ArrivalConfirmation";

export default function ArrivalPage() {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmedArrival, setConfirmedArrival] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await User.me().catch(() => null);
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const isValidImageUrl = (url) => {
    if (!url) return false;
    // Basic check for common image extensions, case-insensitive
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const handleBookingFound = (booking) => {
    setSelectedBooking(booking);
  };

  const handleArrivalSubmit = async (arrivalData) => {
    setIsLoading(true);
    
    try {
      const newArrival = await Arrival.create(arrivalData);
      setConfirmedArrival(newArrival);
    } catch (error) {
      console.error('Error recording arrival:', error);
    }
    
    setIsLoading(false);
  };

  const handleNewArrival = () => {
    setSelectedBooking(null);
    setConfirmedArrival(null);
  };

  const handleViewSchedule = () => {
    navigate(createPageUrl("Schedule"));
  };

  if (confirmedArrival) {
    return (
      <div className="min-h-screen py-4 px-4 flex items-center justify-center">
        <ArrivalConfirmation
          arrival={confirmedArrival}
          booking={selectedBooking}
          onNewArrival={handleNewArrival}
          onViewSchedule={handleViewSchedule}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-4 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
            Driver Arrival
          </h1>
          <p className="text-sm md:text-lg text-slate-600">
            Record your arrival on site for delivery tracking
          </p>
        </motion.div>

        {!selectedBooking ? (
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <BookingLookup
                onBookingFound={handleBookingFound}
                isLoading={isLoading}
                currentUser={currentUser}
              />
            </motion.div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Selected Booking Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Selected Booking</h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Change
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-600">Carrier:</span>
                    <p className="font-medium text-slate-900">{selectedBooking.carrier_name}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Reference:</span>
                    <p className="font-medium text-slate-900 font-mono">{selectedBooking.reference_number}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Sender:</span>
                    <p className="font-medium text-slate-900">{selectedBooking.sender_name}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Pallets:</span>
                    <p className="font-medium text-slate-900">{selectedBooking.pallet_count}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-slate-900 mb-2">Assigned Dock: {selectedBooking.dock_name}</p>
                  {selectedBooking.dock_image_url && isValidImageUrl(selectedBooking.dock_image_url) ? (
                    <img 
                      src={selectedBooking.dock_image_url} 
                      alt={`Image of ${selectedBooking.dock_name}`}
                      className="w-full h-40 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        // On error, hide the image and show the next sibling (fallback div)
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-40 bg-slate-100 rounded-lg shadow-md items-center justify-center ${selectedBooking.dock_image_url && isValidImageUrl(selectedBooking.dock_image_url) ? 'hidden' : 'flex'}`}
                  >
                    <div className="text-center">
                      <Fence className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <span className="text-slate-500 text-sm">Dock image not available</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Driver Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DriverForm
                booking={selectedBooking}
                onSubmit={handleArrivalSubmit}
                isLoading={isLoading}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
