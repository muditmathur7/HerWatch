import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {

  constructor(private storage: StorageService) {}

  ngOnInit() {
    const darkMode = this.storage.getItem<boolean>('herwatch_dark_mode');
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }
  }
}