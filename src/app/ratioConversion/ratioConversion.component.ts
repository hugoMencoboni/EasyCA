import { Component, OnInit } from '@angular/core';
import { Unit } from '../core/model/unit.model';
import { UnitType } from '../core/model/unitType.enum';
import { UnitWeight } from '../core/model/unitWeight.model';
import { CacheService } from '../core/services/cache.service';
import { UnitService } from '../core/services/unit.service';
import { take } from 'rxjs/operators';
import { CacheType } from '../core/model/cacheType.enum';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-ratio-conversion',
    templateUrl: './ratioConversion.component.html',
    styleUrls: ['./ratioConversion.component.scss']
})
export class RatioConversionComponent implements OnInit {
    fromP1: Unit;
    fromP2: Unit;
    toP1: Unit;
    toP2: Unit;

    get completed(): boolean {
        return !!(this.fromP1 && this.fromP2 && this.toP1 && this.toP2);
    }

    get isFavorite(): string {
        const item = this.favorite?.find(f => f.fromP1.unit === this.fromP1.unit
            && f.fromP1.type === this.fromP1.type
            && f.fromP2.unit === this.fromP2.unit
            && f.fromP2.type === this.fromP2.type
            && f.toP1.unit === this.toP1.unit
            && f.toP1.type === this.toP1.type
            && f.toP2.unit === this.toP2.unit
            && f.toP2.type === this.toP2.type);
        return item?.id;
    }

    favorite: Array<{ id: string, fromP1: Unit, fromP2: Unit, toP1: Unit, toP2: Unit, convertionFactor: UnitWeight }>;

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

    constructor(private cacheService: CacheService, private unitService: UnitService) { }

    ngOnInit(): void {
        this.unitService.getUnits().pipe(take(1)).subscribe(units => {
            const favorites = (this.cacheService.getItem(CacheType.RatioConversion) as
                Array<{ id: string, fromP1: Unit, fromP2: Unit, toP1: Unit, toP2: Unit, convertionFactor: UnitWeight }>);

            favorites?.forEach(f => {
                const fromP1 = units?.find(u => u.unit === f.fromP1.unit && u.type === f.fromP1.type);
                const fromP2 = units?.find(u => u.unit === f.fromP2.unit && u.type === f.fromP2.type);
                const toP1 = units?.find(u => u.unit === f.toP1.unit && u.type === f.toP1.type);
                const toP2 = units?.find(u => u.unit === f.toP2.unit && u.type === f.toP2.type);
                f.convertionFactor = this.processConvertionFactor(fromP1, fromP2, toP1, toP2);
                f.fromP1.weight = fromP1.weight;
                f.fromP2.weight = fromP2.weight;
                f.toP1.weight = toP1.weight;
                f.toP2.weight = toP2.weight;
            });
            this.favorite = favorites;
        });
    }

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

        if (this.completed) {
            this.convertionFactor = this.processConvertionFactor(this.fromP1, this.fromP2, this.toP1, this.toP2);
        }
    }

    reset(): void {
        this.fromP1 = undefined;
        this.fromP2 = undefined;
        this.toP1 = undefined;
        this.toP2 = undefined;

        this.convertionFactor = undefined;
        this.nextType = null;
    }

    reverseConvertion(idFavorite?: string): void {
        if (idFavorite) {
            const fav = this.favorite.find(f => f.id === idFavorite);
            [fav.fromP1, fav.fromP2, fav.toP1, fav.toP2] = [fav.toP1, fav.toP2, fav.fromP1, fav.fromP2];
            fav.convertionFactor = this.processConvertionFactor(fav.fromP1, fav.fromP2, fav.toP1, fav.toP2);
        } else if (this.completed) {
            [this.fromP1, this.fromP2, this.toP1, this.toP2] = [this.toP1, this.toP2, this.fromP1, this.fromP2];
            this.convertionFactor = this.processConvertionFactor(this.fromP1, this.fromP2, this.toP1, this.toP2);
        }
    }

    processConvertionFactor(fromP1: Unit, fromP2: Unit, toP1: Unit, toP2: Unit): UnitWeight {
        return {
            a: (fromP1.weight.a * toP2.weight.a) / (toP1.weight.a * fromP2.weight.a),
            b: 0 // TODO: a définir pour débloquer la conversion de la température
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
            this.favorite = Array<{ id: string, fromP1: Unit, fromP2: Unit, toP1: Unit, toP2: Unit, convertionFactor: UnitWeight }>();
        }

        this.favorite.push({
            id: (uuidv4() as string),
            fromP1: this.fromP1,
            fromP2: this.fromP2,
            toP1: this.toP1,
            toP2: this.toP2,
            convertionFactor: this.convertionFactor
        });

        this.cacheService.setItem(CacheType.RatioConversion, this.favorite);
    }

    removeFromFavorite(id: string): void {
        this.favorite = this.favorite?.filter(f => f.id !== id);
        this.cacheService.setItem(CacheType.RatioConversion, this.favorite);
    }
}
