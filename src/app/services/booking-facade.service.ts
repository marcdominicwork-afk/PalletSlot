import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EntitiesService } from './entities.service';

export interface BookingFormData {
  company_id: string;
  company_name?: string;
  warehouse_id: string;
  warehouse_name?: string;
  carrier_id: string;
  carrier_name?: string;
  vehicle_type_id: string;
  vehicle_type_name?: string;
  sender_name: string;
  reference_number: string;
  pallet_count: number;
  booking_date: string;
  movement_type: 'Inwards' | 'Outwards';
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  dock_id?: string;
  dock_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingFacadeService {
  private formDataSubject = new BehaviorSubject<BookingFormData | null>(null);
  formData$ = this.formDataSubject.asObservable();

  constructor(private entities: EntitiesService) {}

  // Load active companies
  async loadCompanies(userId?: string, userRole?: string) {
    try {
      if (userId && userRole !== 'admin') {
        return await this.entities.Company.filter({ 
          is_active: true,
          id: userId 
        });
      } else {
        return await this.entities.Company.filter({ is_active: true });
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      return [];
    }
  }

  // Load warehouses for a company
  async loadWarehouses(companyId: string) {
    if (!companyId) return [];
    try {
      return await this.entities.Warehouse.filter({ 
        company_id: companyId, 
        is_active: true 
      });
    } catch (error) {
      console.error('Error loading warehouses:', error);
      return [];
    }
  }

  // Load active carriers
  async loadCarriers() {
    try {
      return await this.entities.Carrier.filter({ is_active: true });
    } catch (error) {
      console.error('Error loading carriers:', error);
      return [];
    }
  }

  // Load vehicle types for company and warehouse
  async loadVehicleTypes(companyId: string, warehouseId?: string) {
    if (!companyId) return [];
    try {
      const companyWide = await this.entities.VehicleType.filter({ 
        company_id: companyId, 
        warehouse_id: null,
        is_active: true 
      });
      
      let warehouseSpecific: any[] = [];
      if (warehouseId) {
        warehouseSpecific = await this.entities.VehicleType.filter({ 
          warehouse_id: warehouseId, 
          is_active: true 
        });
      }

      // Combine and deduplicate
      const allVehicles = [...warehouseSpecific, ...companyWide];
      return allVehicles.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
    } catch (error) {
      console.error('Error loading vehicle types:', error);
      return [];
    }
  }

  // Simple duration calculation (MVP - will add tiers later)
  calculateDuration(palletCount: number): number {
    if (!palletCount || palletCount < 1) return 0;
    // MVP: 5 minutes per pallet, minimum 15 minutes
    return Math.max(15, palletCount * 5);
  }

  // Load docks for company and warehouse
  async loadDocks(companyId: string, warehouseId: string, movementType: string) {
    if (!companyId || !warehouseId) return [];
    try {
      const docks = await this.entities.Dock.list();
      return docks.filter((d: any) => 
        d.is_active &&
        d.company_id === companyId &&
        d.warehouse_id === warehouseId &&
        (d.movement_type === movementType || d.movement_type === 'Both')
      );
    } catch (error) {
      console.error('Error loading docks:', error);
      return [];
    }
  }

  // Load bookings for a specific date
  async loadBookings(date: string) {
    try {
      const allBookings = await this.entities.Booking.list();
      return allBookings.filter((b: any) => b.booking_date === date);
    } catch (error) {
      console.error('Error loading bookings:', error);
      return [];
    }
  }

  // Create a new booking
  async createBooking(bookingData: BookingFormData) {
    try {
      return await this.entities.Booking.create(bookingData);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Update form data
  updateFormData(data: BookingFormData | null) {
    this.formDataSubject.next(data);
  }

  // Get current form data
  getFormData(): BookingFormData | null {
    return this.formDataSubject.value;
  }
}
