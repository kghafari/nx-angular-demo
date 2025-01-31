import { Injectable } from '@angular/core';
import * as Tone from 'tone';
import { RowNote } from '../interfaces/row-note.interface';
import { Synth, SynthOptions } from 'tone';
import { myConfig } from '../config';

// export interface Note {
//   id: string;
//   duration: number;
//   tone: string;
//   active: boolean;
//   time: number;
// }

// export interface Row {
//   name: string;
//   notes: Note[];
// }

// export interface Track {
//   rows: Row[];
// }

export interface NoteMeta {
  note: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  //public rowState$: Observable<Row[]> = new Observable();

  protected synth = new Tone.Synth().toDestination();
  protected kick = new Tone.MembraneSynth().toDestination();

  public scheduledNotes: Synth<SynthOptions>[] = [];

  constructor() {
    Tone.getTransport().start();
  }

  private letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B', ];
  private octaves = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  public generatePianoNotes(): NoteMeta[] {
    const notes: NoteMeta[] = [];

    for (const octave of this.octaves) {
      for (const letter of this.letters) {
        notes.push({ note: `${letter}${octave}`, id: `${notes.length}` });
      }
    }

    return notes;
  }
  
  public playNote(note: string): void {
    const s = new Tone.Synth().toDestination();
    //const s = new Tone.MembraneSynth().toDestination();
    console.log(`play note: ${note}`);
    s.triggerAttackRelease(note, '4n', Tone.now(), 2);
  }

  public playPattern(): void {    
    // seems like it's better to have the synth and kick as class properties so we have a single instance of each
    // const synth = new Tone.Synth().toDestination();
    // const kick = new Tone.MembraneSynth().toDestination();

    const pattern = new Tone.Pattern(
      (time, note) => {
        this.synth.triggerAttackRelease(note, 0.5, time);
      },
      ['C4', 'D4', 'E4', 'G4'],
      'random'
    );


    const kickPattern = new Tone.Pattern(
      (time, note) => {
        this.kick.triggerAttackRelease(note, 10, time);
      },
      ['C1', '0', 'C3', '0'],
    );

    pattern.interval = '4n';
    kickPattern.interval = '8n';

    pattern.start(0);
    kickPattern.start(0);
  }

  public clearCurrentNotes(): void {
    this.scheduledNotes.forEach((note) => note.dispose());
    this.scheduledNotes = [];
  }

  // We're scheduling these notes too far ahead of time. We need to schedule them closer to the time they should be played.
  public scheduleNotes(notes: RowNote[], duration: number): void {
    if (myConfig.audio.mute) {
      return;
    }
    console.log(
      `given a duration of ${duration}ms, schedule the next ${notes.length} notes`
    );
    let time = 0;
    const synth = new Tone.Synth().toDestination();
    this.scheduledNotes = [];

    notes.forEach((note) => {
      if (note.active) {
        const note = synth.triggerAttackRelease(
          'C4',
          0.05,
          Tone.now() + time / 1000
        );
        this.scheduledNotes.push(note);
      }
      time += duration;
    });
  }

  public stop(): void {
    console.log('stop');
    this.clearCurrentNotes();
    Tone.getTransport().pause();
    Tone.getTransport().cancel();
  }
}
