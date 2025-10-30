import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../ui/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../ui/card.component';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent],
  templateUrl: './booking-confirmation.component.html',
  styles: []
})
export class BookingConfirmationComponent {
  @Input() booking: any;
  @Input() title = 'Booking Confirmed!';
  @Input() message = 'Your slot has been successfully reserved.';
  @Output() onNewBooking = new EventEmitter<void>();
  @Output() onViewSchedule = new EventEmitter<void>();
}
