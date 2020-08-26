import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild, AfterViewChecked } from '@angular/core';
import { UnitService } from '../core/services/unit.service';
import { Unit } from '../core/model/unit.model';
import { UnitType } from '../core/model/unit.enum';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-unit-table',
  templateUrl: './unitTable.component.html',
  styleUrls: ['./unitTable.component.scss']
})
export class UnitTableComponent implements OnInit, OnChanges {
  @Input() backgroundColor = '#f7f8ff';
  @Input() color = '#4a5180';
  @Input() disableAllSectionBut: null | UnitType = null;

  @Output() unitSelected: EventEmitter<Unit> = new EventEmitter();

  @ViewChild('tabs', { static: false }) tabs: MatTabGroup;

  units: Array<Unit>;
  get lengthUnit(): Array<Unit> {
    return this.units.filter(u => u.type === UnitType.Length);
  }

  get areaUnit(): Array<Unit> {
    return this.units.filter(u => u.type === UnitType.Area);
  }

  get volumeUnit(): Array<Unit> {
    return this.units.filter(u => u.type === UnitType.Volume);
  }

  get weightUnit(): Array<Unit> {
    return this.units.filter(u => u.type === UnitType.Weight);
  }

  get temperatureUnit(): Array<Unit> {
    return this.units.filter(u => u.type === UnitType.Temperature);
  }

  get moneyUnit(): Array<Unit> {
    return this.units.filter(u => u.type === UnitType.Money);
  }

  hoverIndex: number | undefined;

  disableLength = false;
  disableWeight = false;
  disableTemperature = false;
  disableArea = false;
  disableVolume = false;
  disableMoney = false;

  constructor(private unitService: UnitService) { }

  ngOnInit() {
    this.units = this.unitService.getUnits();
  }

  unitChoosed(unit: Unit): void {
    this.unitSelected.emit(unit);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disableAllSectionBut) {
      if (!this.disableAllSectionBut) {
        this.disableLength = false;
        this.disableArea = false;
        this.disableVolume = false;
        this.disableMoney = false;
        this.disableTemperature = false;
        this.disableWeight = false;
        return;
      }

      this.disableLength = true;
      this.disableArea = true;
      this.disableVolume = true;
      this.disableMoney = true;
      this.disableTemperature = true;
      this.disableWeight = true;

      switch (this.disableAllSectionBut) {
        case UnitType.Money:
          this.disableMoney = false;
          this.tabs.selectedIndex = 3;
          break;
        case UnitType.Temperature:
          this.disableTemperature = false;
          this.tabs.selectedIndex = 2;
          break;
        case UnitType.Length:
          this.disableLength = false;
          this.tabs.selectedIndex = 0;
          break;
        case UnitType.Area:
          this.disableArea = false;
          this.tabs.selectedIndex = 4;
          break;
        case UnitType.Volume:
          this.disableVolume = false;
          this.tabs.selectedIndex = 5;
          break;
        case UnitType.Weight:
          this.disableWeight = false;
          this.tabs.selectedIndex = 1;
          break;
      }
    }
  }
}
