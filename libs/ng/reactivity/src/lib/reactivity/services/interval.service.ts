import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IntervalService {
  private readonly TICKSPEED = 1000;
  private interval$: Observable<number> = this.createIntervalObservable();

  private getRandomInterval(): number {
    return Math.floor(Math.random() * (1000)); // Random interval between 5-10 seconds
  }

  private createIntervalObservable(): Observable<number> {
    return interval(this.TICKSPEED).pipe(
      map((value) => value += 1),
    );
  }

  getIntervalObservable(): Observable<number> {
    return this.interval$;
  }
}