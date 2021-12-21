import {createAction, props} from '@ngrx/store';
import {CurrentAction, FlexPlayerState, PlayMode} from './reducer';
import {PlaylistTrack} from '../../data-types/entitys/PlaylistTrack';


export const setPlaying = createAction('[player]  setPlaying', props<{ playing: boolean }>());
export const setPlayMode = createAction('[player] setPlayMode', props<{ playMode: PlayMode }>());
export const setSongList = createAction('[player] setSongList', props<{ songList: PlaylistTrack[] }>());
export const setPlayList = createAction('[player]  setPlayList', props<{ playList: PlaylistTrack[] }>());
export const setPlayingIndex = createAction('[player]  setPlayingIndex', props<{ playingIndex: number }>());
export const setCurrentAction = createAction('[player]  setCurrentAction', props<{ currentAction: CurrentAction }>());
export const flexSetPlayerState = createAction('[player]  flexible set', props<FlexPlayerState>());
