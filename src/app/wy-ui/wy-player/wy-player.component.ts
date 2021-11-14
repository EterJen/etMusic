import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {PlayMode} from '../../app-store/player-store/reducer';
import {PlaylistTrack} from '../../data-types/entitys/PlaylistTrack';
import {fromEvent, Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {NzModalService} from 'ng-zorro-antd/modal';
import {PlayerStoreService} from '../../app-store/player-store/player-store.service';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {

  public playPercent = 0;
  public volumePercent = 3;
  public playBufferPercent = 0;
  public songList: PlaylistTrack[] = [];
  public playList: PlaylistTrack[] = [];
  public playingIndex = 0;
  public songListIndex = 0;
  public playingSong?: PlaylistTrack;
  public duration = 0;
  public currentPlayingTime = 0;

  public isPlaying = false;
  public showVolumePanel = false;
  public playPrepared = false;
  public showPlaylistPanel = false;
  /*
  * 订阅页面点击事件
  * 不是播放器点击则隐藏音量面板
  * */
  private documentClickSubscription?: Subscription;
  @ViewChild('audioElement', {static: true})
  private audioER!: ElementRef;
  private audioEl!: HTMLAudioElement;
  private playerSliderIsDragging = false;
  private playModes: PlayMode[] = [
    {type: 'loop', label: '循环'},
    {type: 'random', label: '随机'},
    {type: 'singleLoop', label: '单曲循环'}
  ];
  private playModeIndex = 0;
  public playMode: PlayMode = this.playModes[this.playModeIndex];

  constructor(
    private playerStoreService: PlayerStoreService,
    private nzModalService: NzModalService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.playerStoreService.watchPlayMode().subscribe((playMode: PlayMode) => {
      this.playMode = playMode;
    });
    this.playerStoreService.watchSongList().subscribe((songList: PlaylistTrack[]) => {
      this.songList = songList;
    });
    this.playerStoreService.watchPlayList().subscribe((playList: PlaylistTrack[]) => {
      this.playList = playList;
    });
    this.playerStoreService.watchPlayingIndex().subscribe((playingIndex: number) => {
      this.playingIndex = playingIndex;
    });
    this.playerStoreService.watchPlayingSong().subscribe((playingSong: PlaylistTrack) => {
      this.stopPlay();
      console.log('当前播放歌曲：', playingSong);
      if (!playingSong) {
        this.playingSong = playingSong;
        return;
      }

      if ((playingSong.song?.url === this.playingSong?.song?.url) && this.playingSong?.song?.url) {
        this.rePlayCurrentSong();
      }
      this.playingSong = playingSong;
    });
    this.playerStoreService.watchSongListIndex().subscribe((songListIndex: number) => {
      this.songListIndex = songListIndex;
    });
  }

  /*
  * 计算属性
  * 带监听、高性能
  * 随着某状态改变而改变的属性通常采用计算属性提供数据
  * */
  get playingSongPicUrl(): string {
    if (this.playingSong?.al?.picUrl) {
      return this.playingSong?.al?.picUrl;
    } else {
      return '//s4.music.126.net/style/web2/img/default/default_album.jpg';
    }
  }

  ngOnInit(): void {
    this.audioEl = this.audioER?.nativeElement;
    this.audioEl.volume = this.volumePercent / 100; // 不要等拖动才触发音量更改 web媒体音量 0 - 1
  }


  onTimeupdate(e: Event): void {
    if (this.playerSliderIsDragging || !this.isPlaying) {
      return;
    }
    /*
    * 不推荐使用类型断言 建议用as Type 替代
    * */
    this.currentPlayingTime = (e.target as HTMLAudioElement).currentTime;
    this.playPercent = (this.currentPlayingTime / this.duration) * 100;
    if (this.playBufferPercent < 100) { // 时间更新 缓冲不一定更新
      const buffered = (e.target as HTMLAudioElement).buffered;
      if (buffered.length) {
        const bufferedEnds = [];
        // console.log('------------');
        /*
        * 可能存在分段缓存 此处建议取最大值
        * 经测试 拖动时就会出现分段缓存 如果不取最大值 网速不好的情况下会造成播放条远超缓存条(因为取到了第一段缓存)
        * 打开日志 一目了然
        * 猜想 最后一段是否默认就是最大值 即缓存是保证有序的 直接取 buffered.length - 1
        * */
        for (let i = 0; i < buffered.length; i++) { // 不用异步循环
          // console.log(`第${i}段缓存`);
          // console.log(buffered.start(i));
          // console.log(buffered.end(i));
          bufferedEnds.push(buffered.end(i));
        }
        this.playBufferPercent = (Math.max(...bufferedEnds) / this.duration) * 100;
        // console.log('------------' + this.playBufferPercent);
      }
    }
  }

  /*
  * 播放暂停
  * */
  onPlayToggle(): void {
    if (this.playingSong) {
      if (this.playPrepared) {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
          this.audioEl?.play();
        } else {
          this.audioEl?.pause();
        }
      }
    } else {
      if (this.playList.length) {
        this.playByIndex(0);
      }
    }
  }

  playPrev(idx: number): void {
    this.stopPlay();
    if (!this.playingSong) {
      return;
    }
    if (this.playList.length === 1) {
      this.rePlayCurrentSong();
    } else {
      const newIndex = idx < 0 ? this.playList.length - 1 : idx;
      this.playByIndex(newIndex);
    }
  }

  playNext(idx: number): void {
    this.stopPlay();
    if (!this.playingSong) {
      return;
    }
    if (this.playList.length === 1) {
      this.rePlayCurrentSong();
    } else {
      const newIndex = idx >= this.playList.length ? 0 : idx;
      this.playByIndex(newIndex);
    }
  }

  onPlayPercentChange(wyySliderPerOffset: number): void {
    this.currentPlayingTime = this.duration * (wyySliderPerOffset / 100);
  }

  onSliderDragStart(): void {
    this.playerSliderIsDragging = true;
  }

  onSliderDragEnd(wyySliderPerOffset: number): void {
    this.playerSliderIsDragging = false;
    this.audioEl.currentTime = this.duration * (wyySliderPerOffset / 100);
  }

  onVolumeChange(volume: number): void {
    this.audioEl.volume = volume / 100;
  }

  togglePlaylistPanel(): void {
    if (this.playList.length) {
      this.showPlaylistPanel = !this.showPlaylistPanel;
      this.togglePanel(this.showPlaylistPanel);
    }
  }


  toggleVolumePanel(): void {
    this.showVolumePanel = !this.showVolumePanel;
    this.togglePanel(this.showVolumePanel);
  }

  /*
  * 弃用
  * 判断是否点击了播放器外部
  * 已用指令方案替代 采用事件驱动
  * */
  togglePanel(showAble: boolean): void {
    if (true) {
      return;
    }
    if (showAble) {
      this.subscribeDocumentClick();
    } else {
      this.unsubscribeDocumentClick();
    }

  }

  changePlayMode(): void {
    this.playerStoreService.changePlayMode(this.playModes[++this.playModeIndex % 3]);
  }

  onPlayEnd(): void {
    this.stopPlay();
    if (this.playMode.type === 'singleLoop') {
      this.rePlayCurrentSong();
    } else {
      /*
      * 被监听的属性不要直接改变值 容易导致逻辑混乱
      * 一定要保证新值从状态监听得到
      * 只读
      * */
      this.playNext(this.playingIndex + 1);
    }
  }

  playByIndex(newIndex: number): void {
    this.stopPlay();
    if (newIndex === this.playingIndex) {
      this.rePlayCurrentSong();
      return;
    }
    this.playerStoreService.playByIndex(newIndex);
  }

  onRemoveSong(target: PlaylistTrack): void {
    this.playerStoreService.remove(target);
  }

  onClearPlayList(): void {
    this.nzModalService.confirm({
      nzTitle: '确认清空播放列表？',
      nzOnOk: () => {
        this.stopPlay();
        this.playerStoreService.clear();
      }
    });
  }

  /*
  * 播放目标就绪歌曲
  * */
  playCurrentSong(): void {
    this.audioEl?.play();
    this.playPrepared = true;
    this.isPlaying = true;
    this.playBufferPercent = 0;
    this.duration = this.playingSong?.dt ? this.playingSong.dt / 1000 : 0;
  }

  onElementClickOutSide(): void {
    this.showVolumePanel = false;
    this.showPlaylistPanel = false;
  }

  private stopPlay(): void {
    this.audioEl?.pause();
    this.currentPlayingTime = 0;
    this.playPercent = 0;
    this.playBufferPercent = 0;
    this.playPrepared = false;
    this.isPlaying = false;
    this.duration = 0;
  }

  private subscribeDocumentClick(): void {
    if (!this.documentClickSubscription) {
      this.documentClickSubscription = fromEvent(this.document, 'click').subscribe(() => { // 监听等待触发 提前订阅
        this.showVolumePanel = false;
        this.showPlaylistPanel = false;
        this.unsubscribeDocumentClick();
      });
    }
  }

  private unsubscribeDocumentClick(): void {
    if (this.documentClickSubscription && !this.showPlaylistPanel && !this.showVolumePanel) {
      this.documentClickSubscription.unsubscribe();
      this.documentClickSubscription = undefined;
    }
  }

  private rePlayCurrentSong(): void {
    this.audioEl.currentTime = 0;
  }
}
