import {NgModule} from '@angular/core';

import {SheetRoutingModule} from './sheet-routing.module';
import {SheetListComponent} from './sheet-list/sheet-list.component';
import {ShareModule} from '../../shared/share.module';
import {SheetInfoComponent} from './sheet-info/sheet-info.component';
import {WyUiModule} from '../../wy-ui/wy-ui.module';


@NgModule({
  declarations: [
    SheetListComponent,
    SheetInfoComponent,
  ],
  imports: [
    WyUiModule,
    ShareModule,
    SheetRoutingModule
  ]
})
export class SheetModule {
}
