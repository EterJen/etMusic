import {NgModule} from '@angular/core';
import {PipesModule} from '../shared/pipes/pipes.module';
import {WyComponentsModule} from './wy-components/wy-components.module';
import {WyPlayerModule} from './wy-player/wy-player.module';
import {ShareModule} from '../shared/share.module';


@NgModule({
  declarations: [],
  imports: [
    WyComponentsModule,
    ShareModule,
    WyPlayerModule
  ],
  exports: [
    WyComponentsModule, // 其中组件会被其他模块使用 需要导出
    WyPlayerModule
  ]
})
export class WyUiModule {
}
