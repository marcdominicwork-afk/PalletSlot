import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/booking',
    pathMatch: 'full'
  },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'schedule',
    loadComponent: () => import('./pages/schedule/schedule.component').then(m => m.ScheduleComponent)
  },
  {
    path: 'arrival',
    loadComponent: () => import('./pages/arrival/arrival.component').then(m => m.ArrivalComponent)
  },
  {
    path: 'docks',
    loadComponent: () => import('./pages/docks/docks.component').then(m => m.DocksComponent)
  },
  {
    path: 'companies',
    loadComponent: () => import('./pages/companies/companies.component').then(m => m.CompaniesComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'vehicle-types',
    loadComponent: () => import('./pages/vehicle-types/vehicle-types.component').then(m => m.VehicleTypesComponent)
  },
  {
    path: 'api',
    loadComponent: () => import('./pages/api/api.component').then(m => m.ApiComponent)
  },
  {
    path: 'carriers',
    loadComponent: () => import('./pages/carriers/carriers.component').then(m => m.CarriersComponent)
  },
  {
    path: 'driver-kiosk',
    loadComponent: () => import('./pages/driver-kiosk/driver-kiosk.component').then(m => m.DriverKioskComponent)
  },
  {
    path: 'user-guide',
    loadComponent: () => import('./pages/user-guide/user-guide.component').then(m => m.UserGuideComponent)
  },
  {
    path: 'warehouses',
    loadComponent: () => import('./pages/warehouses/warehouses.component').then(m => m.WarehousesComponent)
  },
  {
    path: '**',
    redirectTo: '/booking'
  }
];
