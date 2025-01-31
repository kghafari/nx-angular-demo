import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AudioService, NoteMeta } from '../services/audio.service';
import { SequencerComponent } from './sequencer/sequencer.component';
import * as Tone from 'tone';
import { InputService } from '../services/input.service';

export interface KeyNoteMap {
  key: string;
  note: string;
}

@Component({
  selector: 'lib-piano-roll-v2',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    SequencerComponent,
  ],
  standalone: true,
  templateUrl: './piano-roll-v2.component.html',
  styleUrl: './piano-roll.component.scss',
})
export class PianoRollV2Component implements OnInit, OnDestroy {
  private readonly audioService = inject(AudioService);
  private readonly inputService = inject(InputService);

  @ViewChildren('noteBtn') noteButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  protected pianoNotes = this.audioService.generatePianoNotes();
  protected pianoNotes_oct4 = this.getOctave(4);
  protected pianoNotes_oct2 = this.getOctave(2);

  protected keyEvent$ = this.inputService.keyEvent$;

  private getOctave(octave: number): NoteMeta[] {
    return this.pianoNotes.slice(octave * 8, octave * 8 + 8);
  }

  public ngOnInit() {
    this.keyEvent$.subscribe((event) => {
      console.log('keyEvent', event);
      this.handleKey(event);
    });
    console.log(this.pianoNotes_oct4);
  }

  protected keys = [
    'KeyA',
    'KeyS',
    'KeyD',
    'KeyF',
    'KeyG',
    'KeyH',
    'KeyJ',
    'KeyK',
  ];

  protected keyNoteMap: KeyNoteMap[] = this.keys.map((key, index) => ({
    key: key,
    note: this.pianoNotes_oct4[index].note,
  }));

  protected a = [this.keys, this.pianoNotes_oct4];

  protected handleKey(event: KeyboardEvent | undefined) {
    for (let i = 0; i < this.keys.length; i++) {
      if (event && event.code === this.keys[i] && event.type === 'keydown') {
        this.audioService.playNote(this.pianoNotes_oct4[i].note);
      }
    }
  }

  protected startAud() {
    console.log('startAud');
  }

  protected playPattern() {
    this.audioService.playPattern();
  }

  protected playNote(note: string) {
    this.audioService.playNote(note);
  }

  public ngOnDestroy() {
    Tone.getTransport().cancel(); // choose
    this.audioService.stop(); // one
    console.log('onDestroy');
  }

  stop() {
    Tone.getTransport().cancel();
  }

  start() {
    Tone.getTransport().start();
  }
}
