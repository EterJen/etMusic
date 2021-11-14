import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import {NgResolver} from '../../../data-types/ng/NgResolver';
import {SongService} from '../../../services/bz/song.service';
import {first} from 'rxjs/operators';
import {map} from 'rxjs/internal/operators';
import Lyric from '../../../data-types/entitys/Lyric';
import {PlaylistTrack} from '../../../data-types/entitys/PlaylistTrack';

export class SongInfoResolverData {
  song: PlaylistTrack | null;
  lyric: Lyric | null;

  constructor(song: PlaylistTrack | null, lyric: Lyric | null) {
    this.song = song;
    this.lyric = lyric;
  }

}

@Injectable()
export class SongInfoResolver implements Resolve<any> {
  constructor(
    private songService: SongService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SongInfoResolverData> {
    const songId = route.paramMap.get('id');
    return forkJoin(
      this.songService.getSongsDetail(songId as string).pipe<PlaylistTrack | null>(map(res => {
        if (res) {
          return res.songs ? res.songs[0] : null;
        }
        return null;
      })),
      this.songService.getLyric(Number(songId))
    ).pipe(first()).pipe(
      map(([song, lyric]) => {
        return new SongInfoResolverData(song, lyric);
      })
    );
  }
}


export const songInfoResolver: NgResolver = {
  resolver: SongInfoResolver
};
