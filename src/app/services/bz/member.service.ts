import {Inject, Injectable} from '@angular/core';
import {NetEaseCloudMusicApiPrefix, ServiceModule} from '../service.module';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import LoginInfo, {DailySignInRes, SampleBack} from '../../data-types/results/LoginInfo';
import {catchError, map} from 'rxjs/internal/operators';
import {LocalStorageService} from '../common/local-storage.service';
import {IErrorInfo} from '../http-config/common-interface';
import * as queryString from 'querystring';
import {NzMessageService} from 'ng-zorro-antd/message';
import {WyUserStoreService} from '../../app-store/wy-user-store/wy-user-store.service';

export type CellphoneLoginParams = {
  phone: string;
  password: string;
  setting: { remember: boolean };
};

@Injectable({
  providedIn: ServiceModule
})
export class MemberService {
  private userIdStoreKey = 'et-wy-userId';
  private cellphoneLoginInfoKey = 'et-wy-cellphoneLoginInfo';
  private userCookieStoreKey = 'et-wy-userCookie';

  constructor(
    @Inject(NetEaseCloudMusicApiPrefix) private netEaseCloudMusicApiPrefix: string,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private wyUserStoreService: WyUserStoreService,
    private nzMessageService: NzMessageService,
  ) {
  }

  public cellphoneLogin(cellphoneLoginParams: any): Observable<LoginInfo | IErrorInfo> {
    return this.http.post<LoginInfo>(this.netEaseCloudMusicApiPrefix + '/login/cellphone', cellphoneLoginParams, {responseType: 'json'}).pipe(
      catchError((err: any, caught: any) => {
        return of(err.error as IErrorInfo);
      })
    );
  }

  public dailySignIn(dsType = 0): Observable<DailySignInRes | IErrorInfo> {
    return this.http.post<DailySignInRes | IErrorInfo>(this.netEaseCloudMusicApiPrefix + '/daily_signin', {
      type: dsType,
      // 通过 CommonInterceptor 拦截器设置 withCredentials: true 支持跨域自动携带cookie
      // cookie: this.localStorageService.getCryptoItem(this.userCookieStoreKey)
    }, {responseType: 'json'}).pipe(
      catchError((err: any, caught: any) => {
        console.log(err);
        return of(err.error as IErrorInfo);
      })
    );
  }

  storeUserId(userId: number | undefined): void {
    this.localStorageService.setCryptoItem(this.userIdStoreKey, userId);
  }

  storeUserCookie(cookie: string | undefined): void {
    this.localStorageService.setCryptoItem(this.userCookieStoreKey, cookie);
  }

  rememberCellphoneLogin(value: any): void {
    this.localStorageService.setCryptoItem(this.cellphoneLoginInfoKey, value);
  }

  forgetCellphoneLogin(): void {
    this.localStorageService.removeCryptoItem(this.cellphoneLoginInfoKey);
  }

  initUserInfo(): void {
    this.getUserDetail().subscribe((res) => {
      const cellphoneLoginParams: CellphoneLoginParams = this.localStorageService.getCryptoItem(this.cellphoneLoginInfoKey);
      this.wyUserStoreService.flexSet({loginInfo: res, cellphoneLoginParams});
    });
  }

  getUserDetail(): Observable<LoginInfo | null> {
    const uid: string = this.localStorageService.getCryptoItem(this.userIdStoreKey);
    if (null != uid) {
      const params = new HttpParams({fromString: queryString.stringify({uid})});
      return this.http.get<LoginInfo>(this.netEaseCloudMusicApiPrefix + '/user/detail', {params}).pipe(
        catchError((err: any, caught: any) => {
          const e = (err.error as IErrorInfo);
          this.nzMessageService.error('用户已失效，请重新登陆');
          return of(null);
        })
      );
    } else {
      return of(null);
    }
  }


  logOut(): void {
    this.http.get<SampleBack>(this.netEaseCloudMusicApiPrefix + '/logout').subscribe((res) => {
      // console.log(res);
      this.nzMessageService.success('已退出');
      this.localStorageService.removeCryptoItem(this.userIdStoreKey);
      this.wyUserStoreService.flexSet({loginInfo: null});
    });
  }
}
