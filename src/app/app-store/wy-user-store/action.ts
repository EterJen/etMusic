import {createAction, props} from '@ngrx/store';
import {FlexWyUserState} from './reducer';


export const flexSetUserState = createAction('[wy-user]  flexible set', props<FlexWyUserState>());
