import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-4">Booking</h1>
      <p class="text-slate-600">Booking page - Coming soon</p>
    </div>
  `,
  styles: []
})
export class BookingComponent {}
