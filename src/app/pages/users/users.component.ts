import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-4">Users</h1>
      <p class="text-slate-600">Users page - Coming soon</p>
    </div>
  `,
  styles: []
})
export class UsersComponent {}
