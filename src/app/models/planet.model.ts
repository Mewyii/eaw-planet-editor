import { AbilitiesList } from "./effects.model";

export const planetTypes = ["", "Sector", "System", "Planet", "Asteroid Field", "Nebula", "Space Station"] as const;
export const climates = ["Uninhabitable", "Harsh", "Temperate"] as const;
export const resources = ["Low", "High", "Medium"] as const;
export const terrains = [
  "Grasslands",
  "Mixed",
  "Forested",
  "Barren",
  "Jungle",
  "Islands",
  "Ruins",
  "Urban",
  "Ocean",
  "Swamps",
  "Iced",
  "Frozen",
  "Gaseous",
  "Rocky",
  "Desert",
  "Crystalline",
  "Volcanic",
] as const;
export const population = ["None", "Very Low", "Low", "Medium", "High", "Very High"] as const;

export type PlanetType = typeof planetTypes[number];
export type ClimateType = typeof climates[number];
export type ResourceType = typeof resources[number];
export type TerrainType = typeof terrains[number];
export type PopulationType = typeof population[number];

export interface Planet {
  "@_Name": string;
  "@_Description"?: string;
  Encyclopedia_Text?: string;
  Planet_Credit_Value?: number;
  Additional_Population_Capacity?: number;
  Special_Structures_Land?: number;
  Special_Structures_Space?: number;
  Planet_Is_Mining_Colony?: "Yes" | "No";
  Planet_Capture_Bonus_Reward?: number;
  Abilities?: AbilitiesList;
  Galactic_Model_Name?: string;
  Loop_Idle_Anim_00?: string;
  Mass?: number;
  Scale_Factor?: number;
  Show_Name?: string;
  Name_Adjust?: string;
  Behavior?: string;
  Pre_Lit?: string;
  Political_Control?: number;
  Camera_Aligned?: string;
  Facing_Adjust?: string;
  Galactic_Position?: string;
  Special_Structures?: number;
  Max_Ground_Base?: number;
  Max_Space_Base?: number;
  Terrain?: string;

  //Splitted Description Properties
  PlanetTerrain?: TerrainType;
  Type?: PlanetType;
  Climate?: ClimateType;
  Resources?: ResourceType;
  Population?: PopulationType;
  PopulationInfo?: string;
  Affiliation?: string[];
  Special?: string[];
}

export interface PlanetArray {
  Planet: Planet[];
}

export interface PlanetFile {
  "?xml"?: string;
  Planets: PlanetArray;
}
