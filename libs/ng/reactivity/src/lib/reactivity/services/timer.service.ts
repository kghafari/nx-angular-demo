import { Injectable } from '@angular/core';
import {
  Observable,
  interval,
  BehaviorSubject,
  Subscription,
  timer,
  takeUntil,
  tap,
} from 'rxjs';

export interface Timer {
  value$: BehaviorSubject<number>;
  remainingTime$: BehaviorSubject<number>;
  timerSubscription: Subscription | null;
}

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timer$: Observable<number> = interval(100);
  private timers: Map<string, Timer> = new Map();

  startTimer(
    key: string,
    duration: number,
    multi: number,
    auto: boolean
  ): void {
    if (
      this.timers.has(key) &&
      this.timers.get(key)?.timerSubscription?.closed === false
    ) {
      // Timer is already running, do nothing
      return;
    }

    if (this.timers.has(key)) {
      this.timers.get(key)?.timerSubscription?.unsubscribe();
    }

    const value$ = new BehaviorSubject<number>(0);
    const remainingTime$ = new BehaviorSubject<number>(duration / 1000);
    const endTimer$ = timer(duration + 100);

    const timerSubscription = this.timer$
      .pipe(
        takeUntil(endTimer$),
        tap((value) => {
          value$.next(value * multi);
          remainingTime$.next(duration / 1000 - value / 10);

          // console.log(value);

          if (auto) {
            this.startTimer(key, duration, multi, auto);
          }
        })
      )
      .subscribe();

    this.timers.set(key, { value$, remainingTime$, timerSubscription });
  }

  startTimer2(
    key: string,
    duration: number,
    multi: number,
    auto: boolean
  ): void {
    if (
      this.timers.has(key) &&
      this.timers.get(key)?.timerSubscription?.closed === false
    ) {
      // Timer is already running, do nothing
      return;
    }

    if (this.timers.has(key)) {
      this.timers.get(key)?.timerSubscription?.unsubscribe();
    }

    const value$ = new BehaviorSubject<number>(0);
    const remainingTime$ = new BehaviorSubject<number>(duration / 1000);
    const endTimer$ = timer(duration);

    const timerSubscription = this.timer$
      .pipe(
        takeUntil(endTimer$),
        tap((value) => {
          value$.next(value * multi);
          remainingTime$.next(duration / 1000 - value / 10);

          console.log(value);
          const bufferTime = multi * 10; // Adjust the multiplier as needed
          if (value > 100 / multi + bufferTime) {
            value$.next(0);
            timerSubscription.unsubscribe();
            if (auto) {
              this.startTimer(key, duration, multi, auto);
            }
          }
        })
      )
      .subscribe();

    this.timers.set(key, { value$, remainingTime$, timerSubscription });
  }

  getValue$(key: string): Observable<number> {
    return (
      this.timers.get(key)?.value$.asObservable() ??
      new BehaviorSubject<number>(0).asObservable()
    );
  }

  getRemainingTime$(key: string): Observable<number> {
    return (
      this.timers.get(key)?.remainingTime$.asObservable() ??
      new BehaviorSubject<number>(0).asObservable()
    );
  }

  stopTimer(key: string): void {
    if (this.timers.has(key)) {
      this.timers.get(key)?.timerSubscription?.unsubscribe();
      this.timers.delete(key);
    }
  }
}
