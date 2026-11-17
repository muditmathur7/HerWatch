import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { ContactService, EmergencyContact, ContactCreate } from '../../core/services/contact.service';

@Component({
  selector: 'app-contacts',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css'
})
export class ContactsComponent implements OnInit {
  newContact: ContactCreate = {
    name: '',
    phone: '',
    relationship: 'Family',
    isPrimary: false
  };

  contacts: EmergencyContact[] = [];
  isLoading = false;
  isAdding = false;
  errorMessage = '';
  successMessage = '';

  emergencyHelplines = [
    { name: 'National Emergency', number: '112', icon: 'fas fa-shield-alt', color: '#ff3b30' },
    { name: 'Women Helpline', number: '1091', icon: 'fas fa-female', color: '#e83e8c' },
    { name: 'Ambulance', number: '102', icon: 'fas fa-ambulance', color: '#ff9500' },
    { name: 'Child / Family Helpline', number: '1098', icon: 'fas fa-hands-helping', color: '#4cd964' }
  ];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.contactService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Failed to load emergency contacts.';
      }
    });
  }

  addContact(): void {
    if (!this.newContact.name.trim() || !this.newContact.phone.trim()) {
      this.errorMessage = 'Please provide both name and phone number.';
      return;
    }

    this.isAdding = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.contactService.addContact(this.newContact).subscribe({
      next: (created) => {
        this.isAdding = false;
        this.contacts.unshift(created);
        this.newContact = { name: '', phone: '', relationship: 'Family', isPrimary: false };
        this.successMessage = 'Contact added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        this.isAdding = false;
        this.errorMessage = err.error?.detail || 'Failed to add contact. Please try again.';
      }
    });
  }

  removeContact(contact: EmergencyContact): void {
    if (!confirm(`Are you sure you want to remove ${contact.name}?`)) {
      return;
    }

    this.contactService.deleteContact(contact.id).subscribe({
      next: () => {
        this.contacts = this.contacts.filter((c) => c.id !== contact.id);
      },
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Failed to delete contact.';
      }
    });
  }
}
