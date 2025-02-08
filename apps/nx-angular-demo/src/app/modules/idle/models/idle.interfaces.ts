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

export interface Resourcees {
  resources: Resource[];
}

export interface Resource {
  id: number;
  key: string;
  label: string;
  value: number;
  startValue: number;
  multiplier: number;
}

export type ResourceType =
  | 'production'
  | 'science'
  | 'faith'
  | 'military'
  | 'culture';

export const startingResources: Resource[] = [
  {
    id: 0,
    key: 'production',
    label: 'Production',
    value: 0,
    startValue: 0,
    multiplier: 1,
  },
  {
    id: 1,
    key: 'science',
    label: 'Science',
    value: 0,
    startValue: 0,
    multiplier: 1,
  },
  {
    id: 2,
    key: 'faith',
    label: 'Faith',
    value: 0,
    startValue: 0,
    multiplier: 1,
  },
  {
    id: 3,
    key: 'military',
    label: 'Military',
    value: 0,
    startValue: 0,
    multiplier: 1,
  },
  {
    id: 4,
    key: 'culture',
    label: 'Culture',
    value: 0,
    startValue: 0,
    multiplier: 1,
  },
];
