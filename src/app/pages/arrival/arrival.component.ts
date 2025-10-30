import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-arrival',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen py-8 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-slate-900 mb-2">Arrival Tracking</h1>
          <p class="text-lg text-slate-600">Track dock arrivals and departures</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-lg font-medium text-slate-600">Arrival Tracking - Coming Soon</p>
          <p class="text-sm text-slate-500 mt-2">Real-time dock arrival and departure tracking will be available here</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ArrivalComponent {}
