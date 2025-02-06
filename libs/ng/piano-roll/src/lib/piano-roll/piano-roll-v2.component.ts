import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AudioService, NoteMeta } from '../services/audio.service';
import { SequencerComponent } from './sequencer/sequencer.component';
import * as Tone from 'tone';
import { InputService } from '../services/input.service';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

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
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSliderModule,
  ],
  standalone: true,
  templateUrl: './piano-roll-v2.component.html',
  styleUrl: './piano-roll-v2.component.scss',
})
export class PianoRollV2Component implements OnInit, OnDestroy {
  private readonly audioService = inject(AudioService);
  private readonly inputService = inject(InputService);
  @Output() noteEvent = new EventEmitter<string>();

  @ViewChildren('noteBtn') noteButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  protected pianoNotes = this.audioService.generatePianoNotes();
  protected pianoNotes_oct4 = this.getOctave(4);
  protected pianoNotes_oct2 = this.getOctave(2);

  protected noteMap = this.inputService.NoteMap;
  protected keyEvent$ = this.inputService.keyEvent$;

  protected asdr = {
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.1,
      release: 0.1,
    },
  };

  protected synthOptions: Partial<Tone.SynthOptions> = {
    oscillator: {
      type: 'sine',
      volume: 0,
      phase: 0,
      mute: false,
      onstop: () => {
        console.log('stop');
      },
    },
    envelope: {
      attack: this.asdr.envelope.attack ?? 0.1,
      decay: this.asdr.envelope.decay ?? 0.1,
      sustain: this.asdr.envelope.sustain ?? 0.1,
      release: this.asdr.envelope.release ?? 0.1,
      attackCurve: 'linear',
      releaseCurve: 'linear',
      decayCurve: 'linear',
    },
  };

  private getOctave(octave: number): NoteMeta[] {
    return this.pianoNotes.slice(octave * 8, octave * 8 + 8);
  }

  public ngOnInit() {
    this.keyEvent$.subscribe((event) => {
      this.handleKey(event, 4);
    });
  }

  protected handleKey(event: KeyboardEvent | undefined, octave: number) {
    this.noteMap.forEach((noteMap) => {
      if (event?.code === noteMap.keyCode && event.type === 'keydown') {
        this.noteEvent.emit(`${noteMap.note}${noteMap.accidental}${octave}`);
        this.audioService.playNote(
          `${noteMap.note}${noteMap.accidental}${octave}`,
          this.synthOptions
        );
      }
    });
  }

  updateEnvelope() {
    console.log('updateEnvelope', this.asdr);
    console.log('updateEnvelope', this.synthOptions);
    if (this.synthOptions.envelope) {
      this.synthOptions.envelope.attack = this.asdr.envelope.attack;
      this.synthOptions.envelope.decay = this.asdr.envelope.decay;
      this.synthOptions.envelope.sustain = this.asdr.envelope.sustain;
      this.synthOptions.envelope.release = this.asdr.envelope.release;
    }

    this.audioService.updateOptions(this.synthOptions);
  }

  protected startAud() {
    console.log('startAud');
  }

  protected playPattern() {
    this.audioService.playPattern();
  }

  protected playNote(note: string) {
    this.audioService.playNote(note, this.synthOptions);
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
