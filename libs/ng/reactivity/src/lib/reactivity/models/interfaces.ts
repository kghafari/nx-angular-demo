export interface Hero {
    id: number;
    name: string;
    health: number;
    mana: number;
    level: number;
    experience: number;
  }
  
  export interface Enemy {
    id: number;
    name: string;
    health: number;
    attackPower: number;
    isAlive: boolean;
  }
  
  export interface Item {
    id: number;
    name: string;
    type: 'weapon' | 'armor' | 'potion';
    effect: string;
  }

  export interface GameState {
    hero: Hero;
    enemies: Enemy[];
    inventory: Item[];
    score: number;
    level: number;
    isGameOver: boolean;
  }
  