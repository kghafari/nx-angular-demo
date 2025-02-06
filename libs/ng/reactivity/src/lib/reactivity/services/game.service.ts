import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HeroService } from './hero.service';
import { EnemyService } from './enemy.service';
import { InventoryService } from './inventory.service';
import { GameState } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gameStateSubject = new BehaviorSubject<GameState>({
    hero: null!,
    enemies: [],
    inventory: [],
    score: 0,
    level: 1,
    isGameOver: false,
  });

  gameState$ = this.gameStateSubject.asObservable();

  private elapsedSecondsSubject = new BehaviorSubject<number>(0);
  elapsedSeconds$ = this.elapsedSecondsSubject.asObservable();
  private timerSubscription!: Subscription;

  constructor(
    private heroService: HeroService,
    private enemyService: EnemyService,
    private inventoryService: InventoryService
  ) {
    // Combine streams from the individual services to update the global game state
    combineLatest([
      this.heroService.hero$,
      this.enemyService.enemies$,
      this.inventoryService.inventory$,
    ])
      .pipe(
        map(([hero, enemies, inventory]) => ({
          hero,
          enemies,
          inventory,
          score: this.calculateScore(enemies),
          level: this.calculateLevel(hero),
          isGameOver: this.checkGameOver(hero),
        })),
        tap((globalState) => console.log(globalState))
      )
      .subscribe((globalState) => this.gameStateSubject.next(globalState));
  }

  private calculateScore(enemies: any[]): number {
    return enemies.filter((enemy) => !enemy.isAlive).length * 100;
  }

  private calculateLevel(hero: any): number {
    return Math.floor(hero.experience / 100) + 1;
  }

  private checkGameOver(hero: any): boolean {
    return hero.health <= 0;
  }

  public restartGame(): void {
    this.heroService.updateHero({
      health: 100,
      mana: 50,
      level: 1,
      experience: 0,
    });

    this.enemyService.enemies$.next([
      { id: 1, name: 'Goblin', health: 50, attackPower: 5, isAlive: true },
    ]);

    this.inventoryService.inventory$.next([]);
    this.gameStateSubject.next({
      hero: this.heroService.heroSubject.value,
      enemies: this.enemyService.enemiesSubject.value,
      inventory: this.inventoryService.inventorySubject.value,
      score: 0,
      level: 1,
      isGameOver: false,
    });

    this.resetGameTimer();
  }

  startGameTimer(): void {
    // Start the interval timer
    this.timerSubscription = interval(1000) // 1-second interval
      .pipe(
        tap((seconds) => {
          this.elapsedSecondsSubject.next(seconds);

          // Trigger specific timed events
          this.handleTimedEvents(seconds);
        })
      )
      .subscribe();
  }

  stopGameTimer(): void {
    // Stop the timer
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  resetGameTimer(): void {
    this.elapsedSecondsSubject.next(0);
  }

  getTimeElapsed(): number {
    return this.elapsedSecondsSubject.value;
  }

  private handleTimedEvents(elapsedSeconds: number): void {
    // Example: Every 5 seconds, enemies attack
    if (elapsedSeconds % 5 === 0) {
      this.enemyAttack();
    }
  }

  private enemyAttack(): void {
    this.heroService.takeDamage(10); // Enemies deal 10 damage to the hero
    // console.log('Enemies attacked the hero!');
  }
}
