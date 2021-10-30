import {Injectable} from '@angular/core';
import {AppStoreModule} from '../app-store.module';
import {select, Store} from '@ngrx/store';
import {AppStore} from '../states-config';
import {getPlayingIndex, getPlayingSong, getPlayList, getPlayMode, getSongList, getSongListIndex} from './selector';
import {PlayMode} from './reducer';
import {optionalSet, setPlayingIndex} from './action';
import {PlaylistTrack} from '../../data-types/entitys/PlaylistTrack';
import {shuffle, simpleFindIndex} from '../../utils/array';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: AppStoreModule
})
export class PlayerStoreService {

  private playMode!: PlayMode;
  private playerStore: Observable<any>;
  private playingSong!: PlaylistTrack;
  private songList: PlaylistTrack[] = [];
  private playingIndex = 0;
  private playList: PlaylistTrack[] = [];

  constructor(
    private appStore: Store<AppStore>
  ) {
    this.playerStore = this.appStore.pipe(select('player'));
    this.watchPlayMode().subscribe((playMode: PlayMode) => {
      this.playMode = playMode;
    });
    this.watchSongList().subscribe((songList: PlaylistTrack[]) => {
      this.songList = songList;
    });
    this.watchPlayList().subscribe((playList: PlaylistTrack[]) => {
      this.playList = playList;
    });
    this.watchPlayingIndex().subscribe((playingIndex: number) => {
      this.playingIndex = playingIndex;
    });
    this.watchPlayingSong().subscribe((playingSong: PlaylistTrack) => {
      this.playingSong = playingSong;
    });
  }

  play(songList: PlaylistTrack[], playingIndex: number): void {
    let newPlayList = [];
    if (this.playMode.type === 'random') {
      newPlayList = shuffle(songList);
    } else {
      // 新数组 浅拷贝 需要保证后面业务逻辑只存在只读操作 若涉及修改数组项使用深拷贝 _.cloneDeep(list)
      newPlayList = songList.slice();
    }
    this.appStore.dispatch(optionalSet({songList, playList: newPlayList, playingIndex}));
  }

  changePlayMode(playMode: PlayMode): void {
    if (this.songList) {
      let newPlayList = [];
      if (playMode.type === 'random') {
        newPlayList = shuffle(this.songList);
      } else {
        newPlayList = this.songList.slice();
      }
      /*
      * 建议一次修改逻辑关联强的状态属性，比如playMode playList playingIndex 分开赋值触发songListIndex多次取值 导致songListIndex产生脏数据
      * 改变播放模式不应该导致当前歌曲被切换 故需要同时改变playMode playList playingIndex
      * */
      const newIndex = simpleFindIndex(newPlayList, this.playingSong);
      this.appStore.dispatch(optionalSet({playList: newPlayList, playMode, playingIndex: newIndex}));
    }
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

  playByIndex(newIndex: number): void {
    this.appStore.dispatch(setPlayingIndex({playingIndex: newIndex}));
  }

  remove(target: PlaylistTrack): void {
    const songList = this.songList.slice();
    const playList = this.playList.slice();
    const sIndex = simpleFindIndex(songList, target);
    songList.splice(sIndex, 1);
    const pIndex = simpleFindIndex(playList, target);
    playList.splice(pIndex, 1);
    let newPlayIndex = this.playingIndex;
    if (this.playingIndex > pIndex) {
      newPlayIndex--;
    } else if (this.playingIndex === playList.length) { // 删除最后正在播放的歌曲 跳转到第一首
      newPlayIndex = 0;
    }
    this.appStore.dispatch(optionalSet({playingIndex: newPlayIndex, playList, songList}));
  }

  clear(): void {
    this.appStore.dispatch(optionalSet({playingIndex: -1, playList: [], songList: []}));
  }
}
