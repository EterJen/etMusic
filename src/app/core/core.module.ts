import {NgModule, Optional, SkipSelf} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from '../app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PagesModule} from '../pages/pages.module';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';
import {ShareModule} from '../shared/share.module';
import {ServiceModule} from '../services/service.module';
import {AppStoreModule} from '../app-store/app-store.module';
import {WyUiModule} from '../wy-ui/wy-ui.module';


registerLocaleData(zh);

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ShareModule,
    AppStoreModule,
    ServiceModule,
    PagesModule,
    AppRoutingModule,
    WyUiModule,
  ],
  exports: [
    AppRoutingModule,
    /*
    * 模块化使项目结构清晰，便于管理，理解，修改维护，提高代码重用性
    * 组件所在模块存在依赖 则需要从导入模块中存在链式导出 或至组件所在模块显式导入
    * 举例说明:
    * AppComponent(位于AppModule模块) 组件为应用启动组件 其页面调用了app-wy-player组件
    * app-wy-player组件位于WyPlayerModule模块
    * 如果不显示在AppModule 引入 WyPlayerModule模块 (非必要显示导入破坏模块化思想 不建议使用)
    * 则需存在链式导出:
    * WyPlayerModule exp WyPlayerComponent(组件 app-wy-player)
    * WyUiModule exp WyPlayerModule
    * CoreModule exp WyUiModule
    * AppModule imp CoreModule
    * */
    ShareModule,
    WyUiModule,
  ],
  providers: [{provide: NZ_I18N, useValue: zh_CN}],
})
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('coreModule 只能被 appModule 引入。');
    }
  }
}
