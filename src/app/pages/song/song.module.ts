import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SongRoutingModule } from './song-routing.module';
import { SongInfoComponent } from './song-info/song-info.component';
import {ShareModule} from '../../shared/share.module';


@NgModule({
  declarations: [
    SongInfoComponent
  ],
  imports: [
    ShareModule,
    SongRoutingModule
  ]
})
export class SongModule { }
