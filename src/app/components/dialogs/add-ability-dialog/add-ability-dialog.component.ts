import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Ability, abilityTypes } from "src/app/models";
import { EffectEditorService } from "../../effect-editor/effect-editor.service";

@Component({
  selector: "app-add-ability-dialog",
  templateUrl: "./add-ability-dialog.component.html",
  styleUrls: ["./add-ability-dialog.component.sass"],
})
export class AddAbilityDialogComponent implements OnInit {
  ability: Ability = {
    "@_Name": "",
    type: "ProductionPrice",
    Price_Reduction_Percentage: 0,
  };

  abilityTypes = abilityTypes;

  constructor(public dialogRef: MatDialogRef<AddAbilityDialogComponent>, private effectEditorService: EffectEditorService) {}

  ngOnInit(): void {}

  onCancelClicked() {
    this.dialogRef.close();
  }

  onConfirmClicked() {
    this.effectEditorService.addEffect(this.ability);
    this.dialogRef.close();
  }
}
