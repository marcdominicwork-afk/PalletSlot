import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Mail, Phone, MapPin, User } from "lucide-react";

export default function CarrierFormHelp() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Managing Carriers</h3>
        <p className="text-blue-800">
          Carriers are the transport companies that make deliveries. Add carrier information here 
          so drivers can select their company when booking delivery slots.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Truck className="w-4 h-4 mr-2 text-blue-600" />
              Carrier Information
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Enter the basic details for the transport company.
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <div><strong>Name:</strong> The official company name (e.g., "DHL Express", "FedEx")</div>
              <div><strong>Address:</strong> Primary business address or depot location</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-blue-600" />
              Contact Details
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Contact information for coordination and communication.
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <div><strong>Email:</strong> Main contact email for the carrier</div>
              <div><strong>Phone:</strong> Primary contact number for dispatchers</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg">
        <h4 className="font-semibold text-amber-900 mb-2">Important Notes</h4>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Carriers appear in the booking form dropdown for driver selection</li>
          <li>• Inactive carriers won't be available for new bookings</li>
          <li>• Contact details help with coordination during delivery issues</li>
          <li>• You can edit carrier information at any time</li>
        </ul>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg">
        <h4 className="font-semibold text-slate-900 mb-2">Example: Cario W/H Carriers</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <div className="font-medium">Swift Transport Ltd</div>
            <div className="text-slate-600">Regional delivery specialist</div>
            <div className="text-xs text-slate-500 mt-1">contact@swifttransport.co.uk</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium">National Logistics</div>
            <div className="text-slate-600">Nationwide freight services</div>
            <div className="text-xs text-slate-500 mt-1">ops@nationallogistics.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}