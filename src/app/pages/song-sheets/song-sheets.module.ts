import { NgModule } from '@angular/core';

import { SongSheetsRoutingModule } from './song-sheets-routing.module';
import { SongSheetsComponent } from './song-sheets/song-sheets.component';
import {ShareModule} from '../../shared/share.module';
import {WyComponentsModule} from '../../wy-ui/wy-components/wy-components.module';


@NgModule({
  declarations: [
    SongSheetsComponent,
  ],
  imports: [
    ShareModule,
    WyComponentsModule,
    SongSheetsRoutingModule
  ]
})
export class SongSheetsModule { }
