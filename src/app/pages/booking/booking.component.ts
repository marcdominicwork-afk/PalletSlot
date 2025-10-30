import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingFormComponent } from '../../components/booking/booking-form.component';
import { TimeSlotGridComponent } from '../../components/booking/time-slot-grid.component';
import { BookingConfirmationComponent } from '../../components/booking/booking-confirmation.component';
import { BookingFacadeService, BookingFormData } from '../../services/booking-facade.service';
import { EntitiesService } from '../../services/entities.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    BookingFormComponent,
    TimeSlotGridComponent,
    BookingConfirmationComponent
  ],
  template: `
    <div class="min-h-screen py-8 px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Title -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-slate-900 mb-2">Book Your Delivery Slot</h1>
          <p class="text-lg text-slate-600">
            Complete your delivery details first, then select an available time slot
          </p>
        </div>

        <!-- Booking Form -->
        <div *ngIf="!confirmedBooking" class="mb-8">
          <app-booking-form
            [currentUser]="currentUser"
            (formSubmitted)="handleFormSubmit($event)"
            (durationCalculated)="handleDurationChange($event)"
          ></app-booking-form>
        </div>

        <!-- Time Slot Grid - Show when form is submitted -->
        <div *ngIf="formData && !confirmedBooking && !selectedTime" class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <app-time-slot-grid
            [selectedDate]="formData.booking_date"
            [selectedTime]="selectedTime"
            [duration]="duration"
            [docks]="docks"
            [bookings]="bookings"
            (timeSelected)="handleTimeSelect($event)"
            (noSlotsAvailable)="handleNoSlots()"
          ></app-time-slot-grid>
        </div>

        <!-- Confirmation Section -->
        <div *ngIf="formData && selectedTime && availableDock && !confirmedBooking" 
             class="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col md:flex-row items-start justify-between gap-4">
              <div class="flex-1">
                <p class="font-semibold text-slate-900">Ready to confirm?</p>
                <p class="text-sm text-slate-600">
                  {{formData.company_name}} • {{formData.warehouse_name}} • {{formData.carrier_name}} • 
                  {{formData.sender_name}} • {{formData.reference_number}} • 
                  {{formData.pallet_count}} pallet{{formData.pallet_count > 1 ? 's' : ''}} • 
                  {{formData.movement_type}} • {{selectedTime}}
                </p>
                <div class="flex items-center space-x-2 text-sm font-semibold text-slate-700 mt-2">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Allocated Dock: {{availableDock.name}}</span>
                </div>
              </div>

              <button
                (click)="handleBookingConfirm()"
                [disabled]="isLoading"
                class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
              >
                {{isLoading ? 'Confirming...' : 'Confirm Booking'}}
              </button>
            </div>
          </div>
        </div>

        <!-- Booking Confirmation -->
        <div *ngIf="confirmedBooking" class="flex items-center justify-center">
          <app-booking-confirmation
            [booking]="confirmedBooking"
            [title]="confirmationTitle"
            [message]="confirmationMessage"
            (onNewBooking)="handleNewBooking()"
            (onViewSchedule)="handleViewSchedule()"
          ></app-booking-confirmation>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BookingComponent implements OnInit {
  currentUser: any = null;
  formData: BookingFormData | null = null;
  selectedTime: string | null = null;
  duration = 0;
  docks: any[] = [];
  bookings: any[] = [];
  availableDock: any = null;
  confirmedBooking: any = null;
  isLoading = false;
  confirmationTitle = 'Booking Confirmed!';
  confirmationMessage = 'Your slot has been successfully reserved.';

  constructor(
    private bookingFacade: BookingFacadeService,
    private entities: EntitiesService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadCurrentUser();
  }

  async loadCurrentUser() {
    try {
      // Try to get current user from Base44 SDK
      const userEntity = (this.entities.User as any);
      if (userEntity && typeof userEntity.me === 'function') {
        this.currentUser = await userEntity.me();
      } else {
        console.log('User not authenticated or me() not available');
        this.currentUser = null;
      }
    } catch (error) {
      console.error('Error loading user:', error);
      this.currentUser = null;
    }
  }

  async handleFormSubmit(formData: BookingFormData) {
    this.formData = formData;
    this.selectedTime = null;
    this.availableDock = null;

    // Load docks and bookings for the selected date
    await this.loadDocksAndBookings();
  }

  async loadDocksAndBookings() {
    if (!this.formData) return;

    this.isLoading = true;
    try {
      [this.docks, this.bookings] = await Promise.all([
        this.bookingFacade.loadDocks(
          this.formData.company_id,
          this.formData.warehouse_id,
          this.formData.movement_type
        ),
        this.bookingFacade.loadBookings(this.formData.booking_date)
      ]);
    } catch (error) {
      console.error('Error loading docks and bookings:', error);
    } finally {
      this.isLoading = false;
    }
  }

  handleDurationChange(duration: number) {
    this.duration = duration;
  }

  handleTimeSelect(time: string | null) {
    this.selectedTime = time;
    if (time && this.formData) {
      this.availableDock = this.findAvailableDock(time);
    } else {
      this.availableDock = null;
    }
  }

  findAvailableDock(time: string): any {
    if (!this.formData || !this.docks) return null;

    const [hours, minutes] = time.split(':').map(Number);
    const slotStart = hours * 60 + minutes;
    const slotEnd = slotStart + this.duration;

    for (const dock of this.docks) {
      const dockStart = dock.start_hour * 60;
      const dockEnd = dock.end_hour * 60;

      if (slotStart < dockStart || slotEnd > dockEnd) {
        continue;
      }

      const hasConflict = this.bookings.some((booking: any) => {
        if (booking.dock_id !== dock.id) return false;

        const [bookingStartHour, bookingStartMin] = booking.start_time.split(':').map(Number);
        const bookingStart = bookingStartHour * 60 + bookingStartMin;
        const bookingEnd = bookingStart + booking.duration_minutes;

        return slotStart < bookingEnd && slotEnd > bookingStart;
      });

      if (!hasConflict) {
        return dock;
      }
    }

    return null;
  }

  async handleBookingConfirm() {
    if (!this.formData || !this.selectedTime || !this.availableDock) return;

    // Recheck available dock before confirming
    const recheckedDock = this.findAvailableDock(this.selectedTime);
    if (!recheckedDock) {
      alert('Sorry, this time slot is no longer available. Please select another time.');
      this.selectedTime = null;
      this.availableDock = null;
      return;
    }

    this.isLoading = true;

    try {
      const [hours, minutes] = this.selectedTime.split(':').map(Number);
      const endTimeMinutes = hours * 60 + minutes + this.duration;
      const endHours = Math.floor(endTimeMinutes / 60);
      const endMins = endTimeMinutes % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

      const bookingData: any = {
        ...this.formData,
        start_time: this.selectedTime,
        end_time: endTime,
        duration_minutes: this.duration,
        dock_id: recheckedDock.id,
        dock_name: recheckedDock.name
      };

      this.confirmedBooking = await this.bookingFacade.createBooking(bookingData);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  handleNoSlots() {
    // Could show a dialog here
    console.log('No slots available');
  }

  handleNewBooking() {
    this.confirmedBooking = null;
    this.formData = null;
    this.selectedTime = null;
    this.availableDock = null;
    this.docks = [];
    this.bookings = [];
  }

  handleViewSchedule() {
    this.router.navigate(['/schedule']);
  }
}
