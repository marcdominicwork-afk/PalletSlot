import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EntitiesService } from '../../services/entities.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.component.html',
  styles: []
})
export class ScheduleComponent implements OnInit {
  selectedDate: string;
  bookings: any[] = [];
  isLoading = false;
  currentUser: any = null;

  constructor(
    private entities: EntitiesService,
    private router: Router
  ) {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  async ngOnInit() {
    await this.loadCurrentUser();
    await this.loadBookings();
  }

  async loadCurrentUser() {
    try {
      const userEntity = (this.entities.User as any);
      if (userEntity && typeof userEntity.me === 'function') {
        this.currentUser = await userEntity.me();
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  async loadBookings() {
    this.isLoading = true;
    try {
      const allBookings = await this.entities.Booking.list();
      
      // Filter bookings by selected date and user permissions
      this.bookings = allBookings.filter((booking: any) => {
        const bookingDate = booking.booking_date;
        const matchesDate = bookingDate === this.selectedDate;
        
        // If user is not admin, show only their company's bookings
        if (this.currentUser && this.currentUser.role !== 'admin') {
          return matchesDate && booking.company_id === this.currentUser.company_id;
        }
        
        return matchesDate;
      });

      // Sort by start time
      this.bookings.sort((a, b) => {
        const timeA = a.start_time || '00:00';
        const timeB = b.start_time || '00:00';
        return timeA.localeCompare(timeB);
      });

    } catch (error) {
      console.error('Error loading bookings:', error);
      this.bookings = [];
    } finally {
      this.isLoading = false;
    }
  }

  previousDay() {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() - 1);
    this.selectedDate = date.toISOString().split('T')[0];
    this.loadBookings();
  }

  nextDay() {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() + 1);
    this.selectedDate = date.toISOString().split('T')[0];
    this.loadBookings();
  }

  today() {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    this.loadBookings();
  }

  canEditBooking(booking: any): boolean {
    // Only allow editing future bookings
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  }

  canCancelBooking(booking: any): boolean {
    return this.canEditBooking(booking);
  }

  editBooking(booking: any) {
    // Navigate to booking page with pre-filled data
    this.router.navigate(['/booking'], { state: { booking } });
  }

  async cancelBooking(booking: any) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await this.entities.Booking.delete(booking.id);
      await this.loadBookings();
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  }
}
