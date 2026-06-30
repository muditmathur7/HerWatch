import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-contacts',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css'
})
export class ContactsComponent {
  newContact = { name: '', phone: '' };
  contacts: { name: string; phone: string }[] = [];

  addContact() {
    this.contacts.push({ ...this.newContact });
    this.newContact = { name: '', phone: '' };
    // TODO: persist to backend
  }
  removeContact(contact: { name: string; phone: string }) {
  this.contacts = this.contacts.filter(c => c !== contact);
  }
}