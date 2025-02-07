import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GameStateService } from '../idle/services/game-state.service';
import { MatTabsModule } from '@angular/material/tabs';
import { PianoRollV2Component } from '@nx-angular-demo/piano-roll';
import { MinutesSecondsPipe } from '@nx-angular-demo/pipes';

@Component({
  selector: 'app-tab',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    PianoRollV2Component,
    MinutesSecondsPipe,
  ],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent {
  private readonly gameService = inject(GameStateService);

  protected resources$ = this.gameService.resources$;
  protected elapsedTime$ = this.gameService.elapsedTime$;

  protected remainingTime$ = this.gameService.remainingTime$;
}
