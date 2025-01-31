import { Injectable } from '@angular/core';
import {
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  Observable,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InputService {
  public keyDown$: Observable<KeyboardEvent> = new Observable();
  public keyUp$: Observable<KeyboardEvent> = new Observable();

  public keyEvent$: Observable<KeyboardEvent> = new Observable();
  public isPressed$: Observable<boolean> = new Observable();
  //public keyEvents$: Observable<KeyState> = new Observable();

  constructor() {
    const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      map((event) => event)
    );

    const keyUp$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(
      map((event) => event)
    );

    this.isPressed$ = merge(keyDown$, keyUp$).pipe(
      map((event) => event.type === 'keydown'),
      distinctUntilChanged()
    );

    this.keyEvent$ = merge(keyDown$, keyUp$).pipe(
      distinctUntilChanged(
        (prev, curr) => prev.type === curr.type && prev.key === curr.key
      )
    );
  }
}
