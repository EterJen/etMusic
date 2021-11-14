import {Action,  createReducer, on} from '@ngrx/store';
import {setPlaying, setPlayList, setPlayingIndex, setPlayMode, setSongList, setFlexiblePlayerState} from './action';
import {PlaylistTrack} from '../../data-types/entitys/PlaylistTrack';

export type PlayMode = {
  type: 'loop' | 'random' | 'singleLoop',
  label: '循环' | '随机' | '单曲循环',
};
export type FlexiblePlayerState = {
  playMode?: PlayMode; // 播放模式
  songList?: PlaylistTrack[]; // 歌单
  playList?: PlaylistTrack[]; // 播放别表
  playingIndex?: number; // 播放索引
};

export type PlayerState = {
  playMode: PlayMode; // 播放模式
  songList: PlaylistTrack[]; // 歌单
  playList: PlaylistTrack[]; // 播放别表
  playingIndex: number; // 播放索引
};

/*
* 状态管理
* 目标为：xxxState
* */
export const initialPlayerState: PlayerState = {
  playMode: {type: 'loop', label: '循环'},
  songList: [],
  playList: [],
  playingIndex: -1,
};


const reducer = createReducer(
  initialPlayerState,
  // reducer部分采用es6简洁语法  ({})自动展开对象 单句自动返回
  on(setPlaying, (state, {playing}) => ({...state, playing})),
  on(setPlayMode, (state, {playMode}) => ({...state, playMode})),
  on(setSongList, (state, {songList}) => ({...state, songList})),
  on(setPlayList, (state, {playList}) => ({...state, playList})),
  on(setPlayingIndex, (state, {playingIndex}) => ({...state, playingIndex})),
  on(setFlexiblePlayerState, (state, {...args}) => ({...state, ...args})),
);


export function playerStateReducer(state: PlayerState | undefined, action: Action): PlayerState {
  return reducer(state, action);
}

