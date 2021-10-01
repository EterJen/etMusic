import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, switchMap} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {SongSheet} from '../../../data-types/entitys/SongSheet';
import Personalized from '../../../data-types/results/Personalized';
import {ServiceModule} from '../../service.module';
import {SongService} from './song.service';
import {Playlist} from '../../../data-types/entitys/Playlist';
import SongSheetDetail from '../../../data-types/results/SongSheetDetail';
import {PlaylistTrack} from '../../../data-types/entitys/PlaylistTrack';

@Injectable({
  providedIn: ServiceModule
})
export class SongSheetService {

  constructor(
    private http: HttpClient,
    private songService: SongService
  ) {
  }

  /*
   * 个性推荐歌单
   * */
  getPersonalizedRecommends(): Observable<SongSheet[]> {
    return this.http.get<Personalized>(environment.baseUri + '/personalized?limit=20').pipe<SongSheet[]>(
      map((res) => {
        if (200 === res.code && res.result) {
          return res.result.slice(0, 16);
        }
        return [];
      })
    );
  }

  /*
   * 歌单详情
   * */
  getSongSheetDetail(sheetId: number): Observable<Playlist | null> {
    const params = new HttpParams().set('id', sheetId.toString());
    return this.http.get<SongSheetDetail>(environment.baseUri + '/playlist/detail', {params}).pipe<Playlist | null>(
      map((res) => {
        if (200 === res.code && res.playlist) {
          return res.playlist;
        }
        return null;
      })
    );
  }

  /*
   * 播放歌单
   * */
  parseSongSheet(sheetId: number): Observable<PlaylistTrack[]> {
    return this.getSongSheetDetail(sheetId).pipe(
      map((res => {
        return res?.tracks;
      })),
      switchMap(res => {
        if (res) {
          return this.songService.parsePlaylistTrick(res);
        }
        return [];
      })
    );
  }
}
