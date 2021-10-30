import { PlayerState, PlayMode} from './reducer';
import {createSelector, props} from '@ngrx/store';
import {PlaylistTrack} from '../../data-types/entitys/PlaylistTrack';
import {simpleFindIndex} from '../../utils/array';

/*
* 官网使用了接口 估计目的是兼容别的state
* 本项目中暂不考虑接口兼容
* */
function selectPlayerState(playerState: PlayerState): PlayerState {
  return playerState;
}


export const getPlayMode = createSelector<PlayerState, PlayerState, PlayMode>(selectPlayerState, (playerState: PlayerState) => playerState.playMode);
export const getSongList = createSelector<PlayerState, PlayerState, PlaylistTrack[]>(selectPlayerState, (playerState: PlayerState) => playerState.songList);
export const getPlayList = createSelector<PlayerState, PlayerState, PlaylistTrack[]>(selectPlayerState, (playerState: PlayerState) => playerState.playList);
export const getPlayingIndex = createSelector<PlayerState, PlayerState, number>(selectPlayerState, (playerState: PlayerState) => playerState.playingIndex);
export const getPlayingSong = createSelector<PlayerState, PlayerState, PlaylistTrack>(selectPlayerState, (playerState: PlayerState) => playerState.playList[playerState.playingIndex]);
export const getSongListIndex = createSelector<PlayerState, PlayerState, number>(selectPlayerState, (playerState: PlayerState) => {
  if (playerState.playMode.type === 'random') {
    return simpleFindIndex(playerState.songList, playerState.playList[playerState.playingIndex]);
  } else {
    return playerState.playingIndex;
  }
});
