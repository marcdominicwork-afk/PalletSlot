import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-guide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-slate-900 mb-2">User Guide</h1>
          <p class="text-lg text-slate-600">How to use the PalletSlot booking system</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 mb-4">Getting Started</h2>
            <ol class="space-y-4 list-decimal list-inside">
              <li class="text-slate-700">
                <span class="font-semibold">Book a Slot:</span> Navigate to the "Book Slot" page and fill in your delivery details including company, warehouse, carrier, sender information, and pallet count.
              </li>
              <li class="text-slate-700">
                <span class="font-semibold">Select Time:</span> After submitting the form, choose an available time slot from the grid. Green slots are available, red slots are booked.
              </li>
              <li class="text-slate-700">
                <span class="font-semibold">Confirm:</span> Review your booking details and confirm. You'll see the allocated dock number.
              </li>
              <li class="text-slate-700">
                <span class="font-semibold">View Schedule:</span> Check your bookings on the "My Schedule" page. You can edit or cancel future bookings.
              </li>
            </ol>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-slate-900 mb-4">Admin Features</h2>
            <p class="text-slate-700 mb-4">Administrators have access to additional management pages:</p>
            <ul class="space-y-2 list-disc list-inside text-slate-700">
              <li>Companies - Manage company accounts</li>
              <li>Warehouses - Configure warehouse locations</li>
              <li>Docks - Set up loading dock configurations</li>
              <li>Carriers - Manage carrier companies</li>
              <li>Vehicle Types - Define vehicle specifications</li>
              <li>Users - Manage user accounts and permissions</li>
            </ul>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-slate-900 mb-4">Need Help?</h2>
            <p class="text-slate-700">For additional assistance, please contact your system administrator.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UserGuideComponent {}
