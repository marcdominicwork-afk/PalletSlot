
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Clock, Package, Hash, User as UserIcon, Fence, Calendar, SearchX, UserCheck, Car, CheckCircle } from "lucide-react";
import { startOfDay } from 'date-fns';

export default function SearchResultsView({ 
    results, 
    onEdit, 
    searchTerm,
    formatTime,
    getDateLabel,
    getStatusColor
}) {
  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Bookings Found</h3>
        <p className="text-slate-600">
          We couldn't find any bookings with the reference number: <span className="font-mono bg-slate-100 p-1 rounded">{searchTerm}</span>
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">
        Search Results for: <span className="font-mono bg-slate-100 py-1 px-2 rounded-md shadow-inner text-blue-800">{searchTerm}</span>
      </h2>
      <div className="space-y-4">
        {results.map((booking) => {
          const isHistorical = new Date(`${booking.booking_date}T00:00:00`) < startOfDay(new Date());

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                      <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-slate-900">
                              {getDateLabel(booking.booking_date)}
                          </h3>
                      </div>
                      <Badge className={`${getStatusColor(booking.status)} mt-2 sm:mt-0`}>
                          {booking.status}
                      </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                      <div className="flex items-start space-x-2">
                        <strong className="w-20 shrink-0">Carrier:</strong>
                        <span>{booking.carrier_name}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <strong className="w-20 shrink-0">Sender:</strong>
                        <span>{booking.sender_name}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <strong className="w-20 shrink-0">Dock:</strong>
                        <span>{booking.dock_name}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <strong className="w-20 shrink-0">Time:</strong>
                        <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <strong className="w-20 shrink-0">Pallets:</strong>
                        <span>{booking.pallet_count}</span>
                      </div>
                  </div>

                  {isHistorical && booking.arrival_status === 'Arrived' && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center space-x-2 font-semibold text-green-700 mb-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Driver Arrived on Site</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
                            <div className="flex items-start space-x-2">
                                <strong className="w-20 shrink-0">Driver:</strong>
                                <span>{booking.driver_name}</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <strong className="w-20 shrink-0">Vehicle:</strong>
                                <span className="font-mono">{booking.vehicle_registration}</span>
                            </div>
                            <div className="flex items-start space-x-2 col-span-full">
                                <strong className="w-20 shrink-0">Time:</strong>
                                <span>{new Date(booking.arrival_time).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                  )}

                </CardContent>
                <CardFooter className="p-4 pt-0 bg-slate-50/50 border-t">
                  {!isHistorical ? (
                    <Button variant="outline" size="sm" onClick={() => onEdit(booking.id)}>
                        <Pencil className="w-3 h-3 mr-2" />
                        Edit Booking
                    </Button>
                  ) : (
                    <Badge variant="secondary">Historical Booking</Badge>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}
