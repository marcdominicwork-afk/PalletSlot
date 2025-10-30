import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, Package, Settings, AlertTriangle } from "lucide-react";

export default function VehicleTypeFormHelp() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Vehicle Type Configuration</h3>
        <p className="text-blue-800">
          Configure vehicle types for your company. Each vehicle type can have custom time calculations 
          that override company defaults, and determines which docks can accommodate the vehicle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Truck className="w-4 h-4 mr-2 text-blue-600" />
              Vehicle Information
            </h4>
            <div className="space-y-3 text-sm text-slate-600">
              <div>
                <strong>Name:</strong> Descriptive vehicle type name
                <div className="text-xs text-slate-500 mt-1">Examples: "Van", "7.5T Truck", "Articulated Lorry"</div>
              </div>
              <div>
                <strong>Code:</strong> Short identifier for the vehicle type
                <div className="text-xs text-slate-500 mt-1">Examples: "VAN", "7.5T", "ARTIC"</div>
              </div>
              <div>
                <strong>Description:</strong> Additional details about the vehicle type
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Package className="w-4 h-4 mr-2 text-blue-600" />
              Pallet Capacity
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Maximum number of pallets this vehicle type can carry. This affects:
            </p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>Dock compatibility (some docks may restrict vehicle types)</li>
              <li>Booking validation (prevents overbooking)</li>
              <li>Time calculation tier limits</li>
            </ul>
            <div className="bg-slate-50 p-3 rounded mt-3 text-xs text-slate-600">
              <div><strong>Typical Capacities:</strong></div>
              <div>Van: 6 pallets • 7.5T: 12 pallets • 18T: 24 pallets • Artic: 33 pallets</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
            <Settings className="w-4 h-4 mr-2 text-blue-600" />
            Custom Time Calculation
          </h4>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-900 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Time Calculation Hierarchy
              </h5>
              <div className="text-sm text-yellow-800 space-y-1">
                <div><strong>1. Company Default:</strong> Applied to all vehicle types by default</div>
                <div><strong>2. Vehicle Override:</strong> When "Use Custom Time Calculation" is enabled</div>
                <div><strong>3. Final Calculation:</strong> Max(Minimum Time, Pallet Time)</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-semibold text-slate-900 mb-2">When to Use Custom Times</h5>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Vehicle requires special handling procedures</li>
                  <li>Different loading/unloading speeds</li>
                  <li>Specialized equipment needed</li>
                  <li>Size-specific operational constraints</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-semibold text-slate-900 mb-2">Example Scenarios</h5>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Large Artic:</strong> Faster per-pallet (2 min) due to bulk efficiency</div>
                  <div><strong>Small Van:</strong> Higher minimum time (20 min) due to access constraints</div>
                  <div><strong>Refrigerated:</strong> Extra time for temperature checks</div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h5 className="font-semibold text-red-900 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Important Restrictions
              </h5>
              <div className="text-sm text-red-800 space-y-1">
                <div>• Pallet tier breaks cannot exceed the vehicle's maximum pallet capacity</div>
                <div>• The system automatically caps tier breaks at the max pallet limit</div>
                <div>• Adding tiers beyond capacity is prevented</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-3">Configuration Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
          <div>
            <strong>Standard Setup:</strong>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Use company defaults for most vehicle types</li>
              <li>Only customize when operationally necessary</li>
              <li>Keep configurations simple and predictable</li>
            </ul>
          </div>
          <div>
            <strong>Testing & Validation:</strong>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Test time calculations with typical pallet counts</li>
              <li>Validate against actual operational data</li>
              <li>Adjust based on dock performance metrics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}