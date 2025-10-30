import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntitiesService } from '../../services/entities.service';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './warehouses.component.html',
  styles: []
})
export class WarehousesComponent implements OnInit {
  warehouses: any[] = [];
  companies: any[] = [];
  isLoading = false;
  showModal = false;
  isSaving = false;
  editingWarehouse: any = null;
  formData: any = { name: '', company_id: '', address: '' };

  constructor(private entities: EntitiesService) {}

  async ngOnInit() {
    await Promise.all([this.loadWarehouses(), this.loadCompanies()]);
  }

  async loadWarehouses() {
    this.isLoading = true;
    try {
      this.warehouses = await this.entities.Warehouse.list();
    } catch (error) {
      console.error('Error loading warehouses:', error);
      this.warehouses = [];
    } finally {
      this.isLoading = false;
    }
  }

  async loadCompanies() {
    try {
      this.companies = await this.entities.Company.list();
    } catch (error) {
      console.error('Error loading companies:', error);
      this.companies = [];
    }
  }

  openCreateModal() {
    this.editingWarehouse = null;
    this.formData = { name: '', company_id: '', address: '' };
    this.showModal = true;
  }

  editWarehouse(warehouse: any) {
    this.editingWarehouse = warehouse;
    this.formData = { ...warehouse, company_id: warehouse.company_id || '' };
    this.showModal = true;
  }

  async saveWarehouse() {
    this.isSaving = true;
    try {
      if (this.editingWarehouse) {
        await this.entities.Warehouse.update(this.editingWarehouse.id, this.formData);
      } else {
        await this.entities.Warehouse.create(this.formData);
      }
      this.closeModal();
      await this.loadWarehouses();
    } catch (error) {
      console.error('Error saving warehouse:', error);
      alert('Failed to save warehouse.');
    } finally {
      this.isSaving = false;
    }
  }

  async deleteWarehouse(warehouse: any) {
    if (!confirm(`Delete ${warehouse.name}?`)) return;
    try {
      await this.entities.Warehouse.delete(warehouse.id);
      await this.loadWarehouses();
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      alert('Failed to delete warehouse.');
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingWarehouse = null;
    this.formData = { name: '', company_id: '', address: '' };
  }
}
