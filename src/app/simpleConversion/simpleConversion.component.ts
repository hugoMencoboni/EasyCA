import { Component, OnInit } from '@angular/core';
import { Unit } from '../core/model/unit.model';
import { UnitType } from '../core/model/unitType.enum';
import { UnitWeight } from '../core/model/unitWeight.model';
import { CacheService } from '../core/services/cache.service';
import { CacheType } from '../core/model/cacheType.enum';
import { v4 as uuidv4 } from 'uuid';
import { UnitService } from '../core/services/unit.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-simple-conversion',
  templateUrl: './simpleConversion.component.html',
  styleUrls: ['./simpleConversion.component.scss']
})
export class SimpleConversionComponent implements OnInit {
  from: Unit;
  to: Unit;
  convertionFactor: UnitWeight;

  get unitIndex(): number {
    return this.from ? (this.to ? 2 : 1) : 0;
  }

  nextType: null | UnitType;

  get completed(): boolean {
    return !!(this.from && this.to);
  }

  get isFavorite(): string {
    const item = this.favorite?.find(f => f.from.unit === this.from.unit
      && f.from.type === this.from.type
      && f.to.unit === this.to.unit
      && f.to.type === this.to.type);
    return item?.id;
  }

  favorite: Array<{ id: string, from: Unit, to: Unit, convertionFactor: UnitWeight }>;

  constructor(private cacheService: CacheService, private unitService: UnitService) { }

  ngOnInit(): void {
    this.unitService.getUnits().pipe(take(1)).subscribe(units => {
      const favorites = (this.cacheService.getItem(CacheType.SimpleConversion) as
        Array<{ id: string, from: Unit, to: Unit, convertionFactor: UnitWeight }>);

      favorites?.forEach(f => {
        const from = units?.find(u => u.unit === f.from.unit && u.type === f.from.type);
        const to = units?.find(u => u.unit === f.to.unit && u.type === f.to.type);
        f.convertionFactor = this.processConvertionFactor(from, to);
        f.from.weight = from.weight;
        f.to.weight = to.weight;
      });
      this.favorite = favorites;
    });
  }

  unitSelected(unit: Unit): void {
    if (!this.from) {
      this.from = unit;
      this.nextType = unit.type;
    } else if (!this.to) {
      this.to = unit;
    }

    if (this.completed) {
      this.convertionFactor = this.processConvertionFactor(this.from, this.to);
    }
  }

  reset(): void {
    this.from = undefined;
    this.to = undefined;

    this.convertionFactor = undefined;
    this.nextType = null;
  }

  reverseConvertion(idFavorite?: string): void {
    if (idFavorite) {
      const favorite = this.favorite.find(f => f.id === idFavorite);
      [favorite.from, favorite.to] = [favorite.to, favorite.from];
      favorite.convertionFactor = this.processConvertionFactor(favorite.from, favorite.to);
    } else if (this.completed) {
      [this.from, this.to] = [this.to, this.from];
      this.convertionFactor = this.processConvertionFactor(this.from, this.to);
    }
  }

  processConvertionFactor(from: Unit, to: Unit): UnitWeight {
    return {
      a: from.weight.a / to.weight.a,
      b: (from.weight.b - to.weight.b) / to.weight.a
    };
  }

  onFavorite(): void {
    const favoriteId = this.isFavorite;
    if (this.isFavorite) {
      this.removeFromFavorite(favoriteId);
    } else {
      this.addToFavorite();
    }
  }

  addToFavorite(): void {
    if (!this.favorite) {
      this.favorite = Array<{ id: string, from: Unit, to: Unit, convertionFactor: UnitWeight }>();
    }

    this.favorite.push({
      id: (uuidv4() as string),
      from: this.from,
      to: this.to,
      convertionFactor: this.convertionFactor
    });

    this.cacheService.setItem(CacheType.SimpleConversion, this.favorite);
  }

  removeFromFavorite(id: string): void {
    this.favorite = this.favorite?.filter(f => f.id !== id);
    this.cacheService.setItem(CacheType.SimpleConversion, this.favorite);
  }
}
