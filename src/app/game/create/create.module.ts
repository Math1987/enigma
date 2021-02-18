import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CreateRouting } from './create.routes';
import { MatRadioModule } from '@angular/material/radio' ;
import { CreateComponent } from './create.component';



@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    CreateRouting,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule
  ]
})
export class CreateModule { }
