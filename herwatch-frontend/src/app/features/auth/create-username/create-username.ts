import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-username',
  imports: [FormsModule],
  templateUrl: './create-username.html',
  styleUrl: './create-username.css'
})
export class CreateUsernameComponent {
  username = '';

  constructor(private router: Router, private auth: AuthService) {}

  onContinue() {
    this.auth.updateSignupData({ username: this.username });
    this.router.navigate(['/setup-pin']);
  }
}