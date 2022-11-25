import { Injectable } from "@angular/core";
import { BehaviorSubject, map, skip } from "rxjs";
import { StorageService } from "src/app/core";
import { Ability } from "src/app/models";

@Injectable({ providedIn: "root" })
export class EffectEditorService {
  private storageId = "effects";

  private initialEffects: Ability[] = [
    {
      "@_Name": "Harsh_Climate_Ground_Unit_Production_Cost_Increase",
      type: "ProductionPrice",
      Stacking_Category: 0,
      Applicable_Unit_Categories: "All",
      Price_Reduction_Percentage: -0.25,
    },
    {
      "@_Name": "Harsh_Climate_Ground_Unit_Production_Speed_Decrease",
      type: "ProductionTime",
      Stacking_Category: 0,
      Applicable_Unit_Categories: "All",
      Time_Reduction_Percentage: -0.25,
    },
    {
      "@_Name": "Uninhabitable_Climate_Ground_Unit_Production_Cost_Increase",
      type: "ProductionPrice",
      Stacking_Category: 0,
      Applicable_Unit_Categories: "All",
      Price_Reduction_Percentage: -0.5,
    },
    {
      "@_Name": "Uninhabitable_Climate_Ground_Unit_Production_Speed_Decrease",
      type: "ProductionTime",
      Stacking_Category: 0,
      Applicable_Unit_Categories: "All",
      Time_Reduction_Percentage: -0.5,
    },
    {
      "@_Name": "Accessible_Terrain_Ground_Building_Production_Cost_Decrease",
      type: "ProductionPrice",
      Stacking_Category: 1,
      Applicable_Unit_Categories: "Structure",
      Price_Reduction_Percentage: 0.25,
    },
    {
      "@_Name": "Accessible_Terrain_Ground_Building_Production_Speed_Increase",
      type: "ProductionTime",
      Stacking_Category: 1,
      Applicable_Unit_Categories: "Structure",
      Time_Reduction_Percentage: 0.25,
    },
    {
      "@_Name": "Inaccessible_Terrain_Ground_Building_Production_Cost_Increase",
      type: "ProductionPrice",
      Stacking_Category: 1,
      Applicable_Unit_Categories: "Structure",
      Price_Reduction_Percentage: -0.25,
    },
    {
      "@_Name": "Inaccessible_Terrain_Ground_Building_Production_Speed_Decrease",
      type: "ProductionTime",
      Stacking_Category: 1,
      Applicable_Unit_Categories: "Structure",
      Time_Reduction_Percentage: -0.25,
    },
  ];

  private effectsSubject = new BehaviorSubject<Ability[]>(this.initialEffects);
  effects$ = this.effectsSubject.asObservable();

  effectNames$ = this.effectsSubject.asObservable().pipe(map((x) => x.map((entry) => entry["@_Name"])));

  constructor(private storageService: StorageService) {
    const storedEffects = this.storageService.getItem<Ability[]>(this.storageId);
    if (storedEffects) {
      this.effectsSubject.next(storedEffects);
    }

    this.effects$.pipe(skip(1)).subscribe((effects) => {
      this.storageService.setItem(this.storageId, effects);
    });
  }

  get effects() {
    return this.effectsSubject.getValue();
  }

  get effectNames() {
    return this.effects.map((entry) => entry["@_Name"]);
  }

  getEffect(name: string) {
    return this.effects.find((x) => x["@_Name"] === name);
  }

  updateEffects(effects: Ability[]) {
    this.effectsSubject.next(effects);
  }

  addEffect(effect: Ability) {
    this.effectsSubject.next([...this.effects, effect]);
  }

  removeEffect(name: string) {
    this.effectsSubject.next([...this.effects.filter((x) => x["@_Name"] !== name)]);
  }
}
