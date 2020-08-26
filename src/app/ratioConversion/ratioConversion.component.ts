import { Component } from '@angular/core';
import { Unit } from '../core/model/unit.model';
import { UnitType } from '../core/model/unitType.enum';
import { UnitWeight } from '../core/model/UnitWeight.model';

@Component({
    selector: 'app-ratio-conversion',
    templateUrl: './ratioConversion.component.html',
    styleUrls: ['./ratioConversion.component.scss']
})
export class RatioConversionComponent {
    fromP1: Unit;
    fromP2: Unit;
    toP1: Unit;
    toP2: Unit;

    showUnitTable = true;
    convertionEnable = false;

    get unitIndex(): number {
        if (!this.fromP1) {
            return 0;
        }

        if (!this.fromP2) {
            return 1;
        }

        if (!this.toP1) {
            return 2;
        }

        if (!this.toP2) {
            return 3;
        }

        return 4;
    }

    get inputSufix(): string {
        return (this.fromP1?.shortLabel ?? '?') + '/' + (this.fromP2?.shortLabel ?? '?');
    }

    get resultSufix(): string {
        return (this.toP1?.shortLabel ?? '?') + '/' + (this.toP2?.shortLabel ?? '?');
    }

    nextType: null | UnitType = null;

    convertionFactor: UnitWeight;

    unitSelected(unit: Unit): void {
        if (!this.fromP1) {
            this.fromP1 = unit;
            this.nextType = null;
        } else if (!this.fromP2) {
            this.fromP2 = unit;
            this.nextType = this.fromP1.type;
        } else if (!this.toP1) {
            this.toP1 = unit;
            this.nextType = this.fromP2.type;
        } else if (!this.toP2) {
            this.toP2 = unit;
        }

        if (this.fromP1 && this.fromP2 && this.toP1 && this.toP2) {
            this.showUnitTable = false;
            this.convertionFactor = this.processConvertionFactor();
            this.convertionEnable = true;
        }
    }

    reset(): void {
        this.fromP1 = undefined;
        this.fromP2 = undefined;
        this.toP1 = undefined;
        this.toP2 = undefined;

        this.showUnitTable = true;
        this.convertionFactor = undefined;
        this.convertionEnable = false;
        this.nextType = null;
    }

    reverseConvertion(): void {
        if (this.fromP1 && this.fromP2 && this.toP1 && this.toP2) {
            [this.fromP1, this.fromP2, this.toP1, this.toP2] = [this.toP1, this.toP2, this.fromP1, this.fromP2];
            this.convertionFactor = this.processConvertionFactor();
        }
    }

    processConvertionFactor(): UnitWeight {
        return {
            a: (this.fromP1.weight.a * this.toP2.weight.a) / (this.toP1.weight.a * this.fromP2.weight.a),
            b: 0 // TODO: a définir pour débloquer la conversion de la température
        };
    }
}
