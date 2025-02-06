export interface Resources {
  production: number;
  science: number;
  faith: number;
  military: number;
  culture: number;
}

export interface Upgrade {
  id: string;
  name: string;
  resource: string;
  multiplier: number;
  cost: number;
  purchased: boolean;
}
