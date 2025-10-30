import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Book, 
  User, 
  Settings, 
  Calendar, 
  Truck, 
  Building, 
  Users, 
  Clock,
  ChevronRight,
  ChevronDown,
  Printer,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserGuide() {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections = [
    {
      id: 'overview',
      title: 'System Overview',
      icon: <Book className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Welcome to PalletSlot</h3>
            <p className="text-blue-800 mb-4">
              PalletSlot is a comprehensive dock scheduling system that allows companies to manage delivery bookings, 
              track arrivals, and optimize their loading dock operations. This guide uses "Cario W/H" as an example customer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">For Drivers & Carriers</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Book delivery time slots</li>
                  <li>• Check-in upon arrival</li>
                  <li>• View assigned dock information</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">For Administrators</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Manage company settings</li>
                  <li>• Configure docks and vehicle types</li>
                  <li>• Monitor all bookings and arrivals</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-3">User Roles</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Badge className="bg-green-100 text-green-800">Admin</Badge>
                <span className="text-slate-700">Full system access - can manage all companies, users, and configurations</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-blue-100 text-blue-800">User</Badge>
                <span className="text-slate-700">Company-specific access - can book slots and view schedules for their company</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-purple-100 text-purple-800">Driver</Badge>
                <span className="text-slate-700">Public access - can check-in for deliveries using the driver kiosk</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'booking',
      title: 'Booking a Delivery Slot',
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-900 mb-4">Step-by-Step Booking Process</h3>
            <p className="text-green-800 mb-4">
              Follow these steps to book a delivery slot for Cario W/H. The system will automatically calculate 
              the required time based on your pallet count and vehicle type.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">Step 1: Access the Booking Page</h4>
              <p className="text-slate-600 mb-3">Navigate to the "Book Slot" page from the main menu.</p>
              <div className="bg-slate-100 p-4 rounded-lg">
                <div className="text-center text-slate-500 py-8">
                  [Screenshot: Main navigation showing "Book Slot" button]
                </div>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">Step 2: Fill in Delivery Details</h4>
              <p className="text-slate-600 mb-3">Complete the booking form with your delivery information:</p>
              <div className="bg-white border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-slate-700">Company</label>
                    <div className="mt-1 p-2 bg-blue-50 rounded border">Cario W/H (CWH)</div>
                  </div>
                  <div>
                    <label className="font-medium text-slate-700">Movement Type</label>
                    <div className="mt-1 p-2 bg-blue-50 rounded border">Inwards</div>
                  </div>
                  <div>
                    <label className="font-medium text-slate-700">Vehicle Type</label>
                    <div className="mt-1 p-2 bg-slate-50 rounded border">18T Truck (Max 24 pallets)</div>
                  </div>
                  <div>
                    <label className="font-medium text-slate-700">Carrier</label>
                    <div className="mt-1 p-2 bg-slate-50 rounded border">Express Logistics Ltd</div>
                  </div>
                  <div>
                    <label className="font-medium text-slate-700">Sender Name</label>
                    <div className="mt-1 p-2 bg-slate-50 rounded border">ABC Manufacturing</div>
                  </div>
                  <div>
                    <label className="font-medium text-slate-700">Number of Pallets</label>
                    <div className="mt-1 p-2 bg-slate-50 rounded border">15</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  ✓ Booking duration automatically calculated: 45 minutes (15 pallets × 3 mins/pallet)
                </div>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">Step 3: Select Time Slot</h4>
              <p className="text-slate-600 mb-3">Choose from available time slots. Green slots are available, gray slots are unavailable.</p>
              <div className="bg-slate-100 p-4 rounded-lg">
                <div className="text-center text-slate-500 py-8">
                  [Screenshot: Time slot grid showing available slots for selected date]
                </div>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">Step 4: Confirm Booking</h4>
              <p className="text-slate-600 mb-3">Review your details and confirm the booking. You'll see the assigned dock information.</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-800">Booking Confirmed</span>
                </div>
                <div className="text-sm text-green-700">
                  <p>Assigned Dock: <strong>Dock 2 - North Bay</strong></p>
                  <p>Time: <strong>10:30 AM - 11:15 AM</strong></p>
                  <p>Reference: <strong>CWH-2024-001</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'schedule',
      title: 'Viewing Your Schedule',
      icon: <Clock className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">Schedule Management</h3>
            <p className="text-purple-800">
              View, edit, and manage all your delivery bookings in one place. The schedule provides multiple views 
              including timeline and list formats.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-purple-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">Timeline View</h4>
              <p className="text-slate-600 mb-3">See all bookings for a specific day across all docks in a visual timeline format.</p>
              <div className="bg-slate-100 p-4 rounded-lg">
                <div className="text-center text-slate-500 py-8">
                  [Screenshot: Timeline view showing Cario W/H bookings across different docks]
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">List View</h4>
              <p className="text-slate-600 mb-3">Detailed list of all bookings with options to edit or view more information.</p>
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="bg-slate-50 p-3 border-b">
                  <h5 className="font-medium text-slate-900">Today's Bookings - Cario W/H</h5>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">Express Logistics Ltd</div>
                      <div className="text-sm text-slate-600">Dock 2 • 10:30-11:15 • 15 pallets • Ref: CWH-2024-001</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">Rapid Transport Co</div>
                      <div className="text-sm text-slate-600">Dock 1 • 14:00-14:30 • 8 pallets • Ref: CWH-2024-002</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">Search Functionality</h4>
              <p className="text-slate-600 mb-3">Quickly find specific bookings using the reference number search.</p>
              <div className="bg-slate-100 p-4 rounded-lg">
                <div className="text-center text-slate-500 py-8">
                  [Screenshot: Search results showing booking CWH-2024-001 with full details]
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'driver-checkin',
      title: 'Driver Check-in Process',
      icon: <User className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-orange-900 mb-4">Driver Arrival Kiosk</h3>
            <p className="text-orange-800">
              The driver kiosk is a standalone tablet interface that allows drivers to check-in upon arrival. 
              This process records arrival times and provides dock assignment information.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-orange-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">Step 1: Find Your Booking</h4>
              <p className="text-slate-600 mb-3">Enter your reference number or select your booking from the list.</p>
              <div className="bg-slate-900 text-white p-6 rounded-lg">
                <div className="text-center">
                  <Truck className="w-12 h-12 text-blue-300 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold mb-1">PalletSlot</h3>
                  <p className="text-slate-300 mb-6">Driver Check-in</p>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <input 
                      type="text" 
                      placeholder="Enter Reference Number (e.g., CWH-2024-001)" 
                      className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-slate-300 text-center"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">Step 2: Confirm Details & Check-in</h4>
              <p className="text-slate-600 mb-3">Verify booking details and provide driver and vehicle information.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <h5 className="font-medium text-slate-900 mb-3">Booking Details</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Company:</span>
                      <span className="font-medium">Cario W/H</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Reference:</span>
                      <span className="font-medium">CWH-2024-001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Time Slot:</span>
                      <span className="font-medium">10:30-11:15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Assigned Dock:</span>
                      <span className="font-medium text-blue-600">Dock 2</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <h5 className="font-medium text-slate-900 mb-3">Driver Information</h5>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Driver Name" 
                      className="w-full p-2 border rounded"
                      disabled
                    />
                    <input 
                      type="text" 
                      placeholder="Vehicle Registration" 
                      className="w-full p-2 border rounded"
                      disabled
                    />
                    <Button className="w-full" disabled>
                      Check In
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">Step 3: Confirmation</h4>
              <p className="text-slate-600 mb-3">Receive confirmation with dock assignment and directions.</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Check-in Confirmed</h4>
                <p className="text-slate-600 mb-4">Please proceed to your assigned dock</p>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">Dock 2 - North Bay</div>
                  <div className="text-slate-600">Reference: CWH-2024-001</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'admin-setup',
      title: 'Administrator Setup',
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-red-900 mb-4">System Configuration</h3>
            <p className="text-red-800">
              This section is for system administrators who need to set up companies, configure docks, 
              manage vehicle types, and oversee user access. We'll use Cario W/H as our example setup.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-red-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">Company Configuration</h4>
              <p className="text-slate-600 mb-3">Set up Cario W/H with time calculation rules.</p>
              <div className="bg-white border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-slate-900 mb-2">Basic Information</h5>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-slate-600">Name:</span> Cario W/H</div>
                      <div><span className="text-slate-600">Code:</span> CWH</div>
                      <div><span className="text-slate-600">Email:</span> operations@cariowh.com</div>
                      <div><span className="text-slate-600">Phone:</span> +44 123 456 7890</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-900 mb-2">Time Configuration</h5>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-slate-600">Minimum Time:</span> 15 minutes</div>
                      <div><span className="text-slate-600">1-10 pallets:</span> 5 mins/pallet</div>
                      <div><span className="text-slate-600">11-25 pallets:</span> 3 mins/pallet</div>
                      <div><span className="text-slate-600">26+ pallets:</span> 2 mins/pallet</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-red-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">Dock Setup</h4>
              <p className="text-slate-600 mb-3">Configure loading docks for Cario W/H operations.</p>
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h6 className="font-medium text-slate-900">Dock 1 - South Bay</h6>
                      <div className="text-sm text-slate-600 mt-1">
                        <div>Hours: 06:00 - 18:00</div>
                        <div>Movement: Inwards & Outwards</div>
                        <div>Vehicle Types: All types accepted</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h6 className="font-medium text-slate-900">Dock 2 - North Bay</h6>
                      <div className="text-sm text-slate-600 mt-1">
                        <div>Hours: 07:00 - 17:00</div>
                        <div>Movement: Inwards only</div>
                        <div>Vehicle Types: 18T Truck, Articulated Lorry</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-red-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">Vehicle Type Configuration</h4>
              <p className="text-slate-600 mb-3">Set up vehicle types for Cario W/H with specific time calculations.</p>
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="bg-slate-50 p-3 border-b">
                  <h6 className="font-medium text-slate-900">Cario W/H Vehicle Types</h6>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">Van (VAN)</div>
                      <div className="text-sm text-slate-600">Max 6 pallets • Uses company defaults</div>
                    </div>
                    <Badge variant="outline">Company Time Rules</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">18T Truck (18T)</div>
                      <div className="text-sm text-slate-600">Max 24 pallets • Custom: 20 min minimum, tiered rates</div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Custom Time Rules</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-red-500 pl-6">
              <h4 className="font-semibold text-slate-900 mb-2">User Management</h4>
              <p className="text-slate-600 mb-3">Add and manage users for Cario W/H.</p>
              <div className="bg-slate-100 p-4 rounded-lg">
                <div className="text-center text-slate-500 py-8">
                  [Screenshot: User management interface showing Cario W/H users with different roles]
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-900 mb-4">Common Issues & Solutions</h3>
            <p className="text-yellow-800">
              Quick solutions to common problems you might encounter while using PalletSlot.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border-l-4 border-yellow-500 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">No Available Time Slots</h4>
              <p className="text-slate-600 mb-2"><strong>Problem:</strong> The system shows "No available slots" for the selected date.</p>
              <div className="text-sm text-slate-600 space-y-1">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Check if docks are configured and active for your company</li>
                  <li>Verify dock operating hours match your requested time</li>
                  <li>Try selecting a different date or reducing pallet count</li>
                  <li>Contact administrator if the issue persists</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border-l-4 border-red-500 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Driver Cannot Find Booking</h4>
              <p className="text-slate-600 mb-2"><strong>Problem:</strong> Driver kiosk cannot locate the booking reference.</p>
              <div className="text-sm text-slate-600 space-y-1">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Verify the reference number is entered correctly</li>
                  <li>Check if the booking date matches today's date</li>
                  <li>Ensure the booking status is "confirmed"</li>
                  <li>Contact the booking administrator for assistance</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border-l-4 border-blue-500 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Incorrect Time Calculation</h4>
              <p className="text-slate-600 mb-2"><strong>Problem:</strong> Booking duration doesn't match expected time.</p>
              <div className="text-sm text-slate-600 space-y-1">
                <p><strong>Solutions:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Check company time configuration settings</li>
                  <li>Verify if vehicle type has custom time rules</li>
                  <li>Remember: Time = Max(Minimum Time, Calculated Pallet Time)</li>
                  <li>Contact administrator to review time tier settings</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border-l-4 border-green-500 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Cannot Edit Past Bookings</h4>
              <p className="text-slate-600 mb-2"><strong>Problem:</strong> Edit button is disabled for historical bookings.</p>
              <div className="text-sm text-slate-600 space-y-1">
                <p><strong>Explanation:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Bookings from previous dates cannot be modified</li>
                  <li>This is by design to maintain data integrity</li>
                  <li>Use the search function to view historical booking details</li>
                  <li>Create a new booking for future dates if needed</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Still Need Help?</h4>
            <p className="text-blue-800 mb-3">
              If you're still experiencing issues, contact your system administrator or IT support team with:
            </p>
            <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
              <li>Screenshot of the error or issue</li>
              <li>Steps you took before the problem occurred</li>
              <li>Your user role and company information</li>
              <li>Browser and device information</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a comprehensive text version for download
    const textContent = sections.map(section => 
      `${section.title.toUpperCase()}\n${'='.repeat(section.title.length)}\n\n${section.content}\n\n`
    ).join('');
    
    const element = document.createElement("a");
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "palletslot-user-guide.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-section { page-break-after: always; }
          body { font-size: 12px; line-height: 1.4; }
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 no-print"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Book className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900">PalletSlot User Guide</h1>
            </div>
            <p className="text-lg text-slate-600 mb-6">
              Complete guide for using the PalletSlot dock scheduling system
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={handlePrint} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print Guide
              </Button>
              <Button onClick={handleDownload} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1 no-print">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Contents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {section.icon}
                      <span className="font-medium">{section.title}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {sections.map((section) => (
                  activeSection === section.id && (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="print-section"
                    >
                      <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-3 text-2xl">
                            {section.icon}
                            <span>{section.title}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {section.content}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}