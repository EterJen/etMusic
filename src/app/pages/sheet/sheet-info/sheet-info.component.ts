import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgResolver} from '../../../data-types/ng/NgResolver';
import SongSheetDetail from '../../../data-types/results/SongSheetDetail';
import {Playlist} from '../../../data-types/entitys/Playlist';
import {HtmlConvertUtils} from '../../../utils/HtmlConvertUtils';
import {PlayerStoreService} from '../../../app-store/player-store/player-store.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ArrayUtils} from '../../../utils/ArrayUtils';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit, OnDestroy {
  songSheetDetail!: SongSheetDetail;
  playlist!: Playlist;
  description = {
    short: '',
    long: ''
  };
  controlDesc = {
    expandAble: false,
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  };
  public playingTrackIdx = -1;
  private destory$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    public playerStoreService: PlayerStoreService,
  ) {
    this.activatedRoute.data.subscribe((res: NgResolver) => {
      if (res.resolver) {
        this.songSheetDetail = res.resolver;
        this.playlist = this.songSheetDetail.playlist;
        if (this.playlist.description) {
          this.descriptionPase(this.playlist.description);
        }
      }
    });
    /*
    * takeUntil this.destory$有数据发出时 停止监听
    * */
    this.playerStoreService.watchPlayingSong().pipe(takeUntil(this.destory$)).subscribe(playingSong => {
      if (playingSong && this.playlist.tracks) {
        this.playingTrackIdx = ArrayUtils.simpleFindIndex(this.playlist.tracks, playingSong);
      } else {
        this.playingTrackIdx = -1;
      }
    });
  }

  ngOnInit(): void {
  }

  toggleDesc(): void {
    this.controlDesc.isExpand = !this.controlDesc.isExpand;
    if (this.controlDesc.isExpand) {
      this.controlDesc.iconCls = 'up';
      this.controlDesc.label = '收起';
    } else {
      this.controlDesc.iconCls = 'down';
      this.controlDesc.label = '展开';
    }
  }


  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }


  private descriptionPase(description: string): void {
    const str = '<b>介绍：</b>' + description;
    if (description.length < 99) {
      this.controlDesc.expandAble = false;
      this.description.short = str;
    } else {
      this.controlDesc.expandAble = true;
      this.description.short = str.slice(0, 99) + '...';
      this.description.long = HtmlConvertUtils.parse(str);
    }
  }
}
