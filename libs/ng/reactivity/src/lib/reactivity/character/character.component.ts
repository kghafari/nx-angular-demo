import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService, CharacterState } from '../services/character.service';
import { map, take, tap } from 'rxjs';
import { HeroService } from '../services/hero.service';
import { GameService } from '../services/game.service';

@Component({
  selector: 'lib-character',
  imports: [CommonModule],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss',
})
export class CharacterComponent implements OnInit {
  private readonly heroService = inject(HeroService);
  private readonly gameService = inject(GameService); 

  protected hero$ = this.heroService.hero$;
  protected elapsedSeconds$ = this.gameService.elapsedSeconds$;

  takeDamage(): void {
    this.heroService.takeDamage(10);
  }

  protected character: CharacterState = {
    name: 'MyHero',
    xp: 0,
    hp: 100,
    damage: 10,
    accuracy: 0.8,
    defense: 0.2,
    critChance: 0.1,
    critDamage: 1.5,
  };


  public ngOnInit(): void {
    this.gameService.startGameTimer();
  }

  public restartGame(): void {
    this.gameService.restartGame();
  }
}
