import { UnitType } from './unitType.enum';
import { UnitWeight } from './unitWeight.model';
import { Units } from './units.enum';

export class Unit {
    type: UnitType;
    unit: Units;
    label: string;
    shortLabel: string;
    weight: UnitWeight;
}
