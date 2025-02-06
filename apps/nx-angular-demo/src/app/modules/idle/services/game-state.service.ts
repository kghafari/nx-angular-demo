import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { Resources } from '../models/idle.interfaces';

type ResourceType = 'production' | 'science' | 'faith' | 'military' | 'culture';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private tickRate = 1000; // 1 second per tick
  private runDuration = 300; // 300 seconds (5 min runs)
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
    culture: 1
  };

  public elapsedTime$ = this.elapsedTime.asObservable();
  public resources$ = this.resources.asObservable();

  constructor() {
    // Start the game loop
    interval(this.tickRate).subscribe(() => this.gameTick());
  }

  private gameTick() {
    let time = this.elapsedTime.value + 1;
    this.elapsedTime.next(time);

    if (time >= this.runDuration) {
      this.endRun();
    } else {
      this.generateResources();
    }
  }

  private generateResources() {
    let updatedResources = { ...this.resources.value };
  
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
}
