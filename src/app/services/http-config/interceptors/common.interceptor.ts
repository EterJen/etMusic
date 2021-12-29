import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

export class CommonInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedRequest = this.normalizeRequestHeaders(req);
    return next.handle(modifiedRequest);
  }

  private normalizeRequestHeaders(req: any): HttpRequest<any> {
    return req.clone({
      withCredentials: true
    });
  }
}
