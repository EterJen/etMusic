import {NgModule} from '@angular/core';
import {WyPlayerComponent} from './wy-player.component';
import {PipesModule} from '../../pipes/pipes.module';
import {WySliderModule} from '../wy-slider/wy-slider.module';


@NgModule({
  declarations: [WyPlayerComponent],
  imports: [
    PipesModule,
    WySliderModule
  ],
  exports: [
    WyPlayerComponent
  ]
})
export class WyPlayerModule {
}
