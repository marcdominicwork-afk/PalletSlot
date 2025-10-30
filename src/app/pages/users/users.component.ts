import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntitiesService } from '../../services/entities.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  companies: any[] = [];
  isLoading = false;
  showModal = false;
  isSaving = false;
  editingUser: any = null;
  formData: any = { full_name: '', email: '', role: 'user', company_id: '' };

  constructor(private entities: EntitiesService) {}

  async ngOnInit() {
    await Promise.all([this.loadUsers(), this.loadCompanies()]);
  }

  async loadUsers() {
    this.isLoading = true;
    try {
      this.users = await this.entities.User.list();
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
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
    this.editingUser = null;
    this.formData = { full_name: '', email: '', role: 'user', company_id: '' };
    this.showModal = true;
  }

  editUser(user: any) {
    this.editingUser = user;
    this.formData = { ...user, company_id: user.company_id || '' };
    this.showModal = true;
  }

  async saveUser() {
    this.isSaving = true;
    try {
      if (this.editingUser) {
        await this.entities.User.update(this.editingUser.id, this.formData);
      } else {
        await this.entities.User.create(this.formData);
      }
      this.closeModal();
      await this.loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user.');
    } finally {
      this.isSaving = false;
    }
  }

  async deleteUser(user: any) {
    if (!confirm(`Delete ${user.full_name}?`)) return;
    try {
      await this.entities.User.delete(user.id);
      await this.loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingUser = null;
    this.formData = { full_name: '', email: '', role: 'user', company_id: '' };
  }
}
