import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup-step1',
  imports: [RouterLink, FormsModule],
  templateUrl: './signup-step1.html',
  styleUrl: './signup-step1.css'
})
export class SignupStep1Component {
  firstName = '';
  lastName = '';
  phone = '';
  age: number | null = null;
  gender = '';

  constructor(private router: Router, private auth: AuthService) {}

  onNext() {
    this.auth.updateSignupData({
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      age: this.age,
      gender: this.gender
    });
    this.router.navigate(['/signup-step2']);
  }
}