import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../ui/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../ui/card.component';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent],
  template: `
    <app-card class="max-w-2xl mx-auto">
      <app-card-header class="text-center bg-green-50">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <app-card-title class="text-2xl text-green-800">{{title}}</app-card-title>
        <p class="text-green-600 mt-2">{{message}}</p>
      </app-card-header>
      
      <app-card-content class="pt-6">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="bg-slate-50 p-3 rounded">
              <p class="text-slate-500 font-medium">Company</p>
              <p class="text-slate-900 mt-1">{{booking.company_name}}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded">
              <p class="text-slate-500 font-medium">Warehouse</p>
              <p class="text-slate-900 mt-1">{{booking.warehouse_name}}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded">
              <p class="text-slate-500 font-medium">Carrier</p>
              <p class="text-slate-900 mt-1">{{booking.carrier_name}}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded">
              <p class="text-slate-500 font-medium">Sender</p>
              <p class="text-slate-900 mt-1">{{booking.sender_name}}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded">
              <p class="text-slate-500 font-medium">Reference Number</p>
              <p class="text-slate-900 mt-1">{{booking.reference_number}}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded">
              <p class="text-slate-500 font-medium">Pallets</p>
              <p class="text-slate-900 mt-1">{{booking.pallet_count}}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded">
              <p class="text-slate-500 font-medium">Date</p>
              <p class="text-slate-900 mt-1">{{booking.booking_date}}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded">
              <p class="text-slate-500 font-medium">Time</p>
              <p class="text-slate-900 mt-1">{{booking.start_time}} - {{booking.end_time}}</p>
            </div>
            <div *ngIf="booking.dock_name" class="bg-blue-50 p-3 rounded col-span-2">
              <p class="text-blue-600 font-medium">Assigned Dock</p>
              <p class="text-blue-900 mt-1 text-lg font-semibold">{{booking.dock_name}}</p>
            </div>
          </div>

          <div class="flex gap-4 pt-6">
            <button
              (click)="onNewBooking.emit()"
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              Make Another Booking
            </button>
            <button
              (click)="onViewSchedule.emit()"
              class="flex-1 px-6 py-3 bg-slate-100 text-slate-900 rounded-md hover:bg-slate-200 font-medium transition-colors"
            >
              View Schedule
            </button>
          </div>
        </div>
      </app-card-content>
    </app-card>
  `,
  styles: []
})
export class BookingConfirmationComponent {
  @Input() booking: any;
  @Input() title = 'Booking Confirmed!';
  @Input() message = 'Your slot has been successfully reserved.';
  @Output() onNewBooking = new EventEmitter<void>();
  @Output() onViewSchedule = new EventEmitter<void>();
}
