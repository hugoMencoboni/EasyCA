import { Injectable } from '@angular/core';
import { Unit } from '../model/unit.model';
import { UnitType } from '../model/unitType.enum';
import { CurrencyService } from './currency.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Currency } from '../model/currency.enum';

@Injectable({
  providedIn: 'root',
})
export class UnitService {

  constructor(private currencyService: CurrencyService) { }

  getUnits(): Observable<Array<Unit>> {
    return this.currencyService.getExchangeRate()
      .pipe(
        map((data: Array<{ currency: Currency, rate: number }>) => {
          const euroRate = data.find(c => c.currency === Currency.Euro);
          const dollarRate = data.find(c => c.currency === Currency.Dollar);
          const canadianDollarRate = data.find(c => c.currency === Currency.CanadianDollar);

          const lengthUnits = [
            { label: 'centimettre', shortLabel: 'cm', type: UnitType.Length, weight: { a: 0.01, b: 0 } },
            { label: 'mettre', shortLabel: 'm', type: UnitType.Length, weight: { a: 1, b: 0 } },
            { label: 'kilomettre', shortLabel: 'km', type: UnitType.Length, weight: { a: 1000, b: 0 } },
            { label: 'inch', shortLabel: 'in', type: UnitType.Length, weight: { a: 0.0254, b: 0 } },
            { label: 'foot', shortLabel: 'ft', type: UnitType.Length, weight: { a: 0.3048, b: 0 } },
            { label: 'yard', shortLabel: 'yd', type: UnitType.Length, weight: { a: 0.9144, b: 0 } },
            { label: 'mile', shortLabel: 'mi', type: UnitType.Length, weight: { a: 1609.34, b: 0 } }
          ];

          const areaUnits = lengthUnits.map(lu => {
            return {
              label: lu.label + '²',
              shortLabel: lu.shortLabel + '²',
              type: UnitType.Area,
              weight: { a: Math.pow(lu.weight.a, 2), b: 0 }
            };
          });

          const volumeUnits = lengthUnits.map(lu => {
            return {
              label: lu.label + '³',
              shortLabel: lu.shortLabel + '³',
              type: UnitType.Volume,
              weight: { a: Math.pow(lu.weight.a, 3), b: 0 }
            };
          });

          return [
            { label: 'gramme', shortLabel: 'g', type: UnitType.Weight, weight: { a: 1, b: 0 } },
            { label: 'kilogramme', shortLabel: 'kg', type: UnitType.Weight, weight: { a: 1000, b: 0 } },
            { label: 'ounce', shortLabel: 'oz', type: UnitType.Weight, weight: { a: 28.35, b: 0 } },
            { label: 'pound (livre)', shortLabel: 'lb', type: UnitType.Weight, weight: { a: 453.59, b: 0 } },
            { label: 'stone', shortLabel: 'st', type: UnitType.Weight, weight: { a: 6350, b: 0 } },
            { label: 'quarter', shortLabel: 'qt', type: UnitType.Weight, weight: { a: 12700, b: 0 } },

            ...lengthUnits,
            ...areaUnits,
            ...volumeUnits,

            { label: 'euro', shortLabel: '€', type: UnitType.Money, weight: { a: euroRate?.rate, b: 0 } },
            { label: 'dollar canadien', shortLabel: '🍁$', type: UnitType.Money, weight: { a: canadianDollarRate?.rate, b: 0 } },
            { label: 'dollar US', shortLabel: '$', type: UnitType.Money, weight: { a: dollarRate?.rate, b: 0 } },

            { label: 'celsius', shortLabel: '°C', type: UnitType.Temperature, weight: { a: 1, b: -273.15 } },
            { label: 'fahrenheit', shortLabel: '°F', type: UnitType.Temperature, weight: { a: 5 / 9, b: 5 / 9 * (-32) - 273.15 } },
            { label: 'kelvin', shortLabel: 'K', type: UnitType.Temperature, weight: { a: 1, b: 0 } },
          ];
        })
      );
  }
}
