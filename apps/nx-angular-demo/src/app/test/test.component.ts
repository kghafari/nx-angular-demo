import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, inject, OnInit } from '@angular/core';
import { PianoRollComponent, PianoRollV2Component } from '@nx-angular-demo/piano-roll';
import { ReactivityComponent } from '@nx-angular-demo/reactivity';
import { ApiService } from '../services/api.service';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  standalone: true,
  imports: [PianoRollComponent, PianoRollV2Component, ReactivityComponent, JsonPipe, AsyncPipe],
})
export class TestComponent implements AfterViewInit, OnInit {
  @ViewChild(PianoRollComponent) pianoRollComponent!: PianoRollComponent;

  private readonly apiService = inject(ApiService);

  protected showPianoRoll = true;
  protected showReactivity = false;
  public data$ = this.apiService.getData();
  public testMessage$ = this.apiService.getTest();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
  }

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
