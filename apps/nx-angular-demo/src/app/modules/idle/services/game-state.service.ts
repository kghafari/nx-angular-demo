import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, map } from 'rxjs';
import { Resources, ResourceType } from '../models/idle.interfaces';


@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private tickRate = 100; // .1 second per tick
  private runDuration = 300000; // 30000ms (5 min runs)
  private elapsedTime = new BehaviorSubject<number>(0);
  private resources = new BehaviorSubject<Resources>({
    production: 0,
    science: 0,
    faith: 0,
    military: 0,
    culture: 0,
  });

  private upgradeMultipliers = {
    production: 1,
    science: 1,
    faith: 1,
    military: 1,
    culture: 1,
  };

  public elapsedTime$ = this.elapsedTime.asObservable();
  public remainingTime$ = this.elapsedTime$.pipe(
    map((time) => this.runDuration - time)
  );
  public resources$ = this.resources.asObservable();

  constructor() {
    // Start the game loop
    interval(this.tickRate).subscribe(() => this.gameTick());
  }

  private gameTick() {
    const time = this.tickRate + this.elapsedTime.value;
    this.elapsedTime.next(time);

    if (time >= this.runDuration) {
      this.endRun();
    } else {
      this.generateResources();
    }
  }

  private generateResources() {
    const updatedResources = { ...this.resources.value };

    updatedResources.production += 1 * this.upgradeMultipliers.production;
    updatedResources.science += 0.5 * this.upgradeMultipliers.science;
    updatedResources.faith += 0.3 * this.upgradeMultipliers.faith;
    updatedResources.military += 0.2 * this.upgradeMultipliers.military;
    updatedResources.culture += 0.4 * this.upgradeMultipliers.culture;

    this.resources.next(updatedResources);
  }

  public applyUpgrade(resource: ResourceType, multiplier: number) {
    this.upgradeMultipliers[resource] *= multiplier;
  }

  private endRun() {
    console.log('Run ended! Apply prestige bonuses.');
    this.elapsedTime.next(0); // Reset timer
    this.prestige();
    this.resetResources();
    // Implement prestige bonuses here
  }

  private resetResources() {
    this.resources.next({
      production: 0,
      science: 0,
      faith: 0,
      military: 0,
      culture: 0,
    });
  }

  private prestige() {
    // when the game ends, we want to take 5% of the resource multiplier and start the game with that as the base mutliplier
    
    const prestigeMultiplier = 0.05;

    this.upgradeMultipliers.production *= 1 + prestigeMultiplier;
    this.upgradeMultipliers.science *= 1 + prestigeMultiplier;
    this.upgradeMultipliers.faith *= 1 + prestigeMultiplier;
    this.upgradeMultipliers.military *= 1 + prestigeMultiplier;
    this.upgradeMultipliers.culture *= 1 + prestigeMultiplier;

    console.log('Prestige applied!. New multipliers:', this.upgradeMultipliers);
  }
}
