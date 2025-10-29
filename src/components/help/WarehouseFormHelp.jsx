import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Clock, Mail, Phone, MapPin, Code } from "lucide-react";

export default function WarehouseFormHelp() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Managing Warehouses</h3>
        <p className="text-blue-800">
          Warehouses are physical locations within a company where goods are stored and processed. 
          Each warehouse can have its own docks, users, and vehicle types for better organization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Building className="w-4 h-4 mr-2 text-blue-600" />
              Basic Information
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Set up the essential details for the warehouse location.
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <div><strong>Name:</strong> Descriptive name (e.g., "Main Distribution Center")</div>
              <div><strong>Code:</strong> Short identifier (e.g., "MDC", "WH01")</div>
              <div><strong>Company:</strong> Which company this warehouse belongs to</div>
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
              Default operating hours for this warehouse location.
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <div><strong>Start Time:</strong> When operations begin (affects dock availability)</div>
              <div><strong>End Time:</strong> When operations end (affects dock availability)</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              Contact Details
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Contact information for this specific warehouse.
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <div><strong>Email:</strong> Warehouse-specific contact email</div>
              <div><strong>Phone:</strong> Direct phone number for this location</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
              Location Details
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Physical address and location information.
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <div><strong>Address:</strong> Full postal address including postcode</div>
              <div>Used for driver directions and delivery coordination</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg">
        <h4 className="font-semibold text-amber-900 mb-2">Warehouse Hierarchy</h4>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• <strong>Company</strong> → <strong>Warehouse</strong> → <strong>Docks</strong></li>
          <li>• Users can be assigned to specific warehouses</li>
          <li>• Vehicle types can be warehouse-specific or company-wide</li>
          <li>• Bookings are made for specific warehouse locations</li>
        </ul>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg">
        <h4 className="font-semibold text-slate-900 mb-2">Example: Cario W/H Warehouses</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <div className="font-medium">Main Distribution Center</div>
            <div className="text-slate-600">Code: MDC</div>
            <div className="text-xs text-slate-500 mt-1">Primary fulfillment hub</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium">North Depot</div>
            <div className="text-slate-600">Code: ND01</div>
            <div className="text-xs text-slate-500 mt-1">Regional distribution point</div>
          </div>
        </div>
      </div>
    </div>
  );
}