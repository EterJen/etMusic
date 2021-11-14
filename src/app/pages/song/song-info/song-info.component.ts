import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgResolver} from '../../../data-types/ng/NgResolver';
import {SongInfoResolverData} from './song-info.resolver';
import {LyricLine, WyLyric} from '../../../wy-ui/wy-player/wy-play-list-panel/wy-lyric';
import {PlaylistTrack} from '../../../data-types/entitys/PlaylistTrack';
import {PlayerStoreService} from '../../../app-store/player-store/player-store.service';

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit {
  song!: PlaylistTrack | null;
  lyricLines?: LyricLine[];

  lyricToggle = {
    showAble: true,
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  };

  constructor(
    private  activatedRoute: ActivatedRoute,
    public playerStoreService: PlayerStoreService,
  ) {
    this.activatedRoute.data.subscribe((ngResolver: NgResolver) => {
      if (ngResolver.resolver) {
        const resolver: SongInfoResolverData = ngResolver.resolver;
        this.song = resolver.song;
        this.lyricLines = new WyLyric({
          next: value => {
          }
        }).parseLyric(resolver.lyric).lyricLines;
        console.log(this.song);
        console.log(this.lyricLines);
      }
    });
  }

  ngOnInit(): void {
  }

  toggleLyric(): void {
    this.lyricToggle.isExpand = !this.lyricToggle.isExpand;
    if (this.lyricToggle.isExpand) {
      this.lyricToggle.iconCls = 'up';
      this.lyricToggle.label = '收起';
    } else {
      this.lyricToggle.iconCls = 'down';
      this.lyricToggle.label = '展开';
    }
  }
}
