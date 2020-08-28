import { Injectable } from '@angular/core';
import { CacheType } from '../model/cacheType.enum';
import { CacheItem } from '../model/cacheItem.model';

@Injectable({
  providedIn: 'root',
})
export class CacheService {

  getItem(cacheKey: CacheType, tolerateDirty: boolean = false): any {
    const cachedData = (JSON.parse(localStorage.getItem(cacheKey)) as CacheItem);

    if (cachedData) {
      cachedData.expiracy = cachedData.expiracy ? new Date(cachedData.expiracy) : undefined;
      cachedData.dirtyAt = cachedData.dirtyAt ? new Date(cachedData.dirtyAt) : undefined;
    }

    const today = new Date();

    if (cachedData &&
      (cachedData.expiracy > today || tolerateDirty && cachedData.dirtyAt > today)) {
      return cachedData.data;
    }

    return undefined;
  }

  setItem(cacheKey: CacheType, data: any, expiracy?: Date, dirtyAt?: Date) {
    const cacheData: CacheItem = {
      data,
      dirtyAt,
      expiracy
    };

    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  }
}
