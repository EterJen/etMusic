import {PlayerState, playerStateReducer} from './player-store/reducer';

/*
* 涉及存储和取值
* AppStore key 与 appReducers key 保持一致
* */
export type AppStore = {
  player: PlayerState | any,
};

export const appReducers: AppStore = {
  player: playerStateReducer
};
