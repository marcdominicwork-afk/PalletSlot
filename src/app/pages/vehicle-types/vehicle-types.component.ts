import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-types',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-4">Vehicle Types</h1>
      <p class="text-slate-600">Vehicle Types page - Coming soon</p>
    </div>
  `,
  styles: []
})
export class VehicleTypesComponent {}
