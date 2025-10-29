import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calculator, Building, Users, Truck } from "lucide-react";

export default function CompanyFormHelp() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Company Configuration Guide</h3>
        <p className="text-blue-800">
          Configure company settings including basic information and time calculation rules for booking duration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Building className="w-4 h-4 mr-2 text-blue-600" />
              Basic Information
            </h4>
            <div className="space-y-3 text-sm text-slate-600">
              <div>
                <strong>Company Name:</strong> Full legal or business name
                <div className="text-xs text-slate-500 mt-1">Example: "Cario Warehouse & Distribution Ltd"</div>
              </div>
              <div>
                <strong>Company Code:</strong> Short, unique identifier (3-10 characters)
                <div className="text-xs text-slate-500 mt-1">Example: "CARIO" or "CWH"</div>
              </div>
              <div>
                <strong>Contact Details:</strong> Primary contact information for the company
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              Minimum Booking Time
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              The minimum time allocated for any booking, regardless of pallet count.
            </p>
            <div className="bg-slate-50 p-3 rounded text-xs text-slate-600">
              <div><strong>Recommended:</strong> 15-30 minutes</div>
              <div><strong>Covers:</strong> Vehicle positioning, paperwork, basic loading/unloading</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
            <Calculator className="w-4 h-4 mr-2 text-blue-600" />
            Pallet Time Tier Configuration
          </h4>
          <p className="text-sm text-slate-600 mb-4">
            Configure how additional time is calculated based on pallet count. The system uses a tiered approach 
            where different pallet ranges have different time-per-pallet rates.
          </p>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-900 mb-2">How It Works</h5>
              <div className="text-sm text-yellow-800 space-y-1">
                <div>• Each tier defines a pallet range and time per pallet</div>
                <div>• Higher tiers typically have lower per-pallet times (bulk efficiency)</div>
                <div>• Final time = Max(Minimum Time, Calculated Pallet Time)</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-semibold text-slate-900 mb-2">Example Setup</h5>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Tier 1:</strong> Up to 10 pallets → 5 min/pallet</div>
                  <div><strong>Tier 2:</strong> Up to 25 pallets → 3 min/pallet</div>
                  <div><strong>Tier 3:</strong> Up to 60 pallets → 2 min/pallet</div>
                  <div className="mt-2 pt-2 border-t border-slate-300">
                    <strong>Minimum Time:</strong> 15 minutes
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-semibold text-slate-900 mb-2">Calculation Examples</h5>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>5 pallets:</strong> Max(15, 5×5) = 25 minutes</div>
                  <div><strong>15 pallets:</strong> Max(15, 10×5 + 5×3) = 65 minutes</div>
                  <div><strong>30 pallets:</strong> Max(15, 10×5 + 15×3 + 5×2) = 105 minutes</div>
                  <div><strong>2 pallets:</strong> Max(15, 2×5) = 15 minutes (minimum)</div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-semibold text-green-900 mb-2">Best Practices</h5>
              <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                <li>Start with higher per-pallet times for small quantities (setup overhead)</li>
                <li>Decrease per-pallet time for larger quantities (efficiency gains)</li>
                <li>Set minimum time to cover basic operations (15-30 minutes typical)</li>
                <li>Consider your dock equipment and typical operation speeds</li>
                <li>Review and adjust based on actual performance data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}