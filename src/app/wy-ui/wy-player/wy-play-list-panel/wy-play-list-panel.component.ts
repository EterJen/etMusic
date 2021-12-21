import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {PlaylistTrack} from '../../../data-types/entitys/PlaylistTrack';
import {PlayMode} from '../../../app-store/player-store/reducer';
import {ArrayUtils} from '../../../utils/ArrayUtils';
import {SongService} from '../../../services/bz/song.service';
import {PlayingLine, WyLyric} from './wy-lyric';
import {Subscription, timer} from 'rxjs';
import {PlayerStoreService} from '../../../app-store/player-store/player-store.service';
import {EventUtils} from '../../../utils/EventUtils';

@Component({
  selector: 'app-wy-play-list-panel',
  templateUrl: './wy-play-list-panel.component.html',
  styleUrls: ['./wy-play-list-panel.component.less']
})
export class WyPlayListPanelComponent implements OnInit, OnChanges, AfterViewInit {
  songList!: PlaylistTrack[];
  songListIndex!: number;
  @Input() show = false;
  @Input() currentPlayingTime = 0;
  @Output() panelClose = new EventEmitter();
  @Output() viewSong = new EventEmitter<number>();
  @Output() viewSheet = new EventEmitter<number>();
  @Output() viewSinger = new EventEmitter<number>();
  @Output() changeSong = new EventEmitter<number>();
  @Output() clearPlayList = new EventEmitter<void>();
  @Output() removeSong = new EventEmitter<PlaylistTrack>();
  playingSong!: PlaylistTrack;
  // 滚动和高亮逻辑分开
  currentLyricScrollIndex = 0;
  currentLyricIndex = -1;
  wyLyric: WyLyric;
  private playMode!: PlayMode;
  private playList!: PlaylistTrack[];
  private playLineSubscription?: Subscription;

  constructor(
    private songService: SongService,
    private playerStoreService: PlayerStoreService
  ) {
    this.wyLyric = new WyLyric({
      next: (playingLine: PlayingLine) => {
        /*
        * 新值替旧值 主要用于点击播放条快进时 取消前面已失效的订阅
        * 否则 当前一次delay较长 新的触发了 再触发旧的 导致歌词乱跳
        * */
        this.playLineSubscription?.unsubscribe();
        /*
        * 尝试补偿拖动播放条时前一条歌词索引(prePlayLyricIndex -1) 如果是连续播放该索引和上一个索引值相同 不会触发滚动组件滚动 逻辑完美融洽
        * */
        if ((playingLine.songId === this.playingSong.id)) {
          this.currentLyricIndex = playingLine.prePlayLyricIndex - 1;
          this.currentLyricScrollIndex = playingLine.prePlayLyricIndex > 0 ? playingLine.prePlayLyricIndex - 1 : 0;
        }

        this.playLineSubscription = timer(this.wyLyric.lyricLines[playingLine.prePlayLyricIndex].time - this.currentPlayingTime).subscribe(() => {
          if (playingLine.songId === this.playingSong.id) { // 也可以在切歌时调用 this.playLineSubscription?.unsubscribe() 让无效订阅失效
            this.currentLyricScrollIndex = playingLine.prePlayLyricIndex;
            this.currentLyricIndex = playingLine.prePlayLyricIndex;
          }
        });
      }
    });
    this.playerStoreService.watchPlayMode().subscribe((playMode: PlayMode) => this.watchPlayMode(playMode));
    this.playerStoreService.watchSongList().subscribe((songList: PlaylistTrack[]) => this.watchSongList(songList));
    this.playerStoreService.watchPlayList().subscribe((playList: PlaylistTrack[]) => this.watchPlayList(playList));
    this.playerStoreService.watchPlayingSong().subscribe((playingSong: PlaylistTrack) => this.watchPlayingSong(playingSong));
    this.playerStoreService.watchSongListIndex().subscribe((songListIndex: number) => this.watchSongListIndex(songListIndex));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentPlayingTime) {
      if (this.wyLyric.lyricLines.length) {
        this.wyLyric.playAt({currentPlayingTime: this.currentPlayingTime, prePlayLyricIndex: -1, songId: this.playingSong?.id});
      }
    }
  }

  playListPanelClose(): void {
    this.panelClose.emit();
  }


  onChangeSong(i: number): void {
    let newPlayingIndex = i;
    if (this.playMode.type === 'random') {
      newPlayingIndex = ArrayUtils.simpleFindIndex(this.playList, this.songList[i]);
    }
    this.changeSong.emit(newPlayingIndex);
  }

  onViewSinger($event: MouseEvent, id: number): void {
    EventUtils.prohibitEventBubbling($event);
    this.viewSinger.emit(id);
  }

  onViewSong($event: MouseEvent, id: number): void {
    EventUtils.prohibitEventBubbling($event);
    this.viewSong.emit(id);
  }

  onRemoveSong(event: MouseEvent, item: PlaylistTrack): void {
    EventUtils.prohibitEventBubbling(event);
    this.removeSong.emit(item);
  }

  private watchPlayMode(playMode: PlayMode): void {
    this.playMode = playMode;
  }

  private watchSongList(songList: PlaylistTrack[]): void {
    this.songList = songList;
  }

  private watchPlayList(playList: PlaylistTrack[]): void {
    this.playList = playList;
  }

  private watchPlayingSong(playingSong: PlaylistTrack): void {
    this.currentLyricScrollIndex = 0;
    this.currentLyricIndex = -1;
    this.wyLyric.clear();
    if (!playingSong) {
      return;
    }
    this.playingSong = playingSong;
    this.updateLyric();
  }

  private watchSongListIndex(songListIndex: number): void {
    this.songListIndex = songListIndex;
  }

  private updateLyric(): void {
    this.songService.getLyric(this.playingSong.id).subscribe((lyric) => {
      if (lyric) {
        this.wyLyric.parseLyric(lyric);
      }
    });
  }
}
