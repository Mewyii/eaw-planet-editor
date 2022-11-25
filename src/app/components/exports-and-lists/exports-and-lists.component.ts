import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Planet, population, resources, ResourceType, terrains, TerrainType } from "src/app/models";
import { ConfigurationService } from "../configuration/configuration.service";
import { PlanetsService } from "../planets/planets.service";

@Component({
  selector: "app-exports-and-lists",
  templateUrl: "./exports-and-lists.component.html",
  styleUrls: ["./exports-and-lists.component.sass"],
})
export class ExportsAndListsComponent implements OnInit {
  farmingPlanetIdentifiers: TerrainType[] = ["Mixed", "Grasslands", "Forested", "Barren", "Islands", "Jungle", "Ruins"];
  miningPlanetIdentifiers: ResourceType[] = ["Medium", "High"];

  resources = resources;
  populations = population;
  terrains = terrains;
  specials: string[] = [];
  affiliations: string[] = [];

  selectedResources: string[] = [];
  selectedPopulations: string[] = [];
  selectedSpecials: string[] = [];
  selectedAffiliations: string[] = [];
  selectedTerrains: string[] = [];

  filteredPlanets: string[] = [];

  constructor(
    private configService: ConfigurationService,
    private planetsService: PlanetsService,
    private snackBarService: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.planetsService.filteredPlanets$.subscribe((planets) => {
      this.filteredPlanets = planets.map((x) => x["@_Name"]);
    });

    this.configService.config$.subscribe((config) => {
      this.affiliations = config.planetAffiliations.split(";");
      this.specials = Object.keys(config.planetSpecialEffects);
    });
  }

  onShowAllPlanetsClicked() {
    this.planetsService.removePlanetFilters();
  }

  onCopyTextToClipboardCommaSeperatedClicked() {
    navigator.clipboard.writeText(this.filteredPlanets.join(", "));
    this.snackBarService.open("Copied!");
  }

  onCopyTextToClipboardLuaTableClicked() {
    navigator.clipboard.writeText(this.filteredPlanets.join(", "));
    this.snackBarService.open("Copied!");
  }

  onCopyTextToClipboardAIEqationsClicked() {
    navigator.clipboard.writeText('Parameter_Type = "' + this.filteredPlanets.join('", \nParameter_Type = "') + '"');
    this.snackBarService.open("Copied!");
  }

  onSelectionChanged(property: keyof Planet, value: unknown) {
    if (property === "Affiliation") {
      this.selectedAffiliations = value as string[];
    }
    if (property === "Special") {
      this.selectedSpecials = value as string[];
    }
    if (property === "Resources") {
      this.selectedResources = value as string[];
    }
    if (property === "Population") {
      this.selectedPopulations = value as string[];
    }
    if (property === "Terrain") {
      this.selectedTerrains = value as string[];
    }

    const filterFunction = (planet: Planet) => {
      if (this.selectedResources.length > 0) {
        if (!this.selectedResources.some((x) => planet.Resources === x)) {
          return false;
        }
      }
      if (this.selectedPopulations.length > 0) {
        if (!this.selectedPopulations.some((x) => planet.Population === x)) {
          return false;
        }
      }
      if (this.selectedTerrains.length > 0) {
        if (!this.selectedTerrains.some((x) => planet.PlanetTerrain === x)) {
          return false;
        }
      }
      if (this.selectedAffiliations.length > 0) {
        if (!this.selectedAffiliations.every((x) => planet.Affiliation?.includes(x))) {
          return false;
        }
      }
      if (this.selectedSpecials.length > 0) {
        if (!this.selectedSpecials.every((x) => planet.Special?.includes(x))) {
          return false;
        }
      }
      return true;
    };

    this.planetsService.filterPlanets(filterFunction);
  }
}
