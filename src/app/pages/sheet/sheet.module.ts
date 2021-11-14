import { NgModule } from '@angular/core';

import { SheetRoutingModule } from './sheet-routing.module';
import { SheetListComponent } from './sheet-list/sheet-list.component';
import {ShareModule} from '../../shared/share.module';
import {WyComponentsModule} from '../../wy-ui/wy-components/wy-components.module';
import { SheetInfoComponent } from './sheet-info/sheet-info.component';


@NgModule({
  declarations: [
    SheetListComponent,
    SheetInfoComponent,
  ],
  imports: [
    ShareModule,
    WyComponentsModule,
    SheetRoutingModule
  ]
})
export class SheetModule { }
