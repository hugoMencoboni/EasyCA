import { Component } from '@angular/core';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss']
})
export class TipsComponent {
  sharedValue: string;
  shareValue = true;

  taxeTooltip = 'Les taxes fédérales et provinciales représentent environ 13% du montant.';

  tipsTooltip = 'Les pourboires représentent souvent 15% du montant hors taxe (10% au minimum, 20 pour un service excellent).';

  taxeFactor = 1.13;
  tipsFactors = [0.1, 0.15, 0.2];
  total = '';

  valueChange(value: string): void {
    this.processTotal(value);

    if (this.shareValue) {
      this.sharedValue = value;
    }
  }

  changeShareStatus(): void {
    this.shareValue = !this.shareValue;
  }

  processTotal(value: string): void {
    if (!isNaN(+value)) {
      const total = (+value) * this.taxeFactor + (+value) * (this.tipsFactors.reduce((p, c) => c += p) / this.tipsFactors.length);
      this.total = (Math.round(total * 100) / 100).toString();
    }
  }
}
