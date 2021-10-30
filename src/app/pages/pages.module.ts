import {NgModule} from '@angular/core';
import {HomeModule} from './home/home.module';
import {ShareModule} from '../shared/share.module';
import {WyUiModule} from '../wy-ui/wy-ui.module';


@NgModule({
  declarations: [
  ],
  imports: [
    ShareModule,
    WyUiModule,
    HomeModule
  ],
})
export class PagesModule {
}
