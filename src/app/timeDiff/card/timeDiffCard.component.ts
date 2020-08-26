import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, timer, interval } from 'rxjs';

@Component({
    selector: 'app-time-diff-card',
    templateUrl: './timeDiffCard.component.html',
    styleUrls: ['./timeDiffCard.component.scss']
})
export class TimeDiffCardComponent implements OnInit, OnDestroy {
    @Input() country = 'FR';

    time;
    timezone;
    subtitle;

    subscription = new Subscription();

    ngOnInit() {
        this.subscription.add(
            interval(1000).subscribe(() => this.time = new Date())
        );

        this.processTimezone();
    }

    processTimezone(): void {
        const today = new Date();

        switch (this.country) {
            case 'FR':
                {
                    this.timezone = '+01';
                    if (today.getMonth() >= 3 || today.getMonth() <= 10) {
                        let summerStart = new Date(today.getFullYear(), 2, 31);
                        while (summerStart.getDay() !== 0) {
                            summerStart = new Date(summerStart.getFullYear(), 2, summerStart.getDate() - 1);
                        }

                        let summerEnd = new Date(today.getFullYear(), 9, 31);
                        while (summerEnd.getDay() !== 0) {
                            summerEnd = new Date(summerEnd.getFullYear(), 9, summerEnd.getDate() - 1);
                        }

                        if (today >= summerStart && today < summerEnd) {
                            this.timezone = '+02';
                        }
                    }

                    this.subtitle = 'France';
                    break;
                }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
