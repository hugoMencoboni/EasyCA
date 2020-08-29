import { Injectable } from '@angular/core';
import { Unit } from '../model/unit.model';
import { UnitType } from '../model/unitType.enum';
import { CurrencyService } from './currency.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Currency } from '../model/currency.enum';
import { SnackbarService } from './snackbar.service';
import { Units } from '../model/units.enum';

@Injectable({
  providedIn: 'root',
})
export class UnitService {

  constructor(private currencyService: CurrencyService, private snackbarService: SnackbarService) { }

  getUnits(): Observable<Array<Unit>> {
    return this.currencyService.getExchangeRate()
      .pipe(
        catchError(() => {
          const warning = 'Le chargement des taux de conversion de devises a rencontré un problème, les conversions peuvent être altérées.';
          this.snackbarService.notifyWarning(warning);

          return of(null);
        }),
        map((data: Array<{ currency: Currency, rate: number }>) => {
          const euroRate = data?.find(c => c.currency === Currency.Euro)?.rate ?? 0;
          const dollarRate = data?.find(c => c.currency === Currency.Dollar)?.rate ?? 0;
          const canadianDollarRate = data?.find(c => c.currency === Currency.CanadianDollar)?.rate ?? 0;

          const lengthUnits = [
            { unit: Units.CM, label: 'centimettre', shortLabel: 'cm', type: UnitType.Length, weight: { a: 0.01, b: 0 } },
            { unit: Units.M, label: 'mettre', shortLabel: 'm', type: UnitType.Length, weight: { a: 1, b: 0 } },
            { unit: Units.KM, label: 'kilomettre', shortLabel: 'km', type: UnitType.Length, weight: { a: 1000, b: 0 } },
            { unit: Units.INCH, label: 'inch', shortLabel: 'in', type: UnitType.Length, weight: { a: 0.0254, b: 0 } },
            { unit: Units.FOOT, label: 'foot', shortLabel: 'ft', type: UnitType.Length, weight: { a: 0.3048, b: 0 } },
            { unit: Units.YARD, label: 'yard', shortLabel: 'yd', type: UnitType.Length, weight: { a: 0.9144, b: 0 } },
            { unit: Units.MILE, label: 'mile', shortLabel: 'mi', type: UnitType.Length, weight: { a: 1609.34, b: 0 } }
          ];

          const areaUnits = lengthUnits.map(lu => {
            return {
              unit: lu.unit,
              label: lu.label + '²',
              shortLabel: lu.shortLabel + '²',
              type: UnitType.Area,
              weight: { a: Math.pow(lu.weight.a, 2), b: 0 }
            };
          });

          const volumeUnits = lengthUnits.map(lu => {
            return {
              unit: lu.unit,
              label: lu.label + '³',
              shortLabel: lu.shortLabel + '³',
              type: UnitType.Volume,
              weight: { a: Math.pow(lu.weight.a, 3), b: 0 }
            };
          });

          return [
            { unit: Units.G, label: 'gramme', shortLabel: 'g', type: UnitType.Weight, weight: { a: 1, b: 0 } },
            { unit: Units.KG, label: 'kilogramme', shortLabel: 'kg', type: UnitType.Weight, weight: { a: 1000, b: 0 } },
            { unit: Units.OUNCE, label: 'ounce', shortLabel: 'oz', type: UnitType.Weight, weight: { a: 28.35, b: 0 } },
            { unit: Units.POUND, label: 'pound (livre)', shortLabel: 'lb', type: UnitType.Weight, weight: { a: 453.59, b: 0 } },
            { unit: Units.STONE, label: 'stone', shortLabel: 'st', type: UnitType.Weight, weight: { a: 6350, b: 0 } },
            { unit: Units.QUARTER, label: 'quarter', shortLabel: 'qt', type: UnitType.Weight, weight: { a: 12700, b: 0 } },

            ...lengthUnits,
            ...areaUnits,
            ...volumeUnits,

            { unit: Units.EURO, label: 'euro', shortLabel: '€', type: UnitType.Money, weight: { a: euroRate, b: 0 } },
            {
              unit: Units.CANADIAN_DOLLAR, label: 'dollar canadien', shortLabel: 'C$', type: UnitType.Money,
              weight: { a: canadianDollarRate, b: 0 }
            },
            { unit: Units.DOLLAR, label: 'dollar US', shortLabel: 'US$', type: UnitType.Money, weight: { a: dollarRate, b: 0 } },

            { unit: Units.CELSIUS, label: 'celsius', shortLabel: '°C', type: UnitType.Temperature, weight: { a: 1, b: -273.15 } },
            {
              unit: Units.FAHRENHEIT, label: 'fahrenheit', shortLabel: '°F', type: UnitType.Temperature,
              weight: { a: 5 / 9, b: 5 / 9 * (-32) - 273.15 }
            },
            { unit: Units.KELVIN, label: 'kelvin', shortLabel: 'K', type: UnitType.Temperature, weight: { a: 1, b: 0 } },
          ];
        })
      );
  }
}
