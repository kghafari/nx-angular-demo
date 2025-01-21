import { AfterViewInit, ChangeDetectorRef, Component, inject, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {
  animate,
  AnimationBuilder,
  AnimationPlayer,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { bounceAnimation } from 'angular-animations';
import { PianoRowComponent } from "./piano-row/piano-row.component";
import { AudioService } from '../services/audio.service';
import { RowNote } from '../interfaces/row-note.interface';

@Component({
  selector: 'lib-piano-roll',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, PianoRowComponent],
  standalone: true,
  templateUrl: './piano-roll.component.html',
  styleUrl: './piano-roll.component.scss',
})
export class PianoRollComponent implements AfterViewInit, OnChanges {

  private readonly animBuilder = inject(AnimationBuilder);
  private readonly audioService = inject(AudioService);
  private readonly cdr = inject(ChangeDetectorRef);

  private anim: AnimationPlayer | null = null;
  protected speed = 1000; // 1 seconds
  protected bpm = this.calculateBPM(this.speed);
  protected isSpeedChanged = false;
  
  // debugging
  protected count = 0;
  protected doneCount = 1;
  public notesPerRow = 4;

  // row 1
  protected notes_1: RowNote[] = [
    { id: '1', duration: 1, active: true },
    { id: '2', duration: 1, active: true },
    { id: '3', duration: 1, active: true },
    { id: '4', duration: 1, active: true },
  ];

  // list of goals:
  // 1. Determine the timing of notes based on the speed of the animation and number of notes per row
  // 2. Play a note when a note is active
  // 3. Change the speed of the animation and update the timing of the notes accordingly
  // 4. Add a row of notes when the user clicks a button and update the timing of the notes accordingly

  

  protected calculateBPM(speed: number): number {
    return (60 * 1000) / speed;
  }

  protected animPlayer(element: HTMLElement | null ): void {
    const noteTiming = this.notesPerRow * this.speed;
    // console.log('noteTiming', noteTiming);
    const slide = this.animBuilder.build([
      style({ left: '0px' }),
      animate(noteTiming, style({ left: '100%' })),
    ]);
  
    if (this.anim) {
      this.anim.destroy();
    }
    const player = slide.create(element);

    this.anim = player;
  
    this.anim.play();
    this.anim.onDone(() => {
      this.audioService.scheduleNotes(this.notes_1, this.speed);
      this.audioService.playNote();
      this.doneCount = this.doneCount + 1;
      this.anim?.restart();
    });
  }
  
  protected fadeInStart = false;
  protected bounceState = false;

  public ngOnChanges() {
    console.log('onChanges');
  }

  public ngAfterViewInit() {
    this.audioService.start();
    this.audioService.scheduleNotes(this.notes_1, this.speed);
    this.animPlayer(document.querySelector("[id='lil']"));
    this.anim?.play();
    this.fadeInStart = true;   
    
    
    setInterval(() => {
      this.count = this.count + 10;
      this.cdr.detectChanges();
      if(this.count >= this.speed){
        this.count = 0;
      }
    }, 10);
  }

  protected animationDone($event: any) {
    this.fadeInStart = !this.fadeInStart;
    this.bounceState = !this.bounceState;
  }

  // buttons
  protected speedUp() {
    this.anim?.restart();
    this.speed = this.speed / 2;
    this.bpm = this.calculateBPM(this.speed);
    this.animPlayer(document.querySelector("[id='lil']"));
  }

  protected speedDown() {
    this.anim?.restart();
    this.speed = this.speed * 2;
    this.bpm = this.calculateBPM(this.speed);
    this.animPlayer(document.querySelector("[id='lil']"));
  }

  protected addNotes() {
    this.notesPerRow = this.notesPerRow + 4;
    for (let i = this.notes_1.length; i < this.notesPerRow; i++) {
      this.notes_1.push({ id: `${i + 4}`, duration: 1, active: false });
    }
    this.anim?.restart();
    this.animPlayer(document.querySelector("[id='lil']"));
  };

  protected removeNotes() {
    this.notesPerRow = this.notesPerRow - 4;
    this.notes_1 = this.notes_1.slice(0, this.notesPerRow);
    this.anim?.restart();
    this.animPlayer(document.querySelector("[id='lil']"));
  };

  start() {
    this.anim?.play();
  }

  pause() {
    this.anim?.pause();
  }

  noteClicked(note: RowNote) {
    console.log('note clicked', note);
  }


  // private setupRows() {
  //   const previousRowItems = this.notes_1.length;
  //     if (currentRowItems > previousRowItems) {
  //       // Add new notes
  //       for (let i = previousRowItems; i < currentRowItems; i++) {
  //         this.notes_1.push({ id: `${i}`, duration: 1, active: false });
  //       }
  //     } else if (currentRowItems < previousRowItems) {
  //       // Remove notes
  //       this.notes_1.splice(currentRowItems, previousRowItems - currentRowItems);
  //     }
  //     this.audioService.scheduleNotes(this.notes_1, this.speed);
  //   }
  }

