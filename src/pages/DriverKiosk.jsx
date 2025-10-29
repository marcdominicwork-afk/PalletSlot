import React, { useState, useEffect } from "react";
import { Arrival } from "@/api/entities";
import { User } from "@/api/entities";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Fence } from "lucide-react";

import BookingLookup from "../components/arrival/BookingLookup";
import DriverForm from "../components/arrival/DriverForm";
import KioskConfirmation from "../components/kiosk/KioskConfirmation";

export default function DriverKiosk() {
  const [step, setStep] = useState('lookup'); // 'lookup', 'details', 'confirmed'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmedArrival, setConfirmedArrival] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    // Setting a generic user for public kiosk access
    const fetchUser = async () => {
      const user = await User.me().catch(() => null);
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const handleBookingFound = (booking) => {
    setSelectedBooking(booking);
    setStep('details');
  };

  const handleArrivalSubmit = async (arrivalData) => {
    setIsLoading(true);
    try {
      const newArrival = await Arrival.create(arrivalData);
      setConfirmedArrival(newArrival);
      setStep('confirmed');
    } catch (error) {
      console.error('Error recording arrival:', error);
      alert('Failed to record arrival. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewArrival = () => {
    setSelectedBooking(null);
    setConfirmedArrival(null);
    setStep('lookup');
  };
  
  const isValidImageUrl = (url) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div 
        className="h-screen w-screen bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-010f63418999?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="h-full w-full bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 overflow-y-auto">
        
        {/* Header */}
        <div className="text-center text-white mb-8">
          <Truck size={48} className="mx-auto text-blue-300"/>
          <h1 className="text-5xl font-bold mt-2 tracking-tight">PalletSlot</h1>
          <p className="text-2xl text-slate-300">Driver Check-in</p>
        </div>
        
        {/* Content Stages */}
        <AnimatePresence mode="wait">
          {step === 'lookup' && (
            <motion.div key="lookup" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full max-w-2xl">
              <BookingLookup
                onBookingFound={handleBookingFound}
                isLoading={isLoading}
                currentUser={currentUser}
              />
            </motion.div>
          )}

          {step === 'details' && selectedBooking && (
            <motion.div key="details" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full max-w-5xl">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Booking Summary */}
                <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-900">Your Booking Details</h3>
                    <button
                      onClick={() => setStep('lookup')}
                      className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      Not your booking?
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-md">
                    <div>
                      <span className="text-slate-600 block text-sm">Carrier</span>
                      <p className="font-semibold text-slate-900">{selectedBooking.carrier_name}</p>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-sm">Reference #</span>
                      <p className="font-semibold text-slate-900 font-mono">{selectedBooking.reference_number}</p>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-sm">Sender</span>
                      <p className="font-semibold text-slate-900">{selectedBooking.sender_name}</p>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-sm">Pallets</span>
                      <p className="font-semibold text-slate-900">{selectedBooking.pallet_count}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-md font-semibold text-slate-900 mb-2">Proceed to Dock: {selectedBooking.dock_name}</p>
                    {selectedBooking.dock_image_url && isValidImageUrl(selectedBooking.dock_image_url) ? (
                      <img 
                        src={selectedBooking.dock_image_url} 
                        alt={`Dock ${selectedBooking.dock_name}`}
                        className="w-full h-48 object-cover rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-slate-100 rounded-lg shadow-md flex items-center justify-center">
                        <div className="text-center">
                          <Fence className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                          <span className="text-slate-500 text-md">Dock image not available</span>
                        </div>
                      </div>
                    )}
                     {selectedBooking.dock_additional_info && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
                            {selectedBooking.dock_additional_info}
                        </div>
                    )}
                  </div>
                </div>

                {/* Driver Form */}
                <DriverForm
                  booking={selectedBooking}
                  onSubmit={handleArrivalSubmit}
                  isLoading={isLoading}
                />
              </div>
            </motion.div>
          )}
            
          {step === 'confirmed' && confirmedArrival && (
            <motion.div key="confirmed" variants={variants} initial="initial" animate="animate" exit="exit">
              <KioskConfirmation
                booking={selectedBooking}
                onNextDriver={handleNewArrival}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}