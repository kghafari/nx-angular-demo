import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  animationFrameScheduler,
  interval,
  map,
  Observable,
  Subject,
  Subscription,
  takeUntil,
  tap,
} from 'rxjs';
import { IntervalService } from './services/interval.service';
import { OrderType } from './models/enums';
import { CharacterComponent } from "./character/character.component";
import { CharacterService } from './services/character.service';
import { ProgressComponent } from "./progress/progress.component";

@Component({
  selector: 'lib-reactivity',
  imports: [CommonModule, CharacterComponent, ProgressComponent],
  templateUrl: './reactivity.component.html',
  styleUrls: ['./reactivity.component.scss'],
  standalone: true,
})
export class ReactivityComponent implements OnInit {
  private readonly intervalService = inject(IntervalService);
    private readonly characterService = inject(CharacterService);
  
  protected characterState$ = this.characterService.characterState$;

  private destroy$ = new Subject<void>();
  private tickSpeed = 2000;

  protected intervalObservable$ = this.intervalService
    .getIntervalObservable()
    .pipe(takeUntil(this.destroy$));
    
  protected interval2$: Observable<number> = this.createInterval(
    this.tickSpeed
  );
  protected interval3$: Observable<number> = this.createInterval(
    this.tickSpeed + 2000
  );

  public ngOnInit(): void {
 
  }

  private createInterval(tickSpeed: number): Observable<number> {
    return interval(tickSpeed).pipe(
      map((value) => tickSpeed / 1000 + (tickSpeed * value) / 1000),
    );
  }
}
