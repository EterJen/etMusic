import { NgModule } from '@angular/core';

import { SignerRoutingModule } from './signer-routing.module';
import {ShareModule} from '../../shared/share.module';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';


@NgModule({
  declarations: [
    SingerDetailComponent
  ],
  imports: [
    ShareModule,
    SignerRoutingModule
  ]
})
export class SignerModule { }
