import {Song} from '../../data-types/entitys/Song';
import {Action, ActionReducerMap, createReducer, on} from '@ngrx/store';
import {setPlaying, setPlayList, setPlayListIndex, setPlayMode, setSongList} from './action';

export type PlayMode = {
  type?: 'loop' | 'random' | 'singleLoop',
  label?: '循环' | '随机' | '单曲循环',
};


export type PlayerState = {
  playing: boolean; // 播放状态
  playMode: PlayMode; // 播放模式
  songList: Song[]; // 歌单
  playList: Song[]; // 播放别表
  playListIndex: number; // 播放索引
};

/*
* 状态管理
* 目标为：xxxState
* */
export const initialPlayerState: PlayerState = {
  playing: false,
  playMode: {type: 'loop', label: '循环'},
  songList: [],
  playList: [],
  playListIndex: -1,
};


const reducer = createReducer(
  initialPlayerState,
  // reducer部分采用es6简洁语法  ({})自动展开对象 单句自动返回
  on(setPlaying, (state, {playing}) => ({...state, playing})),
  on(setPlayMode, (state, {playMode}) => ({...state, playMode})),
  on(setSongList, (state, {songList}) => ({...state, songList})),
  on(setPlayList, (state, {playList}) => ({...state, playList})),
  on(setPlayListIndex, (state, {playListIndex}) => ({...state, playListIndex})),
);


export function playerStateReducer(state: PlayerState | undefined, action: Action): PlayerState {
  return reducer(state, action);
}

