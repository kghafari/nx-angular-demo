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
    startValue: 1,
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
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 3,
    key: 'military',
    label: 'Military',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 4,
    key: 'culture',
    label: 'Culture',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 5,
    key: 'gold',
    label: 'Gold',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 6,
    key: 'food',
    label: 'Food',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 7,
    key: 'population',
    label: 'Population',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 8,
    key: 'happiness',
    label: 'Happiness',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 9,
    key: 'unhappiness',
    label: 'Unhappiness',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 10,
    key: 'health',
    label: 'Health',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 11,
    key: 'unhealth',
    label: 'Unhealth',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 12,
    key: 'energy',
    label: 'Energy',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 13,
    key: 'pollution',
    label: 'Pollution',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 14,
    key: 'water',
    label: 'Water',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 15,
    key: 'air',
    label: 'Air',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 16,
    key: 'land',
    label: 'Land',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 17,
    key: 'sea',
    label: 'Sea',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
  {
    id: 18,
    key: 'space',
    label: 'Space',
    value: 0,
    startValue: 1,
    multiplier: 1,
  },
];
