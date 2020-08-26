import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('tabs', { static: false }) tabs: MatTabGroup;

  selectedTab = 0;
  tabLength = 0;
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  ngAfterViewInit() {
    this.tabLength = this.tabs._tabs.length;
  }

  swipe(eType) {
    if (eType === this.SWIPE_ACTION.LEFT && this.selectedTab > 0) {
      this.selectedTab--;
    }
    else if (eType === this.SWIPE_ACTION.RIGHT && this.selectedTab < this.tabLength) {
      this.selectedTab++;
    }
  }
}
