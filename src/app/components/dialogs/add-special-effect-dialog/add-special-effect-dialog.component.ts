import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { PlanetEffect } from "src/app/models";
import { ConfigurationService } from "../../configuration/configuration.service";
import { EffectEditorService } from "../../effect-editor/effect-editor.service";

@Component({
  selector: "app-add-special-effect-dialog",
  templateUrl: "./add-special-effect-dialog.component.html",
  styleUrls: ["./add-special-effect-dialog.component.sass"],
})
export class AddSpecialEffectDialogComponent implements OnInit {
  name = "";
  effect: PlanetEffect = {};

  effects: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddSpecialEffectDialogComponent>,
    private effectEditorService: EffectEditorService,
    private configService: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.effectEditorService.effectNames$.subscribe((effects) => {
      this.effects = effects;
    });
  }

  onCancelClicked() {
    this.dialogRef.close();
  }

  onConfirmClicked() {
    this.configService.addEffect("special", this.name, this.effect);
    this.dialogRef.close();
  }
}
