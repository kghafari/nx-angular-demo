import { Injectable } from '@angular/core';
import { Observable, interval, map, switchMap, tap } from 'rxjs';

export interface CharacterState {
  hp: number;
  damage: number;
  accuracy: number;
  defense: number;
  critChance: number;
  critDamage: number;
}

@Injectable({
  providedIn: 'root',
})
export class IntervalService {
  private readonly TICKSPEED = 1000;
  private interval$: Observable<number> = this.createIntervalObservable();

  // constructor() {
  //   this.interval$ = this.createIntervalObservable();
  // }

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