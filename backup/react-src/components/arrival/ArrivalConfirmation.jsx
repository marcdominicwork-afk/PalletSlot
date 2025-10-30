import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, UserCheck, Car, Clock, Hash, Truck } from "lucide-react";

export default function ArrivalConfirmation({ arrival, booking, onNewArrival, onViewSchedule }) {
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-xl text-slate-900">
            Arrival Recorded!
          </CardTitle>
          <p className="text-slate-600 text-sm mt-2">
            Driver arrival has been successfully logged
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Driver</p>
                <p className="text-sm text-slate-600">{arrival.driver_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Car className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Vehicle Registration</p>
                <p className="text-sm text-slate-600 font-mono">{arrival.vehicle_registration}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Arrival Time</p>
                <p className="text-sm text-slate-600">{formatDateTime(arrival.arrival_time)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Delivery for</p>
                <p className="text-sm text-slate-600">{booking.carrier_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Hash className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Reference</p>
                <p className="text-sm text-slate-600 font-mono">{booking.reference_number}</p>
              </div>
            </div>
            
            {arrival.notes && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-900 mb-1">Notes</p>
                <p className="text-sm text-slate-600">{arrival.notes}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onNewArrival}
              className="h-11 border-slate-200 hover:bg-slate-50"
            >
              New Arrival
            </Button>
            <Button
              onClick={onViewSchedule}
              className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              View Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}