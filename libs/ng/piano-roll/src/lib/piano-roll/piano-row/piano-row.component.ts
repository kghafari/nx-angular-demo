import { ChangeDetectorRef, Component, EventEmitter, inject, Input, input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AudioService } from '../../services/audio.service';
import { RowNote } from '../../interfaces/row-note.interface';

@Component({
  selector: 'lib-piano-row',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  standalone: true,
  templateUrl: './piano-row.component.html',
  styleUrl: './piano-row.component.scss',
})
export class PianoRowComponent {
  @Input({required: true}) notes!: RowNote[];

  @Output() noteClicked = new EventEmitter<RowNote>();

  protected toggleActive(note: RowNote): void {
    note.active = !note.active;
    this.noteClicked.emit(note);
  }
}
