import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ZorroAntdModule} from '../zorro-antd/zorro-antd.module';
import {WyUiModule} from './wy-ui/wy-ui.module';
import {PipesModule} from './pipes/pipes.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ZorroAntdModule,
    WyUiModule,
    PipesModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ZorroAntdModule,
    WyUiModule,
    PipesModule,
  ]
})
export class ShareModule {
}
