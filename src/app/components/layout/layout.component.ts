import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { EntitiesService } from '../../services/entities.service';
import { LucideAngularModule, Calendar, Clock, BookOpen, Building, Clipboard, Settings, Truck, Users, Code, ChevronDown, LogOut, Loader2, Menu, X } from 'lucide-angular';

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
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
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
  isMobileMenuOpen = false;

  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly BookOpen = BookOpen;
  readonly Building = Building;
  readonly Clipboard = Clipboard;
  readonly Settings = Settings;
  readonly Truck = Truck;
  readonly Users = Users;
  readonly Code = Code;
  readonly ChevronDown = ChevronDown;
  readonly LogOut = LogOut;
  readonly Loader2 = Loader2;
  readonly Menu = Menu;
  readonly X = X;

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
  ) { }

  ngOnInit() {
    this.loadUser();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadUser();
      this.closeMobileMenu();
    });
  }

  async loadUser() {
    this.isLoading = true;
    this.user = {
      id: '1',
      email: 'marc@cario.com.au',
      full_name: 'Marc Enriquez',
      role: 'admin',
      company_id: '1'
    };
    this.isLoading = false;
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

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.isAdminMenuOpen = false;
  }

  getFilteredAdminLinks(): NavLink[] {
    if (this.user?.role === 'company_admin') {
      return this.adminLinks.filter(link => link.path === '/users');
    }
    return this.adminLinks;
  }

  getIconComponent(icon: string) {
    const iconMap: Record<string, any> = {
      calendar: this.Calendar,
      clock: this.Clock,
      book: this.BookOpen,
      building: this.Building,
      clipboard: this.Clipboard,
      settings: this.Settings,
      truck: this.Truck,
      users: this.Users,
      code: this.Code
    };
    return iconMap[icon] || this.Calendar;
  }
}
