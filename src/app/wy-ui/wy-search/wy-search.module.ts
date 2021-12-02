import {NgModule} from '@angular/core';
import {WySearchComponent} from './wy-search.component';
import {ShareModule} from '../../shared/share.module';
import {WySearchPanelComponent} from './wy-search-panle/wy-search-panel.component';
import {OverlayModule} from '@angular/cdk/overlay';


@NgModule({
  declarations: [
    WySearchComponent,
    WySearchPanelComponent,
  ],
  entryComponents: [WySearchPanelComponent],
  imports: [
    ShareModule,
    OverlayModule
  ],
  exports: [WySearchComponent]
})
export class WySearchModule {
}
