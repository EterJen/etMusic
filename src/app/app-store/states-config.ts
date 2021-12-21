import {playerStateReducer} from './player-store/reducer';
import {wyLayerStateReducer} from './wy-layer-store/reducer';
import {wyUserStateReducer} from './wy-user-store/reducer';

/*
* 涉及存储和取值
* AppStore key 与 appReducers key 保持一致
* */
export type AppStore = {
  player: any; // any保证注入和取出时key相同
  wyLayer: any;
  wyUser: any;
};

export const appReducers: AppStore = {
  player: playerStateReducer,
  wyLayer: wyLayerStateReducer,
  wyUser: wyUserStateReducer,
};
