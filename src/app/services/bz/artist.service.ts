import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/internal/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import ArtistList from '../../data-types/results/ArtistList';
import {Artist} from '../../data-types/entitys/Artist';
import {ArtistQuery} from '../../data-types/params/ArtistQuery';
import {NeteaseCloudMusicApiPrefix, ServiceModule} from '../service.module';
import * as queryString from 'querystring';

@Injectable({
  providedIn: ServiceModule
})
export class ArtistService {
  constructor(
    @Inject(NeteaseCloudMusicApiPrefix) private neteaseCloudMusicApiPrefix: string,
    private http: HttpClient
  ) {
  }

  /*
  * 入驻歌手
  * */
  artistList(artistQuery: ArtistQuery): Observable<Artist[]> {
    const paramsStr = queryString.stringify(JSON.parse(JSON.stringify(artistQuery)));
    const params = new HttpParams({fromString: paramsStr});
    return this.http.get<ArtistList>(this.neteaseCloudMusicApiPrefix + '/artist/list', {params}).pipe<Artist[]>(
      map((res) => {
        if (200 === res.code && res.artists) {
          return res.artists;
        }
        return [];
      })
    );
  }
}
