import { Injectable } from '@angular/core';
import { Unit } from '../model/unit.model';
import { UnitType } from '../model/unit.enum';

@Injectable({
  providedIn: 'root',
})
export class UnitService {

  constructor() { }

  getUnits(): Array<Unit> {
    const lengthUnits = [{ label: 'centimettre', shortLabel: 'cm', type: UnitType.Length, weight: 0.001 },
    { label: 'mettre', shortLabel: 'm', type: UnitType.Length, weight: 1 },
    { label: 'kilomettre', shortLabel: 'km', type: UnitType.Length, weight: 1000 },
    { label: 'inch', shortLabel: 'in', type: UnitType.Length, weight: 0.00254 },
    { label: 'foot', shortLabel: 'ft', type: UnitType.Length, weight: 0.03048 },
    { label: 'yard', shortLabel: 'yd', type: UnitType.Length, weight: 0.09144 },
    { label: 'mile', shortLabel: 'mi', type: UnitType.Length, weight: 1.609344 }];

    const areaUnits = lengthUnits.map(lu => {
      return {
        label: lu.label + '²',
        shortLabel: lu.shortLabel + '²',
        type: UnitType.Area,
        weight: Math.pow(lu.weight, 2)
      };
    });

    const volumeUnits = lengthUnits.map(lu => {
      return {
        label: lu.label + '³',
        shortLabel: lu.shortLabel + '³',
        type: UnitType.Volume,
        weight: Math.pow(lu.weight, 3)
      };
    });

    return [
      { label: 'gramme', shortLabel: 'g', type: UnitType.Weight, weight: 1 },
      { label: 'kilogramme', shortLabel: 'kg', type: UnitType.Weight, weight: 1000 },
      { label: 'ounce', shortLabel: 'oz', type: UnitType.Weight, weight: 28.35 },
      { label: 'pound (livre)', shortLabel: 'lb', type: UnitType.Weight, weight: 453.59 },
      { label: 'stone', shortLabel: 'st', type: UnitType.Weight, weight: 6.35 },
      { label: 'quarter', shortLabel: 'qt', type: UnitType.Weight, weight: 12.7 },

      ...lengthUnits,
      ...areaUnits,
      ...volumeUnits,

      { label: 'euro', shortLabel: '€', type: UnitType.Money, weight: 1 },
      { label: 'dollar canadien', shortLabel: '$', type: UnitType.Money, weight: 1.56 },
    ];
  }
}