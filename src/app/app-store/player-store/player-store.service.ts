import {Injectable} from '@angular/core';
import {AppStoreModule} from '../app-store.module';
import {select, Store} from '@ngrx/store';
import {AppStore} from '../states-config';
import {getPlayerState, getPlayingIndex, getPlayingSong, getPlayList, getPlayMode, getSongList, getSongListIndex} from './selector';
import {PlayerState, PlayMode} from './reducer';
import {setFlexiblePlayerState, setPlayingIndex} from './action';
import {PlaylistTrack} from '../../data-types/entitys/PlaylistTrack';
import {ArrayUtils} from '../../utils/ArrayUtils';
import {Observable} from 'rxjs';
import {SongService} from '../../services/bz/song.service';
import {first} from 'rxjs/operators';

@Injectable({
  providedIn: AppStoreModule
})
export class PlayerStoreService {

  private playerStore: Observable<any>;
  private playerState!: PlayerState;

  constructor(
    private songService: SongService,
    private appStore: Store<AppStore>
  ) {
    this.playerStore = this.appStore.pipe(select('player'));
    this.watchPlayerState().subscribe((playerState: PlayerState) => {
      this.playerState = playerState;
    });
  }

  public watchPlayerState(): Observable<PlayerState> {
    return this.playerStore.pipe(select(getPlayerState));
  }

  public watchPlayMode(): Observable<PlayMode> {
    return this.playerStore.pipe(select(getPlayMode));
  }

  watchSongList(): Observable<PlaylistTrack[]> {
    return this.playerStore.pipe(select(getSongList));
  }

  watchPlayList(): Observable<PlaylistTrack[]> {
    return this.playerStore.pipe(select(getPlayList));
  }

  watchPlayingIndex(): Observable<number> {
    return this.playerStore.pipe(select(getPlayingIndex));
  }

  watchPlayingSong(): Observable<PlaylistTrack> {
    return this.playerStore.pipe(select(getPlayingSong));
  }

  watchSongListIndex(): Observable<number> {
    return this.playerStore.pipe(select(getSongListIndex));
  }

  play(songList: PlaylistTrack[], playingIndex: number): void {
    let newPlayList = [];
    if (this.playerState.playMode.type === 'random') {
      newPlayList = ArrayUtils.shuffle(songList);
    } else {
      // 新数组 浅拷贝 需要保证后面业务逻辑只存在只读操作 若涉及修改数组项使用深拷贝 _.cloneDeep(list)
      newPlayList = songList.slice();
    }
    this.appStore.dispatch(setFlexiblePlayerState({songList, playList: newPlayList, playingIndex}));
  }

  changePlayMode(playMode: PlayMode): void {
    if (this.playerState.songList) {
      let newPlayList = [];
      if (playMode.type === 'random') {
        newPlayList = ArrayUtils.shuffle(this.playerState.songList);
      } else {
        newPlayList = this.playerState.songList.slice();
      }
      /*
      * 建议一次修改逻辑关联强的状态属性，比如playMode playList playingIndex 分开赋值触发songListIndex多次取值 导致songListIndex产生脏数据
      * 改变播放模式不应该导致当前歌曲被切换 故需要同时改变playMode playList playingIndex
      * */
      const newIndex = ArrayUtils.simpleFindIndex(newPlayList, this.playerState.playList[this.playerState.playingIndex]);
      this.appStore.dispatch(setFlexiblePlayerState({playList: newPlayList, playMode, playingIndex: newIndex}));
    }
  }


  playByIndex(newIndex: number): void {
    this.appStore.dispatch(setPlayingIndex({playingIndex: newIndex}));
  }

  remove(target: PlaylistTrack): void {
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    const sIndex = ArrayUtils.simpleFindIndex(songList, target);
    songList.splice(sIndex, 1);
    const pIndex = ArrayUtils.simpleFindIndex(playList, target);
    playList.splice(pIndex, 1);
    let newPlayIndex = this.playerState.playingIndex;
    if (this.playerState.playingIndex > pIndex) {
      newPlayIndex--;
    } else if (this.playerState.playingIndex === playList.length) { // 删除最后正在播放的歌曲 跳转到第一首
      newPlayIndex = 0;
    }
    this.appStore.dispatch(setFlexiblePlayerState({playingIndex: newPlayIndex, playList, songList}));
  }

  clear(): void {
    this.appStore.dispatch(setFlexiblePlayerState({playingIndex: -1, playList: [], songList: []}));
  }

  addSong(item: PlaylistTrack | PlaylistTrack[] | null, withPlay = false): void {
    if (!item) {
      return;
    }
    if (withPlay) {
      this.playByIndex(-1);
    }
    this.addSongDetail(item, withPlay);
  }
  /*
  * 添加歌曲 列表 播放
  * */
  addSongDetail(item: PlaylistTrack | PlaylistTrack[], withPlay: boolean): void {
    this.songService.parsePlaylistTrick(item).pipe(first()).subscribe(songs => {
      const songList = this.playerState.songList.slice();
      const playList = this.playerState.playList.slice();
      let playingIndex = this.playerState.playingIndex;
      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const pIndex = ArrayUtils.simpleFindIndex(songList, song);
        if (pIndex > -1) {
          if (withPlay && i === 0) {
            playingIndex = pIndex;
          }
        } else {
          songList.push(song);
          playList.push(song);
          if (withPlay && i === 0) {
            playingIndex = playList.length - 1;
          }
        }
      }
      this.appStore.dispatch(setFlexiblePlayerState({songList, playList, playingIndex}));
    });
  }
}
