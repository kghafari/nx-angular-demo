import { Component, inject, OnInit } from '@angular/core';
import {
  ProgressBarMode,
  MatProgressBarModule,
} from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {
  BehaviorSubject,
  interval,
  map,
  Observable,
  of,
  repeat,
  Subscription,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  tap,
  timer,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { TimerService } from '../services/timer.service';

export interface Timer {
  progress: number;
  remaining: number;
}

@Component({
  selector: 'lib-progress',
  imports: [
    CommonModule,
    MatCardModule,
    MatRadioModule,
    FormsModule,
    MatSliderModule,
    MatProgressBarModule,
  ],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css',
  standalone: true,
})
export class ProgressComponent implements OnInit {
  private timerService = inject(TimerService);
  mode: ProgressBarMode = 'determinate';
  // value = 50;
  multi = 2;
  auto = true;

  public timerDurationMs = 5000;


  bufferValue = 0;
  private interval = 100;
  protected remainingTime$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  protected to100Time$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  // protected progressTimer$ = this.createProgressTimer(5, 100);
  protected timerComplete$ = new BehaviorSubject<boolean>(false);

  protected progress = 0;
  protected remaining = 0;



  protected runTime$: Observable<number> = interval(1000);
  protected simpleTimer$: Observable<Timer> = of({ progress: 0, remaining: 0 });
  
  private totalIntervals = Math.ceil(this.timerDurationMs / this.interval);
  
  protected progress2 = 0;

  ngOnInit() {

    this.runTime$.subscribe();

    this.getTimerWithSeconds$(1000).subscribe((tick) => {
      console.log('tick from observer', tick);
    });

    this.timerComplete$
      .pipe(
        switchMap((complete) => {
          if (complete && this.auto) {
            return this.createProgressTimer(5, 100);
          }
          return this.createProgressTimer(5, 100);
        }),
        takeWhile(({ progress }) => progress < 100, true),
        tap(({ progress, remaining }) => {
          // console.log('progress', progress);
          // console.log('remaining', remaining);
          this.progress = progress;
          this.remaining = remaining;
          if (progress >= 100) {
            this.timerComplete$.next(true);
          }
        })
      )
      .subscribe();
  }

  protected createProgressTimer(
    seconds: number,
    tickspeed: number
  ): Observable<Timer> {
    const totalTicks = Math.ceil((seconds * 1000) / tickspeed);
    return interval(tickspeed).pipe(
      map((tick) => {
        const progress = Math.min(100, Math.round((tick / totalTicks) * 100));
        const remaining = Math.max(0, (totalTicks - tick) * tickspeed);

        return { progress, remaining };
      }),

      takeWhile(({ progress }) => progress < 100, true)
    );
  }

  startTimer(key: string, duration: number): void {
    this.timerService.startTimer(key, duration, this.multi, this.auto);
  }

  getValue$(key: string): Observable<number> {
    return this.timerService.getValue$(key);
  }

  // getRemainingTime$(key: string): Observable<number> {
  //   // return this.timerService.getRemainingTime$(key);
  // }

  stopTimer(key: string): void {
    this.timerService.stopTimer(key);
  }

  protected getTimerWithSeconds$(totalMilliseconds: number): Observable<Timer> {
    {const totalIntervals = Math.ceil(totalMilliseconds / this.interval);

    return interval(this.interval).pipe(
      map((tick) => {

        const progress = Math.min(
          100,
          Math.round((tick / totalIntervals) * 100)
        );
        const remaining = Math.max(0, (totalIntervals - tick) * this.interval);
        console.log('remaining', remaining);
        return { progress, remaining };
      }),
      takeWhile(({ progress }) => progress < 100, true)
    )};
  }

  protected clickTimer() {
    this.simpleTimer$ = this.getTimerWithSeconds$(this.timerDurationMs);
  }
}
