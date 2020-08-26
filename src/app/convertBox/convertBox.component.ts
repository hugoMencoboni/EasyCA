import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { INFERRED_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-convert-box',
  templateUrl: './convertBox.component.html',
  styleUrls: ['./convertBox.component.scss']
})
export class ConvertBoxComponent implements OnInit, OnChanges, OnDestroy {
  @Input() enable = true;

  @Input() inputPrefix: string | undefined;
  @Input() inputIconPrefix: string | undefined;
  @Input() inputSufix: string | undefined;
  @Input() inputIconSufix: string | undefined;

  @Input() convertIcon = 'compare_arrows';
  @Input() convertIconClickable = false;

  @Input() multipleResult = false;

  @Input() resultPrefix: string | Array<string> | undefined;
  @Input() resultIconPrefix: string | Array<string> | undefined;
  @Input() resultSufix: string | Array<string> | undefined;
  @Input() resultIconSufix: string | Array<string> | undefined;

  @Input() factor: number | Array<number> = 1;
  @Input() precision: number | undefined = 2;
  @Input() forcedValue: string;

  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  @Output() reverseConvertion: EventEmitter<void> = new EventEmitter();

  value = new FormControl('');
  convertedValue: string | Array<string>;

  subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      this.value.valueChanges.subscribe((value: string) => {
        if (!value) {
          this.convertedValue = '';
          return;
        }

        if (!isNaN(+value)) {
          const prefix = (this.resultPrefix ? this.resultPrefix + ' ' : '');
          if (!this.multipleResult) {
            this.convertedValue = prefix + this.processConvertion(+value, (this.factor as number), this.precision);
          } else {
            this.convertedValue = new Array<string>();
            (this.factor as Array<number>).forEach((factor: number, index: number) => {
              (this.convertedValue as Array<string>)[index] = prefix + this.processConvertion(+value, factor, this.precision);
            });
          }

          this.valueChange.emit(value);
        }
      })
    );
  }

  processConvertion(value: number, factor: number, precision: number | undefined): number {
    let result = value * factor;

    if (precision !== undefined) {
      result = Math.round(result * Math.pow(10, precision + 1)) / Math.pow(10, (precision + 1));
    }

    return result;
  }

  isArray(elem: any): boolean {
    return Array.isArray(elem);
  }

  convertIconClicked(): void {
    if (this.convertIconClickable) {
      this.reverseConvertion.emit();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.forcedValue && this.forcedValue !== this.value.value) {
      this.value.setValue(this.forcedValue);
    }

    if (changes.enable) {
      if (this.enable) {
        this.value.enable();
      } else {
        this.value.disable();
      }

      this.value.setValue('');
    }

    if (changes.factor) {
      this.value.updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
