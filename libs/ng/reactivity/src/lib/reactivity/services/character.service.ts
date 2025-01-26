import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, map, of, switchMap, tap } from 'rxjs';

export interface CharacterState {
  name: string;
  xp: number;
  hp: number;
  damage: number;
  accuracy: number;
  defense: number;
  critChance: number;
  critDamage: number;
}

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly TICKSPEED = 1000;
  public startingState: CharacterState = {
    name: 'Hero',
    xp: 0,
    hp: 100,
    damage: 10,
    accuracy: 0.8,
    defense: 0.2,
    critChance: 0.1,
    critDamage: 1.5,
  };
  private characterStateSubject = new BehaviorSubject<CharacterState>(this.startingState);
  public characterState$: Observable<CharacterState> = this.characterStateSubject.asObservable();

  

  initializeCharacterState(characterState: CharacterState): void {
    // console.log('CharacterService: ', characterState);
    this.characterStateSubject.next(characterState);
  }

  updateCharacterState(newState: CharacterState): void {
    this.characterStateSubject.next(newState);
  }
}