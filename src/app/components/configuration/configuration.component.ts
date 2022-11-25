import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Config } from "src/app/models";
import { AddSpecialEffectDialogComponent } from "../dialogs/add-special-effect-dialog/add-special-effect-dialog.component";
import { ConfirmDialogComponent } from "../dialogs/confirm-dialog/confirm-dialog.component";
import { EffectEditorService } from "../effect-editor/effect-editor.service";
import { PlanetsService } from "../planets/planets.service";
import { ConfigurationService } from "./configuration.service";

@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.sass"],
})
export class ConfigurationComponent implements OnInit {
  config: Config | undefined;
  effects: string[] = [];

  constructor(
    private configService: ConfigurationService,
    private planetsService: PlanetsService,
    private effectEditorService: EffectEditorService,
    private dialog: MatDialog
  ) {
    configService.config$.subscribe((config) => {
      this.config = { ...config };
    });
    effectEditorService.effectNames$.subscribe((effects) => {
      this.effects = effects;
    });
  }

  ngOnInit(): void {}

  onPlanetEffectChanged() {
    if (this.config) {
      this.configService.updateConfig(this.config);
    }
  }

  onPlanetPopulationEffectChanged() {
    if (this.config) {
      this.configService.updateConfig(this.config);
    }
  }

  onDummyPlanetIdentifiersChanged() {
    if (this.config) {
      this.configService.updateConfig(this.config);
    }
  }

  onPlanetAffiliationsChanged() {
    if (this.config) {
      this.configService.updateConfig(this.config);
    }
  }

  onAddPlanetEffectClicked() {
    this.dialog.open(AddSpecialEffectDialogComponent);
  }

  onDeletePlanetEffectClicked(type: string, id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent);
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.configService.removeEffect("special", id);
        this.planetsService.removeSpecialFromPlanets(id);
      }
    });
  }
}
