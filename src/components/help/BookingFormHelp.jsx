import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, Truck, Calendar, User, Hash, Building, ArrowRight, ArrowLeft } from "lucide-react";

export default function BookingFormHelp() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Book a Delivery Slot</h3>
        <p className="text-blue-800">
          Complete all the delivery details below, and the system will show you available time slots. 
          The booking duration is automatically calculated based on your pallet count and company settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Building className="w-4 h-4 mr-2 text-blue-600" />
              Company Selection
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Select the company you're delivering to. This determines which docks are available and the time calculation rules.
            </p>
            <div className="bg-slate-50 p-3 rounded text-xs text-slate-600">
              <strong>Example:</strong> "Cario W/H" - Warehouse operations company
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <div className="w-4 h-4 mr-2 flex items-center">
                <ArrowRight className="w-3 h-3 text-blue-600" />
                <ArrowLeft className="w-3 h-3 text-orange-600 -ml-1" />
              </div>
              Movement Type
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Choose the type of delivery operation.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800 text-xs">Inwards</Badge>
                <span className="text-xs text-slate-600">Delivering goods to the warehouse</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-orange-100 text-orange-800 text-xs">Outwards</Badge>
                <span className="text-xs text-slate-600">Collecting goods from the warehouse</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Truck className="w-4 h-4 mr-2 text-blue-600" />
              Vehicle & Carrier Info
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Select your vehicle type and carrier. Vehicle type affects which docks you can use and may override time calculations.
            </p>
            <div className="space-y-1 text-xs text-slate-600">
              <div><strong>Vehicle Type:</strong> Determines dock compatibility and pallet limits</div>
              <div><strong>Carrier:</strong> Your transport company name</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Package className="w-4 h-4 mr-2 text-blue-600" />
              Pallet Count & Time Calculation
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Enter the number of pallets. The system automatically calculates booking duration using tiered rates.
            </p>
            <div className="bg-slate-50 p-3 rounded text-xs text-slate-600">
              <div><strong>Example for Cario W/H:</strong></div>
              <div>• 1-10 pallets: 5 minutes per pallet</div>
              <div>• 11-25 pallets: 3 minutes per pallet</div>
              <div>• 26+ pallets: 2 minutes per pallet</div>
              <div className="mt-1"><strong>Minimum time:</strong> 15 minutes</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              Delivery Details
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Provide sender information and reference number for tracking.
            </p>
            <div className="space-y-1 text-xs text-slate-600">
              <div><strong>Sender Name:</strong> Company or person sending the goods</div>
              <div><strong>Reference Number:</strong> Unique identifier for this delivery</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              Date Selection
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Choose your preferred delivery date. Only future dates are allowed.
            </p>
            <div className="bg-slate-50 p-3 rounded text-xs text-slate-600">
              <strong>Tip:</strong> Book early for better time slot availability, especially during busy periods.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Next Steps
        </h4>
        <ol className="list-decimal list-inside space-y-2 text-green-800 text-sm">
          <li>Complete all required fields above</li>
          <li>Available time slots will appear below the form</li>
          <li>Select your preferred time slot</li>
          <li>Review the assigned dock information</li>
          <li>Click "Confirm Booking" to reserve your slot</li>
        </ol>
      </div>
    </div>
  );
}