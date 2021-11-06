import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {AbpHttpConfiguration} from './abp-http-configuration';
import {Observable, of, Subject} from 'rxjs';

@Injectable()
export class AbpHttpInterceptor implements HttpInterceptor {
  constructor(private configuration: AbpHttpConfiguration) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const self = this;
    const interceptObservable: Subject<HttpEvent<any>> = new Subject();
    const modifiedRequest = this.normalizeRequestHeaders(request);
    next.handle(modifiedRequest)
      .subscribe((event) => {
        self.handleSuccessResponse(event, interceptObservable);
      }, (error) => {
        return self.handleErrorResponse(error, interceptObservable);
      });
    return interceptObservable;
  }

  protected normalizeRequestHeaders(request: HttpRequest<any>): HttpRequest<any> {
    let modifiedHeaders = new HttpHeaders();
    modifiedHeaders = request.headers.set('Pragma', 'no-cache')
      .set('Cache-Control', 'no-cache')
      .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');
    modifiedHeaders = this.addXRequestedWithHeader(modifiedHeaders);
    modifiedHeaders = this.addAuthorizationHeaders(modifiedHeaders);
    modifiedHeaders = this.addAspNetCoreCultureHeader(modifiedHeaders);
    modifiedHeaders = this.addAcceptLanguageHeader(modifiedHeaders);
    modifiedHeaders = this.addTenantIdHeader(modifiedHeaders);
    return request.clone({
      headers: modifiedHeaders
    });
  }

  protected addXRequestedWithHeader(headers: HttpHeaders): HttpHeaders {
    if (headers) {
      headers = headers.set('X-Requested-With', 'XMLHttpRequest');
    }
    return headers;
  }

  protected addAspNetCoreCultureHeader(headers: HttpHeaders): HttpHeaders {
    // todo: 如果需要再添加.AspNetCore.Culture
    /*const cookieLangValue = this._utilsService.getCookieValue('Abp.Localization.CultureName');
    if (cookieLangValue && headers && !headers.has('.AspNetCore.Culture')) {
        headers = headers.set('.AspNetCore.Culture', cookieLangValue);
    }*/
    return headers;
  }

  protected addAcceptLanguageHeader(headers: HttpHeaders): HttpHeaders {
    // todo: 如果需要再添加Accept-Language
    /*const cookieLangValue = this._utilsService.getCookieValue('Abp.Localization.CultureName');
    if (cookieLangValue && headers && !headers.has('Accept-Language')) {
        headers = headers.set('Accept-Language', cookieLangValue);
    }*/
    return headers;
  }

  protected addTenantIdHeader(headers: HttpHeaders): HttpHeaders {
    // todo: 如果需要再添加Abp.TenantId
    // const cookieTenantIdValue = this._utilsService.getCookieValue('Abp.TenantId');
    // if (cookieTenantIdValue && headers && !headers.has('Abp.TenantId')) {
    //     headers = headers.set('Abp.TenantId', cookieTenantIdValue);
    // }
    return headers;
  }

  protected addAuthorizationHeaders(headers: HttpHeaders): HttpHeaders {
    let authorizationHeaders = headers ? headers.getAll('Authorization') : null;
    if (!authorizationHeaders) {
      authorizationHeaders = [];
    }
    if (!this.itemExists(authorizationHeaders, (item?: string) => {
      if (undefined === item) {
        return false;
      } else {
        return item.indexOf('Bearer ') === 0;
      }
    })) {
      /*const token = this._tokenService.getToken();
      if (headers && token) {
          headers = headers.set('Authorization', 'Bearer ' + token);
      }*/
    }
    return headers;
  }

  protected handleSuccessResponse(event: HttpEvent<any>, interceptObservable: Subject<HttpEvent<any>>): void {
    const self = this;
    if (event instanceof HttpResponse) {
      if (event.body instanceof Blob && event.body.type && event.body.type.indexOf('application/json') >= 0) {
        const clonedResponse = event.clone();
        self.configuration.blobToText(event.body).subscribe((json) => {
          const responseBody = json === 'null' ? {} : JSON.parse(json);
          const modifiedResponse = self.configuration.handleResponse(event.clone({
            body: responseBody
          }));
          interceptObservable.next(modifiedResponse.clone({
            body: new Blob([JSON.stringify(modifiedResponse.body)], {type: 'application/json'})
          }));
          interceptObservable.complete();
        });
      } else {
        interceptObservable.next(event);
        interceptObservable.complete();
      }
    }
  }

  protected handleErrorResponse(error: any, interceptObservable: Subject<HttpEvent<any>>): Observable<any> {
    const self = this;
    const errorObservable = new Subject();
    if (!(error.error instanceof Blob)) {
      interceptObservable.error(error);
      interceptObservable.complete();
      return of({});
    }
    this.configuration.blobToText(error.error).subscribe((json) => {
      const errorBody = (json === '' || json === 'null') ? {} : JSON.parse(json);
      const errorResponse = new HttpResponse({
        headers: error.headers,
        status: error.status,
        body: errorBody
      });
      const ajaxResponse = self.configuration.getAbpAjaxResponseOrNull(errorResponse);
      if (ajaxResponse != null) {
        self.configuration.handleAbpResponse(errorResponse, ajaxResponse);
      } else {
        self.configuration.handleNonAbpErrorResponse(errorResponse);
      }
      errorObservable.complete();
      // prettify error object.
      error.error = errorBody;
      interceptObservable.error(error);
      interceptObservable.complete();
    });
    return errorObservable;
  }

  private itemExists<T>(items: string[], predicate: CallableFunction): boolean {
    for (const item of items) {
      if (predicate(item)) {
        return true;
      }
    }
    return false;
  }
}
