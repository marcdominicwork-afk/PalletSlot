import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { EntitiesService } from '../../services/entities.service';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  company_id?: string;
}

interface NavLink {
  name: string;
  path: string;
  icon: string;
  newTab?: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LayoutComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  isAdminMenuOpen = false;

  publicLinks: NavLink[] = [
    { name: 'Book Slot', path: '/booking', icon: 'calendar' },
    { name: 'My Schedule', path: '/schedule', icon: 'clock' },
    { name: 'User Guide', path: '/user-guide', icon: 'book', newTab: true }
  ];

  adminLinks: NavLink[] = [
    { name: 'Companies', path: '/companies', icon: 'building' },
    { name: 'Warehouses', path: '/warehouses', icon: 'building' },
    { name: 'Carriers', path: '/carriers', icon: 'clipboard' },
    { name: 'Dock Config', path: '/docks', icon: 'settings' },
    { name: 'Vehicle Types', path: '/vehicle-types', icon: 'truck' },
    { name: 'Users', path: '/users', icon: 'users' },
    { name: 'Booking API', path: '/api', icon: 'code' }
  ];

  constructor(
    private router: Router,
    private entities: EntitiesService
  ) {}

  ngOnInit() {
    this.loadUser();
    
    // Reload user on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadUser();
    });
  }

  async loadUser() {
    this.isLoading = true;
    try {
      const userEntity = (this.entities.User as any);
      if (userEntity && typeof userEntity.me === 'function') {
        const currentUser = await userEntity.me();
        this.user = currentUser as any;
      } else {
        this.user = null;
      }
    } catch (e) {
      this.user = null;
    } finally {
      this.isLoading = false;
    }
  }

  async handleLogout() {
    try {
      const userEntity = (this.entities.User as any);
      if (userEntity && typeof userEntity.logout === 'function') {
        await userEntity.logout();
      }
      this.user = null;
      this.router.navigate(['/booking']);
    } catch (e) {
      console.error('Logout failed:', e);
    }
  }

  toggleAdminMenu() {
    this.isAdminMenuOpen = !this.isAdminMenuOpen;
  }

  closeAdminMenu() {
    this.isAdminMenuOpen = false;
  }

  getFilteredAdminLinks(): NavLink[] {
    if (this.user?.role === 'company_admin') {
      return this.adminLinks.filter(link => link.path === '/users');
    }
    return this.adminLinks;
  }

  getIcon(icon: string): string {
    const icons: Record<string, string> = {
      calendar: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
      clock: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
      book: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
      building: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>',
      clipboard: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>',
      settings: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
      truck: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
      users: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
      code: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>'
    };
    return icons[icon] || '';
  }
}
