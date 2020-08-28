import { Component, AfterViewInit, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { SnackbarService } from './core/services/snackbar.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { distinct } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tabs', { static: false }) tabs: MatTabGroup;

  selectedTab = 0;
  tabLength = 0;
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  subscription = new Subscription();

  constructor(private snackBar: MatSnackBar, private snackBarService: SnackbarService) { }

  ngOnInit(): void {
    const snackbarConfig: MatSnackBarConfig = { duration: 10000 };
    this.subscription.add(
      this.snackBarService.notifications
        .pipe(distinct())
        .subscribe(message => this.snackBar.open(message, null, snackbarConfig))
    );
  }

  ngAfterViewInit(): void {
    this.tabLength = this.tabs._tabs.length;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  swipe(eType) {
    if (eType === this.SWIPE_ACTION.RIGHT && this.selectedTab > 0) {
      this.selectedTab--;
    } else if (eType === this.SWIPE_ACTION.LEFT && this.selectedTab < this.tabLength) {
      this.selectedTab++;
    }
  }
}
