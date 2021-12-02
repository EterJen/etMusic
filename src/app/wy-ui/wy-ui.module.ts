import {NgModule} from '@angular/core';
import {WyComponentsModule} from './wy-components/wy-components.module';
import {WyPlayerModule} from './wy-player/wy-player.module';
import {WySearchModule} from './wy-search/wy-search.module';


@NgModule({
  exports: [
    WyComponentsModule, // 其中组件会被其他模块使用 需要导出
    WyPlayerModule,
    WySearchModule
  ],
})
export class WyUiModule {
}
