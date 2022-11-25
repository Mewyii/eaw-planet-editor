export const abilityTypes = ["ProductionPrice", "ProductionTime"] as const;
export type AbilityType = typeof abilityTypes[number];

export interface AbilityBase {
  "@_Name": string;
  Applicable_Unit_Categories?: string;
  Applicable_Unit_Types?: string;
  Stacking_Category?: number;
  type?: AbilityType;
}

export interface ReduceProductionPriceAbility extends AbilityBase {
  type?: "ProductionPrice";
  Price_Reduction_Percentage: number;
}

export interface ReduceProductionTimeAbility extends AbilityBase {
  type?: "ProductionTime";
  Time_Reduction_Percentage: number;
}

export type Ability = ReduceProductionPriceAbility | ReduceProductionTimeAbility;

export interface AbilitiesList {
  "@_SubObjectList": "Yes";
  Reduce_Production_Price_Ability?: ReduceProductionPriceAbility | ReduceProductionPriceAbility[];
  Reduce_Production_Time_Ability?: ReduceProductionTimeAbility | ReduceProductionTimeAbility[];
}
