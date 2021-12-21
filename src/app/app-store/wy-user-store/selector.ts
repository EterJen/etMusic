import {createSelector} from '@ngrx/store';
import {WyUserState} from './reducer';
import LoginInfo from '../../data-types/results/LoginInfo';
import {CellphoneLoginParams} from '../../services/bz/member.service';

function selectWyUserState(state: WyUserState): WyUserState {
  return state;
}


export const getWyUserState = createSelector<WyUserState, WyUserState, WyUserState>(selectWyUserState, (state: WyUserState) => state);
export const getWyUserLoginInfo = createSelector<WyUserState, WyUserState, LoginInfo | null>(selectWyUserState, (state: WyUserState) => state.loginInfo);
export const getWyUserCellphoneLoginParams = createSelector<WyUserState, WyUserState, CellphoneLoginParams | null>(selectWyUserState, (state: WyUserState) => state.cellphoneLoginParams);
