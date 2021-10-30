import {NgModule} from '@angular/core';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {ShareModule} from '../../shared/share.module';
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';
import { MemberCardComponent } from './components/member-card/member-card.component';
import {WyUiModule} from '../../wy-ui/wy-ui.module';


@NgModule({
  declarations: [
    HomeComponent,
    WyCarouselComponent,
    MemberCardComponent
  ],
  imports: [
    WyUiModule,
    HomeRoutingModule,
    ShareModule,
  ],
  providers: [
  ]
})
export class HomeModule {
}
