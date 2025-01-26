import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Hero } from "../models/interfaces";

@Injectable({
    providedIn: 'root',
  })
  export class HeroService {
    public heroSubject = new BehaviorSubject<Hero>({
      id: 1,
      name: 'Warrior',
      health: 100,
      mana: 50,
      level: 1,
      experience: 0,
    });
  
    hero$ = this.heroSubject.asObservable();
  
    updateHero(updatedHero: Partial<Hero>): void {
      const currentHero = this.heroSubject.value;
      this.heroSubject.next({ ...currentHero, ...updatedHero });
    }
  
    takeDamage(amount: number): void {
      const currentHero = this.heroSubject.value;
      this.heroSubject.next({
        ...currentHero,
        health: Math.max(currentHero.health - amount, 0),
      });
    }
  }