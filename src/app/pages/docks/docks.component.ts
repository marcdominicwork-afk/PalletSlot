import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntitiesService } from '../../services/entities.service';

@Component({
  selector: 'app-docks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './docks.component.html',
  styles: []
})
export class DocksComponent implements OnInit {
  docks: any[] = [];
  warehouses: any[] = [];
  isLoading = false;
  showModal = false;
  isSaving = false;
  editingDock: any = null;
  formData: any = { name: '', warehouse_id: '', start_hour: 6, end_hour: 18 };

  constructor(private entities: EntitiesService) {}

  async ngOnInit() {
    await Promise.all([this.loadDocks(), this.loadWarehouses()]);
  }

  async loadDocks() {
    this.isLoading = true;
    try {
      this.docks = await this.entities.Dock.list();
    } catch (error) {
      console.error('Error loading docks:', error);
      this.docks = [];
    } finally {
      this.isLoading = false;
    }
  }

  async loadWarehouses() {
    try {
      this.warehouses = await this.entities.Warehouse.list();
    } catch (error) {
      console.error('Error loading warehouses:', error);
      this.warehouses = [];
    }
  }

  openCreateModal() {
    this.editingDock = null;
    this.formData = { name: '', warehouse_id: '', start_hour: 6, end_hour: 18 };
    this.showModal = true;
  }

  editDock(dock: any) {
    this.editingDock = dock;
    this.formData = { ...dock, warehouse_id: dock.warehouse_id || '' };
    this.showModal = true;
  }

  async saveDock() {
    this.isSaving = true;
    try {
      if (this.editingDock) {
        await this.entities.Dock.update(this.editingDock.id, this.formData);
      } else {
        await this.entities.Dock.create(this.formData);
      }
      this.closeModal();
      await this.loadDocks();
    } catch (error) {
      console.error('Error saving dock:', error);
      alert('Failed to save dock.');
    } finally {
      this.isSaving = false;
    }
  }

  async deleteDock(dock: any) {
    if (!confirm(`Delete ${dock.name}?`)) return;
    try {
      await this.entities.Dock.delete(dock.id);
      await this.loadDocks();
    } catch (error) {
      console.error('Error deleting dock:', error);
      alert('Failed to delete dock.');
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingDock = null;
    this.formData = { name: '', warehouse_id: '', start_hour: 6, end_hour: 18 };
  }
}
