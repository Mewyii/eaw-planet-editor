import { ClimateType, PlanetType, PopulationType, TerrainType } from "./planet.model";

export interface PlanetEffect {
  income?: number;
  popCap?: number;
  conqueringCosts?: number;
  abilities?: string[];
}

export type PlanetTypeEffects = { [key in PlanetType]: PlanetEffect };
export type PlanetPopulationEffects = { [key in PopulationType]: PlanetEffect };
export type PlanetClimateEffects = { [key in ClimateType]: PlanetEffect };
export type PlanetTerrainEffects = { [key in TerrainType]: PlanetEffect };
export type PlanetSpecialEffects = { [key: string]: PlanetEffect };

export interface Config {
  dummyPlanetIdentifiers: string;
  planetAffiliations: string;
  planetTypeEffects: PlanetTypeEffects;
  planetPopulationEffects: PlanetPopulationEffects;
  planetClimateEffects: PlanetClimateEffects;
  planetTerrainEffects: PlanetTerrainEffects;
  planetSpecialEffects: PlanetSpecialEffects;
}
