import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent } from './app.component';
import { ConvertBoxComponent } from './convertBox/convertBox.component';
import { TipsComponent } from './tips/tips.component';
import { TimeDiffComponent } from './timeDiff/timeDiff.component';
import { TimeDiffCardComponent } from './timeDiff/card/timeDiffCard.component';
import { SimpleConversionComponent } from './simpleConversion/simpleConversion.component';
import { UnitTableComponent } from './unitTable/unitTable.component';
import { RatioConversionComponent } from './ratioConversion/ratioConversion.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ConvertBoxComponent,
    TipsComponent,
    TimeDiffComponent,
    TimeDiffCardComponent,
    SimpleConversionComponent,
    UnitTableComponent,
    RatioConversionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatCardModule,
    MatInputModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' })
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerGestureConfig
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
