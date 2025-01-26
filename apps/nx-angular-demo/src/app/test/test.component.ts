import { Component, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { PianoRollComponent } from '@nx-angular-demo/piano-roll';
import { ReactivityComponent } from '@nx-angular-demo/reactivity';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  standalone: true,
  imports: [PianoRollComponent, ReactivityComponent],
})
export class TestComponent implements AfterViewInit {
  @ViewChild(PianoRollComponent) pianoRollComponent!: PianoRollComponent;

  protected showPianoRoll = false;
  protected showReactivity = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  toggleElement(el: boolean): boolean {
    el = !el;
    return el;
  }

  togglePianoRoll() {
    this.showPianoRoll = !this.showPianoRoll;
  }

  toggleReactivity() {
    this.showReactivity = !this.showReactivity;
  }
}
