import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Observable, fromEvent, interval, map, of, takeUntil, tap } from 'rxjs';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'lib-sequencer',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './sequencer.component.html',
  styleUrl: './sequencer.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, backgroundColor: 'green' })),
      state('visible', style({ opacity: 1, backgroundColor: 'yellow' })),
      state('hidden', style({ opacity: 1, backgroundColor: 'blue' })),
      transition('visible => hidden', animate('300ms ease-in-out')),
      transition('hidden => visible', animate('300ms ease-in-out')),
    ]),
  ],
})
export class SequencerComponent implements OnInit {
  private readonly animBuilder = inject(AnimationBuilder);
  private readonly audioService = inject(AudioService);

  protected interval$?: Observable<number> = undefined;
  protected trackBar: AnimationPlayer = this.animPlayer(null);
  private destroy$ = new BehaviorSubject<boolean>(false);

  @ViewChild('animatedElement', { static: true }) animatedElement!: ElementRef;

  public ngOnInit(): void {
    this.interval$ = this.createInterval(1000);
    const source = interval(1000);

    // this.interval$.pipe(
    //   takeUntil(this.destroy$)
    // ).subscribe((value) => {
    //   this.updateOpacity(value);
    // });

    this.interval$.pipe(
      tap((value) => {
        this.updateOpacity(value);
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  private updateOpacity(value: number): void {
    const opacity = 1 - value / 10;

    if (this.animatedElement.nativeElement.style.opacity <= 0) {
      this.destroy$.next(true);
    }

    this.animatedElement.nativeElement.style.opacity = opacity;
  }

  protected onClick(): void {}

  protected createInterval(tickSpeed: number): Observable<number> {
    return interval(tickSpeed)
      // .pipe
      // //map((value) => value * 128),

      // //map((value) => tickSpeed / 1000 + (tickSpeed * value) / 1000),
      // ();
  }

  protected animPlayer(element: HTMLElement | null): AnimationPlayer {
    const noteTiming = 1000; // this.notesPerRow * this.speed;
    const slide = this.animBuilder.build([
      style({ left: '0px' }),
      animate(noteTiming, style({ left: '100%' })),
    ]);

    if (this.trackBar) {
      this.trackBar.destroy();
    }

    return slide.create(element);

    // this.trackBar = player;
    // this.trackBar.onDone(() => {
    //   // if the router hasn't changed, schedule the notes
    //   this.audioService.scheduleNotes(this.notes_1, this.speed);
    //   this.audioService.playNote();
    //   this.doneCount = this.doneCount + 1;
    //   this.trackBar?.restart();
    // });
  }
}
