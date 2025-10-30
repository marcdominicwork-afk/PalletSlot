import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-4">Warehouses</h1>
      <p class="text-slate-600">Warehouses page - Coming soon</p>
    </div>
  `,
  styles: []
})
export class WarehousesComponent {}
