import {createAction, props} from '@ngrx/store';
import {FlexWyLayerState} from './reducer';


export const flexSetLayerState = createAction('[wy-layer]  flexible set', props<FlexWyLayerState>());
