import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnexionComponent } from './connexion.component';
import { ConnexionRoutes } from './connexion.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input' ;
import { MatButtonModule } from '@angular/material/button'


@NgModule({
  declarations: [ConnexionComponent],
  imports: [
    CommonModule,
    ConnexionRoutes,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ConnexionModule { }
