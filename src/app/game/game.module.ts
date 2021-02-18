import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { GameRouting } from './game.routes';
import { CharacterComponent } from './character/character.component';
import { PantheonComponent } from './pantheon/pantheon.component';
import { CarteComponent } from './carte/carte.component';

import { MatMenuModule } from '@angular/material/menu';
import { InfoCaseComponent } from './carte/info-case/info-case.component';
import { HistoricComponent } from './carte/historic/historic.component' ;


@NgModule({
  declarations: [
    GameComponent,
    CharacterComponent,
    PantheonComponent,
    CarteComponent,
    InfoCaseComponent,
    HistoricComponent
  ],
  imports: [
    CommonModule,
    GameRouting,
    MatMenuModule
  ]
})
export class GameModule { }
