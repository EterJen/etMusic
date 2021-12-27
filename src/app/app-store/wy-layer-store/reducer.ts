import {Action, createReducer, on} from '@ngrx/store';
import {flexSetLayerState} from './action';

export enum ModalType {
  Register = 'register',
  LoginByPhone = 'loginByPhone',
  Share = 'share',
  Like = 'like',
  Default = 'default',
}

export type FlexWyLayerState = {
  visible?: boolean;
  modalType?: ModalType;
};
export type WyLayerState = {
  visible: boolean;
  modalType: ModalType;
};

export const initialState: WyLayerState = {
  visible: false,
  modalType: ModalType.Default
};

const reducer = createReducer(
  initialState,
  on(flexSetLayerState, (state, {...args}) => {
    // console.log(args.type, args);
    return ({...state, ...args});
  }),
);

export function wyLayerStateReducer(state: WyLayerState | undefined, action: Action): WyLayerState {
  return reducer(state, action);
}
