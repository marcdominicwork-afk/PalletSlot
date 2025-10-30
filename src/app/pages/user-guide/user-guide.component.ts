import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-guide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-4">User Guide</h1>
      <p class="text-slate-600">User guide and documentation - Coming soon</p>
    </div>
  `,
  styles: []
})
export class UserGuideComponent {}
