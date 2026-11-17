import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { UserService, UserProfile } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  profile: UserProfile;
  private backup: UserProfile;
  editMode = false;
  isSaving = false;
  saveMessage = '';

  constructor(private userService: UserService) {
    this.profile = this.userService.getUser() ?? {
      firstName: '',
      lastName: '',
      name: '',
      username: '',
      email: '',
      phone: '',
      age: null,
      gender: ''
    };
    this.backup = { ...this.profile };
  }

  ngOnInit(): void {
    this.userService.fetchProfile().subscribe({
      next: (user) => {
        this.profile = user;
        this.backup = { ...user };
      },
      error: (err) => {
        console.error('Failed to fetch profile', err);
      }
    });
  }

  saveProfile() {
    this.isSaving = true;
    this.saveMessage = '';

    // Split name into firstName and lastName if updated as one field
    let firstName = this.profile.firstName;
    let lastName = this.profile.lastName;
    if (this.profile.name) {
      const parts = this.profile.name.trim().split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    const payload = {
      firstName,
      lastName,
      phone: this.profile.phone,
      age: this.profile.age,
      gender: this.profile.gender
    };

    this.userService.updateProfile(payload).subscribe({
      next: (updated) => {
        this.isSaving = false;
        this.profile = updated;
        this.backup = { ...updated };
        this.editMode = false;
        this.saveMessage = 'Profile updated successfully!';
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to update profile', err);
      }
    });
  }

  cancelEdit() {
    this.profile = { ...this.backup };
    this.editMode = false;
  }
}
