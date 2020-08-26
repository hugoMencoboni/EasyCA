import { Component } from '@angular/core';
import { Unit } from '../core/model/unit.model';
import { UnitType } from '../core/model/unitType.enum';
import { UnitWeight } from '../core/model/unitWeight.model';

@Component({
  selector: 'app-simple-conversion',
  templateUrl: './simpleConversion.component.html',
  styleUrls: ['./simpleConversion.component.scss']
})
export class SimpleConversionComponent {
  from: Unit;
  to: Unit;

  showUnitTable = true;
  convertionEnable = false;

  convertionFactor: UnitWeight;

  get unitIndex(): number {
    return this.from ? (this.to ? 2 : 1) : 0;
  }

  nextType: null | UnitType;

  unitSelected(unit: Unit): void {
    if (!this.from) {
      this.from = unit;
      this.nextType = unit.type;
    } else if (!this.to) {
      this.to = unit;
    }

    if (this.from && this.to) {
      this.showUnitTable = false;
      this.convertionFactor = this.processConvertionFactor();
      this.convertionEnable = true;
    }
  }

  reset(): void {
    this.from = undefined;
    this.to = undefined;

    this.showUnitTable = true;
    this.convertionFactor = undefined;
    this.convertionEnable = false;
    this.nextType = null;
  }

  reverseConvertion(): void {
    if (this.from && this.to) {
      [this.from, this.to] = [this.to, this.from];
      this.convertionFactor = this.processConvertionFactor();
    }
  }

  processConvertionFactor(): UnitWeight {
    return {
      a: this.from.weight.a / this.to.weight.a,
      b: (this.from.weight.b - this.to.weight.b) / this.to.weight.a
    };
  }
}
