import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {IAjaxResponse, IErrorInfo} from './common-interface';
import {MessageService} from './message.service';

@Injectable()
export class AbpHttpConfiguration {
  defaultError = {
    message: '产生了一个错误!',
    details: '服务器没有发送错误详情.'
  };
  defaultError401 = {
    message: '您未经过身份验证!',
    details: '为了执行此操作，您应该进行身份验证(登录).'
  };
  defaultError403 = {
    message: '您没有权限!',
    details: '您不能执行此操作.'
  };
  defaultError404 = {
    message: '未找到相关资源!',
    details: '服务器上找不到请求的资源.'
  };

  constructor(private messageService: MessageService) {
  }

  logError(error: IErrorInfo): void {
    console.log(error);
  }

  showError(error: IErrorInfo): any {
    if (error.details) {
      return this.messageService.error(error.details, error.message || this.defaultError.message);
    } else {
      return this.messageService.error(error.message || this.defaultError.message);
    }
  }

  handleTargetUrl(targetUrl: string): void {
    if (!targetUrl) {
      location.href = '/';
    } else {
      location.href = targetUrl;
    }
  }

  handleUnAuthorizedRequest(messagePromise: any, targetUrl?: string): void {
    const self = this;
    if (messagePromise) {
      messagePromise.done(() => {
        self.handleTargetUrl(targetUrl || '/');
      });
    } else {
      self.handleTargetUrl(targetUrl || '/');
    }
  }

  handleNonAbpErrorResponse(response: HttpResponse<any>): void {
    const self = this;
    switch (response.status) {
      case 401:
        self.handleUnAuthorizedRequest(self.showError(self.defaultError401), '/');
        break;
      case 403:
        self.showError(self.defaultError403);
        break;
      case 404:
        self.showError(self.defaultError404);
        break;
      default:
        self.showError(self.defaultError);
        break;
    }
  }

  handleAbpResponse(response: HttpResponse<any>, ajaxResponse: IAjaxResponse): HttpResponse<any> {
    let newResponse;
    if (ajaxResponse.success) {
      newResponse = response.clone({
        body: ajaxResponse.result
      });
      if (ajaxResponse.targetUrl) {
        this.handleTargetUrl(ajaxResponse.targetUrl);
      }
    } else {
      newResponse = response.clone({
        body: ajaxResponse.result
      });
      if (!ajaxResponse.error) {
        ajaxResponse.error = this.defaultError;
      }
      this.logError(ajaxResponse.error);
      this.showError(ajaxResponse.error);
      if (response.status === 401) {
        this.handleUnAuthorizedRequest(null, ajaxResponse.targetUrl);
      }
    }
    return newResponse;
  }

  getAbpAjaxResponseOrNull(response: HttpResponse<any>): IAjaxResponse | null {
    if (!response || !response.headers) {
      return null;
    }
    const contentType = response.headers.get('Content-Type');
    if (!contentType) {
      // this._logService.warn('Content-Type is not sent!');
      console.warn('Content-Type is not sent!');
      return null;
    }
    if (contentType.indexOf('application/json') < 0) {
      // this._logService.warn('Content-Type is not application/json: ' + contentType);
      console.log('Content-Type is not application/json: ' + contentType);
      return null;
    }
    const responseObj = JSON.parse(JSON.stringify(response.body));
    if (!responseObj.__abp) {
      return null;
    }
    return responseObj;
  }

  handleResponse(response: HttpResponse<any>): HttpResponse<any> {
    const ajaxResponse = this.getAbpAjaxResponseOrNull(response);
    if (ajaxResponse == null) {
      return response;
    }
    return this.handleAbpResponse(response, ajaxResponse);
  }

  blobToText(blob: any): Observable<string> {
    return new Observable(
      (observer) => {
        if (!blob) {
          observer.next(blob);
          observer.complete();
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            observer.next('数据流开始传输');
            observer.complete();
          };
          reader.readAsText(blob);
        }

      }
    );
  }
}
