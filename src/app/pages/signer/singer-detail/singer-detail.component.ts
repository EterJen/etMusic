import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgResolver} from '../../../data-types/ng/NgResolver';
import {SingerDetailResolverData} from './singer-detail.resolver';
import {Artist} from '../../../data-types/entitys/Artist';
import {PlayerStoreService} from '../../../app-store/player-store/player-store.service';
import {PlaylistTrack} from '../../../data-types/entitys/PlaylistTrack';
import {takeUntil} from 'rxjs/operators';
import {ArrayUtils} from '../../../utils/ArrayUtils';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit, OnDestroy {
  public artist!: Artist;
  public hotSongs!: PlaylistTrack[];
  public simiArtists!: Artist[];
  playingTrackIdx = -1;
  private destory$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    public playerStoreService: PlayerStoreService
  ) {
    this.activatedRoute.data.subscribe((ngResolver: NgResolver) => {
      const resolver: SingerDetailResolverData = ngResolver.resolver;
      // console.log(resolver);
      this.artist = resolver.artist;
      this.hotSongs = resolver.hotSongs;
      this.simiArtists = resolver.simiArtists;
    });
    /*
   * takeUntil this.destory$有数据发出时 停止监听
   * */
    this.playerStoreService.watchPlayingSong().pipe(takeUntil(this.destory$)).subscribe(playingSong => {
      if (playingSong && this.hotSongs) {
        this.playingTrackIdx = ArrayUtils.simpleFindIndex(this.hotSongs, playingSong);
      } else {
        this.playingTrackIdx = -1;
      }
    });
  }


  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  ngOnInit(): void {
  }

}
