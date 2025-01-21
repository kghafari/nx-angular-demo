import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { PianoRollComponent } from '@nx-angular-demo/piano-roll';

@Component({
  selector: 'app-tasks',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  standalone: true,
  imports: [PianoRollComponent],
})
export class TestComponent implements AfterViewInit {
  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
