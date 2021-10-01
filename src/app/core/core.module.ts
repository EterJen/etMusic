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


registerLocaleData(zh);

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ShareModule,
    ServiceModule,
    PagesModule,
    AppRoutingModule,
  ],
  exports: [
    AppRoutingModule,
    ShareModule
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
