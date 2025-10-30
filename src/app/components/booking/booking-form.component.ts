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
  templateUrl: './booking-form.component.html',
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
