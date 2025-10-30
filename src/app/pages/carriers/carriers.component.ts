import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntitiesService } from '../../services/entities.service';

@Component({
  selector: 'app-carriers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carriers.component.html',
  styles: []
})
export class CarriersComponent implements OnInit {
  carriers: any[] = [];
  isLoading = false;
  showModal = false;
  isSaving = false;
  editingCarrier: any = null;
  formData: any = { name: '', contact_name: '', email: '' };

  constructor(private entities: EntitiesService) {}

  async ngOnInit() {
    await this.loadCarriers();
  }

  async loadCarriers() {
    this.isLoading = true;
    try {
      this.carriers = await this.entities.Carrier.list();
    } catch (error) {
      console.error('Error loading carriers:', error);
      this.carriers = [];
    } finally {
      this.isLoading = false;
    }
  }

  openCreateModal() {
    this.editingCarrier = null;
    this.formData = { name: '', contact_name: '', email: '' };
    this.showModal = true;
  }

  editCarrier(carrier: any) {
    this.editingCarrier = carrier;
    this.formData = { ...carrier };
    this.showModal = true;
  }

  async saveCarrier() {
    this.isSaving = true;
    try {
      if (this.editingCarrier) {
        await this.entities.Carrier.update(this.editingCarrier.id, this.formData);
      } else {
        await this.entities.Carrier.create(this.formData);
      }
      this.closeModal();
      await this.loadCarriers();
    } catch (error) {
      console.error('Error saving carrier:', error);
      alert('Failed to save carrier.');
    } finally {
      this.isSaving = false;
    }
  }

  async deleteCarrier(carrier: any) {
    if (!confirm(`Delete ${carrier.name}?`)) return;
    try {
      await this.entities.Carrier.delete(carrier.id);
      await this.loadCarriers();
    } catch (error) {
      console.error('Error deleting carrier:', error);
      alert('Failed to delete carrier.');
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingCarrier = null;
    this.formData = { name: '', contact_name: '', email: '' };
  }
}
