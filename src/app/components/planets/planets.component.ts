import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfigurationService } from "../configuration/configuration.service";
import { ConfirmDialogComponent } from "../../components/dialogs/confirm-dialog/confirm-dialog.component";
import { EffectEditorService } from "../../components/effect-editor/effect-editor.service";
import {
  AbilitiesList,
  climates,
  ClimateType,
  Config,
  Planet,
  PlanetFile,
  PlanetType,
  planetTypes,
  population,
  PopulationType,
  ReduceProductionPriceAbility,
  ReduceProductionTimeAbility,
  resources,
  ResourceType,
  terrains,
  TerrainType,
} from "../../models";
import { PlanetsService } from "./planets.service";
import { isEqual } from "lodash";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-planets",
  templateUrl: "./planets.component.html",
  styleUrls: ["./planets.component.sass"],
})
export class PlanetsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  planetTypes = planetTypes;
  climates = climates;
  resources = resources;
  terrains = terrains;
  population = population;
  specials: string[] = [];

  farmingPlanetIdentifiers: TerrainType[] = ["Mixed", "Grasslands", "Forested", "Barren", "Islands", "Jungle", "Ruins"];
  miningPlanetIdentifiers: ResourceType[] = ["Medium", "High"];

  config: Config | undefined;
  affiliations: string[] = [];
  filteredPlanets: Planet[] = [];

  dataSource = new MatTableDataSource<Planet>([]);

  constructor(
    private configService: ConfigurationService,
    private effectEditorService: EffectEditorService,
    private dialog: MatDialog,
    private planetsService: PlanetsService
  ) {}

  ngOnInit(): void {
    this.configService.config$.subscribe((config) => {
      this.config = config;
      this.affiliations = config.planetAffiliations.split(";");
      this.specials = Object.keys(config.planetSpecialEffects);
    });

    this.planetsService.filteredPlanets$.subscribe((planets) => {
      if (planets.length === this.filteredPlanets.length) {
        for (const [index, planet] of planets.entries()) {
          if (!isEqual(this.filteredPlanets[index], planet)) {
            this.filteredPlanets[index] = planet;
          }
        }
      } else {
        this.filteredPlanets = planets;
        this.dataSource.data = this.filteredPlanets;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onShowAllPlanetsClicked() {
    this.planetsService.removePlanetFilters();
  }

  onShowFarmingPlanetsClicked() {
    this.planetsService.filterPlanets((x) => this.farmingPlanetIdentifiers.some((id) => x.PlanetTerrain === id));
  }

  onShowMiningPlanetsClicked() {
    this.planetsService.filterPlanets((x) => this.miningPlanetIdentifiers.some((id) => x.Resources === id));
  }

  onFilterOutDummyPlanetsClicked() {
    if (this.config) {
      const dummyPlanetIdentifiers = this.config.dummyPlanetIdentifiers.split(";");
      this.planetsService.filterPlanets((x) => !dummyPlanetIdentifiers.some((id) => x["@_Name"].includes(id)));
    }
  }

  onRecalculatePlanetEffectsClicked() {
    for (const planet of this.filteredPlanets) {
      this.calculatePlanetEffects(planet);
    }
  }

  onDeletePlanetClicked(element: Planet) {
    const ref = this.dialog.open(ConfirmDialogComponent);
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.planetsService.removePlanet(element["@_Name"]);
      }
    });
  }

  onPlanetPropertyChanged(element: Planet, property: keyof Planet, value: unknown) {
    if (property === "Type") {
      element.Type = value as PlanetType;
    }
    if (property === "Climate") {
      element.Climate = value as ClimateType;
    }
    if (property === "Terrain") {
      element.PlanetTerrain = value as TerrainType;
    }
    if (property === "Population") {
      element.Population = value as PopulationType;
    }
    if (property === "PopulationInfo") {
      element.PopulationInfo = value as string;
    }
    if (property === "Resources") {
      element.Resources = value as ResourceType;
      element.Planet_Is_Mining_Colony = element.Resources === "High" ? "Yes" : "No";
    }
    if (property === "Affiliation") {
      element.Affiliation = value as string[];
    }
    if (property === "Special") {
      element.Special = value as string[];
    }

    this.calculatePlanetEffects(element);
    this.planetsService.updatePlanet(element);
  }

  getAbilitiesList(abilities: AbilitiesList | undefined) {
    if (!abilities) {
      return [];
    }
    const abilityNames: string[] = [];
    if (abilities.Reduce_Production_Price_Ability) {
      if (abilities.Reduce_Production_Price_Ability instanceof Array) {
        abilityNames.push(...abilities.Reduce_Production_Price_Ability.map((x) => x["@_Name"]));
      } else {
        abilityNames.push(abilities.Reduce_Production_Price_Ability["@_Name"]);
      }
    }
    if (abilities.Reduce_Production_Time_Ability) {
      if (abilities.Reduce_Production_Time_Ability instanceof Array) {
        abilityNames.push(...abilities.Reduce_Production_Time_Ability.map((x) => x["@_Name"]));
      } else {
        abilityNames.push(abilities.Reduce_Production_Time_Ability["@_Name"]);
      }
    }
    return abilityNames;
  }

  private calculatePlanetEffects(planet: Planet) {
    if (!this.config) {
      return;
    }

    let income = 0;
    let popCap = 0;
    let conqueringCosts = 0;

    const ProductionPriceAbilities: ReduceProductionPriceAbility[] = [];
    const ProductionTimeAbilities: ReduceProductionTimeAbility[] = [];

    if (planet.Type) {
      const planetTypeEffects = this.config.planetTypeEffects[planet.Type];
      if (!planetTypeEffects) {
        console.log("Planet " + planet["@_Name"] + ": Type " + planet.Type + " is missing in config");
        return;
      }

      income += planetTypeEffects.income ?? 0;
      popCap += planetTypeEffects.popCap ?? 0;
      conqueringCosts += planetTypeEffects.conqueringCosts ?? 0;
      if (planetTypeEffects.abilities) {
        for (const ability of planetTypeEffects.abilities) {
          const effect = this.effectEditorService.getEffect(ability);
          if (effect) {
            switch (effect.type) {
              case "ProductionPrice":
                ProductionPriceAbilities.push(effect);
                break;
              case "ProductionTime":
                ProductionTimeAbilities.push(effect);
                break;
              default:
                break;
            }
          }
        }
      }
    }

    if (planet.Population) {
      const planetPopulationEffects = this.config.planetPopulationEffects[planet.Population];
      if (!planetPopulationEffects) {
        console.log("Planet " + planet["@_Name"] + ": Population " + planet.Population + " is missing in config");
        return;
      }

      income += planetPopulationEffects.income ?? 0;
      popCap += planetPopulationEffects.popCap ?? 0;
      conqueringCosts += planetPopulationEffects.conqueringCosts ?? 0;
      if (planetPopulationEffects.abilities) {
        for (const ability of planetPopulationEffects.abilities) {
          const effect = this.effectEditorService.getEffect(ability);
          if (effect) {
            switch (effect.type) {
              case "ProductionPrice":
                ProductionPriceAbilities.push(effect);
                break;
              case "ProductionTime":
                ProductionTimeAbilities.push(effect);
                break;
              default:
                break;
            }
          }
        }
      }
    }

    if (planet.Climate) {
      const planetClimateEffects = this.config.planetClimateEffects[planet.Climate];
      if (!planetClimateEffects) {
        console.log("Planet " + planet["@_Name"] + ": Climate " + planet.Climate + " is missing in config");
        return;
      }

      income += planetClimateEffects.income ?? 0;
      popCap += planetClimateEffects.popCap ?? 0;
      conqueringCosts += planetClimateEffects.conqueringCosts ?? 0;
      if (planetClimateEffects.abilities) {
        for (const ability of planetClimateEffects.abilities) {
          const effect = this.effectEditorService.getEffect(ability);
          if (effect) {
            switch (effect.type) {
              case "ProductionPrice":
                ProductionPriceAbilities.push(effect);
                break;
              case "ProductionTime":
                ProductionTimeAbilities.push(effect);
                break;
              default:
                break;
            }
          }
        }
      }
    }

    if (planet.PlanetTerrain) {
      const planetTerrainEffects = this.config.planetTerrainEffects[planet.PlanetTerrain];
      if (!planetTerrainEffects) {
        console.log("Planet " + planet["@_Name"] + ": Terrain " + planet.PlanetTerrain + " is missing in config");
        return;
      }

      income += planetTerrainEffects.income ?? 0;
      popCap += planetTerrainEffects.popCap ?? 0;
      conqueringCosts += planetTerrainEffects.conqueringCosts ?? 0;
      if (planetTerrainEffects.abilities) {
        for (const ability of planetTerrainEffects.abilities) {
          const effect = this.effectEditorService.getEffect(ability);
          if (effect) {
            switch (effect.type) {
              case "ProductionPrice":
                ProductionPriceAbilities.push(effect);
                break;
              case "ProductionTime":
                ProductionTimeAbilities.push(effect);
                break;
              default:
                break;
            }
          }
        }
      }
    }

    if (planet.Special) {
      for (const special of planet.Special) {
        const planetSpecialEffects = this.config.planetSpecialEffects[special];
        if (!planetSpecialEffects) {
          console.log("Planet " + planet["@_Name"] + ": Special " + special + " is missing in config");
          return;
        }

        income += planetSpecialEffects.income ?? 0;
        popCap += planetSpecialEffects.popCap ?? 0;
        conqueringCosts += planetSpecialEffects.conqueringCosts ?? 0;
        if (planetSpecialEffects.abilities) {
          for (const ability of planetSpecialEffects.abilities) {
            const effect = this.effectEditorService.getEffect(ability);
            if (effect) {
              switch (effect.type) {
                case "ProductionPrice":
                  ProductionPriceAbilities.push(effect);
                  break;
                case "ProductionTime":
                  ProductionTimeAbilities.push(effect);
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
    }

    if (planet.Type) {
      planet.Planet_Credit_Value = income;
      planet.Additional_Population_Capacity = popCap;
      planet.Planet_Capture_Bonus_Reward = conqueringCosts;

      const abilities: AbilitiesList = { "@_SubObjectList": "Yes" };
      if (ProductionPriceAbilities.length === 1) {
        abilities["Reduce_Production_Price_Ability"] = ProductionPriceAbilities[0];
      } else if (ProductionPriceAbilities.length > 1) {
        abilities["Reduce_Production_Price_Ability"] = ProductionPriceAbilities;
      }
      if (ProductionTimeAbilities.length === 1) {
        abilities["Reduce_Production_Time_Ability"] = ProductionTimeAbilities[0];
      } else if (ProductionTimeAbilities.length > 1) {
        abilities["Reduce_Production_Time_Ability"] = ProductionTimeAbilities;
      }
      planet.Abilities = abilities;
    }

    const dummyPlanetIdentifiers = this.config.dummyPlanetIdentifiers.split(";");

    if (planet.Encyclopedia_Text && !dummyPlanetIdentifiers.some((id) => planet["@_Name"].includes(id))) {
      planet.Encyclopedia_Text = this.getPlanetEncyclopediaText(planet);
    }
  }

  private getPlanetEncyclopediaText(planet: Planet): string {
    const planetSuffix = "_WW";
    const spacing = "TEXT_LINE";
    const planetName = this.codifyString(planet["@_Name"]).slice(0, -planetSuffix.length);
    const planetDesc = `PLANET_${planetName}_DESC`;

    let result = "";

    if (planet.Type && planet.Type !== "Planet") {
      result += `PLANET_TYPE_${this.codifyString(planet.Type)}` + "\n";
      if (planet.Type === "Sector" || planet.Type === "System") {
        result += `CAPITAL_PLANET_${planetName}` + "\n" + spacing + "\n";
      } else {
        result += spacing + "\n";
      }
    }

    let planetEffects = "";
    if (planet.Climate) {
      planetEffects += `CLIMATE_${this.codifyString(planet.Climate)}`;
    }
    if (planet.PlanetTerrain) {
      if (planetEffects) {
        planetEffects += "\n";
      }
      planetEffects += `TERRAIN_${this.codifyString(planet.PlanetTerrain)}`;
    }
    if (planet.Population) {
      if (planetEffects) {
        planetEffects += "\n";
      }
      planetEffects += `POPULATION_${this.codifyString(planet.Population)}`;
    }
    if (planet.Resources) {
      if (planetEffects) {
        planetEffects += "\n";
      }
      planetEffects += `RESOURCES_${this.codifyString(planet.Resources)}`;
    }

    if (planetEffects) {
      result += planetEffects + "\n" + spacing + "\n";
    }

    let planetSpecials = "";
    if (planet.Special) {
      for (const special of planet.Special) {
        if (planetSpecials) {
          planetSpecials += "\n";
        }
        planetSpecials += `PLANET_SPECIAL_${this.codifyString(special)}`;
      }
    }

    if (planetSpecials) {
      result += planetSpecials + "\n" + spacing + "\n";
    }

    return result + planetDesc;
  }

  private codifyString(string: string) {
    return string.toUpperCase().replace("(", "").replace(")", "").replace(/\s/g, "_");
  }
}
