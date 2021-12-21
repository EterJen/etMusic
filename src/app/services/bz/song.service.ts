import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NetEaseCloudMusicApiPrefix, ServiceModule} from '../service.module';
import {Song} from '../../data-types/entitys/Song';
import {PlaylistTrack} from '../../data-types/entitys/PlaylistTrack';
import {Observable} from 'rxjs';
import SongDetail from '../../data-types/results/SongDetail';
import {map} from 'rxjs/internal/operators';
import Lyric from '../../data-types/entitys/Lyric';
import SongsDetail from '../../data-types/results/SongsDetail';
import {NzModalService} from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: ServiceModule
})
export class SongService {

  constructor(
    private nzModalService: NzModalService,
    private http: HttpClient,
    @Inject(NetEaseCloudMusicApiPrefix) private netEaseCloudMusicApiPrefix: string
  ) {
  }

  /*
   * 歌曲url by songIds
   * */
  getSongsDetail(songIds: string): Observable<SongsDetail | null> {
    const params = new HttpParams().set('ids', songIds);
    return this.http.get<SongsDetail>(this.netEaseCloudMusicApiPrefix + '/song/detail', {params}).pipe(
      map((res) => {
        if (200 === res.code) {
          return res;
        } else {
          return null;
        }
      })
    );
  }

  /*
   * 歌曲url by songIds
   * */
  getSongUrl(songIds: string): Observable<Song[]> {
    const params = new HttpParams().set('id', songIds);
    return this.http.get<SongDetail>(this.netEaseCloudMusicApiPrefix + '/song/url', {params}).pipe<Song[]>(
      map((res) => {
        if (200 === res.code && res.data) {
          return res.data;
        }
        return [];
      })
    );
  }

  getLyric(songId: number): Observable<Lyric | null> {
    const params = new HttpParams().set('id', songId.toString());
    return this.http.get<Lyric>(this.netEaseCloudMusicApiPrefix + '/lyric', {params}).pipe<Lyric | null>(
      map((res) => {
        if (200 === res.code) {
          return res;
        } else {
          return null;
        }
      })
    );

  }

  /*
 * 歌曲解析（原歌单只有trackid 现根据该id绑定对应歌曲）
 * */
  parsePlaylistTrick(playlistTracks: PlaylistTrack | PlaylistTrack[]): Observable<PlaylistTrack[]> {
    const parmasTracks = Array.isArray(playlistTracks) ? playlistTracks : [playlistTracks];
    const songIds = parmasTracks.map(x => x.id).join(',');
    return this.getSongUrl(songIds).pipe(map(res => {
      return this.mapSongs2PlaylistTracks(parmasTracks, res);
    }));

  }

  mapSongs2PlaylistTracks(playlistTracks: PlaylistTrack[], songs: Song[]): PlaylistTrack[] {
    const res: PlaylistTrack[] = [];
    for (const t of playlistTracks) {
      const find = songs.find(s => (s.id && (s.id === t.id)));
      if (!t.song && find && find.url) {
        t.song = find;
      }
      if (!t.song?.url) {
        if (playlistTracks.length === 1) {
          this.nzModalService.confirm({
            nzTitle: '<i>目标歌曲不存在</i>',
            nzContent: '<b>Some descriptions</b>',
            nzOnOk: () => console.log('OK')
          });
        }
      }
      res.push(t);
    }
    return res;
  }
}
