import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BetterScrollComponent } from './better-scroll/better-scroll.component';



@NgModule({
  declarations: [
    BetterScrollComponent
  ],
  exports: [
    BetterScrollComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
