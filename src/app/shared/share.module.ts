import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ZorroAntdModule} from './zorro-antd/zorro-antd.module';
import {PipesModule} from './pipes/pipes.module';
import {DirectivesModule} from './directives/directives.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ZorroAntdModule,
    PipesModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ZorroAntdModule,
    PipesModule,
    DirectivesModule
  ]
})
/*
* 放业务性不强 但频繁需要引入的模块
* */
export class ShareModule {
}
