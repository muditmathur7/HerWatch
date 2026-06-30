import { Component } from '@angular/core';
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
export class ProfileComponent {
  profile: UserProfile;
  private backup: UserProfile;
  editMode = false;

  constructor(private userService: UserService) {
    this.profile = this.userService.getUser() ?? {
      name: '', username: '', email: '', phone: '', age: null, gender: '', password: ''
    };
    this.backup = { ...this.profile };
  }

  saveProfile() {
    this.userService.saveUser(this.profile);
    this.backup = { ...this.profile };
    this.editMode = false;
  }

  cancelEdit() {
    this.profile = { ...this.backup };
    this.editMode = false;
  }
}