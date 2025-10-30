import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-kiosk',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-4">Driver Kiosk</h1>
      <p class="text-slate-600">Driver self-service kiosk - Coming soon</p>
    </div>
  `,
  styles: []
})
export class DriverKioskComponent {}
