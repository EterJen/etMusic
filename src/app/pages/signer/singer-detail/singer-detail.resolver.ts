import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {forkJoin, Observable, of} from 'rxjs';
import {PlaylistTrack} from '../../../data-types/entitys/PlaylistTrack';
import Lyric from '../../../data-types/entitys/Lyric';
import {NgResolver} from '../../../data-types/ng/NgResolver';
import {ArtistService} from '../../../services/bz/artist.service';
import {map} from 'rxjs/internal/operators';
import {Artist} from '../../../data-types/entitys/Artist';

export class SingerDetailResolverData {
  public artist: Artist;
  public hotSongs: PlaylistTrack[];
  public simiArtists: Artist[];


  constructor(artist: Artist, hotSongs: PlaylistTrack[], simiArtists: Artist[]) {
    this.artist = artist;
    this.hotSongs = hotSongs;
    this.simiArtists = simiArtists;
  }
}

@Injectable()
export class SingerDetailResolver implements Resolve<SingerDetailResolverData> {
  constructor(
    private artistService: ArtistService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SingerDetailResolverData> {
    const id = route.paramMap.get('id');
    return forkJoin(
      this.artistService.artistDetail(Number(id)).pipe(),
      this.artistService.simiArtists(Number(id)).pipe()
    ).pipe(map(([res, simiArtists]) => {
      return new SingerDetailResolverData(res.artist, res.hotSongs, simiArtists);
    }));
  }
}


export const singerDetailResolver: NgResolver = {
  resolver: SingerDetailResolver
};
