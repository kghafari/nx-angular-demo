import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, map } from 'rxjs';
import { Resource, ResourceType, startingResources } from '../models/idle.interfaces';


@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private tickRate = 100; // .1 second per tick
  private runDuration = 300000; // 30000ms (5 min runs)
  private elapsedTime = new BehaviorSubject<number>(0);
  private resources = new BehaviorSubject<Resource[]>(startingResources);

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
    // console.log('Time:', this.resources.value);
    if (time >= this.runDuration) {
      this.endRun();
    } else {
      this.generateResources();
    }
  }

  private generateResources() {
    const updatedResources = [...this.resources.value];

    for(let i = 0; i < updatedResources.length; i++) {
      updatedResources[i].value = (updatedResources[i].value + updatedResources[i].multiplier);
    }
    //console.log('Resources generated:', updatedResources);
    this.resources.next(updatedResources);
  }

  public applyUpgrade(resource: Resource, multiplier: number) {
    const updatedResources = [...this.resources.value];
    const index = updatedResources.findIndex(r => r.key === resource.key);

    updatedResources[index].multiplier = updatedResources[index].multiplier += multiplier;
    this.resources.next(updatedResources);
  }

  private endRun() {
    console.log('Run ended! Apply prestige bonuses.');
    this.elapsedTime.next(0); // Reset timer
    this.prestige();
    this.resetResources();
    // Implement prestige bonuses here
  }

  private resetResources() {
    this.resources.next(startingResources);
  }

  private prestige() {
    // when the game ends, we want to take 5% of the resource multiplier and start the game with that as the base mutliplier
    
    const prestigeMultiplier = 0.05;
    const updatedResources = [...this.resources.value];
    for(let i = 0; i < updatedResources.length; i++) {
      updatedResources[i].multiplier = updatedResources[i].multiplier * (1 + prestigeMultiplier);
    }
    this.resources.next(updatedResources);

    console.log('Prestige applied!. New multipliers:', updatedResources);
  }
}
