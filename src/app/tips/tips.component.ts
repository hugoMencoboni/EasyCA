import { Component } from '@angular/core';
import { UnitWeight } from '../core/model/UnitWeight.model';

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

  taxeFactor: UnitWeight = { a: 1.13, b: 0 };
  tipsFactors: Array<UnitWeight> = [{ a: 0.1, b: 0 }, { a: 0.15, b: 0 }, { a: 0.2, b: 0 }];
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
      const tipsSum = this.tipsFactors.reduce((accumulator, c) => accumulator += c.a, 0);
      const total = (+value) * this.taxeFactor.a + (+value) * (tipsSum / this.tipsFactors.length);
      this.total = (Math.round(total * 100) / 100).toString();
    }
  }
}
