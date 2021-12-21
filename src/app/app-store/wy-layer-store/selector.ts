import {ModalType, WyLayerState} from './reducer';
import {createSelector} from '@ngrx/store';

function selectWyLayerState(state: WyLayerState): WyLayerState {
  return state;
}


export const getWyLayerState = createSelector<WyLayerState, WyLayerState, WyLayerState>(selectWyLayerState, (playerState: WyLayerState) => playerState);
export const getWyLayerVisible = createSelector<WyLayerState, WyLayerState, boolean>(selectWyLayerState, (playerState: WyLayerState) => playerState.visible);
export const getWyLayerModalType = createSelector<WyLayerState, WyLayerState, ModalType>(selectWyLayerState, (playerState: WyLayerState) => playerState.modalType);
