import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ServiceModule} from '../../service.module';
import {Song} from '../../../data-types/entitys/Song';
import {PlaylistTrack} from '../../../data-types/entitys/PlaylistTrack';
import {Observable, Subscriber} from 'rxjs';
import SongDetail from '../../../data-types/results/SongDetail';
import {map} from 'rxjs/internal/operators';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: ServiceModule
})
export class SongService {

  constructor(private http: HttpClient) {
  }

  /*
   * 歌曲详情 by songIds
   * */
  getSongDetail(songIds: string): Observable<Song[]> {
    const params = new HttpParams().set('id', songIds);
    return this.http.get<SongDetail>(environment.baseUri + '/song/url', {params}).pipe<Song[]>(
      map((res) => {
        if (200 === res.code && res.data) {
          return res.data;
        }
        return [];
      })
    );
  }


  /*
 * 歌曲解析（原歌单只有trackid 现根据该id绑定对应歌曲）
 * */
  parsePlaylistTrick(playlistTracks: PlaylistTrack | PlaylistTrack[]): Observable<PlaylistTrack[]> {
    const parmasTracks = Array.isArray(playlistTracks) ? playlistTracks : [playlistTracks];
    const songIds = parmasTracks.map(x => x.id).join(',');
    return this.getSongDetail(songIds).pipe(map(res => {
      return this.mapSongs2PlaylistTracks(parmasTracks, res);
    }));

  }

  mapSongs2PlaylistTracks(playlistTracks: PlaylistTrack[], songs: Song[]): PlaylistTrack[] {
    const res: PlaylistTrack[] = [];
    for (const t of playlistTracks) {
      const find = songs.find(s => (s.id && (s.id === t.id)));
      if (find && find.url) {
        t.song = find;
        res.push(t);
      }
    }
    return res;
  }
}
