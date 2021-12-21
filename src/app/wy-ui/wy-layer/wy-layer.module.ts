import { NgModule } from '@angular/core';
import {ShareModule} from '../../shared/share.module';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { WyLayerLoginComponent } from './wy-layer-login/wy-layer-login.component';



/*
* 相关命令
* cd /media/data/eter/workspace/git/ngWyy/etMusic/src/app/wy-ui
* ng g m wyLayer
* cd /media/data/eter/workspace/git/ngWyy/etMusic/src/app/wy-ui/wy-layer
* ng g c wyLayerLogin -c=OnPush --export
* */
@NgModule({
  declarations: [
    WyLayerModalComponent,
    WyLayerDefaultComponent,
    WyLayerLoginComponent,
  ],
  imports: [
    ShareModule,
  ],
  exports: [
    WyLayerModalComponent,
    WyLayerDefaultComponent,
    WyLayerLoginComponent,
  ]
})
export class WyLayerModule { }
