import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-slot-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-slot-grid.component.html',
  styles: []
})
export class TimeSlotGridComponent implements OnChanges {
  @Input() selectedDate!: string;
  @Input() selectedTime: string | null = null;
  @Input() duration = 0; // in minutes
  @Input() docks: any[] = [];
  @Input() bookings: any[] = [];
  @Output() timeSelected = new EventEmitter<string | null>();
  @Output() noSlotsAvailable = new EventEmitter<void>();

  timeSlots: Array<{time: string, available: boolean}> = [];
  hasAvailableSlots = true;

  ngOnChanges() {
    this.generateTimeSlots();
  }

  generateTimeSlots() {
    if (!this.docks || this.docks.length === 0) {
      this.timeSlots = [];
      this.hasAvailableSlots = false;
      return;
    }

    // Generate slots from 6 AM to 6 PM in 30-minute intervals
    const slots: Array<{time: string, available: boolean}> = [];
    
    for (let hour = 6; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isAvailable = this.isSlotAvailable(time);
        slots.push({ time, available: isAvailable });
      }
    }

    this.timeSlots = slots;
    this.hasAvailableSlots = slots.some(slot => slot.available);

    if (!this.hasAvailableSlots) {
      this.noSlotsAvailable.emit();
    }
  }

  isSlotAvailable(time: string): boolean {
    if (!this.docks || this.docks.length === 0 || !this.duration) {
      return false;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const slotStart = hours * 60 + minutes;
    const slotEnd = slotStart + this.duration;

    // Check if any dock is available for this time slot
    return this.docks.some(dock => {
      const dockStart = dock.start_hour * 60;
      const dockEnd = dock.end_hour * 60;

      // Check if slot fits within dock operating hours
      if (slotStart < dockStart || slotEnd > dockEnd) {
        return false;
      }

      // Check for conflicts with existing bookings
      const hasConflict = this.bookings.some(booking => {
        if (booking.dock_id !== dock.id) {
          return false;
        }

        const [bookingStartHour, bookingStartMin] = booking.start_time.split(':').map(Number);
        const bookingStart = bookingStartHour * 60 + bookingStartMin;
        const bookingEnd = bookingStart + booking.duration_minutes;

        return slotStart < bookingEnd && slotEnd > bookingStart;
      });

      return !hasConflict;
    });
  }

  selectSlot(slot: {time: string, available: boolean}) {
    if (slot.available) {
      this.selectedTime = slot.time;
      this.timeSelected.emit(slot.time);
    }
  }
}
