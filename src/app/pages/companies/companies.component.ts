import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntitiesService } from '../../services/entities.service';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './companies.component.html',
  styles: []
})
export class CompaniesComponent implements OnInit {
  companies: any[] = [];
  isLoading = false;
  showModal = false;
  isSaving = false;
  editingCompany: any = null;
  formData: any = {
    name: '',
    contact_name: '',
    email: '',
    phone: ''
  };

  constructor(private entities: EntitiesService) {}

  async ngOnInit() {
    await this.loadCompanies();
  }

  async loadCompanies() {
    this.isLoading = true;
    try {
      this.companies = await this.entities.Company.list();
    } catch (error) {
      console.error('Error loading companies:', error);
      this.companies = [];
    } finally {
      this.isLoading = false;
    }
  }

  openCreateModal() {
    this.editingCompany = null;
    this.formData = {
      name: '',
      contact_name: '',
      email: '',
      phone: ''
    };
    this.showModal = true;
  }

  editCompany(company: any) {
    this.editingCompany = company;
    this.formData = { ...company };
    this.showModal = true;
  }

  async saveCompany() {
    this.isSaving = true;
    try {
      if (this.editingCompany) {
        await this.entities.Company.update(this.editingCompany.id, this.formData);
      } else {
        await this.entities.Company.create(this.formData);
      }
      this.closeModal();
      await this.loadCompanies();
    } catch (error) {
      console.error('Error saving company:', error);
      alert('Failed to save company. Please try again.');
    } finally {
      this.isSaving = false;
    }
  }

  async deleteCompany(company: any) {
    if (!confirm(`Are you sure you want to delete ${company.name}?`)) {
      return;
    }

    try {
      await this.entities.Company.delete(company.id);
      await this.loadCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Failed to delete company. Please try again.');
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingCompany = null;
    this.formData = {
      name: '',
      contact_name: '',
      email: '',
      phone: ''
    };
  }
}
