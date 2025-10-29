
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Truck, Calendar, Clock, Package, Hash, User, Fence, ArrowRight, ArrowLeft, Printer } from "lucide-react";

export default function BookingConfirmation({ booking, onNewBooking, onViewSchedule, title, message }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    // Adjust for timezone offset to prevent date from shifting
    const timezoneOffset = d.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(d.getTime() + timezoneOffset);

    return adjustedDate.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            /* Hide elements not meant for printing */
            .no-print {
              display: none !important;
            }

            /* Hide everything on the page by default */
            body * {
              visibility: hidden;
            }

            /* Make the printable container and its children visible */
            .printable-area-container, .printable-area-container * {
              visibility: visible;
            }

            /* Position the printable container at the top of the page */
            .printable-area-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 1rem; /* This becomes the margin on the printed paper */
              box-sizing: border-box;
            }
            
            /* Style the card for printing */
            .printable-area {
              box-shadow: none !important;
              border: 1px solid #e5e7eb !important;
              width: 100%;
              max-width: 100%;
              margin: 0;
              padding: 0;
            }

            .printable-area .printable-card-content {
                padding: 1rem;
            }
            
            /* Grid styles for the details section */
            .details-container {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                align-items: start;
            }
            .details-container > div {
                margin: 0 !important;
                padding: 0.5rem !important;
                border: 1px solid #eee;
                border-radius: 0.5rem;
                height: 100%;
            }
            
            /* Styles for the image section */
            .image-wrapper {
                grid-column: 1 / -1;
                margin-top: 1rem !important;
                border: none !important;
                padding: 0 !important;
            }
            .image-wrapper img {
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
                display: block;
                border-radius: 0.5rem;
            }
            .additional-info-wrapper {
                grid-column: 1 / -1;
                margin-top: 1rem !important;
            }
          }
        `}
      </style>
      <div className="printable-area-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm printable-area">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 no-print"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-xl text-slate-900">
                {title || "Booking Confirmed!"}
              </CardTitle>
              <p className="text-slate-600 text-sm mt-2">
                {message || "Your slot has been successfully reserved"}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6 printable-card-content">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 details-container">
                <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                  booking.movement_type === 'Outwards' 
                    ? 'bg-orange-50 border border-orange-200' 
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  {booking.movement_type === 'Inwards' 
                    ? <ArrowRight className="w-5 h-5 text-blue-600" /> 
                    : <ArrowLeft className="w-5 h-5 text-orange-600" />
                  }
                  <div>
                    <p className="text-sm font-medium text-slate-900">Movement Type</p>
                    <p className={`text-sm font-medium ${
                      booking.movement_type === 'Outwards' ? 'text-orange-700' : 'text-blue-700'
                    }`}>{booking.movement_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Carrier</p>
                    <p className="text-sm text-slate-600">{booking.carrier_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Sender</p>
                    <p className="text-sm text-slate-600">{booking.sender_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Hash className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Reference Number</p>
                    <p className="text-sm text-slate-600 font-mono">{booking.reference_number}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Pallets</p>
                    <p className="text-sm text-slate-600">{booking.pallet_count} pallet{booking.pallet_count > 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Fence className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Assigned Dock</p>
                    <p className="text-sm text-slate-600 font-semibold">{booking.dock_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Date</p>
                    <p className="text-sm text-slate-600">{formatDate(booking.booking_date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Time Slot</p>
                    <p className="text-sm text-slate-600">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </p>
                  </div>
                </div>

                {booking.dock_image_url && (
                  <div className="mt-4 image-wrapper md:col-span-3">
                    <p className="text-sm font-medium text-slate-900 mb-2 no-print">Assigned Dock Image</p>
                    <img
                      src={booking.dock_image_url}
                      alt={`Image of ${booking.dock_name}`}
                      className="rounded-lg shadow-md cursor-pointer w-full object-cover aspect-[16/9]"
                      onClick={() => setIsModalOpen(true)}
                    />
                  </div>
                )}

                {booking.dock_additional_info && (
                  <div className="additional-info-wrapper md:col-span-3">
                    <p className="text-sm font-medium text-slate-900 mb-2">Important Information</p>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900 whitespace-pre-wrap">
                      {booking.dock_additional_info}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 no-print">
                <Button
                  variant="outline"
                  onClick={onNewBooking}
                  className="h-11 border-slate-200 hover:bg-slate-50"
                >
                  New Booking
                </Button>
                <Button
                  onClick={onViewSchedule}
                  className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  View Schedule
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="h-11 border-slate-200 hover:bg-slate-50"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 no-print"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.img
            src={booking.dock_image_url}
            alt={`Image of ${booking.dock_name}`}
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
