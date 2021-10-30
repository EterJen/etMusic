import {NgModule} from '@angular/core';
import {HomeModule} from './home/home.module';
import {ShareModule} from '../shared/share.module';
import {WyUiModule} from '../wy-ui/wy-ui.module';
import {SongSheetsModule} from './song-sheets/song-sheets.module';


@NgModule({
  declarations: [
  ],
  imports: [
    ShareModule,
    WyUiModule,
    HomeModule,
    SongSheetsModule
  ],
})
export class PagesModule {
}
