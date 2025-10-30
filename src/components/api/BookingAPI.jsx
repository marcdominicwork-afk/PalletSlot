
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Key, Warehouse, Calendar, CheckSquare, BookCopy } from 'lucide-react';

const CodeBlock = ({ children }) => (
  <div className="bg-slate-800 text-white rounded-lg p-4 my-4 text-sm overflow-x-auto">
    <pre><code>{children}</code></pre>
  </div>
);

export default function BookingAPI() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Booking API Documentation</h1>
        <p className="text-lg text-slate-600">Integrate your systems with PalletSlot to automate bookings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-blue-600" />
            <span>Authentication</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            Authentication is handled via an API key. You must generate an API key for a dedicated 'API User' in the User Management section.
          </p>
          <p>
            Include your API key in the request headers as <Badge variant="secondary">X-API-Key</Badge>.
          </p>
          <CodeBlock>
            {`fetch('https://<your-app-url>/api/endpoint?action=getWarehouses', {
  headers: {
    'X-API-Key': 'YOUR_API_KEY_HERE'
  }
});`}
          </CodeBlock>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Warehouse className="w-5 h-5 text-blue-600" />
            <span>1. Get Warehouses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            Retrieve a list of available warehouses for the company associated with your API key. You will need the <Badge variant="secondary">code</Badge> from the response to make a booking.
          </p>
          <p><Badge>GET</Badge> <Badge variant="outline">/api/endpoint?action=getWarehouses</Badge></p>

          <h4 className="font-semibold mt-4 mb-2">Successful Response (200 OK)</h4>
          <CodeBlock>
            {`{
  "status": "success",
  "data": [
    {
      "code": "MDC-01",
      "name": "Main Distribution Center",
      "address": "123 Industrial Park, Big City"
    },
    {
      "code": "ND-02",
      "name": "North Depot",
      "address": "456 Trade Street, North Town"
    }
  ]
}`}
          </CodeBlock>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>2. Request a Booking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            Request a booking for a specific date. The system will automatically assign the next available time slot and create a <Badge>provisional</Badge> booking. It will also return a list of other available slots for that day.
          </p>
          <p><Badge>POST</Badge> <Badge variant="outline">/api/endpoint?action=requestBooking</Badge></p>

          <h4 className="font-semibold mt-4 mb-2">Request Body (JSON)</h4>
          <CodeBlock>
            {`{
  "warehouse_code": "MDC-01",
  "booking_date": "YYYY-MM-DD",
  "movement_type": "Inwards", // "Inwards" or "Outwards"
  "carrier_name": "Swift Transport Ltd",
  "sender_name": "ACME Corp",
  "reference_number": "PO-12345",
  "pallet_count": 10,
  "vehicle_type_code": "TRUCK-18T" // The code for the vehicle type
}`}
          </CodeBlock>

          <h4 className="font-semibold mt-4 mb-2">Successful Response (200 OK)</h4>
          <CodeBlock>
            {`{
  "status": "success",
  "message": "Provisional booking created. Confirm or update the slot within 15 minutes.",
  "data": {
    "confirmation_id": "CONF_AbCdEfGh12345678",
    "company_name": "Main Distribution Inc.",
    "warehouse_name": "Main Distribution Center",
    "warehouse_address": "123 Industrial Park, Big City",
    "assigned_slot": {
      "dock_name": "Dock 3",
      "dock_image_url": "https://example.com/images/dock3.jpg",
      "dock_notes": "Use side entrance. Contact security on arrival.",
      "start_time": "10:30",
      "end_time": "11:00"
    },
    "available_slots": [
      { "dock_name": "Dock 3", "start_time": "11:30" },
      { "dock_name": "Dock 4", "start_time": "10:30" },
      { "dock_name": "Dock 4", "start_time": "11:00" }
    ]
  }
}`}
          </CodeBlock>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <span>3. Update & Confirm Booking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            Update a provisional booking with a preferred time slot from the available list, or to simply confirm the auto-assigned slot. This finalizes the booking.
          </p>
          <p><Badge>POST</Badge> <Badge variant="outline">/api/endpoint?action=updateBooking</Badge></p>

          <h4 className="font-semibold mt-4 mb-2">Request Body (JSON)</h4>
          <CodeBlock>
            {`{
  "confirmation_id": "CONF_AbCdEfGh12345678",
  "preferred_start_time": "11:30" // Use a time from the 'available_slots' list
}`}
          </CodeBlock>
          <p className="text-sm text-slate-600 my-2">
            To confirm the auto-assigned slot, send the request with the original <Badge variant="secondary">start_time</Badge>.
          </p>

          <h4 className="font-semibold mt-4 mb-2">Successful Response (200 OK)</h4>
          <CodeBlock>
            {`{
  "status": "success",
  "message": "Booking confirmed.",
  "data": {
    "booking_id": "a1b2c3d4-e5f6-...",
    "confirmation_id": "CONF_AbCdEfGh12345678",
    "company_name": "Main Distribution Inc.",
    "warehouse_name": "Main Distribution Center",
    "warehouse_address": "123 Industrial Park, Big City",
    "dock_name": "Dock 3",
    "dock_image_url": "https://example.com/images/dock3.jpg",
    "dock_notes": "Use side entrance. Contact security on arrival.",
    "booking_date": "YYYY-MM-DD",
    "start_time": "11:30",
    "end_time": "12:00",
    "status": "confirmed"
  }
}`}
          </CodeBlock>
        </CardContent>
      </Card>
    </div>
  );
}
