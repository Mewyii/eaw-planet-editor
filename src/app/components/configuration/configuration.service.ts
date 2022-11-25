import { Injectable } from "@angular/core";
import { BehaviorSubject, skip } from "rxjs";
import { StorageService } from "src/app/core";
import {
  ClimateType,
  Config,
  PlanetEffect,
  PlanetPopulationEffects,
  PlanetType,
  PlanetTypeEffects,
  PopulationType,
  TerrainType,
} from "src/app/models";
import { EffectEditorService } from "../effect-editor/effect-editor.service";

@Injectable({ providedIn: "root" })
export class ConfigurationService {
  storageId = "config";

  private readonly initialConfig: Config = {
    dummyPlanetIdentifiers: "Icon_;Dummy_;Galaxy_Core_Art;_Galaxy;_Nebula",
    planetAffiliations:
      "Empire;Rebel;Underworld;Hutt;CIS;CSA;Hapes;Mandalorian;Sith;Republic;Warlords;Independent;Pirates;None;Chiss;Unknown",
    planetTypeEffects: {
      Sector: {
        income: 1000,
        popCap: 80,
        conqueringCosts: -10000,
      },
      System: {
        income: 300,
        popCap: 40,
        conqueringCosts: -3000,
      },
      Planet: {
        income: 0,
        popCap: 20,
        conqueringCosts: 0,
      },
      "Asteroid Field": {
        income: 0,
        popCap: 0,
        conqueringCosts: 0,
      },
      Nebula: {
        income: 0,
        popCap: 0,
        conqueringCosts: 0,
      },
      "Space Station": {
        income: 0,
        popCap: 0,
        conqueringCosts: 0,
      },
      "": {
        income: 0,
        popCap: 0,
        conqueringCosts: 0,
      },
    },
    planetPopulationEffects: {
      None: {
        income: 0,
        popCap: 0,
        conqueringCosts: 0,
      },
      "Very Low": {
        income: 0,
        popCap: 0,
        conqueringCosts: 0,
      },
      Low: {
        income: 100,
        popCap: 0,
        conqueringCosts: -1000,
      },
      Medium: {
        income: 500,
        popCap: 0,
        conqueringCosts: -3000,
      },
      High: {
        income: 1500,
        popCap: -20,
        conqueringCosts: -5000,
      },
      "Very High": {
        income: 3000,
        popCap: -60,
        conqueringCosts: -10000,
      },
    },
    planetClimateEffects: {
      Temperate: {},
      Harsh: {
        abilities: [
          "Harsh_Climate_Ground_Unit_Production_Cost_Increase",
          "Harsh_Climate_Ground_Unit_Production_Speed_Decrease",
        ],
      },
      Uninhabitable: {
        abilities: [
          "Uninhabitable_Climate_Ground_Unit_Production_Cost_Increase",
          "Uninhabitable_Climate_Ground_Unit_Production_Speed_Decrease",
        ],
      },
    },
    planetTerrainEffects: {
      Grasslands: {
        abilities: [
          "Accessible_Terrain_Ground_Building_Production_Cost_Decrease",
          "Accessible_Terrain_Ground_Building_Production_Speed_Increase",
        ],
      },
      Mixed: {
        abilities: [
          "Accessible_Terrain_Ground_Building_Production_Cost_Decrease",
          "Accessible_Terrain_Ground_Building_Production_Speed_Increase",
        ],
      },
      Forested: {
        abilities: [
          "Accessible_Terrain_Ground_Building_Production_Cost_Decrease",
          "Accessible_Terrain_Ground_Building_Production_Speed_Increase",
        ],
      },
      Barren: {},
      Islands: {},
      Jungle: {},
      Ruins: {},
      Urban: {
        abilities: [
          "Inaccessible_Terrain_Ground_Building_Production_Cost_Increase",
          "Inaccessible_Terrain_Ground_Building_Production_Speed_Decrease",
        ],
      },
      Ocean: {
        abilities: [
          "Inaccessible_Terrain_Ground_Building_Production_Cost_Increase",
          "Inaccessible_Terrain_Ground_Building_Production_Speed_Decrease",
        ],
      },
      Swamps: {
        abilities: [
          "Inaccessible_Terrain_Ground_Building_Production_Cost_Increase",
          "Inaccessible_Terrain_Ground_Building_Production_Speed_Decrease",
        ],
      },
      Iced: {
        abilities: [
          "Inaccessible_Terrain_Ground_Building_Production_Cost_Increase",
          "Inaccessible_Terrain_Ground_Building_Production_Speed_Decrease",
        ],
      },
      Frozen: {
        abilities: [
          "Inaccessible_Terrain_Ground_Building_Production_Cost_Increase",
          "Inaccessible_Terrain_Ground_Building_Production_Speed_Decrease",
        ],
      },
      Gaseous: {
        abilities: [
          "Inaccessible_Terrain_Ground_Building_Production_Cost_Increase",
          "Inaccessible_Terrain_Ground_Building_Production_Speed_Decrease",
        ],
      },
      Rocky: {
        abilities: [
          "Inaccessible_Terrain_Ground_Building_Production_Cost_Increase",
          "Inaccessible_Terrain_Ground_Building_Production_Speed_Decrease",
        ],
      },
      Desert: {
        abilities: [
          "Inaccessible_Terrain_Ground_Building_Production_Cost_Increase",
          "Inaccessible_Terrain_Ground_Building_Production_Speed_Decrease",
        ],
      },
      Crystalline: {
        abilities: [
          "Inaccessible_Terrain_Ground_Building_Production_Cost_Increase",
          "Inaccessible_Terrain_Ground_Building_Production_Speed_Decrease",
        ],
      },
      Volcanic: {
        abilities: [
          "Inaccessible_Terrain_Ground_Building_Production_Cost_Increase",
          "Inaccessible_Terrain_Ground_Building_Production_Speed_Decrease",
        ],
      },
    },
    planetSpecialEffects: {},
  };

  initialSpecialEffectNames: string[] = [
    // Properties
    "Research",
    "Corrupt",
    "Intelligence",
    "Force (Dark Side)",
    "Force (Light Side)",
    "Military Training Facilities",
    "Rich",
    "Shipbuilding Facilities",
    "Droid Factories",
    "Pod Racing",
    "Gas Planet Nearby",
    "Unknown Regions Connection",
    // Corporations
    "Cybot Galactica",
    "Incom Corporation",
    "Loronar Corporation",
    "BlasTech Industries",
    "Black Sun",
    "InterGalactic Banking Clan",
    "Brentaal League of Guilds",
    "Rendili StarDrive",
    "Rothana Heavy Engineering",
    "Slayn & Korpil",
    "SoroSuub Corporation",
    "Sienar Technologies",
    "Corellian Engineering Corporation",
  ];

  private configSubject = new BehaviorSubject<Config>(this.getInitialConfig());
  config$ = this.configSubject.asObservable();

  constructor(private effectEditorService: EffectEditorService, private storageService: StorageService) {
    const storedConfig = this.storageService.getItem<Config>(this.storageId);
    if (storedConfig) {
      this.configSubject.next(storedConfig);
    }

    this.config$.pipe(skip(1)).subscribe((config) => {
      this.storageService.setItem(this.storageId, config);
    });

    this.effectEditorService.effectNames$.subscribe((names) => {
      this.refreshEffects(names);
    });
  }

  get config() {
    return this.configSubject.getValue();
  }

  updateConfig(config: Config) {
    this.configSubject.next(config);
  }

  updatePlanetTypeEffects(planetTypeEffects: Partial<PlanetTypeEffects>) {
    const newConfig: Config = {
      ...this.config,
      planetTypeEffects: { ...this.config.planetTypeEffects, ...planetTypeEffects },
    };
    this.configSubject.next(newConfig);
  }

  updatePlanetPopulationEffects(planetPopulationEffects: Partial<PlanetPopulationEffects>) {
    const newConfig: Config = {
      ...this.config,
      planetPopulationEffects: { ...this.config.planetPopulationEffects, ...planetPopulationEffects },
    };
    this.configSubject.next(newConfig);
  }

  addEffect(type: "special", id: string, effect: PlanetEffect) {
    if (!this.config.planetSpecialEffects[id]) {
      const newConfig: Config = {
        ...this.config,
        planetSpecialEffects: { ...this.config.planetSpecialEffects, [id]: effect },
      };
      this.configSubject.next(newConfig);
    }
  }

  removeEffect(type: "special", id: string) {
    if (this.config.planetSpecialEffects[id]) {
      const newConfig: Config = { ...this.config };
      delete newConfig.planetSpecialEffects[id];
      this.configSubject.next(newConfig);
    }
  }

  refreshEffects(abilityNames: string[]) {
    const config = this.config;
    for (const key in config.planetTypeEffects) {
      const abilities = config.planetTypeEffects[key as PlanetType].abilities;
      if (abilities) {
        config.planetTypeEffects[key as PlanetType].abilities = abilities.filter((x) => abilityNames.includes(x));
      }
    }
    for (const key in config.planetClimateEffects) {
      const abilities = config.planetClimateEffects[key as ClimateType].abilities;
      if (abilities) {
        config.planetClimateEffects[key as ClimateType].abilities = abilities.filter((x) => abilityNames.includes(x));
      }
    }
    for (const key in config.planetPopulationEffects) {
      const abilities = config.planetPopulationEffects[key as PopulationType].abilities;
      if (abilities) {
        config.planetPopulationEffects[key as PopulationType].abilities = abilities.filter((x) => abilityNames.includes(x));
      }
    }
    for (const key in config.planetTerrainEffects) {
      const abilities = config.planetTerrainEffects[key as TerrainType].abilities;
      if (abilities) {
        config.planetTerrainEffects[key as TerrainType].abilities = abilities.filter((x) => abilityNames.includes(x));
      }
    }
    for (const key in config.planetSpecialEffects) {
      const abilities = config.planetSpecialEffects[key as TerrainType].abilities;
      if (abilities) {
        config.planetSpecialEffects[key as TerrainType].abilities = abilities.filter((x) => abilityNames.includes(x));
      }
    }

    this.configSubject.next(config);
  }

  private getInitialConfig() {
    const config = this.initialConfig;
    for (const initialSpecialEffectName of this.initialSpecialEffectNames) {
      config.planetSpecialEffects[initialSpecialEffectName] = {};
    }
    return config;
  }
}
