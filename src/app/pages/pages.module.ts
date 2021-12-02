import {NgModule} from '@angular/core';
import {HomeModule} from './home/home.module';
import {SheetModule} from './sheet/sheet.module';
import {SongModule} from './song/song.module';
import {SignerModule} from './signer/signer.module';


@NgModule({
  declarations: [],
  imports: [
    HomeModule,
    SheetModule,
    SongModule,
    SignerModule
  ]
})
export class PagesModule {
}
