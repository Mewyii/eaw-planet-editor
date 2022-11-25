import { Component } from "@angular/core";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { ConfigurationService } from "./components";
import { EffectEditorService } from "./components/effect-editor/effect-editor.service";
import { PlanetsService } from "./components/planets/planets.service";
import { Ability, Config, PlanetFile } from "./models";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"],
})
export class AppComponent {
  constructor(
    public planetsService: PlanetsService,
    private configService: ConfigurationService,
    private effectEditorService: EffectEditorService
  ) {}

  onPlanetsFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const fr = new FileReader();
    fr.onload = (event) => {
      const content = (event.target as FileReader).result;
      if (typeof content === "string") {
        const parser = new XMLParser({
          ignoreAttributes: false,
          parseAttributeValue: true,
        });
        const planetFile = parser.parse(content) as PlanetFile;
        this.planetsService.setPlanetFile(planetFile);
      }
    };

    fr.readAsText(file);
  }

  onExportFileClicked() {
    const builder = new XMLBuilder({ ignoreAttributes: false });
    let xmlDataStr = builder.build(this.planetsService.getExportReadyPlanetFile());

    let newFile = new Blob([xmlDataStr], { type: ".xml" });

    const downloadAncher = document.createElement("a");

    const fileURL = URL.createObjectURL(newFile);
    downloadAncher.href = fileURL;
    downloadAncher.download = "Planets_WW.xml";
    downloadAncher.click();
    downloadAncher.remove();
  }

  onSettingsFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const fr = new FileReader();
    fr.onload = (event) => {
      const content = (event.target as FileReader).result;
      if (typeof content === "string") {
        const settings = JSON.parse(content) as { config: Config; effects: Ability[] };
        this.effectEditorService.updateEffects(settings.effects);
        this.configService.updateConfig(settings.config);
      }
    };

    fr.readAsText(file);
  }

  onSaveSettingsClicked() {
    const config = this.configService.config;
    const effects = this.effectEditorService.effects;
    const settings = { config, effects };

    let newFile = new Blob([JSON.stringify(settings)], { type: "text/plain" });

    const downloadAncher = document.createElement("a");

    const fileURL = URL.createObjectURL(newFile);
    downloadAncher.href = fileURL;
    downloadAncher.download = "planet_editor_settings.json";
    downloadAncher.click();
    downloadAncher.remove();
  }
}
