import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild, OnDestroy } from '@angular/core';
import { UnitService } from '../core/services/unit.service';
import { Unit } from '../core/model/unit.model';
import { UnitType } from '../core/model/unitType.enum';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-unit-table',
  templateUrl: './unitTable.component.html',
  styleUrls: ['./unitTable.component.scss']
})
export class UnitTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() backgroundColor = '#f7f8ff';
  @Input() color = '#4a5180';
  @Input() disableAllSectionBut: null | UnitType = null;

  @Input() hideLength = false;
  @Input() hideWeight = false;
  @Input() hideTemperature = false;
  @Input() hideArea = false;
  @Input() hideVolume = false;
  @Input() hideMoney = false;

  @Output() unitSelected: EventEmitter<Unit> = new EventEmitter();

  @ViewChild('tabs', { static: false }) tabs: MatTabGroup;

  units: Array<Unit>;
  get lengthUnit(): Array<Unit> {
    return this.units?.filter(u => u.type === UnitType.Length);
  }

  get areaUnit(): Array<Unit> {
    return this.units?.filter(u => u.type === UnitType.Area);
  }

  get volumeUnit(): Array<Unit> {
    return this.units?.filter(u => u.type === UnitType.Volume);
  }

  get weightUnit(): Array<Unit> {
    return this.units?.filter(u => u.type === UnitType.Weight);
  }

  get temperatureUnit(): Array<Unit> {
    return this.units?.filter(u => u.type === UnitType.Temperature);
  }

  get moneyUnit(): Array<Unit> {
    return this.units?.filter(u => u.type === UnitType.Money);
  }

  hoverIndex: number | undefined;
  unitTypes = UnitType;
  subscription = new Subscription();

  constructor(private unitService: UnitService) { }

  ngOnInit() {
    this.subscription.add(
      this.unitService.getUnits().subscribe((units: Array<Unit>) => this.units = units)
    );
  }

  unitChoosed(unit: Unit): void {
    this.unitSelected.emit(unit);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disableAllSectionBut && this.disableAllSectionBut) {
      switch (this.disableAllSectionBut) {
        case UnitType.Length:
          this.tabs.selectedIndex = 0;
          break;
        case UnitType.Weight:
          this.tabs.selectedIndex = 1;
          break;
        case UnitType.Money:
          this.tabs.selectedIndex = 2;
          break;
        case UnitType.Area:
          this.tabs.selectedIndex = 3;
          break;
        case UnitType.Volume:
          this.tabs.selectedIndex = 4;
          break;
        case UnitType.Temperature:
          this.tabs.selectedIndex = 5;
          break;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
