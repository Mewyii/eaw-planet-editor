import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";

import { ConfigurationComponent } from "./components/configuration/configuration.component";
import { EffectEditorComponent } from "./components/effect-editor/effect-editor.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AddAbilityDialogComponent } from "./components/dialogs/add-ability-dialog/add-ability-dialog.component";
import { ConfirmDialogComponent } from "./components/dialogs/confirm-dialog/confirm-dialog.component";
import { PlanetsComponent } from "./components/planets/planets.component";
import { ConfigurationRowComponent } from "./components/configuration/configuration-row/configuration-row.component";
import { AddSpecialEffectDialogComponent } from "./components/dialogs/add-special-effect-dialog/add-special-effect-dialog.component";
import { ExportsAndListsComponent } from "./components/exports-and-lists/exports-and-lists.component";

@NgModule({
  declarations: [
    AppComponent,
    ConfigurationComponent,
    EffectEditorComponent,
    AddAbilityDialogComponent,
    ConfirmDialogComponent,
    PlanetsComponent,
    ConfigurationRowComponent,
    AddSpecialEffectDialogComponent,
    ExportsAndListsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatCardModule,
    NgxChartsModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSnackBarModule,
  ],
  providers: [{ provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } }],
  bootstrap: [AppComponent],
})
export class AppModule {}
