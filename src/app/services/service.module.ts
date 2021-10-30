import {InjectionToken, NgModule, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

export const WINDOW = new InjectionToken('WINDOW_TOKEN');


@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {
      /*
      * 注入window对象 跨平台支持
      * */
      provide: WINDOW,
      useFactory(platformId: object): Window | {} {
        return isPlatformBrowser(platformId) ? window : {};
      },
      deps: [PLATFORM_ID] // 由框架整合
    }
  ]
})
export class ServiceModule {
}
