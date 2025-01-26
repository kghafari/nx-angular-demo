import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Enemy } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class EnemyService {
  public enemiesSubject = new BehaviorSubject<Enemy[]>([
    { id: 1, name: 'Goblin', health: 50, attackPower: 5, isAlive: true },
  ]);

  enemies$ = this.enemiesSubject;

  attackEnemy(id: number, damage: number): void {
    const updatedEnemies = this.enemiesSubject.value.map((enemy) =>
      enemy.id === id
        ? {
            ...enemy,
            health: Math.max(enemy.health - damage, 0),
            isAlive: enemy.health - damage > 0,
          }
        : enemy
    );
    this.enemiesSubject.next(updatedEnemies);
  }
}
