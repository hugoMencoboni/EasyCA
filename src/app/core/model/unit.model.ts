import { UnitType } from './unitType.enum';
import { UnitWeight } from './unitWeight.model';

export class Unit {
    type: UnitType;
    label: string;
    shortLabel: string;
    weight: UnitWeight;
}
