import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntitiesService } from '../../services/entities.service';

@Component({
  selector: 'app-vehicle-types',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-types.component.html',
  styles: []
})
export class VehicleTypesComponent implements OnInit {
  vehicleTypes: any[] = [];
  companies: any[] = [];
  isLoading = false;
  showModal = false;
  isSaving = false;
  editingVehicleType: any = null;
  formData: any = { name: '', max_pallets: 26, company_id: '' };

  constructor(private entities: EntitiesService) {}

  async ngOnInit() {
    await Promise.all([this.loadVehicleTypes(), this.loadCompanies()]);
  }

  async loadVehicleTypes() {
    this.isLoading = true;
    try {
      this.vehicleTypes = await this.entities.VehicleType.list();
    } catch (error) {
      console.error('Error loading vehicle types:', error);
      this.vehicleTypes = [];
    } finally {
      this.isLoading = false;
    }
  }

  async loadCompanies() {
    try {
      this.companies = await this.entities.Company.list();
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  }

  openCreateModal() {
    this.editingVehicleType = null;
    this.formData = { name: '', max_pallets: 26, company_id: '' };
    this.showModal = true;
  }

  editVehicleType(type: any) {
    this.editingVehicleType = type;
    this.formData = { ...type, company_id: type.company_id || '' };
    this.showModal = true;
  }

  async saveVehicleType() {
    this.isSaving = true;
    try {
      if (this.editingVehicleType) {
        await this.entities.VehicleType.update(this.editingVehicleType.id, this.formData);
      } else {
        await this.entities.VehicleType.create(this.formData);
      }
      this.closeModal();
      await this.loadVehicleTypes();
    } catch (error) {
      console.error('Error saving vehicle type:', error);
      alert('Failed to save vehicle type.');
    } finally {
      this.isSaving = false;
    }
  }

  async deleteVehicleType(type: any) {
    if (!confirm(`Delete ${type.name}?`)) return;
    try {
      await this.entities.VehicleType.delete(type.id);
      await this.loadVehicleTypes();
    } catch (error) {
      console.error('Error deleting vehicle type:', error);
      alert('Failed to delete vehicle type.');
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingVehicleType = null;
    this.formData = { name: '', max_pallets: 26, company_id: '' };
  }
}
