import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Ability, abilityTypes } from "src/app/models";
import { AddAbilityDialogComponent } from "../dialogs/add-ability-dialog/add-ability-dialog.component";
import { ConfirmDialogComponent } from "../dialogs/confirm-dialog/confirm-dialog.component";
import { EffectEditorService } from "./effect-editor.service";

@Component({
  selector: "app-effect-editor",
  templateUrl: "./effect-editor.component.html",
  styleUrls: ["./effect-editor.component.sass"],
})
export class EffectEditorComponent implements OnInit {
  effects: Ability[] = [];
  abilityTypes = abilityTypes;

  constructor(private effectEditorService: EffectEditorService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.effectEditorService.effects$.subscribe((effects) => {
      this.effects = effects;
    });
  }

  onEffectChanged() {
    this.effectEditorService.updateEffects(this.effects);
  }

  onAddEffectClicked() {
    this.dialog.open(AddAbilityDialogComponent);
  }

  onDeleteEffectClicked(effect: Ability) {
    const ref = this.dialog.open(ConfirmDialogComponent);
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.effectEditorService.removeEffect(effect["@_Name"]);
      }
    });
  }
}
