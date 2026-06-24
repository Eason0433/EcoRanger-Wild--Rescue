// ============================================================
// EcoRanger: Wild Rescue — Type definitions
// ============================================================

/** Soalan kuiz: aneka jenis (MCQ {q,a,c} atau Betul/Salah {q,tf}) */
export interface QA {
  q: string;
  a?: string[];
  c?: number;
  tf?: boolean;
}

/** Haiwan atau tumbuhan */
export interface Species {
  name: string;
  sci?: string;
  common?: string;
  emoji: string;
  status?: string;
  habitat?: string;
  biome?: string;
  sound?: string;
  audio?: string | null;
  rarity?: number;
  mystery?: boolean;
  region?: string;
  rtype?: string;
  stage?: string;
  image: string;
  info: Record<string, string>;
  infoEn?: Record<string, string>;
  bank?: QA[];
  // runtime (peta)
  x?: number;
  y?: number;
  found?: boolean;
}

export interface SceneOption {
  t: string;
  correct: boolean;
  fb: string;
}

/** Babak/krisis — guna dalam STAGES (options) & SCENARIOS (desc/casesMY) */
export interface Scenario {
  type: string;
  title?: string;
  name?: string;
  emoji?: string;
  icon?: string;
  number?: string;
  situation?: string;
  question?: string;
  options?: SceneOption[];
  desc?: string;
  casesMY?: string;
  effect?: string;
  // runtime
  x?: number;
  y?: number;
  resolved?: boolean;
  resolving?: boolean;
  fireLife?: number;
  fireSpots?: any[];
  _done?: boolean;
}

export interface Stage {
  region: string;
  flag?: string;
  type: string;
  title: string;
  species: Species[];
  scenes: Scenario[];
}

export interface Item {
  id: string;
  slot: "base" | "hat" | "gear" | "pet";
  emoji: string;
  name: string;
  price?: number;
  rare?: boolean;
  special?: boolean;
  unlock?: string[];
  hint?: string;
}

export interface RankTier {
  min: number;
  name: string;
  icon: string;
}

export interface AchievementDef {
  name: string;
  icon: string;
  desc: string;
}

export interface RarityInfo {
  name: string;
  frame: string;
  ring: string;
  chip: string;
}

export interface SaveData {
  coins: number;
  xp: number;
  completed: string[];
  stars: Record<string, number>;
  equip: { base: string; hat: string | null; gear: string | null; pet: string | null };
  owned: string[];
  collected: Record<string, { quiz?: boolean; guess?: boolean; listen?: boolean }>;
  scenariosSeen: string[];
  guessLvl: number;
  listenLvl: number;
  tut: Record<string, boolean>;
  ach: string[];
  muted: boolean;
  ctrl: string;
  lang?: string;
  playedGuess?: boolean;
  playedListen?: boolean;
  rewardedGuess?: number[];
  rewardedListen?: number[];
}

export type CatalogEntry = Species;
