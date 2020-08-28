import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private subject = new Subject<string>();

  get notifications(): Observable<string> {
    return this.subject.asObservable();
  }

  notifyWarning(message: string): void {
    this.subject.next(message);
  }
}
