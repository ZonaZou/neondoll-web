export enum OutfitType {
  BASE = 'BASE',
  SCHOOL = 'SCHOOL',
  OFFICE = 'OFFICE',
  SPACE = 'SPACE',
  STREET = 'STREET',
  NETRUNNER = 'NETRUNNER',
  EVENING = 'EVENING'
}

export interface OutfitDefinition {
  id: OutfitType;
  label: string;
  description: string;
  promptModifier: string;
  icon: string; // Emoji or simple string icon
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}
