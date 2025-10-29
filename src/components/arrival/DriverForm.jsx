import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserCheck, Car, AlertCircle, Clock } from "lucide-react";

export default function DriverForm({ booking, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    driver_name: '',
    vehicle_registration: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.driver_name.trim()) {
      newErrors.driver_name = 'Driver name is required';
    }
    
    if (!formData.vehicle_registration.trim()) {
      newErrors.vehicle_registration = 'Vehicle registration is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const arrivalData = {
        ...formData,
        booking_id: booking.id,
        arrival_time: new Date().toISOString()
      };
      onSubmit(arrivalData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const currentTime = new Date().toLocaleString();

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-slate-900 text-lg">
          <UserCheck className="w-5 h-5 text-green-600" />
          <span>Record Arrival</span>
        </CardTitle>
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <Clock className="w-3 h-3" />
          <span>Arrival time: {currentTime}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="driver_name" className="text-xs font-medium text-slate-700">
              Driver Name
            </Label>
            <Input
              id="driver_name"
              type="text"
              value={formData.driver_name}
              onChange={(e) => handleInputChange('driver_name', e.target.value)}
              placeholder="Enter driver's full name"
              className="h-9 text-sm border-slate-200 focus:border-green-500 focus:ring-green-500"
            />
            {errors.driver_name && (
              <p className="text-xs text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.driver_name}</span>
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="vehicle_registration" className="text-xs font-medium text-slate-700">
              Vehicle Registration
            </Label>
            <Input
              id="vehicle_registration"
              type="text"
              value={formData.vehicle_registration}
              onChange={(e) => handleInputChange('vehicle_registration', e.target.value.toUpperCase())}
              placeholder="Enter vehicle registration number"
              className="h-9 text-sm border-slate-200 focus:border-green-500 focus:ring-green-500 font-mono"
              style={{ textTransform: 'uppercase' }}
            />
            {errors.vehicle_registration && (
              <p className="text-xs text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.vehicle_registration}</span>
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes" className="text-xs font-medium text-slate-700">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes..."
              className="h-16 text-sm border-slate-200 focus:border-green-500 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="pt-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium text-sm rounded-lg shadow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Recording...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-3 h-3" />
                    <span>Confirm Arrival</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}