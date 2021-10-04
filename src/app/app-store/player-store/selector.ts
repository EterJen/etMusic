import {initialPlayerState, PlayerState, PlayMode} from './reducer';
import {createAction, createSelector, props} from '@ngrx/store';

/*
* 官网使用了接口 估计目的是兼容别的state
* 本项目中暂不考虑接口兼容
* */
const selectPlayerState = (playerState: PlayerState) => {
    return playerState;
};


export const getPlaying = createSelector(selectPlayerState, (playerState: PlayerState) => playerState.playing);
export const getPlayMode = createSelector(selectPlayerState, (playerState: PlayerState) => playerState.playMode);
export const getSongList = createSelector(selectPlayerState, (playerState: PlayerState) => playerState.songList);
export const getPlayList = createSelector(selectPlayerState, (playerState: PlayerState) => playerState.playList);
export const getPlayListIndex = createSelector(selectPlayerState, (playerState: PlayerState) => playerState.playListIndex);
export const getPlaySong = createSelector(selectPlayerState, (playerState: PlayerState) => playerState.playList[playerState.playListIndex]);
