import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fence, Clock, Truck, ArrowRight, ArrowLeft, Camera, Info } from "lucide-react";

export default function DockFormHelp() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Dock Configuration Guide</h3>
        <p className="text-blue-800">
          Configure loading docks for your company. Each dock can have specific operating hours, 
          movement types, and vehicle restrictions to optimize your loading operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Fence className="w-4 h-4 mr-2 text-blue-600" />
              Basic Dock Information
            </h4>
            <div className="space-y-3 text-sm text-slate-600">
              <div>
                <strong>Dock Name:</strong> Unique identifier for the dock
                <div className="text-xs text-slate-500 mt-1">Examples: "Dock 1", "North Bay", "Express Lane"</div>
              </div>
              <div>
                <strong>Status:</strong> Active docks are available for bookings
                <div className="text-xs text-slate-500 mt-1">Inactive docks won't appear in time slot selection</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              Operating Hours
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Define when this dock is available for operations using 24-hour format.
            </p>
            <div className="bg-slate-50 p-3 rounded text-xs text-slate-600">
              <div><strong>Examples:</strong></div>
              <div>• Standard: 08:00 - 17:00</div>
              <div>• Early Start: 06:00 - 22:00</div>
              <div>• Night Shift: 22:00 - 06:00 (next day)</div>
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
              Movement Types
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Specify which types of operations this dock supports.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800 text-xs">Inwards</Badge>
                <span className="text-xs text-slate-600">Receiving deliveries into warehouse</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-orange-100 text-orange-800 text-xs">Outwards</Badge>
                <span className="text-xs text-slate-600">Dispatching goods from warehouse</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-100 text-purple-800 text-xs">Both</Badge>
                <span className="text-xs text-slate-600">Supports both inwards and outwards</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Truck className="w-4 h-4 mr-2 text-blue-600" />
              Vehicle Type Restrictions
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Select which vehicle types can use this dock. Consider physical constraints.
            </p>
            <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-800">
              <strong>Consider:</strong> Height clearance, turning radius, weight limits, dock door size
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
            <Camera className="w-4 h-4 mr-2 text-blue-600" />
            Visual & Additional Information
          </h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-semibold text-slate-900 mb-2">Dock Image</h5>
                <div className="text-sm text-slate-600 space-y-2">
                  <p>Upload a photo to help drivers locate and identify the dock.</p>
                  <div className="text-xs text-slate-500">
                    <div><strong>Good photos show:</strong></div>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Clear dock number or signage</li>
                      <li>Approach route and parking area</li>
                      <li>Any special equipment or features</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-semibold text-slate-900 mb-2">Additional Information</h5>
                <div className="text-sm text-slate-600 space-y-2">
                  <p>Provide important instructions or warnings for drivers.</p>
                  <div className="text-xs text-slate-500">
                    <div><strong>Examples:</strong></div>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>"Report to security office first"</li>
                      <li>"Height restriction: 4.2m max"</li>
                      <li>"Reverse parking only"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-semibold text-green-900 mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Driver Experience
              </h5>
              <p className="text-sm text-green-800">
                This information appears on booking confirmations and the driver kiosk, helping ensure 
                smooth operations and reducing delays caused by confusion or incorrect dock usage.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">Best Practices</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <strong>Operational Efficiency:</strong>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Separate inwards/outwards docks when possible</li>
              <li>Group similar operations together</li>
              <li>Consider peak hours when setting availability</li>
              <li>Account for dock turnaround time</li>
            </ul>
          </div>
          <div>
            <strong>Safety & Compliance:</strong>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Ensure vehicle restrictions match physical limits</li>
              <li>Include safety requirements in additional info</li>
              <li>Update photos when dock configuration changes</li>
              <li>Regular review of operating hours vs. demand</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}