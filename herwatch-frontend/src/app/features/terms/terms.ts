import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms',
  imports: [FormsModule],
  templateUrl: './terms.html',
  styleUrl: './terms.css'
})
export class TermsComponent {
  agreed = false;

  constructor(private router: Router) {}

  onAccept() {
    // TODO: persist terms-accepted flag once backend exists
    this.router.navigate(['/dashboard']);
  }
}