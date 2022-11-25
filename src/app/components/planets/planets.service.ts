import { Injectable } from "@angular/core";
import { cloneDeep } from "lodash";
import { BehaviorSubject } from "rxjs";
import { ClimateType, Planet, PlanetFile, PlanetType, PopulationType, ResourceType, TerrainType } from "../../models";

@Injectable({ providedIn: "root" })
export class PlanetsService {
  private planetFileSubject = new BehaviorSubject<PlanetFile>({ Planets: { Planet: [] } });
  planetFile$ = this.planetFileSubject.asObservable();

  private filteredPlanetsSubject = new BehaviorSubject<Planet[]>([]);
  filteredPlanets$ = this.filteredPlanetsSubject.asObservable();

  filterFunction: (x: Planet) => boolean = () => true;

  get planetFile() {
    return this.planetFileSubject.getValue();
  }

  get filteredPlanets() {
    return this.filteredPlanetsSubject.getValue();
  }

  get allPlanets() {
    return this.planetFileSubject.getValue().Planets.Planet;
  }

  public getExportReadyPlanetFile() {
    const file = cloneDeep(this.planetFile);
    return this.getCleanedUpPlanetFile(file);
  }

  updatePlanet(updatedPlanet: Planet) {
    updatedPlanet["@_Description"] = this.getUpdatedDescriptionForPlanet(updatedPlanet);

    const file = this.planetFile;
    const index = file.Planets.Planet.findIndex((x) => x["@_Name"] === updatedPlanet["@_Name"]);
    if (index > -1) {
      file.Planets.Planet[index] = { ...file.Planets.Planet[index], ...updatedPlanet };
    }
    this.planetFileSubject.next(file);
    this.filteredPlanetsSubject.next(this.getFilteredPlanets(file));
  }

  //   addPlanet(planet: Ability) {
  //     this.planetsSubject.next([...this.planets, planet]);
  //   }

  removePlanet(name: string) {
    const file = this.planetFile;
    file.Planets.Planet = this.planetFile.Planets.Planet.filter((el) => el["@_Name"] !== name);
    const filteredPlanets = this.filteredPlanets.filter((el) => el["@_Name"] !== name);
    this.planetFileSubject.next(file);
    this.filteredPlanetsSubject.next(filteredPlanets);
  }

  setPlanetFile(planetFile: PlanetFile) {
    this.addDescriptionPropertiesToPlanets(planetFile.Planets.Planet);

    this.planetFileSubject.next(planetFile);
    this.filteredPlanetsSubject.next(this.planetFile.Planets.Planet);
  }

  filterPlanets(filterFunction: (x: Planet) => boolean) {
    this.filterFunction = filterFunction;
    this.filteredPlanetsSubject.next(this.getFilteredPlanets(this.planetFile));
  }

  removePlanetFilters() {
    this.filterFunction = () => true;
    this.filteredPlanetsSubject.next(this.getFilteredPlanets(this.planetFile));
  }

  removeSpecialFromPlanets(specialId: string) {
    const file = this.planetFile;
    file.Planets.Planet = this.planetFile.Planets.Planet.map((x) => ({
      ...x,
      Special: x.Special?.filter((special) => special !== specialId),
    }));

    this.planetFileSubject.next(file);
    this.filteredPlanetsSubject.next(this.getFilteredPlanets(file));
  }

  private getFilteredPlanets(file: PlanetFile) {
    return this.planetFile.Planets.Planet.filter(this.filterFunction);
  }

  private getUpdatedDescriptionForPlanet(planet: Planet) {
    let description = "";
    if (planet.Type) {
      description += `Type: ${planet.Type}`;
    }
    if (planet.Climate) {
      if (description.length > 0) {
        description += ", ";
      }
      description += `Climate: ${planet.Climate}`;
    }
    if (planet.Population) {
      if (description.length > 0) {
        description += ", ";
      }
      description += `Population: ${planet.Population}`;

      if (planet.PopulationInfo) {
        description += ` (${planet.PopulationInfo})`;
      }
    }
    if (planet.Resources) {
      if (description.length > 0) {
        description += ", ";
      }
      description += `Resources: ${planet.Resources}`;
    }
    if (planet.Affiliation) {
      if (description.length > 0) {
        description += ", ";
      }
      description += `Affiliation: ${planet.Affiliation.join("; ")}`;
    }
    if (planet.PlanetTerrain) {
      if (description.length > 0) {
        description += ", ";
      }
      description += `Terrain: ${planet.PlanetTerrain}`;
    }
    if (planet.Special) {
      if (description.length > 0) {
        description += ", ";
      }
      description += `Special: ${planet.Special.join("; ")}`;
    }

    return description;
  }

  private addDescriptionPropertiesToPlanets(planets: Planet[]) {
    for (const planet of planets) {
      if (planet["@_Description"]) {
        const descriptionProps = planet["@_Description"].split(", ");

        const typeIdentifier = "Type: ";
        planet.Type = descriptionProps
          .find((x) => x.includes(typeIdentifier))
          ?.substring(typeIdentifier.length) as PlanetType;

        const climateIdentifier = "Climate: ";
        planet.Climate = descriptionProps
          .find((x) => x.includes(climateIdentifier))
          ?.substring(climateIdentifier.length) as ClimateType;

        const populationIdentifierStart = "Population: ";
        const populationIdentifierEnd = " (";
        const populationDesc = descriptionProps.find((x) => x.includes(populationIdentifierStart));

        if (populationDesc) {
          const populationIdentifierEndIndex = populationDesc.indexOf(populationIdentifierEnd);

          if (populationIdentifierEndIndex > -1) {
            planet.Population = populationDesc.substring(
              populationIdentifierStart.length,
              populationIdentifierEndIndex
            ) as PopulationType;
            planet.PopulationInfo = populationDesc.substring(populationIdentifierEndIndex + 2, populationDesc.length - 1);
          } else {
            planet.Population = populationDesc.substring(populationIdentifierStart.length) as PopulationType;
          }
        }

        const resourcesIdentifier = "Resources: ";
        planet.Resources = descriptionProps
          .find((x) => x.includes(resourcesIdentifier))
          ?.substring(resourcesIdentifier.length) as ResourceType;

        const affiliationIdentifier = "Affiliation: ";
        const affiliationContent = descriptionProps
          .find((x) => x.includes(affiliationIdentifier))
          ?.substring(affiliationIdentifier.length);
        planet.Affiliation = affiliationContent?.split(";").map((x) => x.trim());

        const terrainIdentifier = "Terrain: ";
        planet.PlanetTerrain = descriptionProps
          .find((x) => x.includes(terrainIdentifier))
          ?.substring(terrainIdentifier.length) as TerrainType;

        const specialIdentifier = "Special: ";
        const specialContent = descriptionProps
          .find((x) => x.includes(specialIdentifier))
          ?.substring(specialIdentifier.length);
        planet.Special = specialContent?.split(";").map((x) => x.trim());
      }
    }
  }

  private getCleanedUpPlanetFile(file: PlanetFile) {
    const planets = file.Planets.Planet;
    for (const planet of planets) {
      delete planet["Type"];
      delete planet["Climate"];
      delete planet["Resources"];
      delete planet["Population"];
      delete planet["PopulationInfo"];
      delete planet["PlanetTerrain"];
      delete planet["Special"];
      delete planet["Affiliation"];

      const priceReductionAbility = planet.Abilities?.Reduce_Production_Price_Ability;
      if (priceReductionAbility) {
        if (priceReductionAbility instanceof Array) {
          for (const ability of priceReductionAbility) {
            delete ability["type"];
          }
        } else {
          delete priceReductionAbility["type"];
        }
      }

      const timeReductionAbility = planet.Abilities?.Reduce_Production_Time_Ability;
      if (timeReductionAbility) {
        if (timeReductionAbility instanceof Array) {
          for (const ability of timeReductionAbility) {
            delete ability["type"];
          }
        } else {
          delete timeReductionAbility["type"];
        }
      }
    }

    return file;
  }
}
