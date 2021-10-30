import {NgModule} from '@angular/core';
import {WyPlayerComponent} from './wy-player.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {WySliderModule} from '../wy-slider/wy-slider.module';
import { WyPlayListPanelComponent } from './wy-play-list-panel/wy-play-list-panel.component';
import {ComponentsModule} from '../../shared/components/components.module';
import {ShareModule} from '../../shared/share.module';


@NgModule({
  declarations: [WyPlayerComponent, WyPlayListPanelComponent],
  imports: [
    ShareModule,
    WySliderModule,
    ComponentsModule,
  ],
  exports: [
    WyPlayerComponent
  ]
})
export class WyPlayerModule {
}
