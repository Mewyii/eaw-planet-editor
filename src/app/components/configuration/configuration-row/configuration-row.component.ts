import { KeyValue } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Config, PlanetEffect } from "src/app/models";

@Component({
  selector: "app-configuration-row [key]",
  templateUrl: "./configuration-row.component.html",
  styleUrls: ["./configuration-row.component.sass"],
})
export class ConfigurationRowComponent implements OnInit {
  @Input() effects: string[] = [];
  @Input() key!: string;
  @Input() planetEffect!: PlanetEffect;

  @Output() planetEffectChange = new EventEmitter<PlanetEffect>();

  @Output() onPlanetEffectChange = new EventEmitter();
  @Output() planetEffectDelete = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
}
