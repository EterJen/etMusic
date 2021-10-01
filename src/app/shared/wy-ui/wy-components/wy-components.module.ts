import {NgModule} from '@angular/core';
import {SingleSheetComponent} from './single-sheet/single-sheet.component';
import {PipesModule} from '../../pipes/pipes.module';


@NgModule({
  declarations: [SingleSheetComponent],
  imports: [
    PipesModule
  ],
  exports: [
    SingleSheetComponent
  ]
})
export class WyComponentsModule {
}
