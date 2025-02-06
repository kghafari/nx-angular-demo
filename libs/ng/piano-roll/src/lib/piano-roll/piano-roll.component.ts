import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {
  animate,
  AnimationBuilder,
  AnimationPlayer,
  style,
} from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { PianoRowComponent } from './piano-row/piano-row.component';
import { AudioService, NoteMeta } from '../services/audio.service';
import { RowNote } from '../interfaces/row-note.interface';
import { NavigationStart, Router } from '@angular/router';
import { Observable, interval, map, tap, take, repeat } from 'rxjs';
import { SequencerComponent } from './sequencer/sequencer.component';
import * as Tone from 'tone';
import { InputService } from '../services/input.service';


export const TICKSPEED = 500;

@Component({
  selector: 'lib-piano-roll',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    PianoRowComponent,
    SequencerComponent,
  ],
  standalone: true,
  templateUrl: './piano-roll.component.html',
  styleUrl: './piano-roll.component.scss',
})
export class PianoRollComponent
  implements AfterViewInit, OnChanges, OnInit, OnDestroy
{
  private readonly animBuilder = inject(AnimationBuilder);
  private readonly audioService = inject(AudioService);
  private readonly router = inject(Router);
  private readonly inputService = inject(InputService);

  

  protected debugMode = true;


  protected keyDown$ = this.inputService.keyDown$;
  protected keyUp$ = this.inputService.keyUp$;
  private anim: AnimationPlayer | null = null;
  protected speed = 500;
  protected isSpeedChanged = false;

  @ViewChildren('noteBtn') noteButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  protected pianoNotes = this.audioService.generatePianoNotes();
  protected pianoNotes_oct4 = this.getOctave(4);
  protected pianoNotes_oct2 = this.getOctave(2);

  protected keys = ['a', 's', 'd', 'f', 'g', 'h', 'j'];

  private getOctave(octave: number): NoteMeta[] {
    return this.pianoNotes.slice(octave * 7, octave * 7 + 7);
  }
  //protected interval$ = this.createInterval(this.speed);
  // debugging
  protected count = 0;
  protected doneCount = 1;
  public notesPerRow = 4;

  // row 1
  protected notes_1: RowNote[] = [
    { id: '1', duration: 1, active: true },
    { id: '2', duration: 1, active: false },
    { id: '3', duration: 1, active: true },
    { id: '4', duration: 1, active: true },
  ];

  private createInterval(tickSpeed: number): Observable<number> {
    return interval(tickSpeed).pipe(
      map((value) => tickSpeed / 1000 + (tickSpeed * value) / 1000)
    );
  }


  public ngOnInit() {

    // this.inputService.isPressed$.subscribe((isPressed) => {
    //   console.log('isPressed', isPressed);
    // });

    this.inputService.keyEvent$.subscribe((event) => {
      console.log('keyEvent', event);
      if (event?.type === 'keydown') {
        this.audioService.playNote('C4');
      } 
      // if (event?.type === 'keyup') {
      //   this.audioService.playNote('F4');
      // }
    });
  }

  public ngAfterViewInit() {
    // this.animPlayer(document.querySelector("[id='lil']"));
    // this.anim?.play();
  }

  protected animPlayer(element: HTMLElement | null): void {
    const noteTiming = this.notesPerRow * this.speed;
    const slide = this.animBuilder.build([
      style({ left: '0px' }),
      animate(noteTiming, style({ left: '100%' })),
    ]);

    if (this.anim) {
      this.anim.destroy();
    }
    const player = slide.create(element);

    this.anim = player;

    this.anim.onDone(() => {
      // if the router hasn't changed, schedule the notes

      this.audioService.scheduleNotes(this.notes_1, this.speed);
      // this.audioService.playPattern();
      this.doneCount = this.doneCount + 1;

      if(this.anim) {
        this.anim.restart();
      }
    });
  }

  public ngOnChanges() {
    console.log('onChanges');
  }

  protected startAud() {
    console.log('startAud');
    // this.audioService.start();
  }

  protected playPattern() {
    this.audioService.playPattern();
  }

  protected playNote(note: string) {
    this.audioService.playNote(note);
  }

  protected handleKeydown(event: KeyboardEvent, note: string): void {
    const keyIndex = this.keys.indexOf(event.key);
    if (this.keys.includes(event.key)) {
      const btn = this.noteButtons.toArray()[keyIndex].nativeElement;
      btn.classList.add('active');
      console.log('note', this.pianoNotes_oct2[this.keys.indexOf(event.key)].note);
      this.audioService.playNote(
        this.pianoNotes_oct2[this.keys.indexOf(event.key)].note
      );
    }
  }

  handleKeyup(event: KeyboardEvent): void {
    const keyIndex = this.keys.indexOf(event.key);
    if (keyIndex !== -1) {
      const btn = this.noteButtons.toArray()[keyIndex].nativeElement;
      btn.classList.remove('active');
    }
  }
  public ngOnDestroy() {
    // if (this.interval$) {
    //   this.interval$.subscribe().unsubscribe();
    // }
    // 
    Tone.getTransport().cancel()
    this.audioService.stop();
    if (this.anim) {
      this.anim.pause();
      this.anim.destroy();
    }


    console.log('onDestroy');
  }

 

  protected speedUp() {
    this.audioService.clearCurrentNotes();
    this.anim?.restart();
    // this.interval$ = this.createInterval(this.speed / 2);
    this.speed = this.speed / 2;
    this.animPlayer(document.querySelector("[id='lil']"));
  }

  protected speedDown() {
    this.audioService.clearCurrentNotes();
    this.anim?.restart();
    // this.interval$ = this.createInterval(this.speed * 2);
    this.speed = this.speed * 2;
    this.animPlayer(document.querySelector("[id='lil']"));
  }

  protected addNotes() {
    this.notesPerRow = this.notesPerRow + 4;
    for (let i = this.notes_1.length; i < this.notesPerRow; i++) {
      this.notes_1.push({
        id: `${this.notes_1.length + i}`,
        duration: 1,
        active: false,
      });
    }
    this.anim?.restart();
    this.audioService.clearCurrentNotes();
    this.animPlayer(document.querySelector("[id='lil']"));
  }

  protected removeNotes() {
    this.notesPerRow = this.notesPerRow - 4;
    this.notes_1 = this.notes_1.slice(0, this.notesPerRow);
    this.anim?.restart();
    this.audioService.clearCurrentNotes();
    this.animPlayer(document.querySelector("[id='lil']"));
  }

  start() {
    this.audioService.scheduleNotes(this.notes_1, this.speed);
    this.animPlayer(document.querySelector("[id='lil']"));    
    this.anim?.restart();
  }

  stop() {
    // this.audioService.stop();
    Tone.getTransport().cancel();
    this.anim?.pause();
  }

  noteClicked(note: RowNote) {}

  // play a bunch of random notes
  // protected interval1$ = interval(1000).pipe(
  //   tap((value) => {
  //     this.audioService.playNote("C4");
  //   }),
  //   repeat()
  // ).subscribe();

  // protected interval2$ = interval(1200).pipe(
  //   tap((value) => {
  //     this.audioService.playNote("E4");
  //   }),
  //   repeat()
  // ).subscribe();

  // protected interval32$ = interval(1300).pipe(
  //   tap((value) => {
  //     this.audioService.playNote("F4");
  //   }),
  //   repeat()
  // ).subscribe();

  // protected interval3$ = interval(1400).pipe(
  //   tap((value) => {
  //     this.audioService.playNote("C3");
  //   }),
  //   repeat()
  // ).subscribe();

  // protected interval5$ = interval(1500).pipe(
  //   tap((value) => {
  //     this.audioService.playNote("E3");
  //   }),
  //   repeat()
  // ).subscribe();

  // protected interval13$ = interval(1600).pipe(
  //   tap((value) => {
  //     this.audioService.playNote("F3");
  //   }),
  //   repeat()
  // ).subscribe();

  // protected interval153$ = interval(1700).pipe(
  //   tap((value) => {
  //     this.audioService.playNote("F3");
  //   }),
  //   repeat()
  // ).subscribe();

  // protected interval1533$ = interval(1800).pipe(
  //   tap((value) => {
  //     this.audioService.playNote("F3");
  //   }),
  //   repeat()
  // ).subscribe();
  // protected interval1543$ = interval(1000).pipe(
  //   tap((value) => {
  //     this.audioService.playNote("F3");
  //   }),
  //   repeat()
  // ).subscribe();
  // protected interval1513$ = interval(1000).pipe(
  //   tap((value) => {
  //     this.audioService.playNote("F3");
  //   }),
  //   repeat()
  // ).subscribe();
  // protected interval1153$ = interval(1000).pipe(
  //   tap((value) => {
  //     this.audioService.playNote("F3");
  //   }),
  //   repeat()
  // ).subscribe();

  // protected interval15$ = interval(1000).pipe(
  //   tap((value) => {
  //     this.audioService.playNote("E4");
  //   }),
  //   repeat()
  // ).subscribe();
}
