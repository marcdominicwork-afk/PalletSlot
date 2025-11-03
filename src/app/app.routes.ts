import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/booking',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('../account/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'booking',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'schedule',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/schedule/schedule.component').then(m => m.ScheduleComponent)
  },
  {
    path: 'arrival',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/arrival/arrival.component').then(m => m.ArrivalComponent)
  },
  {
    path: 'docks',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/docks/docks.component').then(m => m.DocksComponent)
  },
  {
    path: 'companies',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/companies/companies.component').then(m => m.CompaniesComponent)
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'vehicle-types',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/vehicle-types/vehicle-types.component').then(m => m.VehicleTypesComponent)
  },
  {
    path: 'api',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/api/api.component').then(m => m.ApiComponent)
  },
  {
    path: 'carriers',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/carriers/carriers.component').then(m => m.CarriersComponent)
  },
  {
    path: 'driver-kiosk',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/driver-kiosk/driver-kiosk.component').then(m => m.DriverKioskComponent)
  },
  {
    path: 'user-guide',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/user-guide/user-guide.component').then(m => m.UserGuideComponent)
  },
  {
    path: 'warehouses',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/warehouses/warehouses.component').then(m => m.WarehousesComponent)
  },
  {
    path: '**',
    redirectTo: '/booking'
  }
];
