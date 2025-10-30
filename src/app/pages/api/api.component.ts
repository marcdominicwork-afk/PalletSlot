import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen py-8 px-4">
      <div class="max-w-5xl mx-auto">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-slate-900 mb-2">Booking API</h1>
          <p class="text-lg text-slate-600">RESTful API documentation for integration</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 mb-4">API Endpoints</h2>
            <div class="space-y-4">
              <div class="border border-slate-200 rounded-lg p-4">
                <div class="flex items-center gap-3 mb-2">
                  <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
                  <code class="text-sm">/api/bookings</code>
                </div>
                <p class="text-sm text-slate-600">List all bookings</p>
              </div>
              
              <div class="border border-slate-200 rounded-lg p-4">
                <div class="flex items-center gap-3 mb-2">
                  <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">POST</span>
                  <code class="text-sm">/api/bookings</code>
                </div>
                <p class="text-sm text-slate-600">Create a new booking</p>
              </div>

              <div class="border border-slate-200 rounded-lg p-4">
                <div class="flex items-center gap-3 mb-2">
                  <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">PUT</span>
                  <code class="text-sm">/api/bookings/:id</code>
                </div>
                <p class="text-sm text-slate-600">Update a booking</p>
              </div>

              <div class="border border-slate-200 rounded-lg p-4">
                <div class="flex items-center gap-3 mb-2">
                  <span class="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">DELETE</span>
                  <code class="text-sm">/api/bookings/:id</code>
                </div>
                <p class="text-sm text-slate-600">Delete a booking</p>
              </div>
            </div>
          </div>

          <div class="pt-4">
            <p class="text-sm text-slate-500">Full API documentation with request/response examples coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ApiComponent {}
