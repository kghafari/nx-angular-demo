import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, map } from 'rxjs';
import { Resources } from '../models/idle.interfaces';

type ResourceType = 'production' | 'science' | 'faith' | 'military' | 'culture';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private tickRate = 1000; // 1 second per tick
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
    culture: 1
  };

  public elapsedTime$ = this.elapsedTime.asObservable();
  public remainingTime$ = this.elapsedTime$.pipe(map((time) => this.runDuration - time));
  public resources$ = this.resources.asObservable();

  constructor() {
    // Start the game loop
    interval(this.tickRate).subscribe(() => this.gameTick());
  }

  private gameTick() {
    // elapsed time: 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000
    // tickspeed(1000) 
    const time = this.tickRate + (this.elapsedTime.value);
    console.log('Tick:', time);
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
