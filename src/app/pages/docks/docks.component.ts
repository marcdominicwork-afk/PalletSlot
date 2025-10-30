import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-docks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-4">Docks</h1>
      <p class="text-slate-600">Docks configuration page - Coming soon</p>
    </div>
  `,
  styles: []
})
export class DocksComponent {}
