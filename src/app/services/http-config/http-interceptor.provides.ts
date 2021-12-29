import {Provider} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {CommonInterceptor} from './interceptors/common.interceptor';

export const commonHttpInterceptorProvides: Provider[] = [
  /**
   * multi 为 true 表示可以多个拦截
   * 多个拦截时 请求顺序拦截 响应反序拦截
   */
  {provide: HTTP_INTERCEPTORS, useClass: CommonInterceptor, multi: true},
];
