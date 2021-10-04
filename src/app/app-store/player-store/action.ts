import {createAction, props} from '@ngrx/store';
import {Song} from '../../data-types/entitys/Song';
import {PlayMode} from './reducer';

export const setPlaying = createAction('[player]  setPlaying', props<{ playing: boolean }>());
export const setPlayMode = createAction('[player] setPlayMode', props<{ playMode: PlayMode }>());
export const setSongList = createAction('[player] setSongList', props<{ songList: Song[] }>());
export const setPlayList = createAction('[player]  setPlayList', props<{ playList: Song[] }>());
export const setPlayListIndex = createAction('[player]  setPlayListIndex', props<{ playListIndex: number }>());
