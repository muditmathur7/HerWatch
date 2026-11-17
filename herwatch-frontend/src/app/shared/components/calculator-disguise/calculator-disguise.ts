import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StealthService } from '../../../core/services/stealth.service';

@Component({
  selector: 'app-calculator-disguise',
  imports: [CommonModule],
  templateUrl: './calculator-disguise.html',
  styleUrl: './calculator-disguise.css'
})
export class CalculatorDisguiseComponent {
  display = '0';
  private currentOp = '';
  private prevValue = 0;
  private shouldReset = false;
  private acTapCount = 0;
  private lastAcTap = 0;

  constructor(private stealth: StealthService) {}

  pressNum(n: string): void {
    if (this.display === '0' || this.shouldReset) {
      this.display = n;
      this.shouldReset = false;
    } else {
      this.display += n;
    }
  }

  pressOp(op: string): void {
    this.prevValue = parseFloat(this.display);
    this.currentOp = op;
    this.shouldReset = true;
  }

  pressEquals(): void {
    // Secret unlock codes: 911 or 1234 followed by equals
    if (this.display === '911' || this.display === '1234') {
      this.stealth.deactivateStealth();
      return;
    }

    const current = parseFloat(this.display);
    let result = 0;

    switch (this.currentOp) {
      case '+':
        result = this.prevValue + current;
        break;
      case '-':
        result = this.prevValue - current;
        break;
      case '×':
        result = this.prevValue * current;
        break;
      case '÷':
        result = current !== 0 ? this.prevValue / current : 0;
        break;
      default:
        return;
    }

    this.display = String(Math.round(result * 100000) / 100000);
    this.currentOp = '';
    this.shouldReset = true;
  }

  pressAC(): void {
    const now = Date.now();
    if (now - this.lastAcTap < 600) {
      this.acTapCount++;
      if (this.acTapCount >= 3) {
        // Triple tap AC unlocks disguise
        this.stealth.deactivateStealth();
        return;
      }
    } else {
      this.acTapCount = 1;
    }
    this.lastAcTap = now;

    this.display = '0';
    this.prevValue = 0;
    this.currentOp = '';
    this.shouldReset = false;
  }

  pressDot(): void {
    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  pressPercent(): void {
    const val = parseFloat(this.display);
    this.display = String(val / 100);
  }

  pressPlusMinus(): void {
    const val = parseFloat(this.display);
    this.display = String(val * -1);
  }
}
