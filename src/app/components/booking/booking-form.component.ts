import { Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookingFacadeService, BookingFormData } from '../../services/booking-facade.service';
import { InputComponent } from '../ui/input.component';
import { LabelComponent } from '../ui/label.component';
import { SelectComponent } from '../ui/select.component';
import { ButtonComponent } from '../ui/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../ui/card.component';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LabelComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent
  ],
  template: `
    <app-card>
      <app-card-header>
        <app-card-title>Delivery Details</app-card-title>
      </app-card-header>
      <app-card-content>
        <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Company Selection -->
          <div>
            <app-label htmlFor="company_id">Company *</app-label>
            <select 
              id="company_id"
              formControlName="company_id"
              (change)="onCompanyChange($event)"
              class="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            >
              <option value="">Select a company...</option>
              <option *ngFor="let company of companies" [value]="company.id">
                {{company.name}}
              </option>
            </select>
            <div *ngIf="bookingForm.get('company_id')?.invalid && bookingForm.get('company_id')?.touched" 
                 class="text-red-600 text-sm mt-1">
              Company is required
            </div>
          </div>

          <!-- Warehouse Selection -->
          <div>
            <app-label htmlFor="warehouse_id">Warehouse *</app-label>
            <select 
              id="warehouse_id"
              formControlName="warehouse_id"
              (change)="onWarehouseChange($event)"
              [disabled]="!bookingForm.get('company_id')?.value || isLoadingWarehouses"
              class="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            >
              <option value="">{{isLoadingWarehouses ? 'Loading...' : 'Select a warehouse...'}}</option>
              <option *ngFor="let warehouse of warehouses" [value]="warehouse.id">
                {{warehouse.name}}
              </option>
            </select>
            <div *ngIf="bookingForm.get('warehouse_id')?.invalid && bookingForm.get('warehouse_id')?.touched" 
                 class="text-red-600 text-sm mt-1">
              Warehouse is required
            </div>
          </div>

          <!-- Carrier Selection -->
          <div>
            <app-label htmlFor="carrier_id">Carrier *</app-label>
            <select 
              id="carrier_id"
              formControlName="carrier_id"
              [disabled]="isLoadingCarriers"
              class="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            >
              <option value="">{{isLoadingCarriers ? 'Loading...' : 'Select a carrier...'}}</option>
              <option *ngFor="let carrier of carriers" [value]="carrier.id">
                {{carrier.name}}
              </option>
            </select>
            <div *ngIf="bookingForm.get('carrier_id')?.invalid && bookingForm.get('carrier_id')?.touched" 
                 class="text-red-600 text-sm mt-1">
              Carrier is required
            </div>
          </div>

          <!-- Sender Name -->
          <div>
            <app-label htmlFor="sender_name">Sender Name *</app-label>
            <input 
              id="sender_name"
              type="text"
              formControlName="sender_name"
              placeholder="Enter sender name"
              class="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div *ngIf="bookingForm.get('sender_name')?.invalid && bookingForm.get('sender_name')?.touched" 
                 class="text-red-600 text-sm mt-1">
              Sender name is required
            </div>
          </div>

          <!-- Reference Number -->
          <div>
            <app-label htmlFor="reference_number">Reference Number *</app-label>
            <input 
              id="reference_number"
              type="text"
              formControlName="reference_number"
              placeholder="Enter reference number"
              class="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div *ngIf="bookingForm.get('reference_number')?.invalid && bookingForm.get('reference_number')?.touched" 
                 class="text-red-600 text-sm mt-1">
              Reference number is required
            </div>
          </div>

          <!-- Pallet Count -->
          <div>
            <app-label htmlFor="pallet_count">Number of Pallets *</app-label>
            <input 
              id="pallet_count"
              type="number"
              formControlName="pallet_count"
              placeholder="Enter pallet count"
              min="1"
              max="60"
              (input)="onPalletCountChange()"
              class="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div *ngIf="bookingForm.get('pallet_count')?.invalid && bookingForm.get('pallet_count')?.touched" 
                 class="text-red-600 text-sm mt-1">
              Pallet count must be between 1 and 60
            </div>
            <div *ngIf="calculatedDuration > 0" class="text-slate-600 text-sm mt-1">
              Estimated duration: {{calculatedDuration}} minutes
            </div>
          </div>

          <!-- Vehicle Type -->
          <div>
            <app-label htmlFor="vehicle_type_id">Vehicle Type *</app-label>
            <select 
              id="vehicle_type_id"
              formControlName="vehicle_type_id"
              [disabled]="!bookingForm.get('warehouse_id')?.value || isLoadingVehicleTypes"
              class="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            >
              <option value="">{{isLoadingVehicleTypes ? 'Loading...' : 'Select vehicle type...'}}</option>
              <option *ngFor="let vehicleType of vehicleTypes" [value]="vehicleType.id">
                {{vehicleType.name}} (Max: {{vehicleType.max_pallets}} pallets)
              </option>
            </select>
            <div *ngIf="bookingForm.get('vehicle_type_id')?.invalid && bookingForm.get('vehicle_type_id')?.touched" 
                 class="text-red-600 text-sm mt-1">
              Vehicle type is required
            </div>
          </div>

          <!-- Movement Type -->
          <div>
            <app-label htmlFor="movement_type">Movement Type *</app-label>
            <select 
              id="movement_type"
              formControlName="movement_type"
              class="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Inwards">Inwards</option>
              <option value="Outwards">Outwards</option>
            </select>
          </div>

          <!-- Booking Date -->
          <div>
            <app-label htmlFor="booking_date">Booking Date *</app-label>
            <input 
              id="booking_date"
              type="date"
              formControlName="booking_date"
              [min]="todayDate"
              class="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div *ngIf="bookingForm.get('booking_date')?.invalid && bookingForm.get('booking_date')?.touched" 
                 class="text-red-600 text-sm mt-1">
              Booking date is required
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-4">
            <button
              type="submit"
              [disabled]="bookingForm.invalid || isSubmitting"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{isSubmitting ? 'Loading...' : 'Continue to Time Selection'}}
            </button>
          </div>
        </form>
      </app-card-content>
    </app-card>
  `,
  styles: []
})
export class BookingFormComponent implements OnInit, OnChanges {
  @Input() currentUser: any;
  @Output() formSubmitted = new EventEmitter<BookingFormData>();
  @Output() durationCalculated = new EventEmitter<number>();

  bookingForm: FormGroup;
  companies: any[] = [];
  warehouses: any[] = [];
  carriers: any[] = [];
  vehicleTypes: any[] = [];

  isLoadingWarehouses = false;
  isLoadingCarriers = false;
  isLoadingVehicleTypes = false;
  isSubmitting = false;
  calculatedDuration = 0;
  todayDate: string;
  private hasLoadedInitialData = false;

  constructor(
    private fb: FormBuilder,
    private bookingFacade: BookingFacadeService
  ) {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];

    this.bookingForm = this.fb.group({
      company_id: ['', Validators.required],
      warehouse_id: ['', Validators.required],
      carrier_id: ['', Validators.required],
      sender_name: ['', Validators.required],
      reference_number: ['', Validators.required],
      pallet_count: ['', [Validators.required, Validators.min(1), Validators.max(60)]],
      vehicle_type_id: ['', Validators.required],
      movement_type: ['Inwards', Validators.required],
      booking_date: [this.todayDate, Validators.required]
    });
  }

  async ngOnInit() {
    // Load carriers immediately (not user-dependent)
    this.isLoadingCarriers = true;
    this.carriers = await this.bookingFacade.loadCarriers();
    this.isLoadingCarriers = false;
  }

  async ngOnChanges(changes: SimpleChanges) {
    // Load user-dependent data when currentUser is available
    if (changes['currentUser'] && changes['currentUser'].currentValue !== undefined) {
      if (!this.hasLoadedInitialData) {
        await this.loadInitialData();
        this.hasLoadedInitialData = true;
      }
    }
  }

  async loadInitialData() {
    // Load companies based on current user
    this.companies = await this.bookingFacade.loadCompanies(
      this.currentUser?.company_id,
      this.currentUser?.role
    );

    // If user is not admin, pre-select their company and load warehouses
    if (this.currentUser && this.currentUser.role !== 'admin' && this.currentUser.company_id) {
      this.bookingForm.patchValue({ company_id: this.currentUser.company_id });
      await this.loadWarehousesForCompany(this.currentUser.company_id);
    }
  }

  async onCompanyChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const companyId = select.value;
    
    // Reset dependent fields
    this.bookingForm.patchValue({
      warehouse_id: '',
      vehicle_type_id: ''
    });
    this.warehouses = [];
    this.vehicleTypes = [];

    if (companyId) {
      await this.loadWarehousesForCompany(companyId);
    }
  }

  async loadWarehousesForCompany(companyId: string) {
    this.isLoadingWarehouses = true;
    this.warehouses = await this.bookingFacade.loadWarehouses(companyId);
    this.isLoadingWarehouses = false;
  }

  async onWarehouseChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const warehouseId = select.value;
    
    // Reset vehicle type
    this.bookingForm.patchValue({ vehicle_type_id: '' });
    this.vehicleTypes = [];

    const companyId = this.bookingForm.get('company_id')?.value;
    if (companyId && warehouseId) {
      this.isLoadingVehicleTypes = true;
      this.vehicleTypes = await this.bookingFacade.loadVehicleTypes(companyId, warehouseId);
      this.isLoadingVehicleTypes = false;
    }
  }

  onPalletCountChange() {
    const palletCount = this.bookingForm.get('pallet_count')?.value;
    if (palletCount) {
      this.calculatedDuration = this.bookingFacade.calculateDuration(palletCount);
      this.durationCalculated.emit(this.calculatedDuration);
    } else {
      this.calculatedDuration = 0;
      this.durationCalculated.emit(0);
    }
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      const formValue = this.bookingForm.value;
      
      // Enrich form data with names
      const selectedCompany = this.companies.find(c => c.id === formValue.company_id);
      const selectedWarehouse = this.warehouses.find(w => w.id === formValue.warehouse_id);
      const selectedCarrier = this.carriers.find(c => c.id === formValue.carrier_id);
      const selectedVehicleType = this.vehicleTypes.find(v => v.id === formValue.vehicle_type_id);

      const bookingData: BookingFormData = {
        ...formValue,
        company_name: selectedCompany?.name,
        warehouse_name: selectedWarehouse?.name,
        carrier_name: selectedCarrier?.name,
        vehicle_type_name: selectedVehicleType?.name,
        duration_minutes: this.calculatedDuration
      };

      this.formSubmitted.emit(bookingData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }
}
