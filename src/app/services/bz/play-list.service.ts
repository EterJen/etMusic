import {Inject, Injectable} from '@angular/core';
import {NeteaseCloudMusicApiPrefix, ServiceModule} from '../service.module';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import TopPlaylists from '../../data-types/results/TopPlaylists';
import * as queryString from 'querystring';

export type TopQueryParams = {
  order: 'new' | 'hot';
  cat: string;
  limit: number;
  offset: number;
};

@Injectable({
  providedIn: ServiceModule
})
export class PlayListService {

  constructor(
    private http: HttpClient,
    @Inject(NeteaseCloudMusicApiPrefix) private neteaseCloudMusicApiPrefix: string
  ) {
  }

  public queryTopPlaylists(topQueryParams: TopQueryParams): Observable<TopPlaylists> {
    const paramsStr = queryString.stringify(JSON.parse(JSON.stringify(topQueryParams)));
    const params = new HttpParams({fromString: paramsStr});
    return this.http.get<TopPlaylists>(this.neteaseCloudMusicApiPrefix + '/top/playlist', {params});
  }

}
