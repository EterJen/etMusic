import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {ServiceModule} from '../../service.module';
import {Banner} from '../../../data-types/entitys/Banner';
import BannersResult from '../../../data-types/results/BannersResult';

@Injectable({
  providedIn: ServiceModule
})
export class BannerService {

  constructor(private http: HttpClient) {
  }


  /*
  * 轮播图
  * */
  public getBanners(): Observable<Banner []> {
    return this.http.get<BannersResult>(environment.baseUri + '/banner?type=0').pipe<Banner[]>(
      map((res) => {
        if (200 === res.code && res.banners) {
          return res.banners;
        } else {
          return [];
        }
      })
    );
  }
}
