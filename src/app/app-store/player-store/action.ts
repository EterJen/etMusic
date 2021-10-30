import {createAction, props} from '@ngrx/store';
import {PlayerStateOptional, PlayMode} from './reducer';
import {PlaylistTrack} from '../../data-types/entitys/PlaylistTrack';


export const setPlaying = createAction('[player]  setPlaying', props<{ playing: boolean }>());
export const setPlayMode = createAction('[player] setPlayMode', props<{ playMode: PlayMode }>());
export const setSongList = createAction('[player] setSongList', props<{ songList: PlaylistTrack[] }>());
export const setPlayList = createAction('[player]  setPlayList', props<{ playList: PlaylistTrack[] }>());
export const setPlayingIndex = createAction('[player]  setPlayingIndex', props<{ playingIndex: number }>());
export const optionalSet = createAction('[player]  optionalSet', props<PlayerStateOptional>());
