import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, switchMap} from 'rxjs/internal/operators';
import {Observable, of} from 'rxjs';
import {SongSheet} from '../../data-types/entitys/SongSheet';
import Personalized from '../../data-types/results/Personalized';
import {NeteaseCloudMusicApiPrefix, ServiceModule} from '../service.module';
import {SongService} from './song.service';
import {Playlist} from '../../data-types/entitys/Playlist';
import SongSheetDetail from '../../data-types/results/SongSheetDetail';
import {PlaylistTrack} from '../../data-types/entitys/PlaylistTrack';
import * as _ from 'lodash';
import {PlayerStoreService} from '../../app-store/player-store/player-store.service';

@Injectable({
  providedIn: ServiceModule
})
export class SongSheetService {

  constructor(
    private http: HttpClient,
    @Inject(NeteaseCloudMusicApiPrefix) private neteaseCloudMusicApiPrefix: string,
    private playerStoreService: PlayerStoreService,
    private songService: SongService
  ) {
  }

  /*
   * 个性推荐歌单
   * */
  getPersonalizedRecommends(): Observable<SongSheet[]> {
    return this.http.get<Personalized>(this.neteaseCloudMusicApiPrefix + '/personalized?limit=20').pipe<SongSheet[]>(
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
    return this.http.get<SongSheetDetail>(this.neteaseCloudMusicApiPrefix + '/playlist/detail', {params}).pipe<Playlist | null>(
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
        console.log('没有歌曲: when playSongSheet');
        return of([]);
      })
    );
  }

  playSheet(sheetId: number): void {
    this.parseSongSheet(sheetId).subscribe((list) => {
      const playlistTracks = _.cloneDeep(list);
      for (const playlistTrack of playlistTracks) {
        playlistTrack.id = playlistTrack.id + 100;
      }
      list.push(...playlistTracks); // 数据不够 复制测试用
      console.log(list);

      /*
      * 改变多个属性建议在一次操作内完成， 原子性操作 防止脏数据产生
      * */
      this.playerStoreService.play(list, 0);
    });
  }

}
