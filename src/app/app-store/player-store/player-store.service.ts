import {Injectable} from '@angular/core';
import {AppStoreModule} from '../app-store.module';
import {select, Store} from '@ngrx/store';
import {AppStore} from '../states-config';
import {
  getCurrentAction,
  getPlayerState,
  getPlayingIndex,
  getPlayingSong,
  getPlayList,
  getPlayMode,
  getSongList,
  getSongListIndex
} from './selector';
import {CurrentAction, PlayerState, PlayMode} from './reducer';
import {flexSetPlayerState} from './action';
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

  watchCurrentAction(): Observable<CurrentAction> {
    return this.playerStore.pipe(select(getCurrentAction));
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
      // ????????? ????????? ??????????????????????????????????????????????????? ??????????????????????????????????????? _.cloneDeep(list)
      newPlayList = songList.slice();
    }
    this.appStore.dispatch(flexSetPlayerState({songList, playList: newPlayList, playingIndex, currentAction: CurrentAction.Play}));
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
      * ?????????????????????????????????????????????????????????playMode playList playingIndex ??????????????????songListIndex???????????? ??????songListIndex???????????????
      * ?????????????????????????????????????????????????????? ?????????????????????playMode playList playingIndex
      * */
      const newIndex = ArrayUtils.simpleFindIndex(newPlayList, this.playerState.playList[this.playerState.playingIndex]);
      this.appStore.dispatch(flexSetPlayerState({playList: newPlayList, playMode, playingIndex: newIndex}));
    }
  }


  playByIndex(newIndex: number): void {
    if (newIndex !== -1) {
      this.appStore.dispatch(flexSetPlayerState({playingIndex: newIndex, currentAction: CurrentAction.Play}));
    } else {
      this.appStore.dispatch(flexSetPlayerState({playingIndex: newIndex}));
    }
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
    } else if (this.playerState.playingIndex === playList.length) { // ????????????????????????????????? ??????????????????
      newPlayIndex = 0;
    }
    this.appStore.dispatch(flexSetPlayerState({playingIndex: newPlayIndex, playList, songList, currentAction: CurrentAction.Delete}));
  }

  clear(): void {
    this.appStore.dispatch(flexSetPlayerState({playingIndex: -1, playList: [], songList: [], currentAction: CurrentAction.Clear}));
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
  * ???????????? ?????? ??????
  * */
  addSongDetail(item: PlaylistTrack | PlaylistTrack[], withPlay: boolean): void {
    this.songService.parsePlaylistTrick(item).pipe(first()).subscribe(songs => {
      const songList = this.playerState.songList.slice();
      const playList = this.playerState.playList.slice();
      let playingIndex = this.playerState.playingIndex;
      let currentAction = CurrentAction.Add;
      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const pIndex = ArrayUtils.simpleFindIndex(songList, song);
        if (pIndex > -1) {
          if (withPlay && i === 0) {
            playingIndex = pIndex;
            currentAction = CurrentAction.Play;
          }
        } else {
          songList.push(song);
          playList.push(song);
          if (withPlay && i === 0) {
            playingIndex = playList.length - 1;
            currentAction = CurrentAction.Play;
          }
        }
      }
      this.appStore.dispatch(flexSetPlayerState({songList, playList, playingIndex, currentAction}));
    });
  }

  reSetCurrentAction(): void {
    this.appStore.dispatch(flexSetPlayerState({currentAction: CurrentAction.Other}));
  }
}
