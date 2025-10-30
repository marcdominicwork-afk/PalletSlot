import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-kiosk',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 to-slate-100">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-5xl font-bold text-slate-900 mb-2">Driver Check-In</h1>
          <p class="text-xl text-slate-600">Self-service kiosk for drivers</p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-12 text-center space-y-6">
          <div class="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <div>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Welcome, Driver!</h2>
            <p class="text-lg text-slate-600 mb-6">Check in for your scheduled delivery</p>
          </div>

          <div class="space-y-4">
            <div class="p-6 bg-slate-50 rounded-lg">
              <p class="text-2xl font-semibold text-slate-900 mb-2">Scan Your QR Code</p>
              <p class="text-slate-600">Or enter your booking reference number</p>
            </div>

            <div class="grid grid-cols-3 gap-4 pt-4">
              <button class="p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xl font-semibold transition-colors">
                Check In
              </button>
              <button class="p-6 border-2 border-slate-300 rounded-lg hover:bg-slate-50 text-xl font-semibold transition-colors">
                Get Help
              </button>
              <button class="p-6 border-2 border-slate-300 rounded-lg hover:bg-slate-50 text-xl font-semibold transition-colors">
                View Queue
              </button>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-200">
            <p class="text-sm text-slate-500">Full driver kiosk functionality coming soon</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DriverKioskComponent {}
