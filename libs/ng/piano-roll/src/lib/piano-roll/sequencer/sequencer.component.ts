import {
  AnimationBuilder,
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
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'lib-sequencer',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './sequencer.component.html',
  styleUrl: './sequencer.component.scss',
  animations: [],
})
export class SequencerComponent implements OnInit {
  private readonly animBuilder = inject(AnimationBuilder);
  private readonly audioService = inject(AudioService);

  // protected trackBar: AnimationPlayer = this.animPlayer(null);
  protected interval$?: Observable<number> = undefined;
  private destroy$ = new BehaviorSubject<boolean>(false);

  protected mockGameInterval: Observable<number> = interval(100);

  @ViewChild('animatedElement', { static: true }) animatedElement!: ElementRef;

  public ngOnInit(): void {

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
  }
}
