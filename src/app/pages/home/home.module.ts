import {NgModule} from '@angular/core';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {ShareModule} from '../../shared/share.module';
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';
import { MemberCardComponent } from './components/member-card/member-card.component';


@NgModule({
  declarations: [
    HomeComponent,
    WyCarouselComponent,
    MemberCardComponent
  ],
  imports: [
    HomeRoutingModule,
    ShareModule,
  ],
  providers: [
  ]
})
export class HomeModule {
}
