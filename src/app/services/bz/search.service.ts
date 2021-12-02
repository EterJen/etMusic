import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NeteaseCloudMusicApiPrefix, ServiceModule} from '../service.module';
import {Observable} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {NzModalService} from 'ng-zorro-antd/modal';
import SearchSuggest, {SearchSuggestResult} from '../../data-types/results/SearchSuggest';
import {pluck} from 'rxjs/operators';

@Injectable({
  providedIn: ServiceModule
})
export class SearchService {
  constructor(
    private nzModalService: NzModalService,
    private http: HttpClient,
    @Inject(NeteaseCloudMusicApiPrefix) private neteaseCloudMusicApiPrefix: string
  ) {
  }

  /*
   * 建议搜索
   * */
  searchSuggest(keywords: string): Observable<SearchSuggestResult> {
    const params = new HttpParams().set('keywords', keywords);
    return this.http.get<SearchSuggest>(this.neteaseCloudMusicApiPrefix + '/search/suggest', {params}).pipe(
      map((res) => {
        if (res.code !== 200) {
          res.result = {};
        }
        return res;
      }),
      pluck('result'),
      map((res) => {
        return res;
      })
    );
  }
}
