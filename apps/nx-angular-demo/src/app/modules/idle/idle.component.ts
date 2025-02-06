import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from './services/game-state.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-idle',
  imports: [CommonModule, MatTabsModule, MatCardModule, MatIconModule],
  templateUrl: './idle.component.html',
  styleUrl: './idle.component.scss',
})
export class IdleComponent {
  private readonly gameService = inject(GameStateService);
  protected resources$ = this.gameService.resources$;
  protected elapsedTime$ = this.gameService.elapsedTime$;
}
