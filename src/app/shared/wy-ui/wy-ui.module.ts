import {NgModule} from '@angular/core';
import {PipesModule} from '../pipes/pipes.module';
import {WyComponentsModule} from './wy-components/wy-components.module';
import {WyPlayerModule} from './wy-player/wy-player.module';
import { WySliderComponent } from './wy-slider/wy-slider.component';


@NgModule({
  declarations: [
  ],
  imports: [
    PipesModule,
    WyComponentsModule,
    WyPlayerModule
  ],
  exports: [
    PipesModule,
    WyComponentsModule,
    WyPlayerModule
  ]
})
export class WyUiModule {
}
