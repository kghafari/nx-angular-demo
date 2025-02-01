import { Injectable } from '@angular/core';
import {
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  Observable,
} from 'rxjs';

export interface NoteMap {
  keyCode: string;
  note: string;
  accidental?: string;
  octave?: number;
}

@Injectable({
  providedIn: 'root',
})
export class InputService {

  public NoteMap: NoteMap[] = [
        { keyCode: 'KeyA', note: 'C', accidental:'' },
        { keyCode: 'KeyW', note: 'C', accidental:'#' },
        { keyCode: 'KeyS', note: 'D', accidental:'' },
        { keyCode: 'KeyE', note: 'E', accidental:'b' },
        { keyCode: 'KeyD', note: 'E', accidental:'' },
        { keyCode: 'KeyF', note: 'F', accidental:'' },
        { keyCode: 'KeyT', note: 'F', accidental:'#' },
        { keyCode: 'KeyG', note: 'G', accidental:'' },
        { keyCode: 'KeyY', note: 'A', accidental:'b' },
        { keyCode: 'KeyH', note: 'A', accidental:'' },
        { keyCode: 'KeyU', note: 'B', accidental:'b' },
        { keyCode: 'KeyJ', note: 'B', accidental:'' },
      ]

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
