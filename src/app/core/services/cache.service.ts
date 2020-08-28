import { Injectable } from '@angular/core';
import { CacheType } from '../model/cacheType.enum';
import { CacheItem } from '../model/cacheItem.model';

@Injectable({
  providedIn: 'root',
})
export class CacheService {

  getItem(code: string, cacheType: CacheType, tolerateDirty: boolean = false): any {
    const cacheKey = `${cacheType}|${code}`;
    const cachedData = (JSON.parse(localStorage.getItem(cacheKey)) as CacheItem);
    cachedData.expiracy = cachedData.expiracy ? new Date(cachedData.expiracy) : undefined;
    cachedData.dirtyAt = cachedData.dirtyAt ? new Date(cachedData.dirtyAt) : undefined;
    const today = new Date();

    if (cachedData &&
      (cachedData.expiracy > today || tolerateDirty && cachedData.dirtyAt > today)) {
      return cachedData.data;
    }

    return undefined;
  }

  setItem(code: string, cacheType: CacheType, data: any, expiracy?: Date, dirtyAt?: Date) {
    const cacheKey = `${cacheType}|${code}`;

    const cacheData: CacheItem = {
      data,
      dirtyAt,
      expiracy
    };

    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  }
}
