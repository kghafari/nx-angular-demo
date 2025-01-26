import { Injectable } from '@angular/core';
import * as Tone from 'tone';
import { RowNote } from '../interfaces/row-note.interface';
import { Synth, SynthOptions } from 'tone';
import { config, Observable } from 'rxjs';
import { myConfig } from '../config';

export interface Note {
  id: string;
  duration: number;
  tone: string;
  active: boolean;
  time: number;
}

export interface Row {
  name: string;
  notes: Note[];
}

export interface Track {
  rows: Row[];
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  public rowState$: Observable<Row[]> = new Observable();



  public scheduledNotes: Synth<SynthOptions>[] = [];

  public playNote(): void {
    const synth = new Tone.Synth().toDestination();
    
    synth.triggerAttackRelease('E4', '8n', Tone.now());
    // synth.triggerAttackRelease('D4', '8n', Tone.now() + 0.25);
    // synth.triggerAttackRelease('E4', '8n', Tone.now() + .5);
  }

  public start(): void {
    Tone.start();
  } 

  public setInterval(): void {
  }

  public clearCurrentNotes(): void {
    this.scheduledNotes.forEach((note) => note.dispose());
    this.scheduledNotes = [];
  }

  public scheduleNotes(notes: RowNote[], duration: number): void {
    if(myConfig.audio.mute) {
      return;
    }
    console.log(`given a duration of ${duration}ms, schedule the next ${notes.length} notes`);
    let time = 0;
    const synth = new Tone.Synth().toDestination();
    this.scheduledNotes = [];

    notes.forEach((note) => {
      if (note.active) {
        const note = synth.triggerAttackRelease('C4', .05, Tone.now() + time / 1000);
        this.scheduledNotes.push(note);
      }
      time += duration;
    });
  }

  public stop(): void {
    Tone.Transport.stop();
  }
}
