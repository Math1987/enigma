import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloorPipe } from '../../pipes/floor.pipe';



@NgModule({
  declarations: [
    FloorPipe
  ],
  imports: [
    CommonModule
  ],
  exports : [
    FloorPipe
  ]
})
export class EnigmaModule { }
