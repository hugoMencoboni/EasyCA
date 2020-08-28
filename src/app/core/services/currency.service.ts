import { Injectable } from '@angular/core';
import { retry, map, catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Currency } from '../model/currency.enum';
import { CacheService } from './cache.service';
import { CacheType } from '../model/cacheType.enum';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  key = 'c5282c046d66efb0a2ea';
  USD = 'USD_EUR';
  CAD = 'CAD_EUR';

  constructor(private http: HttpClient, private cacheService: CacheService) { }

  getExchangeRate(): Observable<Array<{ currency: Currency, rate: number }>> {
    const cachedData = this.getExchangeRateFromCache(false);

    if (cachedData) {
      return of((cachedData as Array<{ currency: Currency, rate: number }>));
    } else {
      return this.getExchangeRateFromWeb().pipe(
        catchError(err => {
          const dirtyCachedData = this.getExchangeRateFromCache(true);

          if (dirtyCachedData) {
            return of(dirtyCachedData);
          }

          return throwError(err);
        }),
      );
    }
  }

  private getExchangeRateFromWeb(): Observable<Array<{ currency: Currency, rate: number }>> {
    const url = `https://free.currconv.com/api/v7/convert?q=${this.USD},${this.CAD}&compact=ultra&apiKey=${this.key}`;
    return this.http.get<any>(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        map(data => {
          return [
            {
              currency: Currency.Euro,
              rate: 1
            },
            {
              currency: Currency.Dollar,
              rate: data[this.USD]
            },
            {
              currency: Currency.CanadianDollar,
              rate: data[this.CAD]
            }
          ];
        }),
        tap(data => {
          const now = new Date();
          const tomorow = new Date();
          tomorow.setDate(now.getDate() + 1);

          const nextMounth = new Date();
          nextMounth.setMonth(now.getMonth() + 1);

          this.cacheService.setItem(CacheType.CurrencyRate, data, tomorow, nextMounth);
        })
      );
  }

  private getExchangeRateFromCache(tolerateDirtyData: boolean): Array<{ currency: Currency, rate: number }> {
    return this.cacheService.getItem(CacheType.CurrencyRate, tolerateDirtyData);
  }
}
